# Docker Guide

This guide covers containerization, Docker configuration, and deployment strategies for the LCM Next.js Boilerplate.

## Overview

The project includes comprehensive Docker support for:

- **Development Environment**: PostgreSQL, MailHog, and other services
- **Production Deployment**: Optimized Next.js application container
- **Multi-stage Builds**: Efficient image building with layer caching
- **Health Checks**: Container health monitoring
- **Volume Management**: Persistent data storage

## Docker Configuration

### Development Setup

The development environment uses `docker-compose.yml`:

```yaml
services:
  # Database
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: ${POSTGRES_DB:-lcm-nextjs-boilerplate}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${POSTGRES_PORT:-5732}:5432"
    networks:
      - lcm-nextjs-boilerplate
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Email testing
  mailhog:
    container_name: mailhog
    image: mailhog/mailhog:latest
    platform: linux/amd64
    restart: unless-stopped
    ports:
      - "${MAILHOG_SMTP_PORT:-1025}:1025"
      - "${MAILHOG_WEB_PORT:-8025}:8025"
    networks:
      - lcm-nextjs-boilerplate

volumes:
  postgres_data:

networks:
  lcm-nextjs-boilerplate:
    driver: bridge
```

### Production Dockerfile

The production `Dockerfile` uses multi-stage builds:

```dockerfile
# Base image with Node.js
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG NODE_ENV=production
ARG SKIP_ENV_VALIDATION=true

# Build the application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

## Development Workflow

### Starting Development Environment

```bash
# Start all development services
pnpm docker:dev

# View running containers
docker ps

# View logs
docker-compose logs -f postgres
docker-compose logs -f mailhog
```

### Available Services

| Service      | Port | Description                 |
| ------------ | ---- | --------------------------- |
| PostgreSQL   | 5432 | Primary database            |
| MailHog SMTP | 1025 | Email testing SMTP server   |
| MailHog Web  | 8025 | Email testing web interface |

### Environment Variables

Create `.env.docker` for production Docker setup:

```bash
# Database
POSTGRES_USER=myapp
POSTGRES_PASSWORD=secure-password
POSTGRES_DB=myapp_production
POSTGRES_PORT=5432

# MailHog
MAILHOG_SMTP_PORT=1025
MAILHOG_WEB_PORT=8025

# Application
NODE_ENV=production
AUTH_SECRET=your-production-secret
DATABASE_URL=postgresql://myapp:secure-password@postgres:5432/myapp_production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Database Connection

Connect to PostgreSQL from the host:

```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d lcm-nextjs-boilerplate

# Using connection string
psql "postgresql://postgres:password@localhost:5432/lcm-nextjs-boilerplate"
```

## Production Deployment

### Building Production Image

```bash
# Build the production image
docker build -t lcm-nextjs-boilerplate .

# Build with build args
docker build \
  --build-arg NODE_ENV=production \
  --build-arg SKIP_ENV_VALIDATION=true \
  -t lcm-nextjs-boilerplate .
```

### Running Production Container

```bash
# Run production container
docker run -d \
  --name lcm-app \
  -p 3000:3000 \
  --env-file .env.docker \
  lcm-nextjs-boilerplate

# With custom network
docker run -d \
  --name lcm-app \
  --network lcm-nextjs-boilerplate \
  -p 3000:3000 \
  --env-file .env.docker \
  lcm-nextjs-boilerplate
```

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
        SKIP_ENV_VALIDATION: true
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/lcm-nextjs-boilerplate
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: lcm-nextjs-boilerplate
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_prod_data:

networks:
  app-network:
    driver: bridge
```

## Performance Optimization

### Multi-stage Build Optimization

```dockerfile
# Optimized Dockerfile with better layer caching
FROM node:22-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm globally
RUN corepack enable pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=false

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true

# Build the application
RUN pnpm build

# Production dependencies only
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=true

# Runtime stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Image Size Optimization

```dockerfile
# Use Alpine Linux for smaller images
FROM node:22-alpine

# Remove unnecessary packages
RUN apk del --purge curl wget

# Use .dockerignore to exclude files
# .dockerignore
node_modules
.next
.git
.env*
*.md
tests/
docs/
.github/
```

### Build Cache Optimization

```bash
# Use BuildKit for better caching
export DOCKER_BUILDKIT=1

# Build with cache mount
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from lcm-nextjs-boilerplate:latest \
  -t lcm-nextjs-boilerplate .
```

## Health Checks and Monitoring

