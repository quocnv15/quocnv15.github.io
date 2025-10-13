# Migration Checklist & Definition of Done

**Project:** Jekyll to TypeScript Migration
**Total Checklist Items:** 85
**Current Progress:** 0/85 (0%)
**Target Completion:** 1-2 days

---

## 📋 Pre-Migration Checklist

### 🔧 Environment Setup
- [ ] **Repository Backup**
  - [ ] Create `jekyll-js-legacy` branch
  - [ ] Tag current commit with `v1.0-js-legacy`
  - [ ] Verify branch protection rules
  - [ ] Test current site functionality completely

- [ ] **Development Environment**
  - [ ] Node.js 18+ installed
  - [ ] npm 8+ installed
  - [ ] Git configured properly
  - [ ] Local Jekyll server working
  - [ ] Chrome DevTools available

- [ ] **Documentation Preparation**
  - [ ] Document current JavaScript behavior
  - [ ] Create migration tracking issue
  - [ ] Set up communication channels
  - [ ] Prepare rollback procedures

### 📊 Baseline Measurements
- [ ] **Performance Baseline**
  - [ ] Lighthouse score: Performance _______
  - [ ] Lighthouse score: Accessibility _______
  - [ ] Lighthouse score: Best Practices _______
  - [ ] Lighthouse score: SEO _______
  - [ ] Page load time: _______ seconds
  - [ ] Bundle size: _______ KB
  - [ ] Number of JavaScript files: _______

- [ ] **Functionality Baseline**
  - [ ] All pages load without errors
  - [ ] Mobile navigation works
  - [ ] Dark mode works (if implemented)
  - [ ] Copy code works (if implemented)
  - [ ] TOC works (if implemented)
  - [ ] Search works (if implemented)
  - [ ] Social sharing works

---

## 🚀 Phase 1: Bootstrap TypeScript Checklist

### 📦 Package Management
- [ ] **Initialize npm project**
  - [ ] `npm init -y` executed
  - [ ] `package.json` created
  - [ ] `.gitignore` updated with `node_modules/`
  - [ ] `.gitignore` updated with `dist/`

- [ ] **Install Dependencies**
  - [ ] `npm install --save-dev typescript` executed
  - [ ] `npm install --save-dev esbuild` executed
  - [ ] Verify installations with `npm list`
  - [ ] Check `package-lock.json` committed

### ⚙️ TypeScript Configuration
- [ ] **Create tsconfig.json**
  - [ ] Basic configuration created
  - [ ] `"strict": true` enabled
  - [ ] `"noUncheckedIndexedAccess": true` enabled
  - [ ] `"target": "es2019"` set
  - [ ] `"module": "esnext"` set
  - [ ] `"lib": ["ES2020", "DOM"]` set
  - [ ] `"moduleResolution": "bundler"` set
  - [ ] `"sourceMap": true` enabled
  - [ ] Include/exclude paths configured

- [ ] **Test TypeScript Compilation**
  - [ ] `npx tsc --noEmit` executes without errors
  - [ ] Sample TypeScript file compiles
  - [ ] Output directory structure correct
  - [ ] Source maps generated

### 🏗️ Build Pipeline Setup
- [ ] **Create Build Script**
  - [ ] `build.js` esbuild configuration created
  - [ ] Entry points configured (`src/ts/main.ts`)
  - [ ] Output directory set to `assets/js/`
  - [ ] Bundle configuration enabled
  - [ ] Minification enabled
  - [ ] Source maps enabled
  - [ ] Target set to `es2019`

- [ ] **Test Build Pipeline**
  - [ ] `node build.js` executes successfully
  - [ ] `assets/js/main.js` created
  - [ ] `assets/js/main.js.map` created
  - [ ] Bundle size < 200KB (initial)
  - [ ] No build errors or warnings

### 📁 Directory Structure
- [ ] **Create TypeScript Source Structure**
  - [ ] `src/ts/` directory created
  - [ ] `src/ts/modules/` directory created
  - [ ] `src/ts/modules/utils/` directory created
  - [ ] `src/ts/interfaces/` directory created
  - [ ] `src/ts/data/` directory created
  - [ ] Verify all directories exist

- [ ] **Create Entry Point**
  - [ ] `src/ts/main.ts` file created
  - [ ] Basic console.log added
  - [ ] DOM ready listener added
  - [ ] File compiles without errors

