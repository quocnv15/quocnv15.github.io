# GitHub Pages Site Restructure Proposal

> **Goal:** Integrate iOS Memory Hub Dashboard into existing Jekyll blog  
> **Current URL:** quocnv15.github.io  
> **Target:** Transform into portfolio showcase site with dashboard

---

## Current State Analysis

### Existing Site Structure
```
quocnv15.github.io/
├── _posts/           → Blog posts (ai-agents, iOS, ai-workflow, etc.)
├── _projects/        → Projects collection
├── _notes/           → Notes collection  
├── _tools/           → Tools collection
├── _layouts/         → Jekyll layouts
├── _includes/        → Reusable components
├── index.md          → Home page with category navigation
├── about.md          → About page
└── archive.md        → Archive page
```

**Current Theme:** Minima (minimal Jekyll theme)  
**Content Type:** Technical blog with portfolio elements

### iOS Memory Hub Dashboard (Ready to Deploy)

**Location:** `/Users/djv033/work-quocnv15/ios-memory/site/index.html`
- Pro Max UI design with dark theme
- Portfolio tracking dashboard
- 5 apps overview with metrics
- Quality gaps tracker
- Quick navigation

---

## Proposed Structure

### Option A: Dashboard as Homepage (Recommended)

```
quocnv15.github.io/
├── index.md → Redirect to /dashboard (NEW homepage)
├── dashboard.md → iOS Memory Hub Dashboard (NEW)
├── blog/ → Blog posts archive (moved from _posts/)
├── portfolio/ → Portfolio showcase (NEW)
│   ├── apps.md → App portfolio overview
│   ├── case-studies.md → 18 case studies
│   └── playbooks.md → Category playbooks
├── projects/ → Existing projects collection
├── about.md → About page (update with new metrics)
└── [Existing _posts/, _layouts/, etc.]
```

### Option B: Dashboard as Separate Page

```
quocnv15.github.io/
├── index.md → Keep current (blog roll)
├── ios-memory/ → iOS Memory Hub (NEW page)
│   ├── dashboard.md → Main dashboard
│   ├── apps.md → App overview
│   ├── case-studies.md → 18 case studies
│   ├── playbooks.md → Category playbooks
│   └── site/ → Dashboard HTML
├── _posts/ → Blog posts (unchanged)
├── _projects/ → Projects (unchanged)
└── [Rest unchanged]
```

### Option C: Full Portfolio Site Restructure

```
quocnv15.github.io/
├── index.md → Portfolio homepage (NEW)
├── dashboard/ → iOS Memory Hub dashboard
│   └── index.html → Visual dashboard
├── apps/ → App portfolio showcase
│   ├── 006-silly-smile.md
│   ├── 009-emoji-merge.md
│   ├── 010-gps-camera.md
│   └── ...
├── insights/ → Blog posts (renamed from _posts)
├── showcase/ → Case studies & playbooks
├── projects/ → Technical projects
├── about.md → About (update with new metrics)
└── [CV/, assets/, etc.]
```

---

## Recommended Implementation (Option A)

### Phase 1: Dashboard Integration (Week 1)

**1. Create dashboard page**
```bash
# Create dashboard.md in Jekyll
cat > quocnv15.github.io/dashboard.md << 'EOF'
---
layout: page
title: iOS Memory Hub Dashboard
permalink: /dashboard/
---

<iframe 
  src="/ios-memory/dashboard/index.html" 
  width="100%" 
  height="2000px"
  style="border: none;"
  onload="this.style.height=this.contentDocument.body.scrollHeight + 'px';">
</iframe>
EOF
```

**2. Add dashboard link to navigation**
- Update `_includes/header-nav.html`
- Add "Dashboard" link in header

**3. Copy dashboard files**
```bash
# Copy dashboard to site
cp -r /Users/djv033/work-quocnv15/ios-memory/site \
   /Users/djv033/work-quocnv15/quocnv15.github.io/ios-memory
```

### Phase 2: Portfolio Pages (Week 2)

**1. Create portfolio pages**
```markdown
---
layout: page
title: App Portfolio
permalink: /portfolio/
---

## iOS App Portfolio

5 apps live, targeting 50...

[Include content from PORTFOLIO-OVERVIEW.md]
```

**2. Create case studies page**
```markdown
---
layout: page
title: Case Studies
permalink: /showcase/case-studies/
---

18 case studies demonstrating...
```

### Phase 3: Navigation Update (Week 3)

**Update header nav:**
- Home → Dashboard
- Add: Portfolio → Apps, Case Studies, Playbooks
- Keep: About, Archive

### Phase 4: Content Migration (Week 4)

**Migrate key content from ios-memory:**
1. Create app detail pages (one per app)
2. Migrate case studies as blog posts
3. Create playbook pages
4. Add metrics auto-update

---

## File Structure After Implementation

