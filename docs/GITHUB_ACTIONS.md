# GitHub Actions & CI/CD

This document outlines the continuous integration and deployment pipeline for the Boop digital board game.

## 🔄 CI/CD Overview

The project uses GitHub Actions for automated testing, building, and deployment. The pipeline ensures code quality and enables confident releases.

## 🧪 Test Automation

### Test Workflow
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '20.x'
```

### Test Strategy
- **Multiple Node Versions**: Test on Node 18.x and 20.x
- **Fast Feedback**: Tests run on every push and PR
- **Coverage Tracking**: Upload coverage reports to Codecov
- **Fail Fast**: Pipeline stops on test failures

## 🏗️ Build & Deploy

### Build Workflow
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build for production
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
    
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
    
    - name: Deploy to staging
      # Deploy to staging environment
      run: echo "Deploy to staging"
    
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
    
    - name: Deploy to production
      # Deploy to production environment
      run: echo "Deploy to production"
```

## 🔍 Code Quality

### Linting Workflow
```yaml
# .github/workflows/lint.yml
name: Code Quality

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Check formatting
      run: npm run format:check
    
    - name: Type check
      run: npm run type-check
```

### Quality Gates
- **ESLint**: Enforce coding standards
- **Prettier**: Consistent code formatting
- **Type Checking**: JSDoc type validation
- **Test Coverage**: Minimum coverage thresholds

## 🏷️ Release Automation

### Release Workflow
```yaml
# .github/workflows/release.yml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version type (patch, minor, major)'
        required: true
        default: 'patch'
        type: choice
        options:
        - patch
        - minor
        - major

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Bump version
      run: npm version ${{ github.event.inputs.version }}
    
    - name: Push changes
      run: |
        git push
        git push --tags
    
    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ steps.version.outputs.new_tag }}
        release_name: Release ${{ steps.version.outputs.new_tag }}
        draft: false
        prerelease: false
```

## 🔐 Security & Secrets

### Environment Secrets
```yaml
# GitHub repository secrets
CODECOV_TOKEN          # Coverage reporting
DEPLOY_TOKEN           # Deployment authentication
SLACK_WEBHOOK_URL      # Notification webhook
```

### Security Scanning
```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run npm audit
      run: npm audit --audit-level high
    
    - name: Run CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript
    
    - name: Run dependency scan
      uses: actions/dependency-review-action@v3
      if: github.event_name == 'pull_request'
```

## 📊 Monitoring & Notifications

### Status Badges
Add to README.md:
```markdown
![Tests](https://github.com/username/boop/actions/workflows/test.yml/badge.svg)
![Build](https://github.com/username/boop/actions/workflows/deploy.yml/badge.svg)
![Coverage](https://codecov.io/gh/username/boop/branch/main/graph/badge.svg)
```

### Slack Notifications
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🚀 Deployment Targets

### Staging Environment
- **Trigger**: Every push to `main` branch
- **URL**: `https://boop-staging.vercel.app`
- **Purpose**: QA testing and preview

### Production Environment
- **Trigger**: GitHub releases
- **URL**: `https://boop-game.com`
- **Purpose**: Live game for users

### Deployment Platforms

#### Vercel (Recommended)
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    working-directory: ./
```

#### Netlify Alternative
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
```

#### GitHub Pages
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## 📋 Workflow Status

### Current Implementation
🚧 **Planned** - Workflows to be implemented:
- [ ] Test automation
- [ ] Build and deploy
- [ ] Code quality checks
- [ ] Security scanning
- [ ] Release automation

### Implementation Priority
1. **Test Automation** - Critical for TDD workflow
2. **Build Pipeline** - Enable deployment
3. **Code Quality** - Maintain standards
4. **Security** - Protect against vulnerabilities
5. **Release** - Streamline version management

## 🛠️ Setup Instructions

### 1. Enable GitHub Actions
```bash
# Create workflow directory
mkdir -p .github/workflows

# Add workflow files (see examples above)
```

### 2. Configure Secrets
In GitHub repository settings → Secrets and variables → Actions:
- Add deployment tokens
- Configure notification webhooks
- Set up coverage reporting tokens

### 3. Branch Protection
Configure branch protection rules for `main`:
- Require status checks to pass
- Require up-to-date branches
- Require review from code owners

### 4. Environment Setup
Create environments in repository settings:
- `staging` - Auto-deploy from main
- `production` - Manual approval required

## 📈 Metrics & Analytics

### Build Metrics
- **Build Time**: Track build duration
- **Test Coverage**: Monitor coverage trends
- **Bundle Size**: Track size over time
- **Deployment Frequency**: Release velocity

### Quality Metrics
- **Test Pass Rate**: Percentage of passing tests
- **Security Vulnerabilities**: Count of open issues
- **Code Quality Score**: ESLint/SonarQube metrics
- **Performance Budgets**: Lighthouse scores

## 🔄 Continuous Improvement

### Regular Reviews
- **Weekly**: Review failed builds and flaky tests
- **Monthly**: Analyze build performance metrics
- **Quarterly**: Update dependencies and tools

### Optimization Opportunities
- **Parallel Jobs**: Run tests and builds in parallel
- **Caching**: Cache dependencies and build artifacts
- **Matrix Strategy**: Test across multiple environments
- **Early Termination**: Fail fast on critical errors
