# Admin Dashboard Guide

The admin dashboard is protected and only accessible to users with the `ADMIN` role. It provides management tools for users, posts, and system settings.

## Quick Start

1. **Seed admin and user**:

   Run the seed script to create a default admin and user:

   ```bash
   pnpm db:generate # Ensure migrations are applied
   pnpm db:seed     # Run the seed script
   ```

   - Admin: `admin@example.com` / `admin123`
   - User: `user@example.com` / `user123`

2. **Access dashboard**: Go to `/admin` (visible for admin users)

## Features

- **User Management**: View, search, and change user roles at `/admin/users`
- **Post Management**: Moderate posts at `/admin/posts`
- **System settings**

## Access

- Only authenticated users with the `ADMIN` role can access `/admin` and its subpages.
- Non-admin users are redirected to the home page.

## Setup

- Place admin dashboard pages in `(protected)/admin`.
- Ensure your admin users have the `ADMIN` role in the database.

## User Roles

Admin access is role-based. Only users with `ADMIN` role can access admin routes.

```prisma
enum Role {
  USER
  ADMIN
}
```

Admin users can:

Admins can:

- View all users and posts
- Change user roles (USER ↔ ADMIN)
- Delete users (and their posts)

## API Routes

Key API routes (see `src/server/api/routers/admin.ts`):

- `getUsers()` - List/search users
- `getPosts()` - List/search posts
- `updateUserRole()` - Change user roles
- `deleteUser()` - Remove users

## Extending the Admin Area

To add new admin features:

1. Add new API procedures in `src/server/api/routers/admin.ts`
2. Create table components in `src/_components/admin/`
3. Add routes in `src/app/admin/[feature]/page.tsx`
4. Use `useAdminTable` for pagination/sorting

## Development

The admin dashboard is at `/admin` and requires admin authentication.
