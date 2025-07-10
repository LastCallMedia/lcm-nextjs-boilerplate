# Routes Documentation

Simple overview of the routes included in this Next.js boilerplate.

## Route Structure

### Authentication Routes

- `/login` - User sign-in with OAuth providers
- `/register` - User registration page
- `/logout` - Sign-out confirmation

### Protected Routes (Requires Authentication)

- `/profile` - User profile management
- `/settings` - Account settings and preferences

### Public Routes

- `/` - Homepage
- `/about` - Information about the boilerplate
- `/contact` - Contact form (demo)
- `/posts` - Public posts listing
- `/post` - Individual post view

### API Routes

#### Public API

- `GET /api/public/status` - Health check
- `GET /api/public/info` - App metadata

#### Protected API

- `GET /api/protected/user` - Current user data
- `GET /api/protected/posts` - User's posts
- `POST /api/protected/posts` - Create new post

## How Authentication Works

1. Visit protected route → redirected to `/login`
2. Sign in → redirected to `/profile`
3. Access any protected route while signed in
4. Sign out → redirected to homepage

## Adding New Routes

### Public Route

Create a new page in `src/app/(public)/your-route/page.tsx`

### Protected Route

Create a new page in `src/app/(protected)/your-route/page.tsx`

### API Route

Create `route.ts` in `src/app/api/your-endpoint/route.ts`

For protected API routes, add authentication check:

```typescript
const session = await auth();
if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
```

That's it! The boilerplate handles the rest automatically.
