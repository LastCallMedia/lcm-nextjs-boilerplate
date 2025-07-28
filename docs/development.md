# Development Guide

# Profile Image Upload

Profile avatars are uploaded to AWS S3 in production, and to local storage (`public/uploads`) in development.
Profile changes (name, email, avatar) are saved to the database via tRPC and Prisma. The client updates the session after profile changes so the new info is reflected immediately. The profile page fetches the latest user data from the database on reload.

**AWS S3 Environment Variables (production):**

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`

Add these to your `.env` file for production deployments.

This guide covers the development workflow, tools, and best practices for working with the LCM Next.js Boilerplate.

## Development Environment

### Prerequisites Setup

Ensure you have the required tools installed:

```bash
# Check versions
node --version  # Should be 22+
pnpm --version  # Should be 8+
docker --version

# Install missing tools
# Node.js: https://nodejs.org/
# pnpm: npm install -g pnpm
# Docker: https://docker.com/get-started
```

### IDE Setup

#### VS Code (Recommended)

Essential extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright",
    "ms-vscode.vscode-eslint"
  ]
}
```

Workspace settings (`.vscode/settings.json`):

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

#### JetBrains WebStorm

Configure for optimal TypeScript and React development:

1. Enable TypeScript service
2. Configure Prettier as default formatter
3. Set up ESLint integration
4. Install Tailwind CSS plugin

## Development Workflow

### Daily Development

```bash
# 1. Start development services
pnpm docker:dev

# 2. Set up database (first time only)
pnpm db:generate

# 3. Start development server
pnpm dev

# 4. Open browser to http://localhost:3000
```

### Docker Development Services

The project uses Docker for local development services:

| Service        | URL                   | Purpose                       |
| -------------- | --------------------- | ----------------------------- |
| Next.js App    | http://localhost:3000 | Main application              |
| PostgreSQL     | localhost:5732        | Database                      |
| MailHog Web UI | http://localhost:8025 | Email testing interface       |
| MailHog SMTP   | localhost:1025        | SMTP server for email testing |

#### Docker Commands

```bash
# Start all development services
pnpm docker:dev

# Stop all services
pnpm docker:dev:down

# Check service status
docker compose ps

# View service logs
docker compose logs postgres
docker compose logs mailhog

# Access PostgreSQL directly
docker compose exec postgres psql -U postgres -d lcm-nextjs-boilerplate

# Restart specific service
docker compose restart postgres
```

#### Environment Configuration

Ensure your `.env` file has the correct settings:

```bash
# Database (matches docker-compose.yml port)
DATABASE_URL=postgresql://postgres:password@localhost:5732/lcm-nextjs-boilerplate

# Docker service configuration (optional - has defaults)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=lcm-nextjs-boilerplate
POSTGRES_PORT=5732
MAILHOG_SMTP_PORT=1025
MAILHOG_WEB_PORT=8025
```

#### Troubleshooting Docker

**Port conflicts:**

```bash
# Find what's using port 5732
lsof -i :5732

# Kill process using the port
sudo kill -9 <PID>
```

**Database connection issues:**

```bash
# Restart Docker services
pnpm docker:dev:down && pnpm docker:dev

# Check if services are healthy
docker compose ps

# Reset database volume (WARNING: deletes all data)
docker compose down -v
docker volume rm lcm-nextjs-boilerplate_postgres_data
pnpm docker:dev
```

### Code Organization

#### Feature-Based Structure

Organize code by features rather than file types:

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Route groups
│   ├── dashboard/      # Dashboard feature
│   └── posts/          # Posts feature
├── _components/        # Shared components
│   ├── ui/            # Design system components
│   ├── auth/          # Authentication components
│   ├── posts/         # Post-related components
│   └── layout/        # Layout components
├── hooks/             # Shared hooks
├── lib/               # Utilities and configurations
└── server/            # Server-side code
```

#### File Naming Conventions

```
PascalCase:     Components (UserProfile.tsx)
camelCase:      Functions, variables (getUserData)
kebab-case:     Files, folders (user-profile.tsx)
UPPER_CASE:     Constants (API_ENDPOINTS)
```

### Git Workflow

#### Branch Naming

```bash
# Feature branches
feature/user-authentication
feature/post-creation-form

# Bug fixes
fix/login-redirect-issue
fix/mobile-navigation

