# Deployment Guide

## Overview

This guide covers deploying the quocnv15.github.io site to GitHub Pages, including local testing, build verification, and troubleshooting.

## Prerequisites

### Local Environment

```bash
# Node.js 16+
node --version

# Ruby 2.7+
ruby --version

# Bundler
bundle --version

# Git
git --version
```

### GitHub Setup

- Repository: `quocnv15/quocnv15.github.io`
- Hosting: GitHub Pages (automatic)
- Branch: `main` (auto-deploys)
- Domain: `quocnv15.github.io` (free)

## Development Workflow

### 1. Local Setup

```bash
# Clone repository
git clone https://github.com/quocnv15/quocnv15.github.io.git
cd quocnv15.github.io

# Install dependencies
bundle install      # Ruby gems (Jekyll)
npm install         # Node.js packages (TypeScript, esbuild)

# Verify installation
npm run check:types # TypeScript type checking
npm run test        # Run test suite
```

### 2. Local Development

```bash
# Start development server with HMR
npm run dev
# Access at http://localhost:4000

# Or use individual commands
npm run dev:ts      # TypeScript watch mode only
npm run dev:jekyll  # Jekyll server only
```

**Development Server Features**:
- Hot reload for TypeScript changes
- Jekyll livereload for content changes
- CSS hot-injection (no page refresh)
- Error overlay for build failures
- Source maps for debugging

### 3. Before Committing

```bash
# Run full test suite
npm run test

# Type checking
npm run check:types

# Bundle size verification
npm run size-check

# Accessibility audit
npm run check:design

# Fix any lint issues (if configured)
npm run lint --fix
```

**Exit Criteria**:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Bundle size < 150KB
- [ ] Accessibility audit passes
- [ ] No console errors on test site

## Build Process

### Production Build

```bash
# Complete production build
npm run build:prod

# Or individual steps
npm run build        # TypeScript + Jekyll
npm run build:ts     # TypeScript only
npm run build:jekyll # Jekyll only
```

**Build Steps**:
1. Clean previous build (`_site/`)
2. Set `NODE_ENV=production`
3. Run TypeScript compiler
   - Type checking
   - Bundle with esbuild
   - Minify JavaScript
   - Generate source maps
4. Run Jekyll build
   - Process Markdown files
   - Generate HTML
   - Copy assets
5. Optimize output
   - Tree shaking
   - CSS optimization
   - Asset compression

**Expected Output**:
```
✅ Build completed successfully
📦 Bundle size: 13.2KB (91% under 150KB target)
🎨 HTML files: 50+
📄 CSS files: compiled
⏱️  Build time: ~718ms
```

### Build Artifacts

```
_site/
├── index.html           # Homepage
├── archive.html         # Blog archive
├── projects.html        # Projects page
├── work/                # Work mode
├── cases/               # Case studies
├── assets/
│   ├── js/
│   │   ├── main.js          # Production bundle (13KB)
│   │   └── main.js.map      # Source map
│   └── css/                 # Compiled CSS
├── _posts/              # Blog content
└── images/              # Images and assets
```

## Deployment

### Automatic Deployment (Recommended)

GitHub Pages automatically deploys on push to `main`:

```bash
# 1. Commit changes
git add .
git commit -m "feat: add new feature"

# 2. Push to main
git push origin main

# 3. GitHub Actions runs:
#    - Builds site (Jekyll + TypeScript)
#    - Runs tests
#    - Deploys to gh-pages branch
#    - Live in ~2 minutes

# 4. Verify deployment
# Check https://quocnv15.github.io
```

### Manual Local Testing Before Deployment

```bash
# 1. Full production build
npm run build:prod

# 2. Test locally
bundle exec jekyll serve --destination _site

# 3. Open browser
open http://localhost:4000

# 4. Verify:
# - [ ] Homepage loads correctly
# - [ ] Dark mode toggle works
# - [ ] Mobile menu responsive
# - [ ] Copy code button functional
# - [ ] TOC generates correctly
# - [ ] All links work
# - [ ] No console errors
```

### Rollback Procedure

If deployment has issues:

