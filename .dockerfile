# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port on which the application will run
EXPOSE 8000

# Start the application
CMD ["yarn", "start"]