# Hotfixes
hotfix/security-patch
```

#### Commit Messages

Follow conventional commits:

```bash
# Format: type(scope): description
git commit -m "feat(auth): add Google OAuth integration"
git commit -m "fix(posts): resolve pagination issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): simplify user data fetching"
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

## Code Style and Quality

### TypeScript Best Practices

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string | null;
}

// Use types for unions and computed types
type UserRole = "admin" | "user" | "moderator";
type UserWithRole = User & { role: UserRole };

// Avoid 'any', use unknown instead
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  return JSON.stringify(data);
}

// Use generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, "id">): Promise<T>;
}
```

#### Component Props

```typescript
// Use proper prop types
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// Use defaultProps or default parameters
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
}: ButtonProps) {
  // Component logic
}

// For forwarded refs
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
  }
);
```

### Component Patterns

#### Compound Components

```typescript
// Create related components that work together
const Card = {
  Root: ({ children, className }: CardProps) => (
    <div className={cn("card", className)}>{children}</div>
  ),
  Header: ({ children }: { children: React.ReactNode }) => (
    <div className="card-header">{children}</div>
  ),
  Content: ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  ),
};

// Usage
<Card.Root>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

#### Custom Hooks

```typescript
// Extract reusable logic into hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}
```

#### Error Boundaries

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Development

#### tRPC Procedures

```typescript
// Input validation with Zod
const createPostInput = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  published: z.boolean().default(false),
});

// Protected procedure with proper error handling
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.post.create({
          data: {
            ...input,
            authorId: ctx.session.user.id,
          },
        });

        return post;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Post with this title already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
});
```

#### Database Queries

```typescript
// Efficient database operations
export async function getUserPosts(userId: string) {
  return await db.post.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      published: true,
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

// Transaction for data consistency
export async function transferPostOwnership(
  postId: string,
  newOwnerId: string,
  currentOwnerId: string,
) {
  return await db.$transaction(async (tx) => {
    // Verify current ownership
    const post = await tx.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post || post.authorId !== currentOwnerId) {
      throw new Error("Post not found or unauthorized");
    }

    // Transfer ownership
    const updatedPost = await tx.post.update({
      where: { id: postId },
      data: { authorId: newOwnerId },
    });

    // Log the transfer
    await tx.auditLog.create({
      data: {
        action: "POST_TRANSFER",
        entityId: postId,
        userId: currentOwnerId,
        metadata: { newOwnerId },
      },
    });

    return updatedPost;
  });
}
```

## Performance Optimization

### React Performance

#### Memoization

```typescript
// Memoize expensive calculations
const ExpensiveComponent = ({ data, filters }: Props) => {
  const processedData = useMemo(() => {
    return data.filter(item =>
      filters.every(filter => filter.test(item))
    );
  }, [data, filters]);

  return <DataTable data={processedData} />;
};

// Memoize components
const UserCard = React.memo(({ user }: { user: User }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// Memoize callback functions
const UserList = ({ users, onUserClick }: Props) => {
  const handleUserClick = useCallback((userId: string) => {
    onUserClick(userId);
  }, [onUserClick]);

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => handleUserClick(user.id)}
        />
      ))}
    </div>
  );
};
```

#### Lazy Loading

```typescript
// Component lazy loading
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazySettings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<LazyDashboard />} />
        <Route path="/settings" element={<LazySettings />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic imports for utilities
async function loadUtility() {
  const { heavyUtility } = await import('./heavy-utility');
  return heavyUtility;
}
```

### Bundle Optimization

#### Tree Shaking

```typescript
// Good: Import specific functions
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";

// Avoid: Importing entire library
import * as dateFns from "date-fns";

// Good: Specific lodash imports
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

// Avoid: Entire lodash library
import _ from "lodash";
```

#### Code Splitting

```typescript
// Route-based code splitting
const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Home")),
  },
  {
    path: "/dashboard",
    component: lazy(() => import("./pages/Dashboard")),
  },
];

// Feature-based code splitting
const AdminPanel = lazy(() =>
  import("./AdminPanel").then((module) => ({
    default: module.AdminPanel,
  })),
);
```

## Testing During Development

### Test-Driven Development

