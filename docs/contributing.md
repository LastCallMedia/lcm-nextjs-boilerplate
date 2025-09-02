# Contributing Guide

Thank you for your interest in contributing to the LCM Next.js Quickstart! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members
- Be constructive in discussions and feedback

## Getting Started

### Prerequisites

- Node.js 22.0.0 or higher
- pnpm 8.0.0 or higher
- Docker (for development services)
- Git

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/lcm-nextjs-boilerplate.git
   cd lcm-nextjs-boilerplate
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/LastCallMedia/lcm-nextjs-boilerplate.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Set up environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start development services**:

   ```bash
   pnpm docker:dev
   ```

7. **Initialize database**:

   ```bash
   pnpm db:generate
   ```

8. **Start development server**:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Update main branch
git checkout main
git merge upstream/main
git push origin main

# Rebase feature branch
git checkout feature/your-feature-name
git rebase main
```

## Pull Request Process

### Before Submitting

1. **Ensure your code follows our style guidelines**
2. **Write or update tests** for your changes
3. **Update documentation** if needed
4. **Test your changes** thoroughly
5. **Rebase your commits** into logical units

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Tests have been added that prove the fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published
- [ ] Documentation has been updated

### Pull Request Template

When creating a pull request, use this template:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots to help explain your changes

## Additional Notes

Any additional information about the changes
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing** in staging environment (if applicable)
4. **Approval** from project maintainer
5. **Merge** to main branch

## Code Style Guidelines

### TypeScript

```typescript
// Use explicit types for function parameters and return values
function createUser(userData: CreateUserInput): Promise<User> {
  // Implementation
}

// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string | null;
}

// Use type unions for specific values
type UserRole = "admin" | "user" | "moderator";

// Prefer const assertions for immutable data
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;
```

### React Components

```typescript
// Use function components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Use React.forwardRef for components that need ref forwarding
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn('input', className)} {...props} />;
  }
);
Input.displayName = 'Input';
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (`useLocalStorage.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Import Organization

```typescript
// 1. Node modules
import React from "react";
import { NextRequest } from "next/server";

// 2. Internal modules (absolute imports)
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

// 3. Relative imports
import { UserCard } from "./user-card";
import type { User } from "./types";
```

### CSS/Styling

```typescript
// Use Tailwind CSS classes
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// Use cn() utility for conditional classes
<button
  className={cn(
    'px-4 py-2 rounded-md font-medium',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>

// Group related classes
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'p-4 gap-2',
  // Appearance
  'bg-white border rounded-lg shadow-sm'
)}>
```

## Testing Requirements

### Unit Tests

```typescript
// Test components
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Test utilities
describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('January 1, 2024');
  });
});
```

### Integration Tests

```typescript
// Test API routes
describe("POST /api/posts", () => {
  it("creates post for authenticated user", async () => {
    const mockSession = { user: { id: "user-1" } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const response = await POST(
      new Request("http://localhost/api/posts", {
        method: "POST",
        body: JSON.stringify({ title: "Test Post" }),
      }),
    );

    expect(response.status).toBe(201);
  });
});
```

### E2E Tests

```typescript
// Test user workflows
test("user can create and view post", async ({ page }) => {
  // Navigate to create post page
  await page.goto("/posts/new");

  // Fill out form
  await page.fill('input[name="title"]', "My New Post");
  await page.fill('textarea[name="content"]', "Post content");

  // Submit form
  await page.click('button[type="submit"]');

  // Verify post was created
  await expect(page.getByText("Post created successfully")).toBeVisible();
  await expect(page.getByText("My New Post")).toBeVisible();
});
```

### Test Coverage

Maintain minimum test coverage:

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Documentation

### Code Documentation

````typescript
/**
 * Creates a new user account with the provided information.
 *
 * @param userData - The user data for account creation
 * @param userData.email - User's email address
 * @param userData.name - User's display name
 * @returns Promise resolving to the created user
 *
 * @throws {ValidationError} When email is invalid
 * @throws {ConflictError} When email already exists
 *
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 * ```
 */
export async function createUser(userData: CreateUserInput): Promise<User> {
  // Implementation
}
````

### README Updates

When adding new features:

1. Update the features list
2. Add setup instructions if needed
3. Update usage examples
4. Add relevant badges or links

### API Documentation

Document tRPC procedures:

```typescript
export const postRouter = createTRPCRouter({
  /**
   * Create a new post
   *
   * @requires authentication
   * @input title - Post title (1-100 characters)
   * @input content - Post content (1-5000 characters)
   * @returns Created post with metadata
   */
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Node.js version: [e.g. 18.17.0]
- Package manager: [e.g. pnpm 8.6.0]

**Additional context**
Add any other context about the problem here.
```

### Security Issues

**Do not** create public issues for security vulnerabilities. Instead:

1. Email security@lastcallmedia.com
2. Include a detailed description
3. Provide steps to reproduce
4. Allow time for investigation before disclosure

## Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation ideas**
If you have ideas about how this could be implemented, please share them.
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Changelog

All notable changes are documented in `CHANGELOG.md`:

```markdown
## [1.2.0] - 2024-01-15

### Added

- New user profile management feature
- Email notification system
- Dark mode toggle component

### Changed

- Improved authentication flow
- Updated dependencies to latest versions

### Fixed

- Fixed mobile navigation issue
- Resolved database connection timeout

### Deprecated

- Old user settings API (use /api/user/settings instead)

### Removed

- Legacy authentication method

### Security

- Fixed potential XSS vulnerability in user input
```

## Community

### Getting Help

- **Documentation**: Check our [docs](./docs/) first
- **GitHub Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our development Discord server

### Recognition

Contributors are recognized in:

- `CONTRIBUTORS.md` file
- Release notes for significant contributions
- Annual contributor highlights

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright",
    "ms-vscode.vscode-eslint",
    "github.copilot",
    "ms-vscode.vscode-jest"
  ]
}
```

### Git Hooks

We use Husky for git hooks:

```bash
# Install git hooks
pnpm prepare

# Pre-commit hook runs:
# - ESLint
# - Prettier
# - Type checking
# - Tests

# Pre-push hook runs:
# - Full test suite
# - Build check
```

### Debugging

```bash
# Debug Next.js
NODE_OPTIONS='--inspect' pnpm dev

# Debug tests
pnpm test --debug

# Debug database queries
DEBUG=prisma:query pnpm dev
```

## Thank You

Thank you for contributing to the LCM Next.js Quickstart! Your efforts help make this project better for everyone. 🎉

---

For questions about contributing, please reach out to the maintainers or create a discussion on GitHub.
