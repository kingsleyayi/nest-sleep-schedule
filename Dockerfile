# Use a Node.js base image
FROM node:19

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port for the application to run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]
