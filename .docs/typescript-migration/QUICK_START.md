# 🚀 Quick Start Guide

**Migration:** Jekyll JavaScript → TypeScript
**Timeline:** 1-2 days
**Difficulty:** Low-Medium

---

## ⚡ 5-Minute Setup

### 1. Backup & Initialize
```bash
# Create backup branch
git checkout -b jekyll-js-legacy
git push origin jekyll-js-legacy

# Return to main branch
git checkout main

# Initialize npm project
npm init -y
```

### 2. Install Dependencies
```bash
npm install --save-dev typescript esbuild
```

### 3. Create Basic Structure
```bash
mkdir -p src/ts/modules/utils src/ts/interfaces
```

### 4. Setup Configuration Files
```bash
# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "module": "esnext",
    "target": "es2019",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "assets"]
}
EOF

# Create build.js
cat > build.js << 'EOF'
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/ts/main.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: 'es2019',
  format: 'esm',
  outdir: 'assets/js'
}).catch(() => process.exit(1));
EOF
```

### 5. Create Entry Point
```bash
# Create src/ts/main.ts
cat > src/ts/main.ts << 'EOF'
console.log('✅ Jekyll TypeScript frontend loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 DOM ready - TypeScript initialized');
  document.body.classList.add('js-enabled');
});
EOF
```

### 6. Update Jekyll Layout
```html
<!-- Add to _layouts/default.html before </body> -->
<script src="/assets/js/main.min.js" defer></script>
```

### 7. Test Setup
```bash
# Build TypeScript
node build.js

# Test locally
bundle exec jekyll serve --livereload
```

Visit `http://localhost:4000` and check browser console for success messages.

---

## 🎯 Migration Roadmap

### Phase 1: TypeScript Bootstrap ✅ (Done above)
- [x] npm project initialized
- [x] TypeScript configuration created
- [x] Basic bundle working
- [x] Jekyll integration tested

### Phase 2: Feature Porting (4-6 hours)
1. **Copy Code Button** (1 hour)
2. **Dark Mode Toggle** (1 hour)
3. **Mobile Navigation** (1 hour)
4. **Table of Contents** (1.5 hours)
5. **Live Search** (2 hours, optional)

### Phase 3: Optimization & Cleanup (2-3 hours)
1. Bundle size optimization
2. Performance testing
3. Remove legacy code
4. Final deployment

---

## 📋 Essential Commands

```bash
# Development
npm run dev              # Build with watch mode
npm run check:types      # Type checking only
npm run build           # Full build with type check

# Testing
bundle exec jekyll serve --livereload
npm run size-check      # Check bundle size

# Deployment
npm run build && bundle exec jekyll build
git push origin main    # Triggers GitHub Actions
```

---

## 🚨 Quick Troubleshooting

### TypeScript Won't Compile
```bash
# Check configuration
npx tsc --noEmit --listFiles

# Common fix: Ensure src/ directory exists
mkdir -p src/ts/modules/utils
```

### Bundle Not Loading
```bash
# Check if file exists
ls -la assets/js/main.min.js

# Verify Jekyll includes it
grep "main.min.js" _layouts/default.html
```

### Build Pipeline Fails
```bash
# Check GitHub Actions
# Go to: https://github.com/quocnv15/quocnv15.github.io/actions

# Test locally
npm run build && bundle exec jekyll build
```

---

## 📊 Progress Tracker

Copy this checklist to track your progress:

```markdown
## Migration Progress

### Phase 1: Setup ✅
- [x] npm project initialized
- [x] Dependencies installed
- [x] TypeScript configured
- [x] Basic bundle created
- [x] Jekyll integration working

### Phase 2: Features (0/5 complete)
- [ ] Copy code button
- [ ] Dark mode toggle
- [ ] Mobile navigation
- [ ] Table of contents
- [ ] Live search (optional)

### Phase 3: Optimization (0/4 complete)
- [ ] Bundle size ≤ 150KB
- [ ] Performance testing
- [ ] Legacy code removal
- [ ] Production deployment

**Current Status:** 20% Complete
**ETA:** 1-2 days remaining
```

---

## 🎯 Success Metrics

Your migration is successful when:

- ✅ Bundle size ≤ 150KB
- ✅ All features work identically to before
- ✅ Site loads without JavaScript errors
- ✅ Mobile navigation works smoothly
- ✅ Dark mode persists across sessions
- ✅ Lighthouse score ≥ 90

---

## 📞 Need Help?

1. **Check the full documentation:** `docs/typescript-migration/`
2. **Review technical requirements:** `technical-requirements.md`
3. **Follow the detailed timeline:** `timeline.md`
4. **Use the complete checklist:** `checklist.md`

---

**Ready to start?** Begin with Phase 2 by implementing the copy code button feature!

**Expected Timeline:**
- **Today:** Complete Phase 1 + start Phase 2
- **Tomorrow:** Finish Phase 2 + Phase 3
- **Day 3:** Testing and deployment

Good luck! 🚀