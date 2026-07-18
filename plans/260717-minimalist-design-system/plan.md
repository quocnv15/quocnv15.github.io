# Refactor quocnv15.github.io → Minimalist Clean Design System (v2)

> **Repo:** `/Volumes/Workspace/0-Working/bkplus/quocnv15.github.io`  
> **Live:** https://quocnv15.github.io  
> **Updated:** 2026-07-17 (v2 — after design-plan review)  
> **Depends on:** Work/Cases IA v1 already shipped (`/work/`, `/cases/`, home CTAs)  
> **Do not change:** permalinks `/work/`, `/cases/`, case-study URLs, content IA

---

## Goal

Đưa site về aesthetic **Minimalist Clean** (slate monochrome chrome + subtle motion), loại gradient nặng / shadow thô / hardcode hex rải rác — **không** đụng lại product IA vừa ship.

### Design language

| Token | Role | Value (light) |
|-------|------|----------------|
| `--color-text` | Headings / body | `#0f172a` (Slate 900) |
| `--color-text-muted` | Secondary | `#64748b` (Slate 500) |
| `--color-border` | Dividers / cards | `#e2e8f0` (Slate 200) |
| `--color-bg` | Page | `#ffffff` |
| `--color-bg-alt` | Alt sections | `#f8fafc` (Slate 50) |
| `--color-primary` / chrome | Nav, UI chrome | `#0f172a` or Slate 800 |
| `--color-accent` | **Links / focus / primary action only** | `#2563eb` (single action accent — not pure mono) |
| `--color-success` / `warning` / `error` | Semantic status | **Keep distinct hues** (do not flatten) |
| Shadows | Micro only | `0 1px 2px rgba(0,0,0,.03)` … soft scale |

**Rules:**

1. Flat surfaces + `1px solid var(--color-border)`; no purple/indigo hero gradients.  
2. One action accent for affordance; chrome stays slate.  
3. Semantic status colors never become slate.  
4. Dark mode: remap tokens under `[data-theme="dark"]` / existing dark block — **no new hardcode hex** in components.

---

## User Review Required

- [x] Aesthetic shift: colorful/gradient → Minimalist Clean slate  
- [ ] **Accent policy:** keep one blue action accent (recommended) vs pure monochrome  
- [ ] **Dark mode:** keep dual theme (recommended) vs light-only v1  
- [ ] **Dashboard HTML** (`ios-memory/dashboard.html`): out of scope v1 (recommended) vs include as phase 2b  

Default if no reply: **accent blue + keep dark mode + dashboard out of scope.**

---

## Current baseline (facts)

| File | Approx surface |
|------|----------------|
| `css/variables.css` | ~56 lines — tokens still blue/purple (`#2563eb`, `#764ba2`) |
| `css/override.css` | ~4020 lines — **~266** hex/gradient hits; dark block exists |
| `css/portfolio-hub.css` | ~696 lines — hero gradients; **powers Work/Cases/Showcase** |
| `archive.md` | large inline `<style>` (~line 160+) |
| `index.md` | inline CTA styles on hero links |

Local `bundle exec jekyll build` may fail on Mini (Ruby/bundler). Prefer **GitHub Pages** + visual checklist.

---

## Scope

### Must cover (v1)

| Priority | Path | Why |
|----------|------|-----|
| P0 | `css/variables.css` | Light + dark tokens |
| P1 | `css/portfolio-hub.css` | Work / Cases / Showcase must match shell |
| P2 | `css/override.css` (shell: header, sidebar, tags, posts) | Main chrome |
| P3 | `archive.md` | Extract inline styles → CSS |
| P4 | `index.md` | Replace inline CTA styles with classes |
| P5 | Grep sweep leftovers in `css/` | No surprise hex |

### Optional / later

- `css/components/*`, `src/css/*` if still hardcoding after P5  
- `ios-memory/dashboard.html` visual restyle (synced blob — treat carefully)  
- `_includes/header-nav.html` only if structure must change (prefer CSS-only)

### Out of scope

- Content/IA: `/work/`, `/cases/` copy, case study markdown  
- `mentor-agent`, private ios-memory  
- Stack rewrite (Next/Astro)  
- Changing permalinks  

---

## Phases

### Phase 0 — Baseline (30–60 min)

- [x] Screenshot (or note) 6 URLs: `/`, `/work/`, `/cases/`, `/archive.html`, `/portfolio/showcase/`, mobile nav
- [x] Record `rg` count of hex/gradient under `css/` (override: 207 hex/14 grad → 0/0)
- [x] Confirm dark-mode toggle still present

**Done when:** baseline noted in PR description.

### Phase 1 — Tokens only

#### [MODIFY] `css/variables.css`

- Set light slate palette + **one** `--color-accent` (action).  
- Soft shadows (`--shadow-sm/md/lg`).  
- Dark map: either second block in `variables.css` or document that dark overrides live only via token remap in override.  
- Keep `--color-success|warning|error`.  
- Optional: `--letter-spacing-tight`, font scale unchanged unless broken.

**Done when:** site still usable; only variables changed (visual may partially shift where vars already used).

### Phase 2 — Product surfaces (critical)

#### [MODIFY] `css/portfolio-hub.css`

- Remove hero/card **gradients**; flat bg + border.  
- Cards: white/slate-50, thin border, subtle hover (border or shadow-sm only).  
- Badges: muted slate, not neon.  
- Preserve layout grid / spacing for Work & Cases.

**Done when:** `/work/` and `/cases/` look minimal and consistent with tokens.

### Phase 3 — Shell & navigation

#### [MODIFY] `css/override.css` (targeted sections first)

