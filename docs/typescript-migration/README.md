# Jekyll to TypeScript Migration Plan

**Project:** Migration Jekyll Blog JavaScript to TypeScript
**Repository:** [quocnv15/quocnv15.github.io](https://github.com/quocnv15/quocnv15.github.io)
**Target:** TypeScript-first frontend with Jekyll SSG backend
**Timeline:** 1-2 days (3 phases)
**Risk Level:** Low (with proper implementation)

## 📋 Overview

This document outlines the complete migration plan for converting the Jekyll blog's JavaScript frontend to TypeScript while maintaining Jekyll as the Static Site Generator (SSG). The migration focuses on type safety, performance optimization, and maintainability.

### 🎯 Migration Goals

- **Type Safety:** Implement strict TypeScript with proper null safety
- **Performance:** Keep bundle size ≤ 150KB with optimizations
- **Maintainability:** Modular architecture with clear separation of concerns
- **Zero Downtime:** Gradual migration with rollback capability
- **Modern Tooling:** Use esbuild for fast builds and GitHub Actions for CI/CD

### 📊 Current State Analysis

**Repository Structure:**
- Jekyll-based static blog with Minima theme
- Custom CSS overrides in `css/override.css`
- Highlight.js for syntax highlighting
- Custom layouts for posts and pages
- GitHub Pages deployment

**Current JavaScript:**
- `/js/highlightjs/highlight.min.js` - Syntax highlighting
- `/js/highlightjs/languages/*.js` - Language definitions
- Inline scripts in layouts (minimal)

**Features to Port:**
- Table of Contents (TOC)
- Dark mode toggle
- Copy code to clipboard
- Mobile navigation
- Social sharing
- Post navigation
- Live search (optional)

---

## 🏗️ Target Architecture

### New Directory Structure

```
src/ts/                     # TypeScript source
├── main.ts                 # Entry point
├── modules/
│   ├── toc.ts             # Table of Contents
│   ├── theme.ts           # Dark mode toggle
│   ├── search.ts          # Live search
│   ├── copy-code.ts       # Copy to clipboard
│   ├── navigation.ts      # Mobile navigation
│   ├── share.ts           # Social sharing
│   └── utils/
│       ├── dom.ts         # DOM utilities
│       ├── storage.ts     # LocalStorage helpers
│       └── errors.ts      # Error handling
├── interfaces/
│   ├── post.ts            # Post-related types
│   ├── search.ts          # Search-related types
│   └── ui.ts              # UI state types
└── data/
    └── search-index.ts    # Search data structure

assets/js/                 # Output bundle for Jekyll
├── main.js                # Main bundle with sourcemap
└── main.js.map            # Source map file

docs/typescript-migration/ # Documentation
├── README.md              # This file
├── timeline.md            # Project timeline
├── technical-requirements.md # Technical specs
└── checklist.md           # Migration checklist
```

### Technology Stack

- **TypeScript 5.0+** - Type-safe JavaScript
- **esbuild** - Fast bundler and minifier
- **Jekyll** - Static Site Generator (unchanged)
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Deployment target

---

## 📅 Migration Timeline

### Phase 1: Bootstrap TypeScript (1-2 hours)
**Objective:** Setup TypeScript toolchain and basic bundle

**Tasks:**
- [ ] Initialize npm project and install dependencies
- [ ] Create TypeScript configuration (`tsconfig.json`)
- [ ] Setup esbuild build pipeline
- [ ] Create entry point (`src/ts/main.ts`)
- [ ] Update Jekyll layouts to load new bundle
- [ ] Test basic functionality

**Deliverables:**
- Working TypeScript compilation
- Basic bundle generation (`assets/js/main.js`)
- Site still functions with existing features
- CI/CD pipeline updated
- Layout updated with subpath-safe script tag + cache-busting

### Phase 2: Port Features (0.5-1 day)
**Objective:** Migrate existing functionality to TypeScript

**Priority Order:**
1. **Copy to Clipboard** - Simple DOM manipulation
2. **Dark Mode Toggle** - State management with LocalStorage
3. **Mobile Navigation** - Event handling and DOM manipulation
4. **Table of Contents** - Dynamic content generation
5. **Live Search** - Complex state and filtering
6. **Social Sharing** - Window management and URLs

**Deliverables:**
- All features ported with type safety
- Strict TypeScript mode enabled
- No regression in functionality
- Comprehensive error handling

### Phase 3: Optimization & Cleanup (0.5-1 day)
**Objective:** Performance optimization and final cleanup

**Tasks:**
- [ ] Enable full strict mode configuration
- [ ] Bundle size optimization and monitoring
- [ ] Remove legacy JavaScript files
- [ ] Performance testing and optimization
- [ ] Final deployment and monitoring

**Deliverables:**
- Production-ready TypeScript bundle
- Bundle size ≤ 150KB
- Performance metrics met or improved
- Full documentation updated

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ All existing features work identically
- ✅ Page load time < 3 seconds on 3G
- ✅ Mobile navigation smooth on touch devices
- ✅ Dark mode persists across sessions
- ✅ Copy code functionality works on all code blocks
- ✅ TOC highlights current section on scroll
- ✅ Search returns relevant results quickly

### Technical Requirements
- ✅ No `any` types used
- ✅ All DOM queries have null checks
- ✅ Event listeners properly cleaned up
- ✅ Memory leaks prevented
- ✅ Console errors eliminated
- ✅ Accessibility attributes maintained

### Performance Requirements
- ✅ Bundle size ≤ 150KB gzipped
- ✅ First Contentful Paint < 1.5s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Cumulative Layout Shift < 0.1
- ✅ Time to Interactive < 3.5s
- ✅ Lighthouse scores ≥ 90

---

## 🚨 Risk Assessment & Mitigation

### High Risk
- **Build Failure:** GitHub Pages doesn't support TypeScript natively
  - **Mitigation:** Use GitHub Actions for build pipeline
- **Bundle Size Bloat:** Dependencies increase bundle size
  - **Mitigation:** Tree-shaking, code splitting, monitoring

### Medium Risk
- **Feature Regression:** Existing functionality broken
  - **Mitigation:** Gradual migration, parallel testing
- **Cross-browser Issues:** Modern JavaScript compatibility
  - **Mitigation:** Target ES2019, browser testing

### Low Risk
- **Development Workflow Changes:** Team adaptation
  - **Mitigation:** Clear documentation, simple build process
- **Maintenance Overhead:** Additional complexity
  - **Mitigation:** Automated builds, minimal dependencies

---

## 📚 Documentation Structure

This migration plan includes the following documents:

1. **README.md** - This overview and summary
2. **timeline.md** - Detailed project timeline with tasks
3. **technical-requirements.md** - Technical specifications and architecture
4. **checklist.md** - Complete migration checklist and DoD

Each document provides specific guidance for different aspects of the migration process.

---

## 🚀 Getting Started

To begin the migration:

1. **Review this document** and understand the overall plan
2. **Check the timeline** in `timeline.md` for detailed tasks
3. **Review technical requirements** in `technical-requirements.md`
4. **Use the checklist** in `checklist.md` to track progress

---

## 🌐 GitHub Pages Deployment Notes

### Build & Deployment
- **Build method:** GitHub Actions (not default Pages build)
- **TypeScript compilation:** Run in Actions, not supported natively by Pages
- **Jekyll build:** Standard Jekyll process in Actions
- **Deployment:** Automatic on push to main branch

### Subpath-Safe Assets
- **All asset references** must use `{{ '/path/to/asset' | relative_url }}`
- **JavaScript bundle:** `{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}`
- **CSS files:** `{{ '/css/style.css' | relative_url }}?v={{ site.time | date: '%s' }}`
- **Images:** `{{ '/images/logo.png' | relative_url }}`

### Cache-Busting Strategy
```html
<!-- In Jekyll layouts -->
<script type="module" defer
  src="{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}">
</script>
```

### CI Layout
Two separate workflows recommended:

1. **ci.yml** (Runs on every push/PR):
   - `npm ci` → `npm run check:types` → `npm run build:ts`
   - No deployment, only validation

2. **pages.yml** (Runs on main branch):
   - Full TypeScript build → Jekyll build → Deploy to Pages
   - Optional preview deploy for Pull Requests

### Known Limitations on GitHub Pages
- **No Git LFS support** for static assets
- **CSP restrictions** - only `<meta http-equiv>` CSP headers supported
- **Build timeout:** 10 minutes for GitHub Actions
- **Storage:** 1GB limit for repository

### Preview Deployments (Optional)
For Pull Request previews:
```yaml
# .github/workflows/pages.yml (partial)
- name: Upload preview artifact
  uses: actions/upload-pages-artifact@v3
  if: github.event_name == 'pull_request'
```

---

## 📞 Support

For questions or issues during migration:
- Review the detailed documentation in this folder
- Check the troubleshooting section in `technical-requirements.md`
- Create issues in the repository for specific problems

---

**Migration Start Date:** TBD
**Estimated Completion:** 1-2 days
**Project Owner:** Development Team
**Review Date:** Post-migration + 1 week