# Testing Guide

This guide covers the comprehensive testing strategy implemented in the LCM Next.js Boilerplate, including unit testing, integration testing, and end-to-end testing.

## Testing Stack

### Core Testing Tools

- **Jest**: JavaScript testing framework for unit and integration tests
- **Playwright**: End-to-end testing framework
- **Testing Library**: React component testing utilities
- **jest-axe**: Accessibility testing for Jest
- **axe-playwright**: Accessibility testing for Playwright

## Running Tests

### Quick Start

```bash
# Install Playwright browsers
pnpm install:playwright

# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run with visual interface
pnpm test:e2e:ui

# Run in headed mode (visible browser)
pnpm test:e2e:headed
```


## Test Structure

```
tests/
├── __mocks__/           # Jest mocks
├── __fixtures__/        # Test data fixtures
├── unit/                # Unit tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
    ├── accessibility.spec.ts    # WCAG compliance tests
    ├── navigation.spec.ts       # Basic navigation and UI
    └── auth.spec.ts            # Authentication flows
```

## Jest Configuration

### Setup Files

The Jest configuration is in `jest.config.js`:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/index.{js,ts}",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/tests/e2e/",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

module.exports = createJestConfig(config);
```

### Jest Setup

The `jest.setup.js` file configures global test utilities:

```javascript
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock environment variables
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";
```

## Unit Testing

### Component Testing

Test React components with Testing Library:

```typescript
// src/_components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("is disabled when loading", () => {
    render(<Button disabled>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Testing with Props and State

```typescript
// src/_components/posts/__tests__/post-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PostForm } from "../post-form";
import { TRPCProvider } from "~/trpc/react";

// Mock tRPC
const mockCreatePost = jest.fn();
jest.mock("~/trpc/react", () => ({
  api: {
    post: {
      create: {
        useMutation: () => ({
          mutate: mockCreatePost,
          isLoading: false,
        }),
      },
    },
  },
}));

describe("PostForm", () => {
  it("submits form with valid data", async () => {
    render(<PostForm />);

    const nameInput = screen.getByLabelText(/post name/i);
    const submitButton = screen.getByRole("button", { name: /create post/i });

    fireEvent.change(nameInput, { target: { value: "New Post" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        name: "New Post",
      });
    });
  });

  it("shows validation error for empty name", async () => {
    render(<PostForm />);

    const submitButton = screen.getByRole("button", { name: /create post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Custom Hooks

```typescript
// src/hooks/__tests__/use-mobile.test.ts
import { renderHook } from "@testing-library/react";
import { useMobile } from "../use-mobile";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("useMobile", () => {
  it("returns false for desktop", () => {
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile", () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(true);
  });
});
```

### Testing Utilities

```typescript
// src/lib/__tests__/utils.test.ts
import { cn } from "../utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("base", "additional")).toBe("base additional");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting classes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});
```

## Integration Testing

### API Route Testing

```typescript
// src/app/api/__tests__/posts.test.ts
import { createMocks } from "node-mocks-http";
import { GET, POST } from "../posts/route";
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("~/server/db", () => ({
  db: {
    post: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("/api/posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns posts for authenticated user", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });

      const { req } = createMocks({ method: "GET" });
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("posts");
    });

    it("returns 401 for unauthenticated user", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const { req } = createMocks({ method: "GET" });
      const response = await GET(req);

      expect(response.status).toBe(401);
    });
  });
});
```

### tRPC Procedure Testing

```typescript
// src/server/api/routers/__tests__/post.test.ts
import { createTRPCMsw } from "msw-trpc";
import { appRouter } from "../root";
import { createTRPCContext } from "../../trpc";

const trpcMsw = createTRPCMsw(appRouter);

describe("postRouter", () => {
  it("creates post with valid input", async () => {
    const ctx = await createTRPCContext({
      session: {
        user: { id: "user-1", email: "test@example.com" },
        expires: "2024-12-31",
      },
    });

    const caller = appRouter.createCaller(ctx);
    const result = await caller.post.create({
      name: "Test Post",
    });

    expect(result).toMatchObject({
      name: "Test Post",
      createdById: "user-1",
    });
  });

  it("throws error for unauthenticated user", async () => {
    const ctx = await createTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.post.create({ name: "Test Post" })).rejects.toThrow(
      "UNAUTHORIZED",
    );
  });
});
```

### Database Integration Testing

```typescript
// tests/integration/database.test.ts
import { PrismaClient } from "~/generated/prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Database Integration", () => {
  beforeAll(async () => {
    // Push schema to test database
    execSync("pnpm db:push", {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    });
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.post.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates user with posts", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
      },
    });

    const post = await prisma.post.create({
      data: {
        name: "Test Post",
        createdById: user.id,
      },
    });

    expect(post.createdById).toBe(user.id);

    const userWithPosts = await prisma.user.findUnique({
      where: { id: user.id },
      include: { posts: true },
    });

    expect(userWithPosts?.posts).toHaveLength(1);
  });
});
```

## End-to-End Testing

### Playwright Configuration

The Playwright configuration in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "pnpm dev:only",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Basic E2E Tests

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/LCM Next.js Boilerplate/);
  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
});

test("navigation works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /posts/i }).click();
  await expect(page).toHaveURL(/.*posts/);
  await expect(page.getByRole("heading", { name: /posts/i })).toBeVisible();
});
```