- Header/nav: flat bg, no gradient bar; active link = accent underline or weight.  
- Sidebar (home categories): flat, thin borders, clean hover.  
- Tags cloud: light gray + border; hover = border-accent or text-accent.  
- Replace hardcoded `#3498db`, `#764ba2`, `#2c3e50`, etc. with `var(...)`.  
- Dark block: only reassign variables / use vars — delete duplicate gradient heroes.

**Done when:** header + home sidebar match minimal language.

### Phase 4 — Archive extract

#### [MODIFY] `archive.md`

- Delete entire inline `<style>` block.  

#### [MODIFY] `css/override.css` (or `css/components/archive.css` if preferred)

- Port archive filters/lists using variables.  
- Flat category dropdown + lists.

**Done when:** `/archive.html` styled only from CSS files.

### Phase 5 — Home CTA cleanup

#### [MODIFY] `index.md`

- Remove inline `style="padding:…"` on hero CTAs.  
- Add classes, e.g. `hero-cta`, `hero-cta-row` defined in `portfolio-hub.css` or `override.css`.  
- Keep three CTAs: Work · Cases · Writing (do not remove IA).

**Done when:** home hero has zero inline color/spacing hacks.

### Phase 6 — Sweep + ship

- [x] `rg '#[0-9a-fA-F]{3,8}|linear-gradient' css/` — exceptions only in `variables.css`  
- [x] Archive extract un-nested (was wrongly inside `@media 2560px`)  
- [x] Projects/Tools inline styles extracted → `css/components/projects-tools.css`  
- [x] Prevention: `npm run check:design`  
- [ ] Push; verify GitHub Pages  
- [ ] Visual checklist (below)  
- [ ] Rollback plan: revert phase commits independently if needed  

---

## File-level checklist

| File | Action |
|------|--------|
| `css/variables.css` | Redefine light + dark-related tokens |
| `css/portfolio-hub.css` | Degraident + card/hero minimal |
| `css/override.css` | Shell, tags, sidebar, dark cleanup |
| `archive.md` | Remove inline styles |
| `index.md` | Class-based CTAs only |
| `css/components/*` | Touch only if grep still dirty |
| `work.md` / `cases.md` | **No content rewrite** unless class hooks needed |

---

## Verification plan

### Automated / mechanical

```bash
cd /Volumes/Workspace/0-Working/bkplus/quocnv15.github.io

# TypeScript (if package scripts exist)
npm run check:types || npm run build  # non-blocking if env issues

# Hardcode gate (expect near-zero outside allowed list)
rg '#[0-9a-fA-F]{3,8}|linear-gradient' css/ || true

# Local Jekyll — optional; may fail on Mini Ruby
bundle exec jekyll build || echo "SKIP local jekyll — use GitHub Pages"
```

**Allowed hex exceptions (document in PR):**  
`--color-success`, `--color-warning`, `--color-error` only (and accent if defined as hex once in variables).

### Manual visual matrix (required)

| URL | Check |
|-----|--------|
| `/` | Hero CTAs readable; no rainbow bar; nav clean |
| `/work/` | Cards/sections flat; hierarchy clear |
| `/cases/` | Featured grid minimal; badges muted |
| `/archive.html` | Filters + lists; no broken layout after style extract |
| `/portfolio/showcase/` | Cards consistent with Cases |
| Mobile nav | Toggle works; no overflow |
| Dark mode | Toggle; no unreadable contrast |

### Ship

- Commit message convention: `style: minimalist slate design system (phase N)`  
- Prefer **one PR per phase** (1–2) or stacked commits; avoid single 4k-line dump if possible  
- Confirm live: https://quocnv15.github.io/work/ and /cases/

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Big-bang override regression | Phase 1–2 first; ship product surfaces before full override sweep |
| Work/Cases look “old” after shell-only change | Phase 2 **before** deep override polish |
| Pure mono kills link affordance | Keep single `--color-accent` |
| Local jekyll broken | Rely on Pages CI + visual matrix |
| Dashboard still colorful | Explicit out of scope; note in README if jarring |
| Dark mode contrast fail | Check both themes each phase |

---

## Success criteria

- [x] Tokens are SOT for chrome colors (slate + one accent + semantic)
- [x] No heavy multi-stop gradients on header/heroes/tags
- [x] `/work/` and `/cases/` match shell aesthetic
- [x] `archive.md` has **zero** inline `<style>`
- [x] Home CTAs class-based, IA preserved
- [x] Grep hex/gradient in `css/` is clean except documented exceptions
- [ ] Live Pages: Work + Cases + Home pass visual matrix (pending deploy)

---

## Estimate

| Phase | Effort |
|-------|--------|
| 0 Baseline | 0.5h |
| 1 Tokens | 0.5–1h |
| 2 portfolio-hub | 1–2h |
| 3 override shell | 2–4h |
| 4 archive extract | 1h |
| 5 index CTAs | 0.5h |
| 6 sweep + ship | 0.5–1h |
| **Total** | **~1–2 focused days** |

---

## Rollback

- Prefer atomic commits per phase.  
- Emergency: `git revert` phase 2–3 commits; tokens-only (phase 1) is usually safe to keep.

---

## Status

| Item | Value |
|------|--------|
| Plan version | **v2** (review-improved) |
| Implementation | **Complete** (all 6 phases) |
| Blocked on | — |

---

## Changelog vs v1 plan

1. Expanded scope: **`portfolio-hub.css` mandatory** (Work/Cases).  
2. Added **accent + semantic color policy** (not pure mono).  
3. Added **dark mode token strategy**.  
4. Replaced big-bang with **phased delivery + rollback**.  
5. Verification: Pages-first + **visual matrix** + grep gate.  
6. Explicit dependency: **do not break Work/Cases IA**.  
7. Dashboard HTML scoped out of v1.  
8. Re-opened intentional product questions with defaults.  
