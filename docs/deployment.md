# Deployment Guide

This guide covers deployment strategies, hosting options, and production configuration for LCM Next.js Quickstart.

## Deployment Overview

The project supports multiple deployment strategies:

- **Docker-based**: Containerized deployment for any platform
- **Vercel**: Optimal for Next.js applications
- **AWS**: EC2, ECS, or Lambda deployments
- **Google Cloud Platform**: Cloud Run or Compute Engine
- **DigitalOcean**: App Platform or Droplets
- **Self-hosted**: VPS or dedicated servers

## Production Configuration

### Environment Setup

Create production environment file (`.env.production`):

```bash
# Environment
NODE_ENV=production

# Application
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
AUTH_URL=https://yourdomain.com

# Authentication
AUTH_SECRET=your-production-secret-here
AUTH_GOOGLE_ID=your-production-google-id
AUTH_GOOGLE_SECRET=your-production-google-secret

# Database
DATABASE_URL=postgresql://user:password@prod-db:5432/app_production

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn
```

### Build Optimization

Configure `next.config.js` for production:

```javascript
/** @type {import("next").NextConfig} */
const config = {
  // Standalone output for Docker
  output: "standalone",

  // Compression
  compress: true,

  // Image optimization
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default config;
```

## Docker Deployment

### Production Docker Build

```dockerfile
# Multi-stage production Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=false

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true

RUN pnpm build

# Runner
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=${AUTH_URL}
      - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network

  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Static file caching
        location /_next/static/ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            proxy_pass http://app;
        }

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login rate limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Main application
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## Platform-Specific Deployments

### Vercel Deployment

Vercel provides optimal hosting for Next.js applications:

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/dashboard",
      "permanent": true
    }
  ]
}
```

#### Vercel Environment Variables

Set these in the Vercel dashboard:

```bash
# Production
NODE_ENV=production
AUTH_SECRET=vercel-production-secret
DATABASE_URL=postgresql://...
NEXT_PUBLIC_BASE_URL=https://yourapp.vercel.app

# Preview (optional)
AUTH_SECRET=vercel-preview-secret
DATABASE_URL=postgresql://preview-db...
```

#### Deployment Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod

# Or use GitHub integration for automatic deployments
```

### AWS Deployment

#### AWS ECS with Fargate

```yaml
# ecs-task-definition.yml
version: "3"
services:
  app:
    image: your-account.dkr.ecr.region.amazonaws.com/lcm-nextjs-boilerplate:latest
    cpu: 512
    memory: 1024
    essential: true
    portMappings:
      - containerPort: 3000
        protocol: tcp
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_SECRET=${AUTH_SECRET}
    logConfiguration:
      logDriver: awslogs
      options:
        awslogs-group: /ecs/lcm-nextjs-boilerplate
        awslogs-region: us-east-1
        awslogs-stream-prefix: ecs
```

#### AWS Lambda with SST

```typescript
// sst.config.ts
import { SSTConfig } from "sst";
import { NextjsSite, RDS } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "lcm-nextjs-boilerplate",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const database = new RDS(stack, "Database", {
        engine: "postgresql13.13",
        defaultDatabaseName: "main",
        migrations: "prisma/migrations",
      });

      const site = new NextjsSite(stack, "Site", {
        bind: [database],
        environment: {
          DATABASE_URL: database.connectionString,
          AUTH_SECRET: process.env.AUTH_SECRET!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
        DatabaseUrl: database.connectionString,
      });
    });
  },
} satisfies SSTConfig;
```

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: lcm-nextjs-boilerplate
region: nyc

services:
  - name: web
    source_dir: /
    github:
      repo: your-username/lcm-nextjs-boilerplate
      branch: main
      deploy_on_push: true

    run_command: node server.js
    build_command: pnpm build

    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs

    routes:
      - path: /

    envs:
      - key: NODE_ENV
        value: production
      - key: AUTH_SECRET
        value: ${AUTH_SECRET}
        type: SECRET
      - key: DATABASE_URL
        value: ${DATABASE_URL}
        type: SECRET

databases:
  - name: db
    engine: PG
    version: "15"
    size: basic-xs
```

### Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: "gcr.io/cloud-builders/docker"
    args:
      [
        "build",
        "-t",
        "gcr.io/$PROJECT_ID/lcm-nextjs-boilerplate:$COMMIT_SHA",
        ".",
      ]

  # Push the container image to Container Registry
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/lcm-nextjs-boilerplate:$COMMIT_SHA"]

  # Deploy container image to Cloud Run
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    entrypoint: gcloud
    args:
      - "run"
      - "deploy"
      - "lcm-nextjs-boilerplate"
      - "--image"
      - "gcr.io/$PROJECT_ID/lcm-nextjs-boilerplate:$COMMIT_SHA"
      - "--region"
      - "us-central1"
      - "--platform"
      - "managed"
      - "--allow-unauthenticated"

images:
  - gcr.io/$PROJECT_ID/lcm-nextjs-boilerplate:$COMMIT_SHA
```

## Database Deployment

### PostgreSQL Setup

#### Managed Database Services

**Vercel Postgres:**

```bash
# Create database
vercel postgres create

# Get connection string
vercel env pull .env.production
```

**AWS RDS:**

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier lcm-nextjs-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --allocated-storage 20 \
  --master-username postgres \
  --master-user-password your-secure-password \
  --vpc-security-group-ids sg-xxxxxx
```

**DigitalOcean Managed Database:**

```bash
# Using doctl CLI
doctl databases create lcm-nextjs-db \
  --engine pg \
  --version 15 \
  --size db-s-1vcpu-1gb \
  --region nyc3
```

#### Migration in Production

```bash
# Production migration workflow
# 1. Backup current database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 2. Run migrations
npx prisma migrate deploy

# 3. Verify migration
npx prisma db pull

# 4. Test application
curl -f https://yourapp.com/api/health
```

### Connection Pooling

For production, use connection pooling:

```bash
# PgBouncer connection string
DATABASE_URL="postgresql://user:password@pgbouncer-host:6543/database?sslmode=require&pgbouncer=true"

# Prisma with connection pooling
DATABASE_URL="postgresql://user:password@host:5432/database?connection_limit=10&pool_timeout=20"
```

## Monitoring and Analytics

### Application Monitoring

#### Sentry Error Tracking

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

#### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, properties);
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }
}
```

#### Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "unknown",
  };

  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    checks.database = true;

    return NextResponse.json({
      status: "healthy",
      checks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        checks,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
```

### Logging

```typescript
// lib/logger.ts
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV === "production"
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }),
});

export { logger };

// Usage
logger.info("User logged in", { userId: "123" });
logger.error("Database connection failed", { error: error.message });
```

## SSL and Security

### SSL Certificate Setup

#### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Cloudflare SSL

```bash
# Use Cloudflare proxy for SSL termination
# Set DNS records to point to your server
# Enable "Flexible" or "Full" SSL in Cloudflare dashboard
```

### Security Headers

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Setup pnpm
        uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        run: |
          # Add deployment script here
          echo "Deploying to production..."
```

### Blue-Green Deployment

```bash
#!/bin/bash
# blue-green-deploy.sh

set -e

BLUE_PORT=3000
GREEN_PORT=3001
HEALTH_CHECK_URL="http://localhost"

# Determine current active container
if docker ps --filter "name=app-blue" --filter "status=running" -q | grep -q .; then
    CURRENT="blue"
    NEW="green"
    CURRENT_PORT=$BLUE_PORT
    NEW_PORT=$GREEN_PORT
else
    CURRENT="green"
    NEW="blue"
    CURRENT_PORT=$GREEN_PORT
    NEW_PORT=$BLUE_PORT
fi

echo "Current active: $CURRENT"
echo "Deploying to: $NEW"

# Stop and remove the new container if it exists
docker stop app-$NEW || true
docker rm app-$NEW || true

# Start new container
docker run -d \
  --name app-$NEW \
  -p $NEW_PORT:3000 \
  --env-file .env.production \
  lcm-nextjs-boilerplate:latest

# Wait for health check
echo "Waiting for health check..."
for i in {1..30}; do
  if curl -f $HEALTH_CHECK_URL:$NEW_PORT/api/health; then
    echo "Health check passed"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "Health check failed"
    docker stop app-$NEW
    docker rm app-$NEW
    exit 1
  fi
  sleep 2
done

