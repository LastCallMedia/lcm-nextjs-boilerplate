# Component Organization

This project uses a structured component architecture for better maintainability and developer experience.

## Folder Structure

```
src/_components/
├── auth/
│   ├── SignIn.tsx          # Authentication component
│   └── index.ts            # Exports for auth components
├── layout/
│   ├── Footer.tsx          # Site footer
│   ├── Navbar.tsx          # Site navigation
│   └── index.ts            # Exports for layout components
├── posts/
│   ├── LastestPost.tsx     # Display latest post
│   ├── PostCard.tsx        # Individual post card
│   ├── PostForm.tsx        # Form for creating posts
│   ├── PostSkeleton.tsx    # Loading skeleton for posts
│   └── index.ts            # Exports for post components
├── theme/
│   ├── ThemeModeToggle.tsx # Dark/light mode toggle
│   └── index.ts            # Exports for theme components
├── ui/
│   ├── button.tsx          # Button component
│   ├── card.tsx            # Card component
│   ├── dropdown-menu.tsx   # Dropdown menu
│   ├── input.tsx           # Input component
│   ├── navigation-menu.tsx # Navigation menu
│   ├── skeleton.tsx        # Loading skeleton
│   ├── theme-provider.tsx  # Theme provider
│   └── index.ts            # Exports for UI components
└── index.ts                # Main exports for all components
```

## Usage

### Import Patterns

**Before (old structure):**

```tsx
import Footer from "~/_components/Footer";
import Navbar from "~/_components/Navbar";
import SignIn from "~/_components/SignIn";
import PostCard from "~/_components/PostCard";
import { Button } from "~/_components/ui/button";
```

**After (new structure):**

```tsx
import { Footer, Navbar } from "~/_components/layout";
import { SignIn } from "~/_components/auth";
import { PostCard } from "~/_components/posts";
import { Button } from "~/_components/ui";

// Or import everything from the main index
import { Footer, Navbar, SignIn, PostCard, Button } from "~/_components";
```

### Component Categories

1. **Layout Components** (`layout/`)
   - Components that define the overall page structure
   - Navbar, Footer, Header, Sidebar, etc.

2. **Authentication Components** (`auth/`)
   - Components related to user authentication
   - SignIn, SignUp, UserProfile, etc.

3. **Post Components** (`posts/`)
   - Components specific to post functionality
   - PostCard, PostForm, PostList, etc.

4. **Theme Components** (`theme/`)
   - Components for theme management
   - ThemeModeToggle, ThemeProvider, etc.

5. **UI Components** (`ui/`)
   - Reusable, generic UI components
   - Button, Card, Input, Modal, etc.

## Benefits

1. **Better Organization**: Components are grouped by functionality
2. **Easier Navigation**: Developers can quickly find related components
3. **Cleaner Imports**: Use category-based imports for better readability
4. **Scalability**: Easy to add new components in appropriate categories
5. **Maintainability**: Related components are co-located

## Adding New Components

When adding a new component:

1. Determine which category it belongs to
2. Place it in the appropriate folder
3. Add the export to the folder's `index.ts`
4. The main `index.ts` will automatically re-export it

Example:

```tsx
// Add new component: src/_components/auth/SignUp.tsx
export { default as SignUp } from "./SignUp";

// Add to: src/_components/auth/index.ts
export { default as SignIn } from "./SignIn";
export { default as SignUp } from "./SignUp";
```
