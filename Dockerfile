# Multi-stage build for production-ready Next.js + Go application

# Stage 1: Build Frontend (Next.js)
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY . .
RUN yarn build

# Stage 2: Build Backend (Go)
FROM golang:1.24-alpine AS backend-builder

# Install necessary packages for CGO and SQLite
RUN apk add --no-cache gcc musl-dev sqlite-dev

WORKDIR /app

# Copy go modules and download dependencies
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copy backend source code
COPY backend/ ./

# Build the Go binary with CGO enabled for SQLite
RUN CGO_ENABLED=1 GOOS=linux go build -a -ldflags '-linkmode external -extldflags "-static"' -o main .

# Stage 3: Production runtime
FROM node:20-alpine

# Install runtime dependencies
RUN apk --no-cache add ca-certificates sqlite

# Create app directory
WORKDIR /app

# Copy built files from previous stages
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static
COPY --from=frontend-builder /app/public ./public
COPY --from=backend-builder /app/main ./backend/

# Copy environment example
COPY backend/.env.example ./backend/.env.example

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Check if .env exists, create from example if not' >> /app/start.sh && \
    echo 'if [ ! -f ./backend/.env ]; then' >> /app/start.sh && \
    echo '  echo "Creating .env from .env.example..."' >> /app/start.sh && \
    echo '  cp ./backend/.env.example ./backend/.env' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start Next.js server in background with explicit port' >> /app/start.sh && \
    echo 'echo "Starting Next.js frontend on port 3000..."' >> /app/start.sh && \
    echo 'HOSTNAME=0.0.0.0 PORT=3000 node server.js &' >> /app/start.sh && \
    echo 'FRONTEND_PID=$!' >> /app/start.sh && \
    echo 'sleep 2' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start Go backend on port 8080' >> /app/start.sh && \
    echo 'echo "Starting Go backend on port 8080..."' >> /app/start.sh && \
    echo 'cd backend' >> /app/start.sh && \
    echo 'BACKEND_PORT=8080 ./main &' >> /app/start.sh && \
    echo 'BACKEND_PID=$!' >> /app/start.sh && \
    echo 'cd ..' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Wait for either process to exit' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD sh -c 'wget --no-verbose --tries=1 --spider http://localhost:3000 || wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/api/health'

# Start the application
CMD ["/app/start.sh"]