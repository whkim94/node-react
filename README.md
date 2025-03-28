# Invoice Management System

This project consists of a NestJS backend API and a React frontend client for managing invoices.

## Running with Docker Compose (Development Mode)

The easiest way to run the complete application stack for local development is using Docker Compose, which will start:
- PostgreSQL database
- NestJS server (in development mode with hot-reload)
- React client (Vite dev server with hot-reload)

### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Setup and Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd node-react
   ```

2. Start the application stack:
   ```bash
   docker-compose up -d
   ```

3. Behind the scenes, Docker Compose will:
   - Build Docker images for the client and server if they don't exist
   - Start the PostgreSQL database and wait for it to be healthy
   - Start the server container which will:
     - Generate the Prisma client
     - Push the database schema to PostgreSQL
     - Seed the database with initial demo data
     - Start the NestJS server in development mode
   - Start the React client with Vite's development server

4. Access the application:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000
   - Database: localhost:5432 (accessible via database tools)

### Managing the Application

- View logs:
  ```bash
  # All services
  docker-compose logs -f
  
  # Specific service
  docker-compose logs -f server
  docker-compose logs -f client
  docker-compose logs -f db
  ```

- Stop the application:
  ```bash
  docker-compose down
  ```

- Rebuild containers after package.json changes:
  ```bash
  docker-compose up -d --build
  ```

- Reset the database (will lose all data):
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

## Development Features

This Docker setup provides several developer-friendly features:

- **Automatic Setup**: Database schema and seed data is automatically applied
- **Hot Reload**: Changes to React and NestJS code are automatically detected and applied
- **Live Containers**: Application code is mounted as volumes, so changes are reflected immediately
- **Development Mode**: Both applications run in development mode with full debugging capabilities
- **Isolated Database**: PostgreSQL runs in its own container with persistent storage

## Demo Credentials

- Email: demo@example.com
- Password: demo123

## Running Without Docker

If you prefer to run the applications directly on your machine without Docker:

1. For the client application:
   - See the [Client README](./client/README.md) for instructions
   - Typically involves: `cd client && npm install && npm run dev`

2. For the server application:
   - See the [Server README](./server/README.md) for instructions
   - Typically involves setting up PostgreSQL, running Prisma migrations, and starting the server with `npm run start:dev`

## Project Structure

- `/client` - React frontend built with Vite, TypeScript, and Tailwind CSS
- `/server` - NestJS backend with PostgreSQL database using Prisma ORM
- `docker-compose.yml` - Configuration for running the complete stack 