```typescript
// 1. Write the test first
describe("useCounter hook", () => {
  it("should increment count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});

// 2. Implement the hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((c) => c - 1);
  }, []);

  return { count, increment, decrement };
}

// 3. Refactor if needed
```

### Development Testing

```bash
# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test UserCard.test.tsx

# Run tests with coverage
pnpm test:coverage

# Debug tests
pnpm test --debug
```

## Debugging

### Browser DevTools

#### React DevTools

```typescript
// Add display names for debugging
const UserCard = ({ user }: Props) => {
  // Component logic
};
UserCard.displayName = 'UserCard';

// Debug with React DevTools Profiler
function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <UserDashboard />
    </Profiler>
  );
}
```

#### Network Debugging

```typescript
// Debug tRPC calls
const utils = api.useContext();

// Invalidate queries for fresh data
utils.posts.getAll.invalidate();

// Prefetch data
utils.posts.getById.prefetch({ id: "123" });

// Access query cache
const cachedData = utils.posts.getAll.getData();
```

### Server-Side Debugging

```typescript
// Debug database queries
const db = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Debug middleware
export async function middleware(request: NextRequest) {
  console.log("Middleware:", request.url);
  const response = NextResponse.next();
  console.log("Response status:", response.status);
  return response;
}

// Debug API routes
export async function GET(request: Request) {
  console.log("API route called:", request.url);
  try {
    // Logic here
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
```

### Performance Debugging

```typescript
// Measure component render time
const MeasuredComponent = ({ children }: Props) => {
  useEffect(() => {
    performance.mark('component-start');
    return () => {
      performance.mark('component-end');
      performance.measure(
        'component-render',
        'component-start',
        'component-end'
      );
    };
  });

  return <div>{children}</div>;
};

// Debug re-renders
function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previous = useRef<Record<string, any>>();

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedKeys: Record<string, any> = {};

      allKeys.forEach(key => {
        if (previous.current![key] !== props[key]) {
          changedKeys[key] = {
            from: previous.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedKeys).length) {
        console.log('[why-did-you-update]', name, changedKeys);
      }
    }

    previous.current = props;
  });
}
```

## Environment Management

### Environment Variables

```typescript
// Type-safe environment variables
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
```

### Configuration Management

```typescript
// Configuration by environment
const config = {
  development: {
    apiUrl: "http://localhost:3000/api",
    logLevel: "debug",
    enableDevtools: true,
  },
  production: {
    apiUrl: "https://api.yourapp.com",
    logLevel: "error",
    enableDevtools: false,
  },
  test: {
    apiUrl: "http://localhost:3001/api",
    logLevel: "silent",
    enableDevtools: false,
  },
};

export const getConfig = () => {
  const env = process.env.NODE_ENV as keyof typeof config;
  return config[env] || config.development;
};
```

## Common Development Tasks

### Adding New Features

1. **Plan the feature**:

   ```bash
   # Create feature branch
   git checkout -b feature/user-profiles
   ```

2. **Database changes**:

   ```bash
   # Update schema
   vim prisma/schema.prisma

   # Generate migration
   pnpm db:generate
   ```

3. **API implementation**:

   ```typescript
   // Create tRPC router
   // Add validation schemas
   // Implement procedures
   ```

4. **UI implementation**:

   ```typescript
   // Create components
   // Add pages
   // Style with Tailwind
   ```

5. **Testing**:
   ```bash
   # Add unit tests
   # Add integration tests
   # Add E2E tests if needed
   ```

### Debugging Common Issues

#### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

#### Build Errors

```bash
# Check for type errors
pnpm typecheck

# Check for lint errors
pnpm lint

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Database Issues

```bash
# Reset database (development only)
pnpm db:push --force-reset

# Generate fresh client
rm -rf node_modules/.prisma
pnpm prisma generate

# Check database connection
pnpm db:studio
```

## Best Practices Summary

### Code Quality

- Use TypeScript strictly
- Write comprehensive tests
- Follow consistent naming conventions
- Document complex logic
- Use proper error handling

### Performance

- Implement proper caching
- Use React performance patterns
- Optimize bundle size
- Monitor Core Web Vitals
- Lazy load heavy components

### Security

- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Sanitize user content
- Keep dependencies updated

### Maintainability

- Keep components small and focused
- Extract reusable logic
- Use consistent patterns
- Document architectural decisions
- Refactor regularly