```bash
# 1. Check deployment status
git log --oneline main | head -5

# 2. Identify last good commit
# (Check GitHub Pages history)

# 3. Revert if necessary
git revert <commit-hash>
git push origin main

# 4. Verify rollback
# Wait ~2 minutes for GitHub Pages to rebuild
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass: `npm run test`
- [ ] No TypeScript errors: `npm run check:types`
- [ ] Bundle size valid: `npm run size-check`
- [ ] Accessibility audit passes: `npm run check:design`
- [ ] Content is fresh and correct
- [ ] Links are verified (internal and external)
- [ ] Images are optimized
- [ ] No console errors in dev build
- [ ] Local build succeeds: `npm run build:prod`
- [ ] Local testing passes (full site works)

### Deployment

- [ ] Create feature branch: `git checkout -b feature/name`
- [ ] Make changes and commit: `git commit -m "feat: description"`
- [ ] Push to remote: `git push origin feature/name`
- [ ] Create/review pull request on GitHub
- [ ] Wait for CI checks to pass
- [ ] Merge PR to `main`
- [ ] Monitor deployment status

### Post-Deployment

- [ ] Verify site loads: https://quocnv15.github.io
- [ ] Check homepage renders correctly
- [ ] Test dark mode toggle
- [ ] Test mobile menu
- [ ] Verify all new content is visible
- [ ] Check Google search console (if integrated)
- [ ] Monitor analytics (if integrated)
- [ ] Fix any issues immediately

## Continuous Integration

### GitHub Actions Workflow

When you push to `main`, GitHub automatically:

1. **Checkout Code** - Clone repository
2. **Setup Node** - Install Node.js 18
3. **Setup Ruby** - Install Ruby 2.7+
4. **Install Dependencies**
   - `bundle install` (Ruby)
   - `npm ci` (Node.js)
5. **Run Tests** - `npm run test`
6. **Type Check** - `npm run check:types`
7. **Build** - `npm run build:prod`
8. **Deploy** - Push to `gh-pages` branch

### Monitoring Deployments

```bash
# View deployment status
# Option 1: GitHub Web
# https://github.com/quocnv15/quocnv15.github.io/deployments

# Option 2: CLI
gh deployment list

# View deployment logs
gh api repos/quocnv15/quocnv15.github.io/pages -q '.status'
```

## Content Deployment

### Adding Blog Posts

```bash
# 1. Create post file
touch _posts/2026-07-22-new-post.md

# 2. Add frontmatter
---
layout: post
title: "Post Title"
date: 2026-07-22
tags: ["iOS", "TypeScript"]
---

# 3. Write content in Markdown

# 4. Commit and push
git add _posts/2026-07-22-new-post.md
git commit -m "docs: add new blog post"
git push origin main
```

### Adding Projects

```bash
# 1. Create project file
touch _projects/new-project.md

# 2. Add project metadata
---
layout: project
title: "Project Name"
description: "Project description"
link: "https://link.to.project"
---

# 3. Commit and push
git add _projects/new-project.md
git commit -m "feat: add new project"
git push origin main
```

### Syncing Content from ios-memory

```bash
# Sync from private ios-memory repository
./scripts/sync-content.sh

# This updates:
# - Dashboard HTML
# - Case studies
# - Portfolio metadata
# - Frontmatter

# Commit changes
git add portfolio/ _data/
git commit -m "docs: sync content from ios-memory"
git push origin main
```

## Troubleshooting Deployment

### Build Fails with TypeScript Error

```bash
# 1. Check errors locally
npm run check:types

# 2. Fix type errors
# Edit the reported files

# 3. Verify fix
npm run check:types

# 4. Commit and push
git add .
git commit -m "fix: resolve TypeScript errors"
git push origin main
```

### Bundle Size Exceeds Limit

```bash
# 1. Analyze bundle
npm run analyze

# 2. Identify large dependencies
# Check esbuild output

# 3. Optimize code
# Remove unused imports
# Tree shake more effectively

# 4. Verify size
npm run size-check

# 5. Commit and push
git add .
git commit -m "perf: optimize bundle size"
git push origin main
```

### Site Not Updating After Push

```bash
# 1. Check build status
gh api repos/quocnv15/quocnv15.github.io/pages

# 2. Hard refresh browser
# Cmd+Shift+R (macOS) or Ctrl+Shift+R (Linux/Windows)

# 3. Check GitHub Pages settings
# https://github.com/quocnv15/quocnv15.github.io/settings/pages

# 4. Wait 2-3 minutes for deployment
# GitHub Pages can take up to 3 minutes to publish

