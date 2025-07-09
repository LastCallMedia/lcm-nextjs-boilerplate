# E2E & Accessibility Testing

This guide covers end-to-end (E2E) and accessibility testing using Playwright in the LCM Next.js Boilerplate.

## Testing Stack

### Tools

- **Playwright**: Cross-browser E2E testing framework
- **@axe-core/playwright**: Accessibility testing integration
- **axe-core**: WCAG compliance checking engine

### Browser Coverage

- **Chromium**: Primary browser for development
- **Firefox**: Cross-browser compatibility
- **WebKit**: Safari compatibility

## Quick Start

### Install Browsers

```bash
pnpm install:playwright
```

### Run Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run with visual interface
pnpm test:e2e:ui

# Run in headed mode (visible browser)
pnpm test:e2e:headed
```

## Test Structure

### Install Browsers

```bash
pnpm install:playwright
```

### Run Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run with visual interface
pnpm test:e2e:ui

# Run in headed mode (visible browser)
pnpm test:e2e:headed
```

## Test Structure

### Test Files

```
tests/e2e/
├── accessibility.spec.ts    # WCAG compliance tests
├── navigation.spec.ts       # Basic navigation and UI
├── auth.spec.ts            # Authentication flows
└── admin.spec.ts           # Admin functionality
```

### Current Test Coverage

- **Navigation**: Homepage, posts page, navigation menu, 404 handling
- **Authentication**: Sign-in page, provider buttons, protected routes
- **Admin**: Access control and basic admin functionality
- **Accessibility**: WCAG 2.1 AA compliance across all pages

## Configuration

The Playwright configuration is in `playwright.config.ts`:

### Key Settings

- **Base URL**: `http://localhost:3000`
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Auto-start dev server**: Automatically starts `pnpm dev` before tests

### CI Integration

Tests automatically adjust for CI environments:

- Single worker on CI for stability
- Dot reporter for cleaner output
- Automatic retries for flaky tests

## Writing Tests

### Basic Test Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Tests", () => {
  test("should load page correctly", async ({ page }) => {
    await page.goto("/your-page");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toBeVisible();
  });
});
```

### Accessibility Testing

```typescript
import AxeBuilder from "@axe-core/playwright";

test("should be accessible", async ({ page }) => {
  await page.goto("/your-page");
  await page.waitForLoadState("networkidle");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Best Practices

### Reliable Tests

1. **Wait for page load**: Always use `page.waitForLoadState("networkidle")`
2. **Use specific selectors**: Prefer `data-testid` attributes
3. **Test behavior, not implementation**: Focus on user interactions

### Accessibility Testing

1. **Use exclusions wisely**: Exclude only known framework issues
2. **Test critical violations**: Focus on serious accessibility problems
3. **Fix before testing**: Address real issues rather than working around them

## Debugging

### Local Debugging

```bash
# Visual test runner
pnpm test:e2e:ui

# Debug mode with inspector
npx playwright test --debug

# Run single test file
pnpm test:e2e tests/e2e/navigation.spec.ts
```

### Common Issues

1. **Port conflicts**: Stop other services on port 3000
2. **Browser installation**: Run `pnpm install:playwright`
3. **Test timeouts**: Check network conditions and page load times

## Performance

### Test Optimization

- Tests run in parallel by default
- Screenshots/videos only captured on failure
- Trace recording available for debugging

### Reducing Test Time

```bash
# Run on single browser only
pnpm test:e2e --project=chromium

# Run specific test file
pnpm test:e2e tests/e2e/accessibility.spec.ts
```

## Maintenance

### Regular Tasks

1. **Update browsers**: `pnpm exec playwright install`
2. **Review accessibility exclusions**: Remove as issues are fixed
3. **Monitor test reliability**: Address flaky tests promptly

### Adding New Tests

1. Follow existing patterns in test files
2. Use the same browser setup and configuration
3. Include accessibility checks for new pages
4. Test real user workflows, not implementation details