### Authentication E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("user can sign in", async ({ page }) => {
    await page.goto("/");

    // Click sign in button
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to auth provider or show sign in form
    await expect(page).toHaveURL(/.*auth.*/);
  });

  test("protected route redirects unauthenticated user", async ({ page }) => {
    await page.goto("/dashboard");

    // Should redirect to sign in
    await expect(page).toHaveURL(/.*auth.*/);
  });
});
```

### Form Interaction Tests

```typescript
// tests/e2e/post-form.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Post Form", () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated state
    await page.goto("/");
    // ... authentication setup
  });

  test("creates new post", async ({ page }) => {
    await page.goto("/posts/new");

    await page.getByLabel(/post name/i).fill("My New Post");
    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText("Post created successfully")).toBeVisible();
    await expect(page).toHaveURL(/.*posts\/\d+/);
  });

  test("shows validation error", async ({ page }) => {
    await page.goto("/posts/new");

    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText(/name is required/i)).toBeVisible();
  });
});
```

## Accessibility Testing

### Jest Accessibility Tests

```typescript
// src/_components/__tests__/accessibility.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { HomePage } from "~/app/page";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("homepage should not have accessibility violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("form should be accessible", async () => {
    const { container } = render(<PostForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Playwright Accessibility Tests

```typescript
// tests/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("homepage should not have accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("form should be accessible", async ({ page }) => {
    await page.goto("/posts/new");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeFocused();

    // Test enter key
    await page.keyboard.press("Enter");
    // Verify the action occurred
  });
});
```

## Test Data Management

### Fixtures

```typescript
// tests/__fixtures__/user.ts
export const userFixture = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  image: "https://example.com/avatar.jpg",
};

export const postFixture = {
  id: 1,
  name: "Test Post",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  createdById: userFixture.id,
};
```

### Factory Functions

```typescript
// tests/__fixtures__/factories.ts
import { faker } from "@faker-js/faker";

export function createUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

export function createPost(overrides = {}) {
  return {
    id: faker.number.int(),
    name: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    createdById: faker.string.uuid(),
    ...overrides,
  };
}
```

### MSW (Mock Service Worker)

```typescript
// src/__mocks__/handlers.ts
import { http, HttpResponse } from "msw";
import { createUser, createPost } from "../__fixtures__/factories";

export const handlers = [
  http.get("/api/posts", () => {
    return HttpResponse.json({
      posts: [createPost(), createPost(), createPost()],
    });
  }),

  http.post("/api/posts", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      post: createPost(body),
    });
  }),

  http.get("/api/auth/session", () => {
    return HttpResponse.json({
      user: createUser(),
      expires: "2024-12-31",
    });
  }),
];
```

```typescript
// src/__mocks__/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

## Testing Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"

      - name: Setup pnpm
        uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:coverage

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Performance Testing

### Bundle Size Testing

```typescript
// tests/performance/bundle-size.test.ts
import { execSync } from "child_process";
import { readFileSync } from "fs";

describe("Bundle Size", () => {
  it("should not exceed size limits", () => {
    // Build the application
    execSync("pnpm build");

    // Read build manifest
    const manifest = JSON.parse(
      readFileSync(".next/build-manifest.json", "utf8"),
    );

    // Check main bundle size
    const mainBundleSize = manifest.pages["/"].reduce((total, file) => {
      if (file.endsWith(".js")) {
        const stats = statSync(`.next/static${file}`);
        return total + stats.size;
      }
      return total;
    }, 0);

    expect(mainBundleSize).toBeLessThan(500 * 1024); // 500KB
  });
});
```

### Lighthouse Testing

```typescript
// tests/performance/lighthouse.spec.ts
import { test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

test("should pass lighthouse audit", async ({ page }) => {
  await page.goto("/");

  await playAudit({
    page,
    thresholds: {
      performance: 90,
      accessibility: 95,
      "best-practices": 90,
      seo: 90,
    },
  });
});
```

## Test Organization Best Practices

### Test Structure

```typescript
describe("ComponentName", () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      // Authentication setup
    });

    it("should display user content", () => {
      // Test authenticated behavior
    });
  });

  describe("when user is not authenticated", () => {
    it("should redirect to login", () => {
      // Test unauthenticated behavior
    });
  });

  describe("form validation", () => {
    it("should show error for invalid input", () => {
      // Test validation
    });
  });
});
```

### Test Naming

```typescript
// Good test names
it("should create post when valid data is submitted");
it("should show error message when name is empty");
it("should redirect to dashboard after successful login");

// Avoid vague names
it("should work correctly");
it("should handle edge case");
it("should test the component");
```

### Debugging Tests

```typescript
// Debug specific test
test.only("debug this test", async ({ page }) => {
  await page.pause(); // Opens browser for debugging
});

// Skip flaky test temporarily
test.skip("flaky test", () => {
  // Test code
});

// Run test in specific conditions
test.describe.configure({ mode: "serial" });
```

## Coverage Reporting

### Jest Coverage

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Badges

```markdown
[![Coverage Status](https://coveralls.io/repos/github/your-org/your-repo/badge.svg?branch=main)](https://coveralls.io/github/your-org/your-repo?branch=main)
```

## Troubleshooting

### Common Issues

#### Tests timing out

```typescript
// Increase timeout for slow tests
test("slow operation", async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await page.goto("/slow-page");
});
```

#### Mock not working

```typescript
// Ensure mocks are cleared between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### Database test interference

```typescript
// Isolate database tests
beforeEach(async () => {
  await cleanDatabase();
});
```

#### Flaky E2E tests

```typescript
// Use proper waiting strategies
await page.waitForSelector('[data-testid="content"]');
await page.waitForURL("**/dashboard");
await page.waitForLoadState("networkidle");
```
