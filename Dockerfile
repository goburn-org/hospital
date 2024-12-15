# Base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .
COPY package.json package-lock.json ./

# Install production dependencies
RUN yarn install --production
RUN yarn prisma generate

# Expose the port the app will run on
EXPOSE 9000/tcp

ENV NODE_ENV=production

# Command to run the app
ENTRYPOINT ["yarn", "dev:api:serve"]
