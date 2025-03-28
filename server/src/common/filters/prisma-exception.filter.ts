import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  constructor(private logger: LoggerService) {
    super();
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request['requestId'] || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'Internal Server Error';

    this.logger.setContext('PrismaException');

    // Map Prisma error codes to HTTP status codes
    switch (exception.code) {
      case 'P2000': // Value too long for column
        status = HttpStatus.BAD_REQUEST;
        message = 'Input value too long';
        error = 'Bad Request';
        break;

      case 'P2001': // Record does not exist
        status = HttpStatus.NOT_FOUND;
        message = 'Record does not exist';
        error = 'Not Found';
        break;

      case 'P2002': // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        error = 'Conflict';
        break;

      case 'P2003': // Foreign key constraint failure
        status = HttpStatus.BAD_REQUEST;
        message = 'Related record not found';
        error = 'Bad Request';
        break;

      case 'P2004': // Constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Constraint violation';
        error = 'Bad Request';
        break;

      case 'P2005': // Invalid value for field
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid value for field';
        error = 'Bad Request';
        break;

      case 'P2006': // Invalid value provided
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid value provided';
        error = 'Bad Request';
        break;

      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'Not Found';
        break;

      default:
        // Log unknown Prisma errors with more detail for debugging
        this.logger.error(
          `Unhandled Prisma error: ${exception.code}`,
          exception.stack,
          'PrismaException',
        );
    }

    const logMessage = `[${requestId}] ${request.method} ${request.url} ${status} - Prisma error ${exception.code}: ${message}`;

    if (status >= 500) {
      this.logger.error(logMessage, exception.stack, 'PrismaException');
    } else {
      this.logger.warn(logMessage, 'PrismaException');
    }

    const errorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      prismaCode: exception.code,
      // Include the field that caused the error if available
      field: exception.meta?.target || exception.meta?.field,
    };

    // Remove the stack trace in production
    if (process.env.NODE_ENV !== 'production') {
      errorResponse['stackTrace'] = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
