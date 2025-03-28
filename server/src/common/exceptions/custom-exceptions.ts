import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception to be thrown when a business rule is violated
 */
export class BusinessRuleException extends HttpException {
  constructor(message: string, statusCode = HttpStatus.UNPROCESSABLE_ENTITY) {
    super({ message, error: 'Business Rule Violation' }, statusCode);
  }
}

/**
 * Exception for insufficient permissions (more specific than ForbiddenException)
 */
export class InsufficientPermissionsException extends HttpException {
  constructor(resource?: string) {
    const message = resource
      ? `You don't have sufficient permissions to access ${resource}`
      : 'Insufficient permissions';
    super({ message, error: 'Insufficient Permissions' }, HttpStatus.FORBIDDEN);
  }
}

/**
 * Exception for resource conflicts
 */
export class ResourceConflictException extends HttpException {
  constructor(resource: string, message = 'already exists') {
    super(
      { message: `${resource} ${message}`, error: 'Resource Conflict' },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Exception for rate limiting
 */
export class TooManyRequestsException extends HttpException {
  constructor(message = 'Too many requests', retryAfter?: number) {
    const response: Record<string, any> = {
      message,
      error: 'Too Many Requests',
    };

    if (retryAfter) {
      response.retryAfter = retryAfter;
    }

    super(response, HttpStatus.TOO_MANY_REQUESTS);
  }
}

/**
 * Exception for data validation errors
 */
export class ValidationException extends HttpException {
  constructor(errors: Record<string, string[]>) {
    super(
      {
        message: 'Validation failed',
        error: 'Validation Error',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception for unauthorized actions (more descriptive than UnauthorizedException)
 */
export class AuthenticationFailedException extends HttpException {
  constructor(message = 'Authentication failed') {
    super({ message, error: 'Authentication Failed' }, HttpStatus.UNAUTHORIZED);
  }
}

/**
 * Exception for service unavailable situations
 */
export class ServiceUnavailableException extends HttpException {
  constructor(service: string, message = 'is currently unavailable') {
    super(
      { message: `${service} ${message}`, error: 'Service Unavailable' },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
