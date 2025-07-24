# Copilot Instructions Template

> **Important**: This is a template file. When you clone this boilerplate, customize these instructions to match your specific project requirements, business domain, and team preferences.

## Why This File Matters

This file provides AI coding assistants (like GitHub Copilot, Claude, ChatGPT, etc.) with essential context about your project. Well-crafted instructions lead to:

- **More accurate code suggestions** that follow your project's patterns
- **Consistent coding style** across your team
- **Better architecture decisions** aligned with your tech stack
- **Faster development** with contextually relevant assistance
- **Reduced debugging** from AI-generated code that doesn't fit your project

## How to Use This Template

1. **Customize the project context** section with your specific domain and requirements
2. **Update the coding standards** to match your team's preferences
3. **Add project-specific patterns** you want the AI to follow
4. **Include domain-specific terminology** and business rules
5. **Remove or modify** sections that don't apply to your project
6. **Keep it updated** as your project evolves

---

## Project Context

### Project Overview
<!-- Replace this with your project's specific information -->
**Project Type**: [e.g., E-commerce platform, SaaS dashboard, Marketing website]
**Target Audience**: [e.g., End consumers, Business users, Developers]
**Key Features**: [e.g., User authentication, Payment processing, Real-time chat]
**Business Domain**: [e.g., Healthcare, Finance, Education, E-commerce]

### Architecture & Tech Stack

This project is built on the **T3 Stack** with the following core technologies:

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js
- **Validation**: Zod schemas
- **State Management**: React Query (TanStack Query)
- **Testing**: Jest (unit) + Playwright (E2E)

### Project Structure
```
src/
├── _components/         # Reusable React components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── ui/              # shadcn/ui components
│   └── [domain]/        # Domain-specific components
├── app/                 # Next.js App Router pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── server/              # Server-side code
│   ├── api/             # tRPC routers
│   ├── auth/            # NextAuth.js configuration
│   └── db.ts            # Database connection
└── trpc/                # tRPC client configuration
```

## Code Generation Guidelines

### General Principles

1. **Type Safety First**: Always use TypeScript with proper typing
2. **Component Composition**: Prefer composition over inheritance
3. **Server/Client Separation**: Clearly distinguish server and client code
4. **Performance**: Prioritize Core Web Vitals and loading performance
5. **Accessibility**: Follow WCAG 2.1 AA guidelines
6. **Security**: Never expose sensitive data or create security vulnerabilities

### Coding Standards

#### TypeScript
- Use strict TypeScript configuration
- Prefer `interface` for object types, `type` for unions/primitives
- Always define return types for functions
- Use proper generic constraints
- Avoid `any` - use `unknown` if truly needed
- Use the linting practices from './eslint.config.js' when generating code

```typescript
// Good
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

function getUser(id: string): Promise<User | null> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

#### React Components
- Use functional components with hooks
- Prefer named exports over default exports
- Co-locate components with their tests and styles
- Use proper TypeScript props interfaces

```typescript
// Good
interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
  };
  onEdit?: (id: string) => void;
}

export function PostCard({ post, onEdit }: PostCardProps) {
  // implementation
}

// Avoid
export default function PostCard(props: any) {
  // implementation
}
```

#### Styling with Tailwind CSS
- Use utility classes for consistency
- Leverage design tokens from the theme
- Create reusable component variants with class-variance-authority
- Use shadcn/ui components as base building blocks

```typescript
// Good
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### tRPC Patterns

#### Router Structure
- Group related procedures in logical routers
- Use input/output validation with Zod
- Implement proper error handling
- Use middleware for common functionality (auth, logging)

```typescript
// Good
export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return ctx.db.post.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.post.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
```

#### Client Usage
- Use tRPC hooks for data fetching
- Implement proper loading and error states
- Leverage optimistic updates where appropriate

