# Moboco App Portfolio Overview

> **Last updated:** 2026-04-24  
> **Total Apps:** 5 active (target: 50)  
> **Portfolio Status:** Early validation phase

---

## Portfolio Snapshot (April 2026)

| App ID | Name | Category | Status | Ad Spend | Revenue | ROI | Pattern |
|--------|------|----------|--------|----------|---------|-----|---------|
| **006** | Silly Smile | Wallpaper | ⚖️ Stable | $600 | $660 | 1.1x | Break-even |
| **009** | Emoji Merge | Puzzle Game | 🔥 Early | - | 9 IAP | TBD | Traction |
| **010** | GPS Camera | Utility Camera | 🚀 Star | $13 | ~$100 | **7.7x** | **Winner** |
| **014** | Zipper Wallpaper | Wallpaper | 📊 Live | - | - | - | New |
| **017** | Dual Camera | Camera | 📊 Live | - | - | - | Complex |

**Portfolio Totals:**
- Ad Spend: ~$613
- Revenue: ~$760+
- Net: +$147
- Average ROI: ~1.24x

---

## App Details

### App 006: Silly Smile ⚖️

**Category:** Wallpaper (Emoji-themed)  
**Tech Stack:** UIKit + RxSwift + MVVM + Coordinator, Realm, Kingfisher, AdMob  
**Monetization:** IAP (monthly/weekly) + AdMob (banner, interstitial, rewarded, native, AOA)  
**Languages:** 18 + RTL support

**Metrics:**
- Ad Spend: $600
- Ads Revenue: $260
- IAP Revenue: $400
- Total Revenue: $660
- Net: +$60
- ROI: 1.1x

**Strengths:**
- Strong monetization infrastructure
- Premium paywall iteration (WeeklyPaywallVC)
- 18 languages + RTL
- Ads module well-structured

**Weaknesses:**
- High CAC ($600 for modest return)
- Git history very dirty (duplicate commits)
- Version 0.0.0 released multiple times
- AOA splash race condition bug

**Pattern:** ⚖️ **Break-even Stable** — Needs optimization before scale

---

### App 009: Emoji Merge 🔥

**Category:** Puzzle Game (Merge mechanics)  
**Tech Stack:** UIKit + RxSwift + MVVM + Coordinator, Realm, Kingfisher, AdMob, Hero, XLPagerTabStrip  
**Monetization:** IAP premium + AdMob (all formats)  
**Languages:** 18 + RTL support

**Metrics:**
- IAP Purchases: 9 (early traction)
- Ad Spend: Not tracked yet
- Revenue: TBD
- Status: Too early for ROI calculation

**Strengths:**
- Good game-specific helpers (EmojiCategoryHelper, LevelCelebrationHelper)
- Unit tests for puzzle logic
- Responsive design (UIScreen+Responsive)
- Banner migration done correctly

**Weaknesses:**
- Game logic commits diluted by ads/infrastructure
- Same AOA race condition as App 006
- Version 0.0.0 released 6 times
- ~403 commits = ~200 unique (50% duplicate)

**Pattern:** 🔥 **Early Traction** — 9 IAP purchases shows demand, need more data

---

### App 010: GPS Camera 🚀

**Category:** Utility Camera (GPS stamp + map)  
**Tech Stack:** UIKit + RxSwift + MVVM + Coordinator, Realm, AVFoundation, MapKit, CoreLocation  
**Monetization:** IAP + Ads (later removed for fork)  
**Languages:** Multiple

**Metrics:**
- Ad Spend: $13
- IAP Revenue: ~$100
- Net: +$87
- ROI: **7.7x** ⭐

**Strengths:**
- **EXCELLENT unit economics** (7.7x ROI, immediate payback)
- SwiftUI migration 6-phase (very systematic)
- Clean navigation architecture
- Experimental branches managed well
- Tests for business logic

**Weaknesses:**
- Stamp overlay had many fix iterations (preview ≠ capture coordinates)
- Feature scope too wide for v1.0 (6+ features)
- Dual camera experiments not documented
- 7+ release attempts for v1.0

**Pattern:** 🚀 **Star Performer** — SCALE READY

---

### App 014: Zipper Wallpaper

**Category:** Wallpaper (Zipper lock style)  
**Tech Stack:** UIKit + RxSwift + MVVM + Coordinator, Realm, Kingfisher, Alamofire, AdMob  
**Monetization:** Premium paywall + native top ad + AdMob  
**Languages:** 18 + RTL support

**Metrics:**
- Status: Newly live
- Data: Insufficient

**Strengths:**
- **Cleanest release history** (only 1 vunknown error)
- API migration well-thought (brainstorm report)
- Progressive thumbnail loading (UX detail)
- Data layer separation clear

