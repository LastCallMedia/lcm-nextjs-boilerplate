# lcm-nextjs-boilerplate

A production-grade Next.js boilerplate for LCM, designed to help teams start new projects quickly with best practices and batteries-included setup.

## Features
- [T3 Stack](https://create.t3.gg/): Next.js, tRPC, Prisma, Tailwind CSS, NextAuth, Zod
- [shadcn/ui](https://ui.shadcn.com/): Modern UI components
- [react-intl](https://formatjs.io/docs/react-intl/): Internationalization
- [Jest](https://jestjs.io/) + [jest-axe](https://github.com/nickcolley/jest-axe): Unit & accessibility testing
- [Playwright](https://playwright.dev/) + [axe-core/playwright](https://github.com/abhinaba-ghosh/axe-playwright): E2E & accessibility testing
- [Dark mode](https://github.com/pacocoursey/next-themes)
- Feature toggles via Makefile (WIP)
- Example WebSocket integration (WIP)
- User settings page with image upload (WIP)
- Boilerplate routes for rapid prototyping

## Getting Started

```sh
pnpm install
pnpm dev
```

## Testing
- `pnpm test` for Jest unit tests
- `pnpm exec playwright test` for E2E tests

## Environment Variables
See `.env.example` for required variables.

## Jira Board
This project is tracked in [WKSP Jira Board](https://lastcall.atlassian.net/jira/software/projects/WKSP/boards/203/backlog).

## Future Plans
- Makefile feature toggles for enabling/disabling features
- WebSocket example route
- User settings page with image upload
- More example routes (auth, protected, public, etc.)
- Improved i18n setup
- More robust testing (unit, integration, E2E, accessibility)
- GitHub Actions CI/CD
- Husky, lint-staged, commitlint
- SEO best practices

---

### Contributing
See [GitHub Issues](https://github.com/LastCallMedia/lcm-nextjs-boilerplate/issues) for tasks and ideas.

---
