import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface RequestWithId extends Request {
  requestId?: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = uuidv4();
    const logger = this.logger; // Store logger reference

    // Add request ID to the request for tracking across the application
    req.requestId = requestId;

    // Log the incoming request
    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - ${ip} - ${userAgent}`,
    );

    if (req.body && Object.keys(req.body).length > 0) {
      this.logger.debug(
        `[${requestId}] Request body: ${this.sanitizeData(req.body as Record<string, unknown>)}`,
      );
    }

    const startTime = Date.now();

    // Capture the response
    const originalSend = res.send;
    res.send = function (this: Response, body?: unknown): Response {
      const responseTime = Date.now() - startTime;
      const contentLength = body ? Buffer.from(String(body)).length : 0;

      const logMessage = `[${requestId}] ${method} ${originalUrl} ${res.statusCode} - ${responseTime}ms - ${contentLength}b`;

      // Log based on status code
      if (res.statusCode >= 500) {
        logger.error(logMessage);
      } else if (res.statusCode >= 400) {
        logger.warn(logMessage);
      } else {
        logger.log(logMessage);
      }

      // Call the original send function and return its result
      return originalSend.call(this, body) as Response;
    };

    next();
  }

  private sanitizeData(data: Record<string, unknown>): string {
    try {
      // Create a deep copy of the data
      const sanitized = JSON.parse(JSON.stringify(data)) as Record<
        string,
        unknown
      >;

      // Array of sensitive fields to mask
      const sensitiveFields = [
        'password',
        'token',
        'authorization',
        'secret',
        'apiKey',
        'credit_card',
      ];

      // Recursively sanitize the data
      this.recursiveSanitize(sanitized, sensitiveFields);

      return JSON.stringify(sanitized);
    } catch (error) {
      // Ignore error details, just return a placeholder
      return '[Error sanitizing data]';
    }
  }

  private recursiveSanitize(
    obj: Record<string, unknown>,
    sensitiveFields: string[],
  ): void {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.recursiveSanitize(
          obj[key] as Record<string, unknown>,
          sensitiveFields,
        );
      } else if (
        sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        obj[key] = '[REDACTED]';
      }
    });
  }
}
