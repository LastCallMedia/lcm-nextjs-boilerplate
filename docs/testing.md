# Testing Guide

Testing setup for unit tests with Jest and E2E tests with Playwright.

## Quick Start

```bash
# Install dependencies
pnpm install
pnpm install:playwright

# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

## Unit Testing

### Component Tests

```typescript
// tests/unit/PostCard.test.tsx
import { render, screen } from "@testing-library/react";
import { PostCard } from "~/components/posts/PostCard";

const mockPost = {
  id: 1,
  name: "Test Post",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  createdById: "user-1",
};

describe("PostCard", () => {
  it("renders post information", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });
});
```

### Form Tests

```typescript
// tests/unit/PostForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostForm } from "~/components/posts/PostForm";

// Mock tRPC
jest.mock("~/trpc/react", () => ({
  api: {
    post: {
      create: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isPending: false,
        })),
      },
    },
  },
}));

describe("PostForm", () => {
  it("submits form data", async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await user.type(screen.getByLabelText(/post name/i), "New Post");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Assert submission
  });
});
```

## E2E Testing

### Navigation Tests

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test("homepage navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/LCM Next.js Boilerplate/);
  
  await page.getByRole("link", { name: /posts/i }).click();
  await expect(page).toHaveURL(/.*posts/);
});
```

### Authentication Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("sign in flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/.*auth/);
});
```

## Accessibility Testing

### Component Accessibility

```typescript
// Component test with accessibility check
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("component is accessible", async () => {
  const { container } = render(<PostCard post={mockPost} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2E Accessibility

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage accessibility", async ({ page }) => {
  await page.goto("/");
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
    
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Test Scripts

```bash
# Unit tests
pnpm test                    # Run all Jest tests
pnpm test:watch              # Run in watch mode
pnpm test:coverage           # Run with coverage report

# E2E tests
pnpm test:e2e                # Run Playwright tests
pnpm test:e2e:ui             # Run with visual UI
pnpm test:e2e:headed         # Run with visible browser

# Setup
pnpm install:playwright      # Install browsers
```

## Configuration

### Jest Config

- **Environment**: jsdom for React components
- **Setup**: `jest.setup.js` configures testing utilities
- **Mocks**: Next.js router, NextAuth, and tRPC are pre-mocked

### Playwright Config

- **Browsers**: Chromium, Firefox, WebKit
- **Auto-start**: Builds and starts the app before tests
- **Retries**: 2 retries on CI, 0 locally

## Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (`getByRole`, `getByLabelText`)
3. **Keep tests simple and focused**
4. **Include accessibility checks** for important components
5. **Mock external dependencies** (APIs, databases)

## Common Patterns

### Mocking tRPC

```typescript
jest.mock("~/trpc/react", () => ({
  api: {
    post: {
      getLatest: {
        useSuspenseQuery: jest.fn(() => [mockPost]),
      },
    },
  },
}));
```

### Testing Hooks

```typescript
import { renderHook } from "@testing-library/react";
import { useMobile } from "~/hooks/use-mobile";

test("useMobile hook", () => {
  const { result } = renderHook(() => useMobile());
  expect(typeof result.current).toBe("boolean");
});
```

This testing setup provides comprehensive coverage with minimal configuration. Focus on testing user interactions and critical paths rather than implementation details.
