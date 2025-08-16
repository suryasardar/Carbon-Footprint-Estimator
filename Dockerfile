# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# FROM node:20-alpine AS build
# WORKDIR /app
# COPY --from=deps /app/node_modules node_modules
# COPY . .
# RUN npm run build

# FROM node:20-alpine
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=build /app/dist dist
# COPY package*.json ./
# RUN npm ci --omit=dev
# EXPOSE 3000
# CMD ["node", "dist/server.js"]

# Use the same base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 3000

# Set the command to run the dev script
CMD ["npm", "run", "dev"]
