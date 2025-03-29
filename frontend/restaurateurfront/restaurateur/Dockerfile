# Use Node.js image for development
FROM node:18 AS development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for the development server (usually 3000 for Vite)
EXPOSE 3000

# Run the development server (Assuming you use Vite)
CMD ["npm", "run", "dev"]
