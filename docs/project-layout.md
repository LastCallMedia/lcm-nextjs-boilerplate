
# Project Organization information


## 🏗️ Project Layout

```
├── docs/                    # Comprehensive documentation
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── src/
│   ├── _components/         # Reusable React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── posts/          # Post-related components
│   │   ├── theme/          # Theme components
│   │   └── ui/             # shadcn/ui components
│   ├── app/                # Next.js App Router
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── server/             # Server-side code
│   │   ├── api/            # tRPC routers
│   │   ├── auth/           # NextAuth.js configuration
│   │   └── db.ts           # Database connection
│   ├── styles/             # Global styles
│   └── trpc/               # tRPC client configuration
├── tests/                  # Test files
└── docker-compose.yml      # Docker services
```


## 📦 Available Scripts

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `pnpm dev`                | Start development server with Turbo        |
| `pnpm build`              | Build for production                       |
| `pnpm start`              | Start production server                    |
| `pnpm preview`            | Build and start production server locally  |
| `pnpm lint`               | Run ESLint                                 |
| `pnpm lint:fix`           | Fix ESLint issues                          |
| `pnpm typecheck`          | Run TypeScript type checking               |
| `pnpm check`              | Run linting and type checking              |
| `pnpm format:check`       | Check code formatting                      |
| `pnpm format:write`       | Format code with Prettier                  |
| `pnpm test`               | Run Jest unit tests                        |
| `pnpm test:watch`         | Run Jest tests in watch mode               |
| `pnpm test:coverage`      | Run Jest tests with coverage report        |
| `pnpm test:e2e`           | Run Playwright E2E tests                   |
| `pnpm test:e2e:ui`        | Run Playwright tests with UI mode          |
| `pnpm test:e2e:headed`    | Run Playwright tests in headed mode        |
| `pnpm install:playwright` | Install Playwright browsers                |
| `pnpm clean`              | Clean build artifacts and caches           |
| `pnpm db:studio`          | Open Prisma Studio                         |
| `pnpm db:generate`        | Generate Prisma client and run migrations  |
| `pnpm db:migrate`         | Deploy migrations in production            |
| `pnpm db:push`            | Push schema changes to database (dev only) |
| `pnpm docker:dev`         | Start development services with Docker     |
| `pnpm docker:dev:down`    | Stop development Docker services           |
| `pnpm docker:prod`        | Start production build with Docker         |
| `pnpm docker:prod:down`   | Stop production Docker services            |
| `pnpm docker:build`       | Build Docker images                        |

