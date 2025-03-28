#!/bin/sh

echo "Waiting for database to be ready..."

# Regenerate Prisma client
npx prisma generate

# Rebuild bcrypt
echo "Rebuilding bcrypt..."
npm rebuild bcrypt --build-from-source

# Push database schema
npx prisma db push
echo "Database schema pushed!"

# Seed database
npx prisma db seed
echo "Database seeded!"

# Start the application
echo "Starting NestJS server..."
npm run start:dev 