### Application Health Check

Create a health check endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
```

### Docker Health Checks

```yaml
# docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Monitoring with Docker

```bash
# Monitor container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View health check logs
docker inspect --format='{{json .State.Health}}' container-name

# Monitor resource usage
docker stats

# View container logs
docker logs -f container-name
```

## Development Tools

### Docker Debugging

```bash
# Execute commands in running container
docker exec -it lcm-app sh

# Debug container startup
docker run -it --entrypoint sh lcm-nextjs-boilerplate

# Inspect image layers
docker history lcm-nextjs-boilerplate

# Check environment variables
docker exec lcm-app env
```

### Database Management

```bash
# Backup database
docker exec postgres pg_dump -U postgres lcm-nextjs-boilerplate > backup.sql

# Restore database
docker exec -i postgres psql -U postgres lcm-nextjs-boilerplate < backup.sql

# Connect to database
docker exec -it postgres psql -U postgres -d lcm-nextjs-boilerplate
```

### Log Management

```bash
# View all service logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f postgres

# View logs from specific time
docker-compose logs --since 2024-01-01T10:00:00

# Tail logs
docker-compose logs --tail 100 app
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: your-username/lcm-nextjs-boilerplate
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

# Configuration
IMAGE_NAME="lcm-nextjs-boilerplate"
CONTAINER_NAME="lcm-app"
PORT="3000"

echo "Deploying $IMAGE_NAME..."

# Stop and remove existing container
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Pull latest image
docker pull $IMAGE_NAME:latest

# Run new container
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:3000 \
  --env-file .env.docker \
  --restart unless-stopped \
  $IMAGE_NAME:latest

# Health check
echo "Waiting for application to start..."
sleep 30

if curl -f http://localhost:$PORT/api/health; then
  echo "Deployment successful!"
else
  echo "Deployment failed - health check failed"
  exit 1
fi

# Cleanup old images
docker system prune -f
```

## Security Considerations

### Image Security

```dockerfile
# Use specific image versions
FROM node:22.0.0-alpine

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Don't run as root
USER nextjs

# Scan for vulnerabilities
RUN npm audit --audit-level moderate
```

### Secret Management

```bash
# Use Docker secrets for sensitive data
echo "secret-password" | docker secret create db_password -

# Reference in compose file
services:
  app:
    secrets:
      - db_password
    environment:
      - DATABASE_PASSWORD_FILE=/run/secrets/db_password

secrets:
  db_password:
    external: true
```

### Network Security

```yaml
# Isolate services with custom networks
services:
  app:
    networks:
      - frontend
      - backend

  postgres:
    networks:
      - backend

  nginx:
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true # No external access
```

## Troubleshooting

### Common Issues

#### Port conflicts

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 $(lsof -t -i:3000)

# Use different port
docker run -p 3001:3000 lcm-nextjs-boilerplate
```

#### Permission issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Use correct user in container
USER nextjs
```

#### Database connection issues

```bash
# Check container network
docker network inspect lcm-nextjs-boilerplate_default

# Test connectivity
docker exec app ping postgres
```

#### Build failures

```bash
# Clear Docker cache
docker builder prune

# Build without cache
docker build --no-cache -t lcm-nextjs-boilerplate .

# Check build logs
docker build -t lcm-nextjs-boilerplate . 2>&1 | tee build.log
```

### Performance Issues

#### Slow builds

```bash
# Use BuildKit
export DOCKER_BUILDKIT=1

# Enable parallel builds
docker build --parallel -t lcm-nextjs-boilerplate .
```

#### Large image size

```bash
# Analyze image layers
docker history lcm-nextjs-boilerplate

# Use dive tool
dive lcm-nextjs-boilerplate
```

#### Memory issues

```bash
# Set memory limits
docker run -m 512m lcm-nextjs-boilerplate

# Monitor memory usage
docker stats --no-stream
```

## Advanced Topics

### Multi-architecture Builds

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t lcm-nextjs-boilerplate:latest \
  --push .
```

### Custom Base Images

```dockerfile
# Create custom base image
FROM node:22-alpine AS base
RUN apk add --no-cache curl git && \
    npm install -g pnpm@latest

# Use custom base
FROM my-registry/node-base:latest AS deps
```

### Volume Management

```yaml
# Named volumes for persistence
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/app/data

# Backup volumes
services:
  backup:
    image: alpine
    volumes:
      - postgres_data:/data:ro
    command: tar czf /backup/data.tar.gz /data
```
