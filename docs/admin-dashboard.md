# Admin Dashboard Guide

Admin area for user management, post moderation, and extensible table management.

## Quick Start

1. **Create an admin user**:

   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Access dashboard**: Navigate to `/admin` (link appears in navbar for admin users)

## Features

- **User Management**: View, search, and manage user roles at `/admin/users`
- **Post Management**: View and moderate posts at `/admin/posts`

## User Roles

Admin access is role-based - only users with ADMIN role can access these routes.

```prisma
enum Role {
  USER
  ADMIN
}
```

Admin users can:

- View all users and posts
- Change user roles (USER ↔ ADMIN)
- Delete users (and their posts)

## API Routes

Protected tRPC procedures in `src/server/api/routers/admin.ts`:

- `getUsers()` - Paginated user list with search
- `getPosts()` - Paginated post list with search
- `updateUserRole()` - Change user roles
- `deleteUser()` - Remove users

## Extending the Admin Area

To add new admin features:

1. **Add new procedures** to `src/server/api/routers/admin.ts`
2. **Create table components** following the pattern in `src/_components/admin/`
3. **Add routes** to `src/app/admin/[feature]/page.tsx`
4. **Use the `useAdminTable` hook** for consistent pagination/sorting

Example: Adding a new admin table for managing categories:

```typescript
// In admin.ts router
getCategories: adminProcedure
  .input(/* pagination schema */)
  .query(/* fetch categories */),

// New component
<DataTable<Category, CategorySortField>
  data={categories}
  // ...standard table props
/>
```

## Development

The admin dashboard is accessible at `/admin` and requires proper authentication with admin privileges.
