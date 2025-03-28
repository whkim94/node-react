FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache make gcc g++ python3

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy source code and config files
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["/entrypoint.sh"] 