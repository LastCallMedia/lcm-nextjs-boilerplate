# Routes Documentation

This document explains the boilerplate routes implemented in the LCM Next.js Boilerplate and how to use and extend them.

## Overview

The boilerplate includes comprehensive examples of different route types commonly needed in web applications:

- **Public Routes**: Accessible without authentication
- **Authentication Routes**: For login, register, logout flows
- **Protected Routes**: Require user authentication
- **API Routes**: Both public and protected endpoints

## Route Structure

### Authentication Routes (`(auth)` route group)

Located in `src/app/(auth)/`

#### `/login`

- **Purpose**: User sign-in page
- **Features**:
  - NextAuth.js integration
  - Automatic redirect if already logged in
  - Links to Terms and Privacy
  - Guest access option
- **Access**: Public (redirects authenticated users)

#### `/register`

- **Purpose**: User registration page
- **Features**:
  - Same OAuth providers as login
  - Link to existing login page
  - Terms and Privacy agreement
- **Access**: Public (redirects authenticated users)

#### `/logout`

- **Purpose**: User sign-out confirmation
- **Features**:
  - Shows current user info
  - Confirmation before logout
  - Cancel option
- **Access**: Protected (redirects unauthenticated users)

### Protected Routes (`(protected)` route group)

Located in `src/app/(protected)/`

These routes require authentication and include a shared layout with:

- User authentication checks
- Automatic redirect to login if not authenticated
- Access to user session data

#### `/profile`

- **Purpose**: User profile management
- **Features**:
  - User avatar and basic info
  - Profile settings form (demo)
  - Account details display
  - Profile picture management info
- **Note**: Form is disabled for demo purposes

#### `/settings`

- **Purpose**: Application settings and preferences
- **Features**:
  - Account security settings
  - Application preferences
  - Privacy controls
  - Danger zone (account deletion)
- **Note**: All controls disabled for demo

### Public Routes (`(public)` route group)

Located in `src/app/(public)/`

#### `/about`

- **Purpose**: Information about the boilerplate
- **Features**:
  - Project overview and tech stack
  - Key features list
  - Route examples with badges
  - Getting started information
- **Content**: Educational about the boilerplate itself

#### `/contact`

- **Purpose**: Contact form and information
- **Features**:
  - Contact form (demo)
  - Contact information
  - FAQ section
  - Support resources
- **Note**: Form disabled, for demonstration only

#### `/terms`

- **Purpose**: Terms of Service
- **Features**:
  - Comprehensive legal terms example
  - Proper formatting and structure
  - Demo disclaimer
- **Content**: Example legal document structure

#### `/privacy`

- **Purpose**: Privacy Policy
- **Features**:
  - Privacy policy example
  - Data handling practices
  - User rights information
  - Third-party service mentions
- **Content**: Example privacy policy structure

### Posts Routes

Located in `src/app/` (not in route groups, making them public)

#### `/posts`

- **Purpose**: Display all posts publicly
- **Features**:
  - Shows all posts from database
  - Includes post creation form
  - No authentication required
  - Public access to content
- **API Calls**: Uses `getAllPosts()` from utils/api.ts
- **Access**: Public (no authentication required)

#### `/post`

- **Purpose**: Individual post display
- **Features**:
  - Basic post display interface
  - No authentication required
  - Public access
- **Access**: Public (no authentication required)

## API Routes

### Public API (`/api/public/`)

#### `GET /api/public/status`

- **Purpose**: API health check and monitoring
- **Response**: Server status, version, timestamp, and basic metadata
- **Authentication**: None required
- **Use case**: Health checks, monitoring, API availability verification

#### `GET /api/public/info`

- **Purpose**: Application metadata and configuration
- **Response**: App details, features list, available routes, tech stack info
- **Authentication**: None required
- **Use case**: API documentation, feature discovery, client configuration

### Protected API (`/api/protected/`)

#### `GET /api/protected/user`

- **Purpose**: Current user information
- **Response**: User data, session info
- **Authentication**: Required (401 if unauthorized)

#### `GET /api/protected/posts`

- **Purpose**: Get user's posts (protected endpoint)
- **Response**: Array of user's posts
- **Authentication**: Required (401 if unauthorized)
- **Note**: This is different from the public `/posts` route which shows all posts

#### `POST /api/protected/posts`

- **Purpose**: Create new post (protected endpoint)
- **Body**: `{ name: string }`
- **Response**: Created post data
- **Authentication**: Required

## Important Notes

### Posts Routes Architecture

The boilerplate demonstrates different approaches to content access:

- **Public UI Routes** (`/posts`, `/post`): Allow public viewing of all posts without authentication
- **Protected API Routes** (`/api/protected/posts`): Require authentication for creating and managing user-specific posts
- **Mixed Approach**: This shows how you can have public content consumption with protected content creation

This pattern is common in modern applications where content is publicly viewable but requires authentication to create or manage.

## How to Use These Routes

### For Development

1. **Start with Public Routes**: Use `/about` and `/contact` as templates for static pages
2. **Customize Auth Flow**: Modify the auth routes based on your authentication needs
3. **Extend Protected Areas**: Add new protected routes following the profile/settings pattern
4. **API Integration**: Use the API route patterns for your own endpoints

### Authentication Flow

1. User visits protected route → redirected to `/login`
2. User signs in → redirected to `/profile`
3. User can access all protected routes
4. User signs out → redirected to homepage

### Route Protection

Protection is handled through:

- **Server-side**: `await auth()` checks in page components
- **Middleware**: Route-level protection in `middleware.ts`
- **Layouts**: Shared authentication state in route group layouts

## Extending the Routes

### Adding New Public Routes

1. Create page in `src/app/(public)/new-route/page.tsx`
2. Add metadata and proper content
3. Update navigation if needed

### Adding New Protected Routes

1. Create page in `src/app/(protected)/new-route/page.tsx`
2. Include authentication check: `const session = await auth()`
3. Redirect if not authenticated: `if (!session) redirect("/login")`
4. Add to protected layout navigation

### Adding New API Routes

1. Create `route.ts` file in appropriate API directory
2. For protected routes: Add `await auth()` check
3. Return proper HTTP status codes
4. Include error handling

### Customizing Layouts

Each route group has its own layout:

- `(auth)/layout.tsx` - Minimal layout for auth pages
- `(protected)/layout.tsx` - Full featured layout with navigation
- `(public)/layout.tsx` - Basic public layout

## Best Practices

1. **Consistent Error Handling**: All routes include proper error boundaries
2. **Type Safety**: All routes use TypeScript properly
3. **Accessibility**: Routes include proper ARIA labels and semantic HTML
4. **SEO**: All pages include proper metadata
5. **Security**: Protected routes have multiple layers of protection
6. **User Experience**: Smooth redirects and loading states

## Integration with Existing Features

These routes integrate seamlessly with:

- **NextAuth.js**: Authentication state management
- **Prisma**: Database operations in API routes
- **tRPC**: Type-safe API calls from components
- **shadcn/ui**: Consistent UI components
- **Tailwind CSS**: Responsive design
- **TypeScript**: Full type safety

This route structure provides a complete foundation for building modern web applications with proper authentication, clear navigation patterns, and extensible architecture.
