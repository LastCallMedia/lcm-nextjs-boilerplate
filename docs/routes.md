# Routes Documentation

Simple overview of the routes included in this Next.js boilerplate.

## Route Structure

### Authentication Routes

- `/login` - User sign-in with magic link email and Google OAuth

### Protected Routes (Requires Authentication)

- `/dashboard` - Main dashboard overview (default after login)
- `/profile` - User profile management
- `/settings` - Account settings and preferences

### Public Routes

- `/` - Homepage
- `/about` - Information about the boilerplate
- `/contact` - Contact form (demo)
- `/posts` - Public posts listing
- `/post` - Individual post view

## How Authentication Works

1. Visit protected route → redirected to `/login`
2. Sign in → redirected to `/dashboard`
3. Access any protected route while signed in
4. Sign out → redirected to homepage (instant logout)

## Adding New Routes

### Public Route

Create a new page in `src/app/(public)/your-route/page.tsx`

### Protected Route

Create a new page in `src/app/(protected)/your-route/page.tsx`

For protected routes, authentication is handled automatically by the route group layout.

That's it! The boilerplate handles the rest automatically.
