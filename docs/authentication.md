# Authentication Guide

This guide covers the authentication system built with NextAuth.js, including setup, configuration, and usage patterns.

## Overview

The authentication system uses **NextAuth.js v5** (beta) with the following features:

- **Magic Link Login**: Email-based authentication with secure magic links
- **OAuth Integration**: Google OAuth provider configured
- **Session Management**: Secure session handling with database persistence
- **Type Safety**: Full TypeScript integration
- **Prisma Adapter**: Database-backed sessions and user data
- **Route Protection**: Server and client-side route protection

## Configuration

### NextAuth.js Setup

The authentication configuration is located in `src/server/auth/config.ts`:

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { db } from "~/server/db";
import { env } from "~/env";

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Nodemailer({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
  },
} satisfies NextAuthConfig;
```

### Environment Variables

Required environment variables for authentication:

```bash
# NextAuth.js Secret (generate with: npx auth secret)
AUTH_SECRET=your-secret-here

# Google OAuth Configuration
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Email Magic Link Configuration
EMAIL_SERVER=smtp://localhost:1025
EMAIL_FROM=noreply@yourdomain.com

# Authentication URL
AUTH_URL=http://localhost:3000

# Show Google sign-in button in UI
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

## Database Schema

The Prisma schema includes NextAuth.js required models:

```prisma
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

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  posts         Post[]    // Your app-specific relations
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Usage Patterns

### Server Components

Access session data in server components:

```typescript
import { auth } from "~/server/auth";

export default async function ServerPage() {
  const session = await auth();

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Client Components

Use the session in client components:

```typescript
"use client";
import { useSession } from "next-auth/react";

export function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {session?.user.name}</h1>
    </div>
  );
}
```

### tRPC Integration

Protect tRPC procedures with authentication:

```typescript
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Public procedure (no authentication required)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),

  // Protected procedure (authentication required)
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id, // User ID available
        },
      });
    }),
});
```

## Route Protection

### Middleware Protection

Protect routes using Next.js middleware in `middleware.ts`:

```typescript
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protect routes that start with /admin
  const isProtectedRoute = nextUrl.pathname.startsWith("/admin");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Page-Level Protection

Protect individual pages:

```typescript
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <div>Protected content</div>;
}
```

## Authentication Components

### Sign In Component

```typescript
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function SignIn() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span>Signed in as {session.user.name}</span>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("google")}>Sign in with Google</Button>
  );
}
```

### User Avatar Component

```typescript
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { auth } from "~/server/auth";

export async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <Avatar>
      <AvatarImage src={session.user.image ?? ""} />
      <AvatarFallback>
        {session.user.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
```

## Google OAuth Setup

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** or **Google People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**

### 2. Configure OAuth Consent Screen

1. Set application name and user support email
2. Add authorized domains
3. Configure scopes (email, profile)
4. Add test users if in development

### 3. Set Authorized Redirect URIs

Add these redirect URIs:

**Development:**

```
http://localhost:3000/api/auth/callback/google
```

**Production:**

```
https://yourdomain.com/api/auth/callback/google
```

### 4. Environment Configuration

Add your credentials to `.env`:

```bash
AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-client-secret
```

## Adding Additional Providers

### GitHub Provider

```typescript
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
  // ... rest of config
};
```

### Email Provider

```typescript
import Resend from "next-auth/providers/resend";

export const authConfig = {
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: "noreply@yourdomain.com",
    }),
  ],
  // ... rest of config
};
```

## Session Management

### Session Configuration

Configure session behavior:

```typescript
export const authConfig = {
  session: {
    strategy: "database", // Use database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // ... rest of config
};
```

### Custom Session Data

Extend session with custom data:

```typescript
export const authConfig = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        // Add custom fields
        role: user.role,
        preferences: user.preferences,
      },
    }),
  },
};
```

## Security Best Practices

### 1. Environment Variables

- Keep `AUTH_SECRET` secure and unique
- Use different secrets for different environments
- Rotate secrets regularly

### 2. CSRF Protection

- NextAuth.js includes built-in CSRF protection
- Always use HTTPS in production
- Configure secure cookie settings

### 3. Session Security

- Use database sessions for better security
- Implement session timeout
- Consider implementing session revocation

### 4. OAuth Security

- Validate redirect URIs carefully
- Use state parameter for OAuth flows
- Implement proper scope validation

## Troubleshooting

### Common Issues

#### "AUTH_SECRET is not set"

```bash
# Generate a secret
npx auth secret

# Add to .env
AUTH_SECRET=generated-secret-here
```

#### Google OAuth Errors

- Verify redirect URIs match exactly
- Check that Google+ API is enabled
- Ensure OAuth consent screen is configured

#### Database Connection Issues

```bash
# Reset database and regenerate
pnpm db:push --force-reset
pnpm prisma generate
```

#### Session Not Persisting

- Check `AUTH_URL` matches your domain
- Verify database connection
- Check cookie settings in browser dev tools

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  // ... rest of config
};
```

## Testing Authentication

### Unit Tests

Test authentication utilities:

```typescript
import { auth } from "~/server/auth";

// Mock session for testing
jest.mock("~/server/auth", () => ({
  auth: jest.fn(),
}));

const mockAuth = auth as jest.MockedFunction<typeof auth>;

test("protected route redirects unauthenticated users", async () => {
  mockAuth.mockResolvedValue(null);
  // Test logic here
});
```

### E2E Tests

Test authentication flows with Playwright:

```typescript
import { test, expect } from "@playwright/test";

test("user can sign in with Google", async ({ page }) => {
  await page.goto("/");
  await page.click('button:has-text("Sign in")');
  // Mock OAuth flow or use test credentials
});
```

## Advanced Topics

### Role-Based Access Control

Implement user roles:

```typescript
// Extend User model
model User {
  id     String @id @default(cuid())
  email  String @unique
  role   Role   @default(USER)
  // ... other fields
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

// Create role-based procedures
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});
```

### Custom Sign-in Pages

Create custom authentication UI:

```typescript
// pages/auth/signin.tsx
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
  return (
    <div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}
```

### Integration with External APIs

Use session tokens for external API calls:

```typescript
export const externalApiProcedure = protectedProcedure.mutation(
  async ({ ctx }) => {
    const account = await ctx.db.account.findFirst({
      where: { userId: ctx.session.user.id },
    });

    // Use access_token for external API calls
    const response = await fetch("https://api.external.com/data", {
      headers: {
        Authorization: `Bearer ${account?.access_token}`,
      },
    });

    return response.json();
  },
);
```
