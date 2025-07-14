# Local GitHub Actions Testing with Act

This guide covers how to run GitHub Actions workflows locally using [act](https://github.com/nektos/act), which allows you to test your CI/CD pipeline before pushing to GitHub.

## Overview

Act is a tool that allows you to run your GitHub Actions locally using Docker. This is incredibly useful for:

- **🚀 Faster Feedback**: Test changes without pushing to GitHub
- **💰 Cost Savings**: Avoid using GitHub Actions minutes during development
- **🔍 Debugging**: Better debugging capabilities with local access
- **🔒 Security**: Test sensitive workflows in isolated environment

## Installation

### macOS

```bash
# Using Homebrew (recommended)
brew install act

# Using MacPorts
sudo port install act
```

### Linux

```bash
# Using curl (recommended)
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Using package managers
# Ubuntu/Debian
sudo apt install act

# Arch Linux
sudo pacman -S act

# Fedora/CentOS/RHEL
sudo dnf install act
```

### Windows

```powershell
# Using Chocolatey
choco install act-cli
# Using Scoop
scoop install act
# Using Winget
winget install nektos.act
```

### Manual Installation

Download the latest release from [GitHub Releases](https://github.com/nektos/act/releases) and add it to your PATH.

## Prerequisites

Before using act, ensure you have:

- **Docker installed and running**
- **Act installed** (see installation instructions above)
- **Repository cloned locally**
- **Sufficient Docker resources** (at least 4GB RAM allocated)

## Usage

### Basic Commands

Navigate to your project root and run:

```bash
# Run all workflows (entire pipeline)
act

# Run specific workflow job (tests only)
act -j test

# Run E2E tests specifically
act -j e2e-tests

# View workflow execution graph and available jobs
act -l
```

### Advanced Commands

```bash
# Run with verbose output for debugging
act -v

# Run with specific environment variables
act --env NODE_ENV=production

# Use specific Docker image
act --container-architecture linux/amd64

# Run with custom event (default is 'push')
act pull_request

# Run specific workflow file
act -W .github/workflows/test.yml

# Dry run (show what would be executed)
act --dry-run
```

## Project-Specific Workflows

### Unit Tests (`act -j jest-tests`)

- Runs Jest unit tests
- Includes accessibility testing with jest-axe
- Fast execution (typically under 2 minutes)
- No external services required

### E2E Tests (`act -j e2e-tests`)

- Runs Playwright end-to-end tests
- Includes PostgreSQL service setup
- Tests across multiple browsers (Chromium, Firefox, WebKit)
- Includes accessibility validation with axe-core
- Longer execution time (5-10 minutes)

### Code Quality (`act -j code-quality`)

- Runs ESLint for code linting and style enforcement
- Executes TypeScript type checking with `tsc --noEmit`
- Validates code formatting with Prettier
- Ensures consistent code standards across the project
- Fast execution (typically under 1 minute)
- No external services required


### Full Pipeline (`act`)

- Runs all workflows in parallel
- Complete CI/CD validation
- Most comprehensive testing approach

## Troubleshooting

### Common Issues and Solutions

#### Docker Permission Issues

```bash
# Linux: Add your user to docker group
sudo usermod -aG docker $USER
# Then logout and login again

# Verify Docker is running
docker ps
```

#### Memory Issues

```bash
# Check Docker memory allocation
docker system info | grep -i memory

# For large builds, allocate at least 4GB in Docker Desktop:
# Docker Desktop → Settings → Resources → Memory
```

#### Network Issues

```bash
# For DNS resolution issues in containers
act --env NODE_OPTIONS="--dns-result-order=ipv4first"

# For IPv6 binding issues
act --env HOST=0.0.0.0
```

#### Build Failures

```bash
# Clean Docker images and retry
docker system prune -f
act --rm  # Remove containers after execution

# Use specific architecture if needed
act --container-architecture linux/amd64
```

#### Authentication Issues

```bash
# For workflows requiring secrets, create .secrets file
echo "GITHUB_TOKEN=your_token_here" > .secrets
act --secret-file .secrets
```

### Environment Variables

The project workflows use these environment variables:

```bash
NODE_ENV=production          # Set production mode
NEXT_TELEMETRY_DISABLED=1   # Disable Next.js telemetry
DATABASE_URL=...             # Automatically set by PostgreSQL service
NEXTAUTH_SECRET=...          # Required for authentication
NEXTAUTH_URL=...             # Required for authentication
```

## Performance Tips

### Faster Execution

```bash
# Use cached Docker images
act --use-gitignore=false

# Run specific jobs instead of full pipeline
act -j test  # Instead of 'act'

# Use local Docker registry for faster pulls
# (Advanced: set up local registry)
```

### Resource Management

```bash
# Monitor Docker resource usage
docker stats

# Clean up after testing
docker system prune -f
act --rm
```

## Workflow-Specific Notes

### Unit Tests Workflow

- **File**: `.github/workflows/test.yml`
- **Duration**: ~2 minutes
- **Resources**: Low memory usage
- **Dependencies**: Node.js packages only

### E2E Tests Workflow

- **File**: `.github/workflows/e2e-test.yml`
- **Duration**: ~5-10 minutes
- **Resources**: High memory usage (PostgreSQL + browsers)
- **Dependencies**: PostgreSQL service, Playwright browsers

### Build Process

Both workflows include:

1. **Dependency Installation**: `pnpm install --frozen-lockfile`
2. **Build Process**: `pnpm build` (Next.js standalone output)
3. **Test Execution**: Jest or Playwright
4. **Cleanup**: Automatic container cleanup

## Debugging Tips

### Verbose Output

```bash
# Enable detailed logging
act -v

# Show Docker commands being executed
act -v --verbose
```

### Interactive Debugging

```bash
# Access running container (in another terminal)
docker ps  # Find container ID
docker exec -it <container-id> /bin/bash

# Check logs
docker logs <container-id>
```

### Common Debug Commands

```bash
# Check workflow syntax
act --dry-run

# List all available actions
act -l

# Show workflow graph
act --graph
```

## Integration with Development Workflow

### Recommended Usage

1. **Before Committing**: Run `act -j test` to validate unit tests
2. **Before PR**: Run `act` to validate full pipeline
3. **After Major Changes**: Run `act -j e2e-tests` for comprehensive validation
4. **For CI/CD Changes**: Test workflow modifications locally first

### Git Hooks Integration

Consider adding act to your git hooks:

```bash
# .git/hooks/pre-push
#!/bin/sh
echo "Running tests locally before push..."
act -j test
```

## Limitations

### Known Limitations

- **Artifact Upload**: Fails locally (expected behavior)
- **GitHub-specific Actions**: Some actions may not work identically
- **Secrets Management**: Requires manual setup
- **Performance**: Slower than native GitHub Actions runners

### Not Supported Locally

- GitHub-specific contexts (github.repository, etc.)
- Some third-party actions may behave differently
- GitHub App authentication
- Matrix builds (run sequentially instead of parallel)

## Further Reading

- [Act Documentation](https://github.com/nektos/act)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Project Testing Guide](./testing.md)

---

For more information about the project's testing strategy, see the [Testing Documentation](./testing.md).