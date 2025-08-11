# Database Guide

This guide covers the database setup, Prisma ORM usage, migrations, and best practices for the PostgreSQL database.

## Overview

The project uses **PostgreSQL** as the primary database with **Prisma** as the ORM, providing:

- **Type Safety**: Generated TypeScript types for all database operations
- **Migration Management**: Version-controlled database schema changes
- **Query Builder**: Intuitive API for database operations
- **Connection Pooling**: Efficient database connection management
- **Development Tools**: Prisma Studio for database visualization

## Database Schema

### Core Models

The schema includes NextAuth.js models plus application-specific models:

```prisma
// Application Models
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdBy   User   @relation(fields: [createdById], references: [id])
  createdById String

  @@index([name])
}

// NextAuth.js Models
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  posts         Post[]    // Application relation
}

model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String?
  access_token             String?
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String?
  session_state            String?
  user                     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  refresh_token_expires_in Int?

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Configuration

### Prisma Configuration

The Prisma configuration in `prisma/schema.prisma`:

```prisma
generator client {
  provider               = "prisma-client" // ESM-compatible generator (Prisma v7 ready)
  output                 = "../src/generated/prisma"
  runtime                = "nodejs"
  moduleFormat           = "esm"
  generatedFileExtension = "ts"
  importFileExtension    = "ts"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Note**: This project uses the new ESM-compatible `prisma-client` generator (without the `-js` suffix) which:

- Generates TypeScript files directly to `src/generated/prisma`
- Provides better ESM support and import/export compatibility
- Will become the default in Prisma v7
- Eliminates issues with code generation into `node_modules`

### Prisma Config File

The project uses `prisma.config.ts` for modern Prisma configuration:

```typescript
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
```

**Benefits**:

- Eliminates deprecation warnings from `package.json#prisma`
- Uses official Prisma configuration format
- Centralizes all Prisma settings in one file

### Database Connection

Database connection is configured in `src/server/db.ts`:

```typescript
import { PrismaClient } from "~/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### Environment Configuration

Database connection string in `.env`:

```bash
# PostgreSQL connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/lcm-nextjs-boilerplate"

# Alternative format with connection pooling
DATABASE_URL="postgresql://user:password@host:port/database?schema=public&connection_limit=5"
```

## Development Workflow

### Initial Setup

1. **Start the database**:

   ```bash
   pnpm docker:dev
   ```

2. **Generate client and run migrations**:

   ```bash
   pnpm db:generate
   ```

3. **Open Prisma Studio** (optional):
   ```bash
   pnpm db:studio
   ```

### Making Schema Changes

1. **Edit the schema**:

   ```prisma
   // Add new model in prisma/schema.prisma
   model Comment {
     id      String @id @default(cuid())
     content String
     postId  Int
     post    Post   @relation(fields: [postId], references: [id])
   }
   ```

2. **Generate migration**:

   ```bash
   pnpm db:generate
   # This creates a new migration file and updates the client
   ```

3. **Review migration**:
   Check the generated SQL in `prisma/migrations/`

### Alternative: Schema Push (Development Only)

For rapid prototyping without migration files:

```bash
pnpm db:push
```

⚠️ **Warning**: Only use `db:push` in development. Always use migrations for production.

## Database Operations

### Basic Queries

```typescript
import { db } from "~/server/db";

// Create
const post = await db.post.create({
  data: {
    name: "My First Post",
    createdById: userId,
  },
});

// Read
const posts = await db.post.findMany({
  include: {
    createdBy: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

// Update
const updatedPost = await db.post.update({
  where: { id: postId },
  data: { name: "Updated Title" },
});

// Delete
await db.post.delete({
  where: { id: postId },
});
```

### Advanced Queries

```typescript
// Complex filtering
const posts = await db.post.findMany({
  where: {
    AND: [
      { name: { contains: "search term" } },
      { createdAt: { gte: new Date("2024-01-01") } },
    ],
  },
  include: {
    createdBy: {
      select: { name: true, email: true },
    },
  },
  take: 10,
  skip: 20,
});

// Aggregations
const stats = await db.post.aggregate({
  _count: { id: true },
  _max: { createdAt: true },
  where: { createdById: userId },
});

// Transactions
const result = await db.$transaction(async (tx) => {
  const post = await tx.post.create({
    data: { name: "New Post", createdById: userId },
  });

  await tx.user.update({
    where: { id: userId },
    data: { postCount: { increment: 1 } },
  });

  return post;
});
```

### Raw Queries

For complex queries that need raw SQL:

```typescript
// Raw query
const result = await db.$queryRaw`
  SELECT 
    u.name,
    COUNT(p.id) as post_count
  FROM "User" u
  LEFT JOIN "Post" p ON u.id = p."createdById"
  GROUP BY u.id, u.name
  ORDER BY post_count DESC
`;

// Parameterized raw query
const posts = await db.$queryRaw`
  SELECT * FROM "Post" 
  WHERE "createdAt" > ${startDate}
  AND "name" ILIKE ${`%${searchTerm}%`}
`;
```

## Migration Management

### Creating Migrations

```bash
# Create and apply migration
pnpm db:generate

# Create migration without applying (CI/CD)
npx prisma migrate dev --create-only
```

### Migration Files

Migrations are stored in `prisma/migrations/`:

```
prisma/migrations/
├── migration_lock.toml
├── 20240701165225_init/
│   └── migration.sql
└── 20240702120000_add_comments/
    └── migration.sql
```

### Production Migrations

```bash
# Apply migrations in production
pnpm db:migrate

# Or manually
npx prisma migrate deploy
```

### Migration Best Practices

1. **Review migrations** before applying
2. **Backup database** before major changes
3. **Test migrations** on staging first
4. **Use transactions** for complex changes
5. **Avoid destructive changes** without data migration

## Performance Optimization

### Indexing Strategy

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  status    Status
  categoryId Int

  // Single column indexes
  @@index([createdAt])
  @@index([status])

  // Composite indexes
  @@index([status, createdAt])
  @@index([categoryId, createdAt])
}
```

### Query Optimization

```typescript
// Use select to limit fields
const posts = await db.post.findMany({
  select: {
    id: true,
    name: true,
    createdAt: true,
  },
});

// Use include sparingly
const posts = await db.post.findMany({
  include: {
    createdBy: {
      select: { name: true, image: true }, // Only needed fields
    },
  },
});

// Pagination
const posts = await db.post.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: "desc" },
});

// Cursor-based pagination for large datasets
const posts = await db.post.findMany({
  take: 20,
  cursor: lastPostId ? { id: lastPostId } : undefined,
  skip: lastPostId ? 1 : 0,
  orderBy: { id: "asc" },
});
```

### Connection Pooling

Configure connection pooling for production:

```bash
# Connection pooling parameters
DATABASE_URL="postgresql://user:password@host:port/db?connection_limit=10&pool_timeout=20"
```

## Development Tools

### Prisma Studio

Visual database browser:

```bash
# Start Prisma Studio
pnpm db:studio

# Opens at http://localhost:5555
```

Features:

- Browse and edit data
- Visual relationships
- Query builder interface
- Schema visualization

### Database Introspection

Generate schema from existing database:

```bash
# Introspect existing database
npx prisma db pull

# Generate client from introspected schema
npx prisma generate
```

### Schema Validation

```bash
# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format
```

## Testing with Database

### Test Database Setup

Use separate database for tests:

```bash
# Test environment
DATABASE_URL="postgresql://postgres:password@localhost:5432/lcm-nextjs-boilerplate-test"
```

### Test Utilities

```typescript
// test/db-utils.ts
import { PrismaClient } from "~/generated/prisma/client";

export function createTestDb() {
  const db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  return db;
}

export async function clearDb(db: PrismaClient) {
  await db.post.deleteMany();
  await db.user.deleteMany();
}
```

### Jest Setup

```typescript
// jest.setup.js
import { db } from "~/server/db";

beforeEach(async () => {
  // Clear database before each test
  await db.post.deleteMany();
  await db.user.deleteMany();
});

afterAll(async () => {
  await db.$disconnect();
});
```

## Production Considerations

### Environment Variables

Production database configuration:

```bash
# Production with connection pooling
DATABASE_URL="postgresql://user:password@prod-host:5432/db?connection_limit=20&pool_timeout=20&sslmode=require"

# Connection string with SSL
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require&sslcert=client-cert.pem&sslkey=client-key.pem&sslrootcert=server-ca.pem"
```

### Security Best Practices

1. **Use environment variables** for sensitive data
2. **Enable SSL** in production
3. **Limit database permissions** for application user
4. **Use connection pooling** to prevent connection exhaustion
5. **Monitor query performance** and slow queries

### Backup Strategy

```bash
# Automated backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20240701.sql
```

### Monitoring

Monitor database performance:

```typescript
// Add query logging in production
const db = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

db.$on("query", (e) => {
  if (e.duration > 1000) {
    console.warn(`Slow query: ${e.query} (${e.duration}ms)`);
  }
});
```

## Troubleshooting

### Common Issues

#### Schema Drift

```bash
# Reset schema to match migrations
npx prisma migrate reset

# Or force schema state
npx prisma db push --force-reset
```

#### Connection Issues

```bash
# Test database connection
npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

#### Migration Conflicts

```bash
# Resolve migration conflicts
npx prisma migrate resolve --applied "migration-name"

# Reset and reapply
npx prisma migrate reset
```

#### Generated Client Issues

```bash
# Clear and regenerate client
rm -rf node_modules/.prisma
rm -rf prisma/generated
npx prisma generate
```

### Debug Mode

Enable query logging for debugging:

```typescript
const db = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

### Performance Issues

1. **Add missing indexes** for frequently queried columns
2. **Use select** to limit returned fields
3. **Implement pagination** for large datasets
4. **Use connection pooling** for high-traffic applications
5. **Monitor query execution time** and optimize slow queries

## Advanced Topics

### Custom Field Types

```prisma
model User {
  id       String   @id @default(cuid())
  metadata Json?    // JSON field
  tags     String[] // Array field
  rating   Decimal  // Decimal for precise numbers
}
```

### Soft Deletes

```prisma
model Post {
  id        Int       @id @default(autoincrement())
  name      String
  deletedAt DateTime?

  @@map("posts")
}
```

```typescript
// Middleware for soft deletes
db.$use(async (params, next) => {
  if (params.model === "Post") {
    if (params.action === "delete") {
      params.action = "update";
      params.args["data"] = { deletedAt: new Date() };
    }
    if (params.action === "findMany" || params.action === "findFirst") {
      if (!params.args.where) params.args.where = {};
      params.args.where.deletedAt = null;
    }
  }
  return next(params);
});
```

### Multi-Database Support

```prisma
// Multiple databases
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

datasource analytics {
  provider = "postgresql"
  url      = env("ANALYTICS_DATABASE_URL")
}
```

### Custom Prisma Extensions

```typescript
const db = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
  },
});
```
