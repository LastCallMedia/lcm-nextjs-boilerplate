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
- **Legal Pages**: Manage Terms and Privacy Policy content at `/admin/settings`
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
- Manage legal pages (Terms and Privacy Policy)

## Legal Pages Management

The admin dashboard includes a comprehensive legal pages system accessible in `/admin/settings`:

### Features

- **Type Selector**: Switch between Terms and Privacy Policy
- **Markdown Editor**: Rich content editing with preview
- **Version Control**: Active/inactive status for content versioning
- **Toast Notifications**: Success/error feedback on save

### Usage

1. Navigate to `/admin/settings`
2. Select page type (Terms/Privacy) in dropdown
3. Click "Edit Page" or "Create Page"
4. Enter title and markdown content
5. Save with automatic confirmation

### Database Structure

- `LegalPage` model with type differentiation (TERMS, PRIVACY)
- User relation for tracking creators
- Public routes: `/terms` and `/privacy`

### API Endpoints

- `legalPages.getActive()` - Get active page by type
- `legalPages.upsert()` - Create/update legal pages (ADMIN only)
- `legalPages.delete()` - Remove legal pages (ADMIN only)

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
