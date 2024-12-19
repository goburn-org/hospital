# Base image
FROM node:20-slim

# Install OpenSSL 3
RUN apt-get update && apt-get install -y libssl3

# Set working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn install --production

# Generate Prisma client
RUN yarn prisma generate

# Expose the port
EXPOSE 9000/tcp

# Set environment to production
ENV NODE_ENV=production

# Run the application
ENTRYPOINT ["yarn", "dev:api:serve"]
