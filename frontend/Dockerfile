FROM node:16 AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with force to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the React app
ENV SKIP_PREFLIGHT_CHECK=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
