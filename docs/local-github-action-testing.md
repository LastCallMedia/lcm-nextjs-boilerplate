# Local GitHub Actions Testing with Act

This guide covers how to run GitHub Actions workflows locally using [act](https://github.com/nektos/act), which allows you to test your CI/CD pipeline before pushing to GitHub. Make sure act is installed in your local device. Follow the steps mentioned [here](https://github.com/nektos/act) to install act into your local device.

### Basic Commands

Navigate to your project root and run:

```bash
# Run all workflows (entire pipeline)
act

# Run specific workflow job
act -j jest-tests

# Run specific workflow file
act -W .github/workflows/jest-test.yml

# View workflow execution graph and available jobs
act -l
```