### 🔗 Jekyll Integration
- [ ] **Update Jekyll Layouts**
  - [ ] `_layouts/default.html` updated
  - [ ] Script tag added: `<script type="module" defer src="{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>`
  - [ ] All asset (JS/CSS/IMG) use `| relative_url`
  - [ ] Site tested in subpath (Project Pages)
  - [ ] (Custom domain) CNAME confirmed after deploy
  - [ ] No Git LFS used for static assets
  - [ ] Old script tags identified (keep for now)
  - [ ] Script placement verified (before </body>)

- [ ] **Test Jekyll Integration**
  - [ ] `bundle exec jekyll build` succeeds
  - [ ] `bundle exec jekyll serve --livereload` works
  - [ ] Site loads without JavaScript errors
  - [ ] Browser console shows TypeScript log message
  - [ ] All existing functionality preserved

### 🔄 CI/CD Integration
- [ ] **Update package.json Scripts**
  - [ ] `"build:ts": "node build.js"` added
  - [ ] `"check:types": "tsc --noEmit"` added
  - [ ] `"build": "npm run build:ts && npm run check:types"` added
  - [ ] `"dev": "npm run build:ts --watch"` added

- [ ] **Create CI Workflow**
  - [ ] `ci.yml` workflow created for push/PR validation
  - [ ] Job `check:types` runs before build
  - [ ] TypeScript compilation checked on every push
  - [ ] Build artifacts generated (no deployment)

- [ ] **Test GitHub Actions**
  - [ ] Push changes to feature branch
  - [ ] CI workflow starts and passes
  - [ ] TypeScript compilation succeeds
  - [ ] Jekyll build succeeds
  - [ ] Deployment successful (pages.yml)
  - [ ] (Optional) Preview deploy for PR created
  - [ ] Site loads correctly from deployed version

### ✅ Phase 1 Sign-off
- [ ] **All deliverables complete**
  - [ ] TypeScript toolchain working
  - [ ] Basic bundle deployed
  - [ ] CI/CD pipeline updated
  - [ ] No regression in functionality
  - [ ] Bundle size < 200KB
  - [ ] Source maps available
  - [ ] Team sign-off obtained

---

## 🔧 Phase 2: Port Features Checklist

### 🛠️ Core Utilities Setup
- [ ] **Create DOM Utilities**
  - [ ] `src/ts/modules/utils/dom.ts` created
  - [ ] `qs<T>()` function implemented
  - [ ] `qsSafe<T>()` function implemented
  - [ ] `create<T>()` function implemented
  - [ ] `ready()` function implemented
  - [ ] `debounce()` function implemented
  - [ ] `throttle()` function implemented
  - [ ] All functions tested and working

- [ ] **Create Type Definitions**
  - [ ] `src/ts/interfaces/types.ts` created
  - [ ] `ThemeMode` union type defined
  - [ ] `UIState` union type defined
  - [ ] `PostMeta` interface defined
  - [ ] `TocItem` interface defined
  - [ ] `SearchRecord` interface defined
  - [ ] All types used in modules

- [ ] **Create Error Handling**
  - [ ] `src/ts/modules/utils/errors.ts` created
  - [ ] Global error handler implemented
  - [ ] Promise rejection handler implemented
  - [ ] Error logging functionality added
  - [ ] User-friendly error messages

### 📋 Copy Code Feature
- [ ] **Implementation**
  - [ ] `src/ts/modules/copy-code.ts` created
  - [ ] `initCopyCode()` function implemented
  - [ ] `copyToClipboard()` async function implemented
  - [ ] Clipboard API with fallback implemented
  - [ ] Visual feedback (success/error) added
  - [ ] Button creation and styling implemented

- [ ] **Testing**
  - [ ] Copy buttons appear on all code blocks
  - [ ] Copy functionality works on Chrome
  - [ ] Copy functionality works on Firefox
  - [ ] Copy functionality works on Safari
  - [ ] Fallback method works on older browsers
  - [ ] Visual feedback shows correctly
  - [ ] Error handling works properly

- [ ] **Integration**
  - [ ] Module imported in main.ts
  - [ ] Called during initialization
  - [ ] Works with existing syntax highlighting
  - [ ] No conflicts with other scripts

### 🌙 Dark Mode Toggle
- [ ] **Implementation**
  - [ ] `src/ts/modules/theme.ts` created
  - [ ] `initTheme()` function implemented
  - [ ] `getStoredTheme()` function implemented
  - [ ] `applyTheme()` function implemented
  - [ ] `toggleTheme()` function implemented
  - [ ] System preference detection implemented
  - [ ] LocalStorage persistence implemented

