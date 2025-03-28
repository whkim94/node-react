# Invoice API

## Description
A NestJS-based API for managing invoices with authentication, user registration, and PostgreSQL database.

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start PostgreSQL: `docker-compose up -d`
4. Run migrations: `npx prisma generate`
5. Load Schema to sync: `npx prisma db push`
6. Seed database: `npx prisma db seed`
7. Start server: `npm run start:dev`

## Docker Setup
You can also run the server using Docker:

```bash
# Build the Docker image
docker build -t invoice-server .

# Run the container
docker run -p 3000:3000 --env-file .env invoice-server
```

For running the complete stack with client and database, see the root [README.md](../README.md) for Docker Compose instructions.

## Database Configuration
The application uses PostgreSQL with the following default configuration:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: nest

## Demo Credentials
- Email: demo@example.com
- Password: demo123

## API Endpoints

### Authentication
- POST /auth/login - Login with email and password
- POST /auth/register - Register new user with name, email, and password

### Invoices
- GET /invoices - Get all invoices for the authenticated user
- GET /invoices/:id - Get invoice by ID (requires auth)
- POST /invoices - Create a new invoice
- PUT /invoices/:id - Update an existing invoice
- DELETE /invoices/:id - Delete an invoice

### User Management
- User data is automatically associated with their invoices
- All invoice operations are restricted to the authenticated user's data

## Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Authorized routes protected by JwtAuthGuard

## Exception Handling System

The application uses a standardized exception handling system to ensure consistent error responses across all endpoints. This system includes:

### 1. Global Exception Filters

- `HttpExceptionFilter`: Catches all exceptions and transforms them into a standardized JSON response format.
- `PrismaExceptionFilter`: Specializes in handling Prisma database errors and mapping them to appropriate HTTP status codes.

### 2. Custom Application Exceptions

The application defines several custom exception classes for specific business scenarios:

- `AuthenticationFailedException`: For authentication-related errors
- `BusinessRuleException`: For violations of business rules
- `InsufficientPermissionsException`: For permission-related issues
- `ResourceConflictException`: For resource conflicts (e.g., duplicate entries)
- `TooManyRequestsException`: For rate limiting
- `ValidationException`: For data validation errors
- `ServiceUnavailableException`: For service unavailability

### 3. Standardized Response Format

All error responses follow a consistent structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2023-05-25T10:15:30.123Z",
  "path": "/api/invoices",
  "errors": {
    "field1": ["Error message 1", "Error message 2"],
    "field2": ["Error message 3"]
  }
}
```

### 4. Enhanced Validation

The application uses NestJS ValidationPipe with enhanced options:

- Whitelist validation (strips unknown properties)
- Automatic type transformation
- Detailed validation error messages

### Usage Example

```typescript
// Instead of using built-in exceptions
// throw new NotFoundException('Invoice not found');

// Use custom exceptions for more context and consistency
throw new ResourceNotFoundException('invoice', 'not found');
```

This standardized exception handling system improves the developer experience for API consumers and makes debugging easier by providing consistent, detailed error information.
