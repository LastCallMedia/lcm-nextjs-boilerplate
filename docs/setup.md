# Setup & Installation Guide

This guide provides detailed instructions for setting up the LCM Next.js Boilerplate on your local development environment.

## Prerequisites

### System Requirements

- **Node.js**: Version 22.0.0 or higher
- **pnpm**: Version 8.0.0 or higher (recommended package manager)
- **Docker**: For running PostgreSQL and development services
- **Git**: For version control

### Verify Prerequisites

```bash
# Check Node.js version
node --version

# Check pnpm version
pnpm --version

# Check Docker version
docker --version
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lcm-nextjs-boilerplate
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies and automatically run `prisma generate` via the postinstall script.

### 3. Environment Configuration

#### Copy Environment Template

```bash
cp .env.example .env
```

#### Configure Environment Variables

Edit the `.env` file with your specific configuration:

```bash
# Environment
NODE_ENV=development

# Authentication
AUTH_SECRET=your-secret-here  # Generate with: npx auth secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_URL=http://localhost:3000

# Public URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/lcm-nextjs-boilerplate
```

#### Required Environment Variables

| Variable               | Description                                  | Required        |
| ---------------------- | -------------------------------------------- | --------------- |
| `NODE_ENV`             | Environment mode (development/production)    | Yes             |
| `AUTH_SECRET`          | NextAuth.js secret for JWT signing           | Yes             |
| `AUTH_GOOGLE_ID`       | Google OAuth client ID                       | For Google auth |
| `AUTH_GOOGLE_SECRET`   | Google OAuth client secret                   | For Google auth |
| `AUTH_URL`             | Base URL for authentication callbacks        | Yes             |
| `NEXT_PUBLIC_BASE_URL` | Public-facing base URL                       | Yes             |
| `DATABASE_URL`         | PostgreSQL connection string                 | Yes             |
| `EMAIL_SERVER`         | SMTP server URL (dev: smtp://localhost:1025) | For magic links |
| `EMAIL_FROM`           | From email address                           | For magic links |
| `RESEND_API_KEY`       | Resend API key (production only)             | For production  |

### 4. Database Setup

#### Start Database Services

```bash
pnpm docker:dev
```

This command starts:

- PostgreSQL database (port 5432)
- MailHog for email testing (port 8025)

#### Initialize Database

```bash
# Generate Prisma client and run migrations
pnpm db:generate

# Alternative: Push schema without migrations (development only)
pnpm db:push
```

#### Verify Database Connection

```bash
# Open Prisma Studio to view your database
pnpm db:studio
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at:

- **Main app**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (when running)
- **MailHog UI**: http://localhost:8025

## Google OAuth Setup

### 1. Create Google OAuth Application

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Configure Environment Variables

Add your Google OAuth credentials to `.env`:

```bash
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

## Development Tools Setup

### VS Code Extensions (Recommended)

- **Prisma** - Syntax highlighting for Prisma schema
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
- **TypeScript Importer** - Auto import for TypeScript
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **GitLens** - Git integration enhancements

### VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -- -p 3001
```

#### Database Connection Issues

```bash
# Reset Docker containers
pnpm docker:dev:down
pnpm docker:dev

# Reset database (development only)
pnpm db:push --force-reset
```

#### Prisma Generation Issues

```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
pnpm prisma generate
```

#### Node Modules Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Environment Validation Errors

The project uses `@t3-oss/env-nextjs` for environment validation. If you see validation errors:

1. Check that all required environment variables are set
2. Verify the variable names match exactly (case-sensitive)
3. Restart the development server after making changes

### Docker Issues

#### Permission Errors (Linux/macOS)

```bash
sudo chown -R $USER:$USER .
```

#### Port Conflicts

Edit `docker-compose.yml` to use different ports:

```yaml
ports:
  - "5433:5432" # Use 5433 instead of 5432
```

## Next Steps

After successful setup:

1. **Explore the codebase**: Start with `src/app/page.tsx`
2. **Read the architecture guide**: [Architecture Documentation](./architecture.md)
3. **Set up authentication**: [Authentication Guide](./authentication.md)
4. **Learn about the database**: [Database Documentation](./database.md)
5. **Start building**: [Development Guide](./development.md)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [T3 Stack Documentation](https://create.t3.gg/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