# 5. Check deployment logs
gh run list
gh run view <run-id>
```

### Broken Links After Deployment

```bash
# 1. Run link checker (if available)
npm run check:links

# 2. Manually verify key links:
# - Homepage navigation
# - Blog post links
# - Project links
# - External references

# 3. Fix broken links in source
# Edit Markdown files

# 4. Commit and redeploy
git add .
git commit -m "fix: broken links"
git push origin main
```

### Performance Degradation

```bash
# 1. Check bundle size
npm run analyze

# 2. Check build time
npm run build:prod --timing

# 3. Profile locally
# Open DevTools Performance tab
# Check FCP, LCP, CLS metrics

# 4. Optimize if needed
# Remove unnecessary features
# Lazy load components

# 5. Redeploy optimized version
git add .
git commit -m "perf: improve performance"
git push origin main
```

## Environment-Specific Configuration

### Development Environment

```bash
NODE_ENV=development

# Effects:
- TypeScript source maps enabled
- Debug logging active
- Larger bundle (24.6KB with sourcemaps)
- Faster iteration
```

### Production Environment

```bash
NODE_ENV=production

# Effects:
- Tree shaking enabled
- Minification applied
- Source maps generated (optional)
- Optimized bundle (13KB)
- Performance metrics
```

### Environment Variables

```bash
# .env.local (git-ignored)
NODE_ENV=production
JEKYLL_ENV=production

# Committed to repo
# None (static site doesn't need config)
```

## Deployment Monitoring

### Key Metrics to Track

| Metric | Target | Current | Method |
|--------|--------|---------|--------|
| First Contentful Paint | <1.5s | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | <2.5s | Lighthouse |
| Bundle Size | <150KB | 13KB | `npm run size-check` |
| Build Time | <1s | ~718ms | CLI output |
| Test Coverage | >80% | Framework ready | Vitest |
| Uptime | 99.9%+ | 100% | GitHub Pages |

### Performance Testing

```bash
# 1. Run Lighthouse locally
# DevTools → Lighthouse → Generate report

# 2. Check bundle size
npm run analyze

# 3. Monitor build time
npm run build:prod --timing

# 4. Check accessibility
npm run check:design

# 5. Run tests
npm run test
```

## Disaster Recovery

### Backup Strategy

**Primary Backup**: GitHub repository itself
- All source code versioned
- Git history preserved
- Automatic GitHub backup

**Secondary Backup** (Recommended):
```bash
# Keep local backup
git clone https://github.com/quocnv15/quocnv15.github.io.git ~/backups/quocnv15-backup

# Or use GitHub's export
# Settings → Export repository data
```

### Recovery Procedure

```bash
# 1. If data is lost locally
git fetch origin
git reset --hard origin/main

# 2. If GitHub repo corrupted
# Contact GitHub Support
# Restore from local backup

# 3. If _site/ folder lost
npm run build:prod
# Rebuilds from source

# 4. Full restore from scratch
git clone https://github.com/quocnv15/quocnv15.github.io.git
cd quocnv15.github.io
bundle install
npm install
npm run build:prod
```

## Release Process

### Versioning

Currently using date-based versioning:
- Format: `YYYY-MM-DD`
- Examples: `2026-07-22`, `2026-Q3-2026`

### Release Steps

```bash
# 1. Finalize release notes
# Document changes in CHANGELOG.md (if used)

# 2. Tag release
git tag -a v2026-07-22 -m "Release 2026-07-22"

# 3. Push tags
git push origin --tags

# 4. Create GitHub Release
gh release create v2026-07-22 --notes "Release notes here"

# 5. Monitor deployment
# Check GitHub Pages status
```

## FAQ

**Q: How long does deployment take?**
A: ~2 minutes for build + deploy after pushing to main

**Q: Can I preview changes before deployment?**
A: Yes, run `npm run build:prod` locally and test with `bundle exec jekyll serve`

**Q: How do I rollback a deployment?**
A: Use `git revert` and push - GitHub Pages will rebuild with old version

**Q: What if tests fail?**
A: Fix failing tests locally, commit, push again - deployment waits for tests

**Q: Can I deploy without pushing to main?**
A: No, GitHub Pages only deploys from main branch

**Q: How do I test on mobile before deploying?**
A: Use local IP: `bundle exec jekyll serve --host 0.0.0.0`
Then access from phone: `http://<your-ip>:4000`

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-22  
**Next Review**: 2026-10-22