**Weaknesses:**
- Fork from ios006 carried remnants
- API endpoints wrong initially
- Onboarding refactor (video → static)

**Pattern:** 📊 **New Launch** — Too early, watching

---

### App 017: Dual Camera

**Category:** Camera (Dual capture)  
**Tech Stack:** Fork from GPS Camera, UIKit + RxSwift + MVVM + Coordinator  
**Monetization:** IAP (premium)  
**Languages:** 19

**Metrics:**
- Status: Live
- Data: Insufficient

**Strengths:**
- **Research-first approach** (feasibility study, competitive analysis)
- Clean architecture (protocol-driven services)
- Beads pipeline systematic
- Deep hardware debugging (MultiCam session recovery)
- 19 languages, iPad support

**Weaknesses:**
- Export pipeline: 10+ fix commits (no clear contract)
- Session state machine came too late
- Fork + pivot hidden cost (>50% code stripped)
- 3 deploy attempts for v1.0
- Zombie plan (dualshot-recorder rewrite)

**Pattern:** 📊 **Complex** — Technical achievement, business TBD

---

## Technical Patterns Across Portfolio

### Shared Strengths

1. **Architecture:** MVVM + Coordinator + Repository consistent across all apps
2. **Localization:** 3-phase rollout (sync → Xcode → deep) became pattern
3. **Monetization:** Shared infrastructure (IAP service, Ad modules)
4. **CI/CD:** Fastlane automation standard

### Systemic Weaknesses

1. **Git History:** Duplicate commits across ALL projects (~50% waste)
2. **Version Management:** `0.0.0` releases repeated across projects
3. **AOA Bug:** Race condition appears in 006, 009 (should be shared library fix)
4. **Fork Hygiene:** Info.plist remnants, unused code carried over

---

## Category Analysis

| Category | Apps | Avg ROI | Winner? | Pattern |
|----------|------|---------|---------|---------|
| **Wallpaper** | 006, 014 | 1.1x (006 only) | No | ⚠️ High CAC, low ARPU |
| **Puzzle Game** | 009 | TBD | TBD | 🔥 Early signals |
| **Utility Camera** | 010 | **7.7x** | **YES** | 🚀 **Scale category** |
| **Dual Camera** | 017 | TBD | TBD | 📊 Technical showcase |

**Insight:** Utility Camera category shows strongest unit economics. Wallpaper apps have stable but low ROI.

---

## Monetization Strategies

| Strategy | Apps | Effectiveness | Notes |
|----------|------|---------------|-------|
| **IAP + Ads (wallpaper)** | 006, 014 | 1.1x | Stable but CAC high |
| **IAP Premium (game)** | 009 | TBD | 9 purchases early |
| **IAP Impulse (utility)** | 010 | **7.7x** | **Winning strategy** |
| **Premium Only (camera)** | 017 | TBD | New launch |

**Insight:** Low-friction impulse IAP (App 010) outperforms complex subscription models (App 006).

---

## Launch Timeline

```
App 006: Live → Monetizing
App 009: Live → Early traction
App 010: Live → STAR PERFORMER
App 014: Live → New (< 30 days)
App 017: Live → New (< 30 days)
```

**Cohort analysis:**
- Q1 2026: Apps 006, 009, 010 (validation phase)
- April 2026: Apps 014, 017 (expansion phase)

---

## Technical Debt Tracker

| Debt Item | Affected Apps | Severity | Fix Cost |
|-----------|---------------|----------|----------|
| Git duplicate commits | ALL | Medium | Process change |
| Version 0.0.0 releases | 006, 009, 014 | High | Fastlane validation |
| AOA race condition | 006, 009 | High | Shared lib fix |
| Fork remnants | 014, 017 | Medium | Audit script |

---

## Next Actions

### Immediate (This Week)
1. **Scale App 010** by 20-30% budget (test if 7.7x holds)
2. **Fix App 006** ad creative (reduce CAC from $600)
3. **Track App 009** metrics daily (9 IAP → validate or pivot)

### Short-term (This Month)
1. **Launch 3 more utility camera apps** (test if category pattern holds)
2. **Create Wallpaper Playbook** (if 006 optimizes to >2x ROI)
3. **Archive zombie plans** (cleanup technical debt)

### Medium-term (This Quarter)
1. **Reach 10 active apps** with pattern-informed decisions
2. **Document first Category Playbook** (Utility Camera)
3. **Automate metrics collection** (no more manual tracking)

---

**Related Documents:**
- [Pattern Detection Framework](../portfolio/showcase/framework/pattern-detection-50apps.md)
- [Metrics Tracker](../portfolio/showcase/templates/moboco-metrics-tracker.md)
- [Case Study 018: Unit Economics Validation](../portfolio/showcase/case-studies/018-unit-economics-validation.md)