- [ ] **UI Components**
  - [ ] Theme toggle button added to navigation
  - [ ] Button styled appropriately
  - [ ] Accessibility attributes added
  - [ ] Smooth transitions implemented
  - [ ] Visual feedback for current state

- [ ] **Testing**
  - [ ] Toggle button appears and works
  - [ ] Theme preference persists across sessions
  - [ ] System preference detection works
  - [ ] Manual toggle overrides system preference
  - [ ] Smooth transitions work
  - [ ] No layout shift when toggling

### 📱 Mobile Navigation
- [ ] **Implementation**
  - [ ] `src/ts/modules/navigation.ts` created
  - [ ] `initMobileNav()` function implemented
  - [ ] Menu toggle functionality implemented
  - [ ] Click-outside-to-close implemented
  - [ ] Keyboard navigation implemented
  - [ ] Touch-friendly interactions

- [ ] **Testing**
  - [ ] Hamburger menu appears on mobile
  - [ ] Menu opens/closes correctly
  - [ ] Links work within mobile menu
  - [ ] Keyboard navigation works
  - [ ] Click-outside-to-close works
  - [ ] Smooth animations present
  - [ ] No z-index issues

### 📑 Table of Contents
- [ ] **Implementation**
  - [ ] `src/ts/modules/toc.ts` created
  - [ ] `initTOC()` function implemented
  - [ ] Heading parsing implemented
  - [ ] Hierarchical structure generation implemented
  - [ ] Smooth scroll navigation implemented
  - [ ] Active section highlighting implemented

- [ ] **UI Components**
  - [ ] TOC container added to post layout
  - [ ] TOC styled appropriately
  - [ ] Hover states implemented
  - [ ] Active section styling implemented
  - [ ] Scroll behavior configured

- [ ] **Testing**
  - [ ] TOC generates correctly for posts with headings
  - [ ] TOC doesn't appear on pages without headings
  - [ ] Clicking TOC items scrolls smoothly
  - [ ] Active section updates on scroll
  - [ ] TOC works on mobile devices
  - [ ] No conflicts with existing navigation

### 🔍 Live Search (Optional)
- [ ] **Implementation**
  - [ ] `src/ts/modules/search.ts` created
  - [ ] `initSearch()` function implemented
  - [ ] Search index creation implemented
  - [ ] Debounced search input implemented
  - [ ] Result filtering implemented
  - [ ] Result highlighting implemented

- [ ] **UI Components**
  - [ ] Search input added to layout
  - [ ] Results container added
  - [ ] Loading states implemented
  - [ ] Empty states implemented
  - [ ] Error states implemented

- [ ] **Testing**
  - [ ] Search input accepts text
  - [ ] Results update in real-time
  - [ ] Results are relevant
  - [ ] Search works with titles and content
  - [ ] Performance acceptable with large content
  - [ ] Keyboard navigation works

### 📤 Social Sharing
- [ ] **Implementation**
  - [ ] `src/ts/modules/share.ts` created
  - [ ] `initShareButtons()` function implemented
  - [ ] Enhanced popup window management implemented
  - [ ] Click tracking added
  - [ ] Accessibility improvements added

- [ ] **Testing**
  - [ ] All share buttons work correctly
  - [ ] Popup windows open properly
  - [ ] URLs are encoded correctly
  - [ ] Keyboard accessibility works
  - [ ] Touch interactions work
  - [ ] No conflicts with existing sharing

### 🔗 Integration & Testing
- [ ] **Main.ts Integration**
  - [ ] All modules imported in main.ts
  - [ ] Initialization order correct
  - [ ] Error handling for module failures
  - [ ] Graceful degradation for missing features

- [ ] **Cross-browser Testing**
  - [ ] Chrome (latest): All features work
  - [ ] Firefox (latest): All features work
  - [ ] Safari (latest): All features work
  - [ ] Edge (latest): All features work
  - [ ] Mobile Chrome: All features work
  - [ ] Mobile Safari: All features work

- [ ] **Performance Testing**
  - [ ] Bundle size < 150KB
  - [ ] Initialization time < 100ms
  - [ ] No memory leaks
  - [ ] Event listeners properly cleaned up

### ✅ Phase 2 Sign-off
- [ ] **All features ported**
  - [ ] Copy code functionality working
  - [ ] Dark mode toggle working
  - [ ] Mobile navigation working
  - [ ] Table of contents working
  - [ ] Live search working (if implemented)
  - [ ] Social sharing enhanced
  - [ ] No `any` types in codebase
  - [ ] Strict TypeScript mode enabled
  - [ ] All existing functionality preserved
  - [ ] Team sign-off obtained

