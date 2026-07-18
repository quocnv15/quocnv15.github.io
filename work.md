---
layout: page
title: Work
permalink: /work/
full_bleed: true
hide_title: true
---

<link href="{{ '/css/portfolio-hub.css' | relative_url }}?v=work2" rel="stylesheet">

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

<div class="hub-section work-hub">

  <h2 class="hub-section__title">Now</h2>
  <p class="work-lead">Focus this week — ship, systems, public proof.</p>

  <div class="portfolio-grid">
    <div class="portfolio-card work-priority">
      <span class="portfolio-card__badge">01</span>
      <h3 class="portfolio-card__title">Ship / learn</h3>
      <p class="portfolio-card__description">Keep live apps in a disciplined acquisition band; protect efficiency before scaling.</p>
    </div>
    <div class="portfolio-card work-priority">
      <span class="portfolio-card__badge">02</span>
      <h3 class="portfolio-card__title">Systems</h3>
      <p class="portfolio-card__description">Harness + quality gates over feature thrash.</p>
    </div>
    <div class="portfolio-card work-priority">
      <span class="portfolio-card__badge">03</span>
      <h3 class="portfolio-card__title">Public proof</h3>
      <p class="portfolio-card__description">Keep case studies honest and current on the <a href="{{ '/' | relative_url }}#cases">home featured cases</a>.</p>
    </div>
  </div>

  <aside class="work-callout" role="note">
    Deep private dailies stay in <code>ios-memory</code> (not published). This page is public-safe only.
  </aside>

  <h2 class="hub-section__title">Portfolio snapshot</h2>
  <p class="work-lead">
    Curated from portfolio overview
    (<a href="{{ '/ios-memory/dashboard.html' | relative_url }}">dashboard</a>
    /
    <a href="{{ '/portfolio/_overview.md' | relative_url }}">_overview</a>).
  </p>

  <div class="portfolio-grid">
    <div class="portfolio-card work-snapshot">
      <h3 class="portfolio-card__title">Utility camera / GPS lane</h3>
      <span class="work-status-pill">Scale carefully</span>
      <p class="portfolio-card__description">Star category historically</p>
    </div>
    <div class="portfolio-card work-snapshot">
      <h3 class="portfolio-card__title">Wallpaper / emoji lanes</h3>
      <span class="work-status-pill">Optimize</span>
      <p class="portfolio-card__description">Efficiency before volume</p>
    </div>
    <div class="portfolio-card work-snapshot">
      <h3 class="portfolio-card__title">Pipeline / harness</h3>
      <span class="work-status-pill">Active</span>
      <p class="portfolio-card__description">Agent OS + CI discipline</p>
    </div>
  </div>

  <p class="work-meta-line">
    <strong>Full metrics:</strong>
    <a href="{{ '/portfolio/_overview.md' | relative_url }}">Portfolio overview</a>
    ·
    <a href="{{ '/ios-memory/dashboard.html' | relative_url }}">Live dashboard</a>
  </p>

  <h2 class="hub-section__title">Operator links</h2>
  <p class="work-lead">Jump surfaces by intent.</p>

  <div class="portfolio-grid portfolio-grid--2col">
    <a class="portfolio-card" href="{{ '/ios-memory/dashboard.html' | relative_url }}">
      <h3 class="portfolio-card__title">Dashboard</h3>
      <p class="portfolio-card__description">Visual portfolio / memory board</p>
    </a>
    <a class="portfolio-card" href="{{ '/memory/' | relative_url }}">
      <h3 class="portfolio-card__title">Memory summary</h3>
      <p class="portfolio-card__description">5–10 min reading order</p>
    </a>
    <a class="portfolio-card" href="{{ '/memory/quality-gaps/' | relative_url }}">
      <h3 class="portfolio-card__title">Quality gaps</h3>
      <p class="portfolio-card__description">Open product / tech debt themes</p>
    </a>
    <a class="portfolio-card" href="{{ '/' | relative_url }}#cases">
      <h3 class="portfolio-card__title">Featured cases</h3>
      <p class="portfolio-card__description">Public stories on the home page</p>
    </a>
    <a class="portfolio-card" href="{{ '/portfolio/' | relative_url }}">
      <h3 class="portfolio-card__title">Portfolio hub</h3>
      <p class="portfolio-card__description">Catalog + playbooks</p>
    </a>
    <a class="portfolio-card" href="{{ '/archive.html' | relative_url }}">
      <h3 class="portfolio-card__title">Writing</h3>
      <p class="portfolio-card__description">Blog archive</p>
    </a>
  </div>

  <h2 class="hub-section__title">Weekly review ritual</h2>
  <p class="work-lead">Two minutes. Same order every week.</p>

  <ol class="work-ritual">
    <li class="work-ritual__item">
      <span class="work-ritual__num" aria-hidden="true">1</span>
      <span class="work-ritual__text">Open <strong>this page</strong> → skim <em>Now</em>.</span>
    </li>
    <li class="work-ritual__item">
      <span class="work-ritual__num" aria-hidden="true">2</span>
      <span class="work-ritual__text">Open <strong>Dashboard</strong> → review public-safe portfolio status.</span>
    </li>
    <li class="work-ritual__item">
      <span class="work-ritual__num" aria-hidden="true">3</span>
      <span class="work-ritual__text">Open <strong>Cases</strong> → if a story improved, note for next sync.</span>
    </li>
    <li class="work-ritual__item">
      <span class="work-ritual__num" aria-hidden="true">4</span>
      <span class="work-ritual__text">Private deep work stays in <code>ios-memory</code> dailies / plans.</span>
    </li>
  </ol>

  <h2 class="hub-section__title">Sync</h2>
  <p class="work-lead">Public content is refreshed via:</p>

  <div class="work-code">
    <pre class="work-code__pre"><code># from quocnv15.github.io
./scripts/sync-content.sh</code></pre>
  </div>

  <ul class="hub-list work-sync-notes">
    <li><strong>Allowlist only:</strong> dashboard HTML, case studies, portfolio overview.</li>
    <li><strong>Never synced:</strong> mentors full corpus, SOUL, dailies, beads.</li>
  </ul>

</div>
