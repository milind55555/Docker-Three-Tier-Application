# ==============================================================================
# Node.js Alpine Backend Container
# ==============================================================================
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json* ./

# Install only production dependencies for minimal footprint and enhanced security
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Set appropriate directory ownership for non-root 'node' user
RUN chown -R node:node /app

# Switch to non-root user for security best practice
USER node

# Expose backend port
EXPOSE 5000

# Container health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the Express application
CMD ["node", "server.js"]
