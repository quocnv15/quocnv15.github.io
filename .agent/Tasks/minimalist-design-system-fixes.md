# Minimalist Design System — Fix Log (2026-07-18)

## Status
✅ Fixed locally (pending commit/ship)

## Root causes fixed

1. **Archive styles nested in ultra-wide media query**  
   `/* ARCHIVE PAGE */` was appended inside `@media (min-width: 2560px)` in `css/override.css`, so most archive styles only applied on ≥2560px viewports.

2. **Missing design tokens**  
   `--color-primary-dark` / `--color-secondary-dark` were referenced in override + buttons but not defined after the slate token rewrite.

3. **Featured cards still “heavy”**  
   `.featured-card` used solid primary fill + aggressive hover — not Minimalist Clean.

4. **Projects / Tools inline style debt**  
   Large `<style>` blocks with `#3498db` gradients lived in `projects.md` / `tools.md`.

5. **Hardcoded hex leftovers** in `portfolio-hub.css` / `override.css`.

## Changes

| File | Change |
|------|--------|
| `css/variables.css` | Added `primary-dark`, `secondary-dark`, `accent-hover`, `on-primary` (+ dark maps) |
| `css/override.css` | Closed 2560 media before archive; global archive; light featured cards; token hex cleanup |
| `css/portfolio-hub.css` | `#fff` / `#ccc` → tokens |
| `css/components/projects-tools.css` | **New** token-based Projects/Tools styles |
| `css/components/lifetime-calculator.css` | **New** Life Time Calculator styles |
| `css/components/swiftui-page.css` | **New** SwiftUI showcase styles (flat hero) |
| `_includes/head.html` | Load page CSS modules |
| `projects.md` / `tools.md` / `swiftui.md` / `_tools/life-time-calculator.md` | Removed inline `<style>`; chrome emoji cleaned |
| `scripts/check-design-system.js` | Prevention gate |
| `package.json` | `npm run check:design` |

## Verification

```bash
npm run check:design
```

Expect:
- ARCHIVE PAGE at depth 0
- No hex/gradient outside `variables.css`
- No `<style>` in archive/projects/tools

## Out of scope (intentional)

- Nav reduction to 5 links (v2 plan keeps IA)
- `ios-memory/dashboard.html` restyle
- `src/css/theme.css` (not loaded by production head)

## Ship checklist

- [ ] `npm run check:design`
- [ ] Local visual: `/`, `/work/`, `/cases/`, `/archive.html`, `/projects/`, `/tools/`
- [ ] Commit + push → GitHub Pages
