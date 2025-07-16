# Architecture Overview

This document outlines the architectural decisions, patterns, and structure of the LCM Next.js Boilerplate.

## High-Level Architecture

The boilerplate follows the **T3 Stack** philosophy, emphasizing type safety, developer experience, and modern web development practices.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │    Database     │
│                 │    │                 │    │                 │
│  React/Next.js  │◄──►│  tRPC/NextAuth  │◄──►│   PostgreSQL    │
│  Tailwind CSS   │    │   Prisma ORM    │    │                 │
│  shadcn/ui      │    │   Zod Schemas   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Technologies

### Frontend Stack

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with concurrent features
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library built on Radix UI

### Backend Stack

- **tRPC**: End-to-end typesafe APIs
- **NextAuth.js**: Authentication and session management
- **Prisma**: Type-safe database ORM
- **Zod**: Schema validation and type inference

### Database & Infrastructure

- **PostgreSQL**: Primary database
- **Docker**: Containerization for development
- **pnpm**: Fast, disk space efficient package manager

## Project Structure

```
src/
├── _components/          # Reusable UI components
│   ├── auth/            # Authentication-related components
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── posts/           # Post-related components
│   ├── theme/           # Theme switching components
│   └── ui/              # shadcn/ui components
├── app/                 # Next.js App Router
│   ├── api/             # API routes
│   │   ├── auth/        # NextAuth.js configuration
│   │   └── trpc/        # tRPC endpoint
│   ├── post/            # Post-related pages
│   └── layout.tsx       # Root layout
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── server/              # Server-side code
│   ├── api/             # tRPC routers and procedures
│   ├── auth/            # NextAuth.js configuration
│   └── db.ts            # Database connection
├── styles/              # Global CSS styles
└── trpc/                # tRPC client configuration
```

## Design Patterns

### 1. Type-Safe API Layer (tRPC)

tRPC provides end-to-end type safety between client and server:

```typescript
// Server-side procedure
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });
    }),
});

// Client-side usage (fully typed)
const createPost = api.post.create.useMutation();
```

### 2. Component Composition

Components are organized by feature and follow composition patterns:

```typescript
// Component structure
src/_components/
├── posts/
│   ├── index.ts          # Export barrel
│   ├── PostCard.tsx      # Individual post display
│   ├── PostForm.tsx      # Post creation form
│   ├── PostList.tsx      # List of posts
│   └── PostSkeleton.tsx  # Loading skeleton
```

### 3. Server Components First

Leveraging Next.js App Router with server components by default:

```typescript
// Server component (default)
export default async function PostsPage() {
  const posts = await api.post.getLatest();
  return <PostList posts={posts} />;
}

// Client component (when needed)
'use client';
export function PostForm() {
  // Interactive client-side logic
}
```

### 4. Database Layer (Prisma)

Type-safe database access with Prisma:

```typescript
// Schema definition
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  createdBy User     @relation(fields: [createdById], references: [id])
}

// Type-safe queries
const posts = await db.post.findMany({
  include: { createdBy: true },
  orderBy: { createdAt: 'desc' },
});
```

## Data Flow

### 1. Request Lifecycle

```
User Action → Client Component → tRPC Mutation → Server Procedure → Database → Response
```

### 2. Authentication Flow

```
User Login → NextAuth.js → OAuth Provider → Session Creation → Protected Routes
```

### 3. Component Rendering

```
Server Component → Data Fetching → Client Hydration → Interactive Features
```

## Security Considerations

### 1. Environment Variables

- Validation with `@t3-oss/env-nextjs`
- Separate client and server environment variables
- Type-safe environment variable access

### 2. Authentication

- NextAuth.js with secure session management
- CSRF protection built-in
- Secure cookie configuration

### 3. Database Security

- Prisma's built-in SQL injection protection
- Row-level security considerations
- Connection pooling and timeouts

### 4. Input Validation

- Zod schemas for all inputs
- Type-safe validation on both client and server
- Sanitization of user inputs

## Performance Optimizations

### 1. Build Optimizations

- **Standalone output**: Optimized for containerization
- **Bundle analysis**: Monitor bundle size
- **Tree shaking**: Automatic dead code elimination

### 2. Runtime Optimizations

- **Server components**: Reduce client-side JavaScript
- **Image optimization**: Next.js automatic image optimization
- **Font optimization**: Automatic font optimization

### 3. Database Optimizations

- **Connection pooling**: Efficient database connections
- **Query optimization**: Prisma query optimization
- **Indexing**: Strategic database indexes

## Scalability Considerations

### 1. Horizontal Scaling

- **Stateless design**: Easy to scale across multiple instances
- **Database connection pooling**: Efficient resource usage
- **CDN-ready**: Static assets can be served from CDN

### 2. Code Organization

- **Feature-based structure**: Easy to split into microservices
- **Modular components**: Reusable across projects
- **Type safety**: Reduces runtime errors in production

### 3. Development Team Scaling

- **Clear patterns**: Consistent code organization
- **Type safety**: Self-documenting code
- **Tooling**: Automated formatting and linting

## Deployment Architecture

### Development

```
Local Development → Docker Compose → PostgreSQL + MailHog
```

### Production

```
Source Code → Docker Build → Container Registry → Production Environment
```

## Extension Points

### 1. Adding New Features

1. Create tRPC router in `src/server/api/routers/`
2. Add database models in `prisma/schema.prisma`
3. Create UI components in `src/_components/`
4. Add pages in `src/app/`

### 2. Adding Authentication Providers

1. Configure provider in `src/server/auth/config.ts`
2. Add environment variables
3. Update Prisma schema if needed

### 3. Adding Database Models

1. Update `prisma/schema.prisma`
2. Run `pnpm db:generate`
3. Create tRPC procedures
4. Build UI components

## Testing Strategy

### 1. Unit Testing

- **Jest**: Component and utility testing
- **Testing Library**: React component testing
- **Type testing**: TypeScript compilation tests

### 2. Integration Testing

- **tRPC procedures**: API endpoint testing
- **Database operations**: Prisma query testing
- **Authentication flows**: NextAuth.js testing

### 3. End-to-End Testing

- **Playwright**: Full user journey testing
- **Accessibility testing**: axe-core integration
- **Visual regression**: Screenshot comparison

## Monitoring and Observability

### 1. Error Tracking

- Ready for Sentry integration
- Structured error logging
- User-friendly error boundaries

### 2. Performance Monitoring

- Next.js analytics ready
- Web vitals tracking
- Database query performance

### 3. Health Checks

- Database connection health
- API endpoint health
- Docker container health checks

## Future Architecture Considerations

### 1. Microservices Migration

- Feature-based code organization makes extraction easier
- tRPC procedures can become separate services
- Database can be split by domain

### 2. State Management

- Currently uses server state with tRPC
- Can add Zustand or Redux for complex client state
- Form state with React Hook Form

### 3. Caching Strategy

- Next.js built-in caching
- Can add Redis for session storage
- CDN caching for static assets

### 4. Static and Public Routes

The app supports two types of unauthenticated routes:

- **Public Routes**: Pages like `/about` or `/terms` that do not require authentication but still share common layouts.
- **Static Routes**: Fully static pages rendered without requiring a user session, suitable for marketing or legal content.

To configure:

- Define static routes in the `staticRoutes` array in `auth.ts`.
- Define public routes in the `publicRoutes` array in `middleware.ts`.

This separation improves flexibility when defining pages that don’t require user login, without impacting access control for protected routes.