```typescript
// Good
function PostsList() {
  const { data: posts, isLoading, error } = api.posts.getAll.useQuery({
    limit: 20,
  });

  if (isLoading) return <PostsListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Database Patterns with Prisma

#### Schema Design
- Use descriptive model and field names
- Implement proper relationships and constraints
- Add database-level validations where appropriate

```prisma
// Good
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          Role      @default(USER)
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  published   Boolean  @default(false)
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("posts")
}
```

#### Query Patterns
- Use type-safe Prisma queries
- Implement proper error handling
- Use transactions for related operations
- Optimize queries with appropriate `select` and `include`

### Authentication Patterns

#### NextAuth.js Setup
- Configure providers in `src/server/auth/config.ts`
- Use proper session management
- Implement role-based access control

```typescript
// Good - tRPC middleware
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

#### Client-Side Auth
- Use NextAuth.js hooks and utilities
- Implement proper loading states for auth
- Handle authentication redirects appropriately

### Testing Guidelines

#### Unit Tests with Jest
- Test components in isolation
- Mock external dependencies
- Include accessibility tests
- Test error states and edge cases

```typescript
// Good
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PostCard } from './PostCard';

expect.extend(toHaveNoViolations);

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
  };

  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<PostCard post={mockPost} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### E2E Tests with Playwright
- Test complete user workflows
- Include authentication flows
- Test responsive design
- Verify accessibility at the page level

## Project-Specific Guidelines

<!-- Customize this section for your specific project -->

### Domain-Specific Terms
<!-- Add your business domain terminology here -->
- **[Term]**: [Definition and usage]
- **[Term]**: [Definition and usage]

### Business Rules
<!-- Add your specific business logic patterns -->
- [Rule 1]: [Implementation guidance]
- [Rule 2]: [Implementation guidance]

### Common Patterns
<!-- Add patterns specific to your project -->
- [Pattern name]: [When to use and how to implement]

### What to Avoid
<!-- Add anti-patterns specific to your project -->
- ❌ [Anti-pattern]: [Why to avoid and what to do instead]

### API Conventions
<!-- Customize for your API patterns -->
- Use RESTful naming for tRPC procedures
- Implement consistent error handling
- Follow established input/output schemas

### Security Considerations
<!-- Add your specific security requirements -->
- [Security rule]: [Implementation details]

## File and Folder Conventions

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types**: PascalCase (e.g., `User.ts`, `ApiResponse.ts`)

### File Organization
- Group related components in feature folders
- Co-locate tests with components (`__tests__` or `.test.tsx`)
- Keep utilities in `src/lib/`
- Store types in `types/` directory for shared types

### Import Conventions
```typescript
// 1. React and Next.js imports
import { useState } from 'react';
import { NextPage } from 'next';

// 2. Third-party library imports
import { z } from 'zod';
import { Button } from '@/components/ui/button';

// 3. Internal imports (absolute paths)
import { api } from '@/trpc/client';
import { PostCard } from '@/components/posts/PostCard';

// 4. Relative imports
import './styles.css';
```

## Environment and Configuration

### Environment Variables
- Use `@t3-oss/env-nextjs` for type-safe environment variables
- Document all required environment variables
- Provide sensible defaults where possible
- Keep sensitive values out of client-side code

### Configuration Files
- Keep configuration in `src/lib/` directory
- Use proper TypeScript typing for config objects
- Make configuration environment-aware

## Performance Guidelines

### Next.js Optimization
- Use appropriate rendering strategies (SSR, SSG, ISR)
- Optimize images with Next.js Image component
- Implement proper caching strategies
- Use dynamic imports for code splitting

### React Optimization
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Avoid unnecessary re-renders
- Use proper loading states

## Deployment Considerations

<!-- Customize for your deployment strategy -->
- **Platform**: [Your deployment platform]
- **Environment Variables**: [Deployment-specific variables]
- **Build Process**: [Any special build requirements]
- **Monitoring**: [Monitoring and logging setup]

---

## Maintenance

Remember to:
- ✅ Update these instructions when project patterns change
- ✅ Add new business rules and domain concepts
- ✅ Review and refine based on AI assistant feedback
- ✅ Share updates with your team
- ✅ Version control this file with your project

**Last Updated**: [Add date when you customize this template]
**Project Version**: [Your project version]
**Team Contact**: [Your team contact information]