---

## ⚡ Phase 3: Optimization & Cleanup Checklist

### 📦 Bundle Optimization
- [ ] **esbuild Configuration**
  - [ ] Tree-shaking enabled
  - [ ] Dead code elimination enabled
  - [ ] Minification optimized
  - [ ] Source maps optimized for production
  - [ ] Target configuration optimized

- [ ] **Bundle Analysis**
  - [ ] Bundle size measured
  - [ ] Bundle analyzer run (if needed)
  - [ ] Largest dependencies identified
  - [ ] Unused dependencies removed
  - [ ] Bundle size ≤ 150KB achieved

- [ ] **Code Splitting (Optional)**
  - [ ] Search functionality split (if implemented)
  - [ ] Lazy loading implemented (if needed)
  - [ ] Dynamic imports configured
  - [ ] Loading states implemented

### 🚀 Performance Optimization
- [ ] **Loading Optimization**
  - [ ] Script defer attribute used
  - [ ] Critical CSS inlined (if needed)
  - [ ] Resource hints added (preconnect, prefetch)
  - [ ] Image optimization verified

- [ ] **Runtime Optimization**
  - [ ] DOM caching implemented
  - [ ] Event delegation used where appropriate
  - [ ] Debouncing/throttling applied
  - [ ] Memory leaks prevented

- [ ] **Monitoring Setup**
  - [ ] Performance monitoring implemented
  - [ ] Error tracking implemented
  - [ ] User interaction tracking (optional)
  - [ ] Core Web Vitals monitoring

### 🧹 Code Cleanup
- [ ] **Remove Legacy Code**
  - [ ] Old inline scripts removed
  - [ ] Unused jQuery removed (if present)
  - [ ] Old JavaScript files deleted
  - [ ] Old CSS classes cleaned up
  - [ ] Old HTML attributes removed

- [ ] **Enable Full Strict Mode**
  - [ ] `"strict": true` verified
  - [ ] `"noUncheckedIndexedAccess": true` verified
  - [ ] `"noImplicitReturns": true` verified
  - [ ] `"exactOptionalPropertyTypes": true` verified
  - [ ] `"noImplicitOverride": true` verified

- [ ] **Code Quality**
  - [ ] All TypeScript errors resolved
  - [ ] ESLint configured (optional)
  - [ ] Prettier configured (optional)
  - [ ] Code formatted consistently
  - [ ] Comments added where needed

### 🧪 Final Testing
- [ ] **Comprehensive Testing**
  - [ ] All pages load without errors
  - [ ] All features work correctly
  - [ ] Cross-browser compatibility verified
  - [ ] Mobile responsiveness verified
  - [ ] Accessibility verified

- [ ] **Performance Validation**
  - [ ] Lighthouse Performance ≥ 90
  - [ ] Lighthouse Accessibility ≥ 95
  - [ ] Lighthouse Best Practices ≥ 90
  - [ ] Lighthouse SEO ≥ 90
  - [ ] Core Web Vitals met

- [ ] **Bundle Validation**
  - [ ] Bundle size ≤ 150KB gzipped
  - [ ] Source maps available
  - [ ] No console errors
  - [ ] No memory leaks
  - [ ] Fast loading time

### 📚 Documentation & Deployment
- [ ] **Documentation Updates**
  - [ ] README.md updated with TypeScript setup
  - [ ] Development documentation updated
  - [ ] Deployment documentation updated
  - [ ] Troubleshooting guide created
  - [ ] Contributing guidelines updated

- [ ] **Production Deployment**
  - [ ] Final changes merged to main branch
  - [ ] GitHub Actions workflow successful
  - [ ] Production build successful
  - [ ] Site deployed to GitHub Pages
  - [ ] SSL certificate verified

- [ ] **Post-deployment Verification**
  - [ ] Live site loads correctly
  - [ ] All features work on production
  - [ ] Performance metrics met
  - [ ] No broken links (404 errors)
  - [ ] Google Search Console shows no errors
  - [ ] RSS feed accessible
  - [ ] Sitemap accessible

- [ ] **GitHub Pages Checks (Final Testing)**
  - [ ] Build & deployment via **GitHub Actions**
  - [ ] URL Pages hoạt động (root hoặc subpath)
  - [ ] Không 404 asset ở `/project`
  - [ ] Cache-bust hoạt động (mã thời gian thay đổi)
  - [ ] (Nếu có) CNAME hiển thị đúng

