# Documentation Index

Welcome to the LCM Next.js Boilerplate documentation! This comprehensive guide will help you understand, set up, and work with the boilerplate effectively.

## 📖 Getting Started

Start here if you're new to the project:

- **[Setup & Installation](./setup.md)** - Complete setup guide from prerequisites to running locally
- **[Architecture Overview](./architecture.md)** - Understanding the project structure and design decisions

## 🏗️ Core Concepts

Deep dive into the main components of the system:

- **[Authentication](./authentication.md)** - NextAuth.js setup, providers, and session management
- **[Database](./database.md)** - Prisma ORM, migrations, and database best practices
- **[UI & Styling](./ui-styling.md)** - Component system, Tailwind CSS, and design patterns

## 🛠️ Development

Guides for active development:

- **[Development Guide](./development.md)** - Workflow, patterns, and best practices
- **[Testing](./testing.md)** - Unit, integration, and E2E testing strategies
- **[Local GitHub Actions Testing](./local-testing.md)** - Run GitHub Actions locally with act

## 🚀 Deployment & Infrastructure

Production deployment and operations:

- **[Docker Guide](./docker.md)** - Containerization and Docker workflows
- **[Deployment](./deployment.md)** - Production deployment strategies and platform guides

## 🤝 Contributing

Help improve the project:

- **[Contributing Guide](./contributing.md)** - How to contribute code, documentation, and ideas

## 📋 Quick Reference

### Essential Commands

```bash
# Development
pnpm dev              # Start development server
pnpm docker:dev       # Start development services (DB, etc.)
pnpm db:studio        # Open database management UI

# Building & Testing
pnpm build            # Build for production
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI
pnpm lint             # Check code quality
pnpm typecheck        # Check TypeScript types

# Database
pnpm db:generate      # Generate Prisma client & run migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:migrate       # Deploy migrations (production)
```

### Key File Locations

```
├── docs/                    # This documentation
├── src/
│   ├── _components/         # Reusable components
│   ├── app/                 # Next.js App Router pages
│   ├── server/              # Server-side code (tRPC, auth)
│   └── lib/                 # Utilities and configurations
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migration files
├── tests/                   # Test files
└── docker-compose.yml       # Development services
```

### Environment Variables

Required for development:

```bash
NODE_ENV=development
AUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://postgres:password@localhost:5432/lcm-nextjs-boilerplate
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🎯 Common Tasks

### Adding a New Feature

1. **Plan**: Define requirements and design
2. **Database**: Update schema if needed
3. **API**: Create tRPC procedures
4. **UI**: Build components and pages
5. **Test**: Add appropriate tests
6. **Document**: Update relevant docs

### Debugging Issues

1. **Check logs**: Development server console and browser console
2. **Database**: Use Prisma Studio to inspect data
3. **Network**: Check API calls in browser dev tools
4. **Types**: Run `pnpm typecheck` for TypeScript errors

### Performance Optimization

1. **Bundle analysis**: Check what's being included
2. **Database queries**: Optimize with proper indexing
3. **Caching**: Implement appropriate caching strategies
4. **Images**: Use Next.js Image optimization

## 🆘 Getting Help

- **Documentation**: Start with the relevant guide above
- **GitHub Issues**: Search existing issues or create a new one
- **Code Examples**: Check the existing codebase for patterns
- **Community**: Join discussions on GitHub Discussions

## 📚 External Resources

### Framework Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tool Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Testing

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

## 🔄 Keeping Up to Date

The project is actively maintained and updated. To stay current:

1. **Watch the repository** for updates
2. **Check releases** for new features and fixes
3. **Review changelogs** before updating
4. **Test thoroughly** after updates

---

**Need to update this documentation?** See our [Contributing Guide](./contributing.md) for information on how to contribute improvements to these docs.