```
quocnv15.github.io/
├── index.md → Dashboard redirect
├── dashboard/
│   └── index.html → Visual dashboard (copied from ios-kit)
├── ios-memory/ (NEW)
│   ├── dashboard.md → Jekyll wrapper
│   ├── apps.md → Portfolio overview
│   ├── case-studies.md → 18 case studies
│   └── playbooks.md → Category playbooks
├── portfolio/ (NEW)
│   ├── apps/
│   │   ├── 006-silly-smile.md
│   │   ├── 009-emoji-merge.md
│   │   └── 010-gps-camera.md
│   └── showcase/
│       └── case-studies/
├── _posts/ → Blog posts (unchanged)
├── _projects/ → Projects (unchanged)
├── _includes/
│   ├── header-nav.html → UPDATE: add dashboard link
│   └── [other includes unchanged]
├── about.md → UPDATE: add portfolio metrics
└── [Rest unchanged]
```

---

## Implementation Scripts

### Script 1: Copy Dashboard

```bash
#!/bin/bash
# copy-dashboard.sh

IOS_KIT="/Users/djv033/work-quocnv15/ios-kit"
GITHUB_IO="/Users/djv033/work-quocnv15/quocnv15.github.io"

# Create ios-memory directory
mkdir -p "$GITHUB_IO/ios-memory"

# Copy dashboard HTML
cp "$IOS_KIT/ios-memory/site/index.html" \
   "$GITHUB_IO/ios-memory/dashboard.html"

echo "✅ Dashboard copied to $GITHUB_IO/ios-memory/dashboard.html"
```

### Script 2: Update Navigation

```bash
#!/bin/bash
# update-nav.sh

GITHUB_IO="/Users/djv033/work-quocnv15/quocnv15.github.io"

# Backup original
cp "$GITHUB_IO/_includes/header-nav.html" \
   "$GITHUB_IO/_includes/header-nav.html.backup"

# Add dashboard link (manual step - update the file)
echo "⚠️  Manually add this to $GITHUB_IO/_includes/header-nav.html:"
echo '<a href="/ios-memory/dashboard/" class="page-link">Dashboard</a>'
```

---

## Deployment Workflow

### Current Setup
```bash
cd /Users/djv033/work-quocnv15/quocnv15.github.io
git add .
git commit -m "add ios memory dashboard"
git push
```

### After Integration
```bash
# Auto-deploys to GitHub Pages
# Available at: https://quocnv15.github.io/dashboard/
```

---

## Navigation Structure

### Header Navigation
```
[Home] [Dashboard] [Portfolio ▾] [About] [Archive]
            ├─ Apps
            ├─ Case Studies  
            └─ Playbooks
```

### Dashboard Page
- **Hero Section:** Portfolio snapshot (5 apps, 1.24x ROI)
- **Stats Cards:** Key metrics at glance
- **Apps Grid:** Interactive cards with metrics
- **Quick Nav:** Links to key documents
- **Quality Gaps:** Visual tracker

### Portfolio Pages
- **Apps Overview:** All 5 apps with metrics
- **Case Studies:** 18 case studies with filters
- **Playbooks:** Category-specific playbooks
- **Pattern Detection:** Scale to 50 apps framework

---

## Benefits

### 1. Single Source of Truth
- Dashboard embedded in main site
- No separate deployment needed
- All content in one repository

### 2. SEO Benefits
- Single domain for all content
- Better for personal branding
- Easier to share

### 3. Navigation Clarity
- Clear section for portfolio
- Easy to find for visitors
- Logical flow from blog → dashboard → portfolio

### 4. Maintenance Simplicity
- One repo to update
- Git-based deployment
- No separate hosting needed

---

## Migration Priority

| Phase | Tasks | Impact | Effort |
|-------|-------|--------|--------|
| **1** | Copy dashboard HTML | High | Low |
| **1** | Create dashboard.md wrapper | High | Low |
| **1** | Update header navigation | High | Low |
| **2** | Create portfolio pages | High | Medium |
| **2** | Migrate case studies | Medium | Medium |
| **3** | Create app detail pages | Medium | High |
| **4** | Auto-update metrics | High | High |

---

## Next Actions

### Immediate (Today)

1. **Run copy script**
   ```bash
   bash scripts/copy-dashboard.sh
   ```

2. **Create dashboard.md**
   ```bash
   # Copy and paste dashboard.md template above
   ```

3. **Update header-nav.html**
   - Add Dashboard link manually
   - Test navigation

### This Week

1. Create portfolio overview page
2. Add iOS Memory link to footer
3. Test dashboard on different devices

### Next Week

1. Migrate top 5 case studies
2. Create app detail pages
3. Update about.md with portfolio metrics

---

**URL after deployment:** https://quocnv15.github.io/dashboard/  
**Maintenance:** Weekly updates to dashboard HTML  
**Content source:** ios-kit/ios-memory/ (truth source)