### ✅ Phase 3 Sign-off
- [ ] **All optimizations complete**
  - [ ] Bundle size ≤ 150KB
  - [ ] Performance metrics met or exceeded
  - [ ] Full strict mode enabled
  - [ ] Documentation complete and updated
  - [ ] Production deployment successful
  - [ ] Post-deployment monitoring setup
  - [ ] Team sign-off obtained
  - [ ] Stakeholder approval received

---

## 📊 Overall Project Completion

### ✅ Final Acceptance Criteria
- [ ] **Functional Requirements Met**
  - [ ] All existing features work identically
  - [ ] Page load time < 3 seconds on 3G
  - [ ] Mobile navigation smooth on touch devices
  - [ ] Dark mode persists across sessions
  - [ ] Copy code functionality works on all code blocks
  - [ ] TOC highlights current section on scroll
  - [ ] Search returns relevant results quickly

- [ ] **Technical Requirements Met**
  - [ ] No `any` types used
  - [ ] All DOM queries have null checks
  - [ ] Event listeners properly cleaned up
  - [ ] Memory leaks prevented
  - [ ] Console errors eliminated
  - [ ] Accessibility attributes maintained

- [ ] **Performance Requirements Met**
  - [ ] Bundle size ≤ 150KB gzipped
  - [ ] First Contentful Paint < 1.5s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Cumulative Layout Shift < 0.1
  - [ ] Time to Interactive < 3.5s
  - [ ] Lighthouse scores ≥ 90

### 📈 Final Metrics
- [ ] **Performance Metrics**
  - [ ] Bundle size: _______ KB (target ≤ 150KB)
  - [ ] Build time: _______ seconds (target < 30s)
  - [ ] Page load time: _______ seconds (target < 3s)
  - [ ] Lighthouse Performance: _______ (target ≥ 90)
  - [ ] Lighthouse Accessibility: _______ (target ≥ 95)
  - [ ] Lighthouse Best Practices: _______ (target ≥ 90)
  - [ ] Lighthouse SEO: _______ (target ≥ 90)

- [ ] **Code Quality Metrics**
  - [ ] TypeScript coverage: 100%
  - [ ] Strict mode: Fully enabled
  - [ ] Number of `any` types: 0
  - [ ] Code lines: _______
  - [ ] Test coverage: _______ (target 80%+)

### 🎯 Project Success Criteria
- [ ] **Migration Success**
  - [ ] Zero downtime during deployment
  - [ ] All existing functionality preserved
  - [ ] Performance improved or maintained
  - [ ] Developer experience improved
  - [ ] Codebase more maintainable

- [ ] **Team Satisfaction**
  - [ ] Development team satisfied with new toolchain
  - [ ] Documentation comprehensive and useful
  - [ ] Onboarding process for new developers clear
  - [ ] Future maintenance processes established

---

## 🚨 Rollback Criteria

### Immediate Rollback Triggers
- [ ] Site becomes inaccessible
- [ ] Critical functionality broken
- [ ] Performance severely degraded (>50% slower)
- [ ] Security vulnerabilities introduced
- [ ] User complaints spike

### Rollback Process
1. **Switch to `jekyll-js-legacy` branch**
2. **Update GitHub Pages source branch**
3. **Clear CDN cache if applicable**
4. **Verify site functionality**
5. **Communicate with stakeholders**

### Post-Rollback Actions
- [ ] Conduct root cause analysis
- [ ] Document lessons learned
- [ ] Update migration plan
- [ ] Schedule retry with mitigation

---

## 📞 Support Information

### Troubleshooting Resources
- **TypeScript Compilation:** Check `tsconfig.json` settings
- **Build Issues:** Verify esbuild configuration
- **Runtime Errors:** Check browser console
- **Performance Issues:** Use Lighthouse and bundle analyzer
- **Deployment Issues:** Check GitHub Actions logs

### Contact Information
- **Technical Lead:** [Name/Contact]
- **Project Manager:** [Name/Contact]
- **DevOps Support:** [Name/Contact]
- **Emergency Contact:** [Name/Contact]

### Documentation Links
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [esbuild Documentation](https://esbuild.github.io/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Checksheet Last Updated:** TBD
**Migration Start Date:** TBD
**Migration Completion Date:** TBD
**Total Duration:** _______ hours
**Final Status:** ____________________