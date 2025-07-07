# Admin Dashboard Guide

This guide covers the comprehensive admin dashboard system with user management, post moderation, and analytics features.

## Overview

The admin dashboard provides a complete administrative interface with the following features:

- **Role-Based Access Control**: Admin-only access with middleware protection
- **User Management**: View, edit roles, and manage user accounts with robust image handling
- **Post Management**: Moderate and manage all posts in the system
- **Analytics Dashboard**: Real-time statistics and data visualization
- **Responsive Design**: Modern UI with excellent accessibility and user experience

## Features

### User Management

- **User Table**: Paginated, sortable, and searchable user interface
- **Profile Images**: Robust handling of OAuth provider avatars (Google, GitHub, Facebook)
- **Role Management**: Promote/demote users between USER and ADMIN roles
- **User Actions**: Delete users with confirmation dialogs
- **Advanced Search**: Real-time search with debouncing and focus management

### Post Management

- **Post Table**: View all posts with author information and timestamps
- **Search & Filter**: Find posts by title or author
- **Moderation Tools**: Comprehensive post management interface

### Dashboard Analytics

- **Real-time Stats**: Live user and post counts
- **Visual Charts**: Data visualization with responsive charts
- **System Overview**: Key metrics and performance indicators

### Security & Access Control

- **Middleware Protection**: Server-side route protection for `/admin` paths
- **Role Verification**: Database-backed role checking
- **Session Management**: Secure admin session handling

## Database Schema

The admin system extends the base User model with role-based permissions:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(USER)

  // Relations
  accounts      Account[]
  sessions      Session[]
  posts         Post[]

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
}
```

## API Routes

Admin-specific tRPC procedures are protected and located in `src/server/api/routers/admin.ts`:

```typescript
// User Management
getUsers(); // Paginated user list with search
updateUserRole(); // Change user roles
deleteUser(); // Remove user accounts

// Post Management
getPosts(); // Paginated post list with search

// Analytics
getStats(); // Dashboard statistics
```

## Configuration

### Image Optimization

External OAuth provider images are configured in `next.config.js`:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google avatars
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub avatars
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook avatars
      },
    ],
  },
};
```

### Route Protection

Admin routes are protected via middleware in `middleware.ts`:

```typescript
export default function middleware(request: NextRequest) {
  // Protect /admin routes - requires ADMIN role
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Role verification logic
  }
}
```

## Setup Instructions

### 1. Database Migration

Run the Prisma migration to add role support:

```bash
npx prisma db push
```

### 2. Create Admin User

Promote your first admin user in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 3. Access Dashboard

Once you have admin privileges:

1. Sign in to the application
2. Navigate to `/admin` (link appears in navbar for admin users)
3. Access user management, post moderation, and analytics

## Component Architecture

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx           # Admin layout with navigation
│       ├── page.tsx             # Dashboard overview
│       ├── users/
│       │   └── page.tsx         # User management page
│       └── posts/
│           └── page.tsx         # Post management page
├── _components/
│   └── admin/
│       ├── admin-stats.tsx      # Dashboard statistics
│       ├── data-table.tsx       # Reusable data table
│       ├── posts-table.tsx      # Post management table
│       └── users-table.tsx      # User management table
└── server/
    └── api/
        └── routers/
            └── admin.ts         # Admin API procedures
```

## Technical Implementation

### Search Functionality

The search system uses debounced input with separated concerns:

- **Search Input**: Independent component that never shows loading states
- **Table Data**: Only the table content shows loading/searching states
- **Focus Management**: Maintains cursor position during search operations

### Image Handling

User avatars include robust error handling:

- **Fallback System**: Displays initials when images fail to load
- **Unoptimized Mode**: Bypasses Next.js optimization for OAuth images
- **Loading States**: Shows skeleton placeholders during image load

### Accessibility

The admin interface includes comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators
- **Loading States**: Clear feedback for all async operations

## Usage Examples

### Accessing Admin Dashboard

Admin users will see an "Admin" link in the navigation bar that leads to `/admin`.

### Managing Users

1. Navigate to `/admin/users`
2. Use search to find specific users
3. Use dropdown actions to change roles or delete users
4. Pagination controls for large user lists

### Managing Posts

1. Navigate to `/admin/posts`
2. Search posts by title or author
3. View post details and author information
4. Use moderation controls as needed

### Viewing Analytics

The main dashboard at `/admin` shows:

- Total user count
- Total post count
- Recent activity metrics
- Visual charts and graphs

## Security Considerations

- **Role Verification**: All admin routes verify ADMIN role server-side
- **Input Validation**: All forms include proper validation
- **Image Security**: External images are whitelisted and validated
- **Session Protection**: Admin sessions are properly secured

The admin dashboard provides a complete, production-ready administrative interface with excellent user experience and robust security.
