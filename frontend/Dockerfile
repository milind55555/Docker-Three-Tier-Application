# ==============================================================================
# Stage 1: Build the React application
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm ci || npm install

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ==============================================================================
# Stage 2: Serve production bundle with Nginx
# ==============================================================================
FROM nginx:alpine

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx configuration with reverse proxy support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
