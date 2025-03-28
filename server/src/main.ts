import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { LoggerService } from './common/services/logger.service';
import { HttpExceptionFilter, PrismaExceptionFilter } from './common/filters';

async function bootstrap() {
  try {
    // Create a logger for bootstrap process
    const app = await NestFactory.create(AppModule);

    // Get logger service from the app container
    const logger = app.get(LoggerService);
    logger.setContext('Bootstrap');

    // Enable CORS
    app.enableCors({
      origin: 'http://localhost:5173', // Your client's URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Apply global exception filters
    const httpExceptionFilter = new HttpExceptionFilter(logger);
    app.useGlobalFilters(
      httpExceptionFilter,
      new PrismaExceptionFilter(logger),
    );

    // Apply enhanced validation pipe with standardized error responses
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip non-whitelisted properties
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
        transform: true, // Transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true, // Convert primitive types automatically
        },
        stopAtFirstError: false, // Collect all validation errors
        exceptionFactory: (errors) => {
          const formattedErrors = errors.reduce((acc, error) => {
            const property = error.property;
            const constraints = error.constraints || {};

            // Convert the constraints object to an array of error messages
            acc[property] = Object.values(constraints);

            return acc;
          }, {});

          // Throw a BadRequestException with our standardized format
          return new BadRequestException({
            message: 'Validation failed',
            error: 'Bad Request',
            errors: formattedErrors,
          });
        },
      }),
    );

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error(
      'Failed to start application',
      error instanceof Error ? error.stack : String(error),
    );
    process.exit(1);
  }
}
bootstrap();
