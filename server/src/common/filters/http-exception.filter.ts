import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
  error?: string;
  stackTrace?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: LoggerService | Logger;

  constructor(logger?: LoggerService) {
    this.logger = logger || new Logger('ExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request['requestId'] || 'unknown';

    // Extract status code and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exceptionResponse };
      errorName = exception.name;
    } else if (exception instanceof Error) {
      message = { message: exception.message };
      errorName = exception.name;
    }

    // Build the error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: errorName,
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      errorResponse.stackTrace = exception.stack;
    }

    // Log the error
    const logMessage = `[${requestId}] ${request.method} ${request.url} ${status} - ${
      typeof message === 'object' ? JSON.stringify(message) : message
    }`;

    if (status >= 500) {
      if (this.logger instanceof LoggerService) {
        this.logger.error(
          logMessage,
          exception instanceof Error ? exception.stack : undefined,
          'HttpException',
        );
      } else {
        this.logger.error(
          logMessage,
          exception instanceof Error ? exception.stack : undefined,
        );
      }
    } else if (status >= 400) {
      if (this.logger instanceof LoggerService) {
        this.logger.warn(logMessage, 'HttpException');
      } else {
        this.logger.warn(logMessage);
      }
    } else {
      if (this.logger instanceof LoggerService) {
        this.logger.log(logMessage, 'HttpException');
      } else {
        this.logger.log(logMessage);
      }
    }

    // Send the response
    response.status(status).json(errorResponse);
  }
}
