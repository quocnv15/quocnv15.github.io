---
layout: page
title: Work
permalink: /work/
---

<link href="{{ '/css/portfolio-hub.css' | relative_url }}" rel="stylesheet">

<section class="portfolio-hero">
  <p class="portfolio-hero__eyebrow">REVIEW HUB</p>
  <h1 class="portfolio-hero__title">Work — operator view</h1>
  <p class="portfolio-hero__subtitle">
    Personal review surface. Open this page to know <strong>what matters this week</strong>
    and jump into deeper ops.
  </p>
  <p class="portfolio-hero__stats">
    <span>As of 2026-07-17</span>
    <span>Indie iOS · Agent OS</span>
  </p>
</section>

## Now

1. **Ship / learn** — keep live apps in a disciplined spend band; watch ROAS vs June efficiency baseline.  
2. **Systems** — harness + quality gates over feature thrash.  
3. **Public proof** — keep case studies honest and current on [/cases/](/cases/).

> Deep private dailies stay in `ios-memory` (not published). This page is public-safe only.

## Portfolio snapshot

Curated from portfolio overview (see raw metrics on [dashboard](/ios-memory/dashboard.html) / `_overview`).

| Focus | Status | Note |
|-------|--------|------|
| Utility camera / GPS lane | Scale carefully | Star category historically |
| Wallpaper / emoji lanes | Optimize | Efficiency over spend |
| Pipeline / harness | Active | Agent OS + CI discipline |

**Full metrics dump:** [Portfolio overview (synced)](/portfolio/_overview.md) · [Live dashboard](/ios-memory/dashboard.html)

## Operator links

| Surface | Use when |
|---------|----------|
| [Dashboard](/ios-memory/dashboard.html) | Visual portfolio / memory board |
| [Memory summary](/memory/) | 5–10 min reading order |
| [Quality gaps (memory)](/memory/quality-gaps/) | Open product/tech debt themes |
| [Cases show-off](/cases/) | Public stories worth sharing |
| [Portfolio hub](/portfolio/) | Catalog + playbooks |
| [Writing](/archive.html) | Blog archive |

## Weekly review ritual (2 minutes)

1. Open **this page** → skim *Now*.  
2. Open **Dashboard** → check spend/ROI band.  
3. Open **Cases** → if a story improved, note for next sync.  
4. Private deep work stays in `ios-memory` dailies / plans.

## Sync

Public content is refreshed via:

```bash
# from quocnv15.github.io
./scripts/sync-content.sh
```

Allowlist only: dashboard HTML, case studies, portfolio overview.  
**Never** synced: mentors full corpus, SOUL, dailies, beads.