# Update load balancer to point to new container
# (Implementation depends on your load balancer)
echo "Switching traffic to $NEW container"

# Stop old container
docker stop app-$CURRENT
docker rm app-$CURRENT

echo "Deployment complete"
```

## Performance Optimization

### CDN Configuration

#### Cloudflare Settings

```javascript
// Cloudflare Page Rules
const pageRules = [
  {
    url: "yourdomain.com/_next/static/*",
    settings: {
      cacheLevel: "cache_everything",
      edgeCacheTtl: "1 year",
      browserCacheTtl: "1 year",
    },
  },
  {
    url: "yourdomain.com/api/*",
    settings: {
      cacheLevel: "bypass",
      disablePerformance: true,
    },
  },
];
```

#### AWS CloudFront

```json
{
  "DistributionConfig": {
    "CallerReference": "lcm-nextjs-boilerplate",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "origin1",
          "DomainName": "yourapp.com",
          "CustomOriginConfig": {
            "HTTPPort": 443,
            "HTTPSPort": 443,
            "OriginProtocolPolicy": "https-only"
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "origin1",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "managed-caching-optimized"
    },
    "CacheBehaviors": {
      "Quantity": 2,
      "Items": [
        {
          "PathPattern": "/_next/static/*",
          "TargetOriginId": "origin1",
          "ViewerProtocolPolicy": "redirect-to-https",
          "CachePolicyId": "managed-caching-optimized-for-uncompressed-objects"
        },
        {
          "PathPattern": "/api/*",
          "TargetOriginId": "origin1",
          "ViewerProtocolPolicy": "redirect-to-https",
          "CachePolicyId": "managed-caching-disabled"
        }
      ]
    }
  }
}
```

### Database Optimization

```typescript
// Production database configuration
const productionDbConfig = {
  connectionLimit: 20,
  acquireTimeoutMillis: 60000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 600000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
};

// Connection pooling with Prisma
const db = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=${productionDbConfig.connectionLimit}&pool_timeout=20`,
    },
  },
});
```

## Scaling Considerations

### Horizontal Scaling

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lcm-nextjs-boilerplate
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lcm-nextjs-boilerplate
  template:
    metadata:
      labels:
        app: lcm-nextjs-boilerplate
    spec:
      containers:
        - name: app
          image: lcm-nextjs-boilerplate:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: lcm-nextjs-service
spec:
  selector:
    app: lcm-nextjs-boilerplate
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### Auto-scaling

```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: lcm-nextjs-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: lcm-nextjs-boilerplate
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
docker build --no-cache -t lcm-nextjs-boilerplate . 2>&1 | tee build.log

# Verify dependencies
pnpm audit
pnpm outdated
```

#### Runtime Errors

```bash
# Check application logs
docker logs app-container -f

# Check health endpoint
curl -f https://yourapp.com/api/health

# Monitor resource usage
docker stats app-container
```

#### Database Connection Issues

```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT 1"

# Check connection pooling
# Monitor active connections in database
```

#### SSL Certificate Issues

```bash
# Check certificate validity
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Test SSL configuration
curl -I https://yourdomain.com
```

### Performance Issues

#### Slow Response Times

```bash
# Profile application
curl -o /dev/null -s -w "%{time_total}" https://yourapp.com

# Check database performance
# Monitor slow query logs
```

#### High Memory Usage

```bash
# Monitor memory usage
docker stats --no-stream

# Profile Node.js memory
node --inspect=0.0.0.0:9229 server.js
```

### Rollback Procedures

```bash
#!/bin/bash
# rollback.sh

PREVIOUS_VERSION=${1:-"previous"}

echo "Rolling back to version: $PREVIOUS_VERSION"

# Stop current containers
docker stop $(docker ps -q --filter "name=app")

# Start previous version
docker run -d \
  --name app-rollback \
  -p 3000:3000 \
  --env-file .env.production \
  lcm-nextjs-boilerplate:$PREVIOUS_VERSION

# Health check
if curl -f http://localhost:3000/api/health; then
  echo "Rollback successful"
else
  echo "Rollback failed"
  exit 1
fi
```

This deployment guide provides comprehensive coverage of production deployment strategies, from simple Docker deployments to complex Kubernetes orchestration. Choose the deployment method that best fits your infrastructure requirements and scaling needs.
