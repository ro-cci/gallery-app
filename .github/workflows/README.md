# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing and CI/CD.

## Available Workflows

### 🚀 `ci.yml` - Comprehensive CI Pipeline
**Recommended for production use**

- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Features**:
  - Tests on multiple Node.js versions (18.x, 20.x, 22.x)
  - Automatic dependency caching
  - Code linting (if ESLint is configured)
  - Build validation (if build script exists)
  - Test coverage generation
  - Codecov integration (optional)
  - Detailed test summary in PR comments

### ⚡ `test-simple.yml` - Basic Testing
**Good for simple projects or getting started**

- **Triggers**: Push to `main` branch, Pull Requests to `main`
- **Features**:
  - Single Node.js version (20.x)
  - Basic dependency installation
  - Test execution only

## Usage

### Current Status
The repository currently uses **both workflows** for demonstration purposes. In a real project, you would typically choose one:

- **Use `ci.yml`** for comprehensive testing and production projects
- **Use `test-simple.yml`** for simple projects or quick setup

### To Use Only One Workflow
1. **Keep comprehensive CI**: Delete `test-simple.yml`
2. **Keep simple testing**: Delete `ci.yml`

### Adding Secrets (Optional)
For Codecov integration in `ci.yml`, add your Codecov token:
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add a new secret named `CODECOV_TOKEN`
3. Paste your Codecov token value

## Test Results
The workflows will show test results in:
- ✅ **GitHub Actions tab**: Detailed logs and results
- 📝 **Pull Request checks**: Pass/fail status
- 📊 **PR Summary**: Test summary (comprehensive workflow only)

## Current Test Status
With the intentional bugs introduced for demonstration:
- 📊 **Expected**: ~7 failing tests out of 43 total
- 🎯 **Purpose**: Demonstrates realistic CI failure scenarios
- 🔧 **Fix**: Remove the intentional bugs to make all tests pass
