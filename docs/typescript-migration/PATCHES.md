# Patches for GitHub Pages Deployment Updates

## Patch 1: README.md updates

```diff
--- a/docs/typescript-migration/README.md
+++ b/docs/typescript-migration/README.md
@@ -69,8 +69,8 @@

 assets/js/                 # Output bundle for Jekyll
-├── main.min.js            # Main bundle with sourcemap
-└── main.min.js.map        # Source map file
+├── main.js                # Main bundle with sourcemap
+└── main.js.map            # Source map file

 docs/typescript-migration/ # Documentation
 ├── README.md              # This file
@@ -105,6 +105,7 @@
 **Deliverables:**
 - Working TypeScript compilation
- Basic bundle generation (`assets/js/main.min.js`)
+ Basic bundle generation (`assets/js/main.js`)
 - Site still functions with existing features
 - CI/CD pipeline updated
+- Layout updated with subpath-safe script tag + cache-busting

 ### Phase 2: Port Features (0.5-1 day)
@@ -217,6 +218,48 @@
 3. **Review technical requirements** in `technical-requirements.md`
 4. **Use the checklist** in `checklist.md` to track progress

 ---

+## 🌐 GitHub Pages Deployment Notes
+
+### Build & Deployment
+- **Build method:** GitHub Actions (not default Pages build)
+- **TypeScript compilation:** Run in Actions, not supported natively by Pages
+- **Jekyll build:** Standard Jekyll process in Actions
+- **Deployment:** Automatic on push to main branch
+
+### Subpath-Safe Assets
+- **All asset references** must use `{{ '/path/to/asset' | relative_url }}`
+- **JavaScript bundle:** `{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}`
+- **CSS files:** `{{ '/css/style.css' | relative_url }}?v={{ site.time | date: '%s' }}`
+- **Images:** `{{ '/images/logo.png' | relative_url }}`
+
+### Cache-Busting Strategy
+```html
+<!-- In Jekyll layouts -->
+<script type="module" defer
+  src="{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}">
+</script>
+```
+
+### CI Layout
+Two separate workflows recommended:
+
+1. **ci.yml** (Runs on every push/PR):
+   - `npm ci` → `npm run check:types` → `npm run build:ts`
+   - No deployment, only validation
+
+2. **pages.yml** (Runs on main branch):
+   - Full TypeScript build → Jekyll build → Deploy to Pages
+   - Optional preview deploy for Pull Requests
+
+### Known Limitations on GitHub Pages
+- **No Git LFS support** for static assets
+- **CSP restrictions** - only `<meta http-equiv>` CSP headers supported
+- **Build timeout:** 10 minutes for GitHub Actions
+- **Storage:** 1GB limit for repository
+
+### Preview Deployments (Optional)
+For Pull Request previews:
+```yaml
+# .github/workflows/pages.yml (partial)
+- name: Upload preview artifact
+  uses: actions/upload-pages-artifact@v3
+  if: github.event_name == 'pull_request'
+```
+
 ---

 ## 📞 Support
```

## Patch 2: checklist.md updates

```diff
--- a/docs/typescript-migration/checklist.md
+++ b/docs/typescript-migration/checklist.md
@@ -96,8 +96,8 @@

 - [ ] **Test Build Pipeline**
   - [ ] `node build.js` executes successfully
-  - [ ] `assets/js/main.min.js` created
-  - [ ] `assets/js/main.min.js.map` created
+  - [ ] `assets/js/main.js` created
+  - [ ] `assets/js/main.js.map` created
   - [ ] Bundle size < 200KB (initial)
   - [ ] No build errors or warnings

@@ -118,7 +118,12 @@
 ### 🔗 Jekyll Integration
 - [ ] **Update Jekyll Layouts**
   - [ ] `_layouts/default.html` updated
-  - [ ] Script tag added: `<script src="/assets/js/main.min.js" defer></script>`
+  - [ ] Script tag added: `<script type="module" defer src="{{ '/assets/js/main.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>`
+  - [ ] All asset (JS/CSS/IMG) use `| relative_url`
+  - [ ] Site tested in subpath (Project Pages)
+  - [ ] (Custom domain) CNAME confirmed after deploy
+  - [ ] No Git LFS used for static assets
   - [ ] Old script tags identified (keep for now)
   - [ ] Script placement verified (before </body>)

@@ -139,6 +144,11 @@
   - [ ] `"build": "npm run build:ts && npm run check:types"` added
   - [ ] `"dev": "npm run build:ts --watch"` added

+- [ ] **Create CI Workflow**
+  - [ ] `ci.yml` workflow created for push/PR validation
+  - [ ] Job `check:types` runs before build
+  - [ ] TypeScript compilation checked on every push
+  - [ ] Build artifacts generated (no deployment)
+
 - [ ] **Test GitHub Actions**
   - [ ] Push changes to feature branch
   - [ ] GitHub Actions workflow starts
   - [ ] TypeScript compilation succeeds
   - [ ] Jekyll build succeeds
   - [ ] Deployment successful (pages.yml)
+  - [ ] (Optional) Preview deploy for PR created
   - [ ] Site loads correctly from deployed version

 ### ✅ Phase 1 Sign-off
@@ -473,6 +483,11 @@
 - [ ] RSS feed accessible
 - [ ] Sitemap accessible

+- [ ] **GitHub Pages Checks (Final Testing)**
+  - [ ] Build & deployment via **GitHub Actions**
+  - [ ] URL Pages hoạt động (root hoặc subpath)
+  - [ ] Không 404 asset ở `/project`
+  - [ ] Cache-bust hoạt động (mã thời gian thay đổi)
+  - [ ] (Nếu có) CNAME hiển thị đúng
+
 ### ✅ Phase 3 Sign-off
 - [ ] **All optimizations complete**
   - [ ] Bundle size ≤ 150KB
```

---

## REPRO_CMDS

```bash
# Install dependencies
npm ci

# Type checking
npm run check:types

# Build TypeScript bundle
npm run build:ts

# Build Jekyll site
bundle exec jekyll build

# Deploy to GitHub Pages (push to main branch)
git add .
git commit -m "feat: Add TypeScript toolchain with GitHub Actions deployment"
git push origin main
```

## Summary of Changes

### README.md:
1. ✅ Updated bundle filename from `main.min.js` → `main.js`
2. ✅ Added GitHub Pages Deployment Notes section
3. ✅ Added subpath-safe asset guidance
4. ✅ Added cache-busting strategy with Liquid templates
5. ✅ Added CI layout with separate workflows
6. ✅ Added known limitations and preview deployment guidance

### checklist.md:
1. ✅ Updated all references to `main.min.js` → `main.js`
2. ✅ Updated Jekyll integration with subpath-safe script tag
3. ✅ Added GitHub Pages specific checklist items
4. ✅ Added CI workflow creation tasks
5. ✅ Added final GitHub Pages verification checks

All changes maintain the original TypeScript migration goals while ensuring compatibility with GitHub Pages deployment and subpath-safe asset handling.