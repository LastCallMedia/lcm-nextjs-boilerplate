# LCM Next.js Boilerplate

A production-ready Next.js boilerplate for Last Call Media, designed to accelerate project development with modern best practices and a comprehensive tech stack.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3+-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

### Core Stack

- **🚀 [T3 Stack](https://create.t3.gg/)**: Next.js, tRPC, Prisma, Tailwind CSS, NextAuth.js, Zod
- **⚛️ React 19**: Latest React features with concurrent rendering
- **🔒 Authentication**: Complete NextAuth.js setup with Google provider
- **🗄️ Database**: PostgreSQL with Prisma ORM and type-safe queries
- **🎨 UI Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **🌙 Dark Mode**: Built-in theme switching with next-themes

### Developer Experience

- **📝 TypeScript**: Fully typed with strict configuration
- **🔧 ESLint & Prettier**: Code formatting and linting
- **🧪 Testing**: Jest for unit tests, Playwright for E2E testing
- **♿ Accessibility**: Built-in accessibility testing with axe-core
- **🐳 Docker**: Complete containerization setup
- **📱 Responsive**: Mobile-first design approach

### Production Ready

- **🔐 Environment Validation**: Type-safe environment variables with @t3-oss/env-nextjs
- **🚀 Performance**: Optimized builds with standalone output
- **📊 Monitoring**: Ready for production monitoring integration
- **🔄 CI/CD Ready**: GitHub Actions compatible structure

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 22.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **Docker**: For database and development services

### Installation

1. **Clone and install dependencies**:

   ```bash
   git clone <repository-url>
   cd lcm-nextjs-boilerplate
   pnpm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the database**:

   ```bash
   pnpm docker:dev
   ```

4. **Initialize the database**:

   ```bash
   pnpm db:generate
   ```

5. **Start development server**:
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[🛠️ Setup & Installation](./docs/setup.md)** - Detailed setup instructions
- **[🏗️ Architecture](./docs/architecture.md)** - Project structure and design decisions
- **[🔑 Authentication](./docs/authentication.md)** - NextAuth.js configuration and usage
- **[🗄️ Database](./docs/database.md)** - Prisma setup, migrations, and best practices
- **[🎨 UI & Styling](./docs/ui-styling.md)** - Component library and styling guide
- **[🧪 Testing](./docs/testing.md)** - Testing strategies and tools
- **[🎭 Local GitHub Actions Testing](./docs/local-testing.md)** - Run GitHub Actions locally with act
- **[🐳 Docker](./docs/docker.md)** - Containerization and deployment
- **[🔧 Development](./docs/development.md)** - Development workflow and tools
- **[🚀 Deployment](./docs/deployment.md)** - Production deployment guide

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

## 🏗️ Project Structure

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

## 🔧 Tech Stack

### Frontend

- **Next.js 15.3+** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### Backend

- **tRPC** - End-to-end typesafe APIs
- **NextAuth.js** - Authentication and session management
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **Zod** - Schema validation
- **In-memory Event System** – Lightweight pub/sub for features like typing indicators built on tRPC subscriptions, learn more - **[💬 Typing Indicator](./docs/sse-typing-indicator.md)**

### Development & Testing

- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **Playwright** - E2E testing
- **Docker** - Containerization
- **pnpm** - Fast package manager

## � Testing

This project includes Jest setup for unit testing with accessibility testing support.

### Unit Testing with Jest

- **Framework**: Jest with React Testing Library
- **Accessibility**: jest-axe for accessibility testing
- **Coverage**: Built-in coverage reporting
- **Configuration**: `jest.config.js` and `jest.setup.js`

#### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

#### Writing Tests

Tests are co-located with components in `__tests__` directories:

```
src/
└── _components/
    └── posts/
        ├── PostCard.tsx
        └── __tests__/
            └── PostCard.test.tsx
```

### CI/CD Integration

Tests automatically run in CI/CD pipeline:

- Unit tests with Jest
- Coverage reporting
- Accessibility checks

## �🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📋 Project Management

This project is tracked in our [WKSP Jira Board](https://lastcall.atlassian.net/jira/software/projects/WKSP/boards/203/backlog).

## 🗺️ Roadmap

- [ ] Internationalization (i18n) setup
- [ ] WebSocket integration example
- [ ] User settings page with image upload
- [ ] Feature toggles via configuration
- [ ] GitHub Actions CI/CD pipeline
- [ ] Pre-commit hooks (Husky, lint-staged)
- [ ] SEO optimization utilities
- [ ] Performance monitoring integration
- [ ] Error tracking setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Last Call Media

This boilerplate is maintained by [Last Call Media](https://lastcallmedia.com), a digital agency specializing in open-source web development.

---

**Made with ❤️ by the LCM Team**
