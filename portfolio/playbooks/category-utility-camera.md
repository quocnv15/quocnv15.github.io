# Category Playbook: Utility Camera

> **First Winner Discovery:** App 010 (GPS Camera)  
> **Discovery Date:** 2026-04-24  
> **Key Metrics:** 7.7x ROI, $13 CAC, ~$100 LTV (early), immediate payback

---

## Discovery Summary

**Winner:** App 010 - GPS Camera  
**Pattern:** Low-friction utility IAP outperforms complex subscription models  
**Unit Economics:**
- Ad Spend: $13
- IAP Revenue: ~$100
- Net: +$87
- **ROI: 7.7x** ⭐
- Payback: Immediate

---

## Pattern Characteristics

### Market

**Target User:**
- Travelers who want photo memories with location context
- Outdoor enthusiasts (hiking, cycling, running)
- Real estate/property inspectors
- Social media users who want "authentic" photo stamps

**Pain Point:**
- Default camera apps don't show GPS location on photos
- Separate apps needed for camera + GPS tracking
- Manual effort to add location stamps after photo

**Competition Level:** Medium
- Many camera apps exist
- Few focus on GPS stamp utility (not social filters)
- Low barrier for differentiation (specific utility focus)

### Product

**Core Feature:**
- GPS stamp overlay on photos/videos
- Map view of photo locations
- Simple, focused utility (not feature-heavy)

**Differentiation:**
- Real-time GPS stamp (not post-processing)
- Clean, minimal UI
- No social features (pure utility)
- One-time purchase psychology ($X vs subscription)

**User Delight Moment:**
- First photo with accurate GPS stamp "just works"
- Seeing photo collection on map view

### Monetization

**Pricing Model:** Low-friction IAP
- Impulse purchase pricing (not expensive tiers)
- One-time unlock (not recurring subscription)
- Clear value: "Pay $X, GPS stamp forever"

**Conversion Rate:** Estimated ~10-15% (based on ~$100 revenue from $13 spend)
- Low friction = higher conversion
- Clear utility = willingness to pay

**ARPU:** ~$10-15 (estimated from 9 IAP in App 009 pattern)

### Growth

**Primary Channel:** Apple Search Ads (ASA)
- Low CAC ($13 for utility app)
- High intent searches ("GPS camera", "location stamp photo")

**CAC:** $13 (very low for camera category)
- Specific keywords cheaper than generic "camera"  
- Less competition than wallpaper/game categories

**Viral Coefficient:** Low (utility apps rarely viral)
- Growth primarily via paid acquisition
- Word-of-mouth from specific use cases (travel, outdoor)

---

## Execution Checklist

When launching new app in **Utility Camera** category:

### Pre-Launch

- [ ] **Feature:** Core utility (1-2 features max, not feature-heavy)
- [ ] **Feature:** Clear output (photo/video with stamp/overlay)
- [ ] **Pricing:** $0.99-$4.99 one-time (not subscription)
- [ ] **ASO:** Keywords: specific utility terms ("GPS stamp", "location photo", NOT generic "camera")
- [ ] **ASO:** Screenshots: show before/after (photo without stamp → with stamp)
- [ ] **Tech Stack:** UIKit + AVFoundation (camera apps need UIKit, not SwiftUI yet)
- [ ] **Permissions:** Location, Camera, Photo Library (clear why each needed)

### Launch Week

- [ ] **Ads:** Apple Search Ads basic only (start small, $10-20/day)
- [ ] **Tracking:** Daily IAP count, ad spend, revenue
- [ ] **Optimization:** If 7+ days with < 3 IAP → revisit ASO/keywords

### Post-Launch (Week 2-4)

- [ ] **Iterate:** Based on user reviews (focus on core utility, not new features)
- [ ] **Scale:** If ROI > 3x after 14 days → increase ad budget 50%
- [ ] **Stop:** If ROI < 1x after 30 days → kill or pivot

---

## Success Signals

| Timeline | Metric | Threshold | Action |
|----------|--------|-----------|--------|
| **Week 1** | Installs | > 50 | Continue |
| **Week 1** | IAP purchases | > 3 | Good signal |
| **Week 2** | ROI | > 2x | Scale budget |
| **Week 4** | Net profit | > $50 | Validate category |
| **Week 8** | Payback period | < 7 days | Double down |

---

## Red Flags

| Timeline | Metric | Threshold | Action |
|----------|--------|-----------|--------|
| **Week 1** | Installs | < 20 | Revisit ASO keywords |
| **Week 2** | IAP purchases | < 2 | Check pricing (too high?) |
| **Week 4** | ROI | < 1x | Kill or pivot |
| **Any time** | Ad CAC | > $30 | Stop ads, reassess market |

---

## Technical Must-Haves

### AVFoundation

```swift
// Camera session configuration MUST handle:
- Device orientation changes
- Photo capture with GPS metadata
- Video recording with location overlay
- Memory management for large video files
```

### CoreLocation

```swift
// Location accuracy matters:
- desiredAccuracy = kCLLocationAccuracyBest
- Allow user to disable GPS stamp (privacy)
- Show location permission rationale clearly
```

### Permissions

```xml
<!-- Info.plist MUST have clear descriptions: -->
NSCameraUsageDescription: "Take photos with GPS location stamp"
NSPhotoLibraryUsageDescription: "Save stamped photos to your library"
NSLocationWhenInUseUsageDescription: "Add your location to photos"
```

---

## Common Pitfalls (Don't Repeat)

### ❌ Feature scope too wide

**Bad:** Camera + GPS + Map + Filters + Social + Cloud  
**Good:** Camera + GPS stamp (that's it)

**Lesson from App 010:** Original had 6+ features, most stripped when forked. MVP = 1-2 core features.

### ❌ Subscription pricing for simple utility

**Bad:** $0.99/month for GPS stamp  
**Good:** $2.99 one-time "forever"

**Lesson:** Utility apps don't have ongoing value to justify subscription. One-time purchase aligns with user psychology.

### ❌ Generic camera keywords

**Bad:** ASO keywords: "camera", "photo", "video"  
**Good:** "GPS stamp", "location photo", "geotag camera"

**Lesson:** Generic keywords = expensive ($5+ CAC). Specific utility keywords = cheap ($1-2 CAC).

### ❌ Preview ≠ Capture coordinates

**Bug:** GPS stamp correct in preview, wrong in saved photo  
**Fix:** Transform preview coordinates to capture output coordinates

**Lesson from App 010:** Cost 6+ fix commits. Get coordinate system right FIRST.

---

## Next Apps in Category

Based on Utility Camera pattern, potential winners:

1. **Timestamp Camera** - Add date/time stamp to photos
2. **Barcode Scanner Camera** - Scan + save with metadata
3. **Document Scanner** - Scan docs + OCR + organize
4. **QR Code Camera** - Scan + generate + history
5. **Measurement Camera** - Measure objects in camera view

**Launch Order:** Timestamp → QR → Document → Barcode → Measurement  
*(Prioritize by search volume + differentiation potential)*

---

## Anti-Patterns to Avoid

### ❌ Don't add social features

Utility camera ≠ Social camera. Adding filters, sharing, social features:
- Increases development time
- Dilutes utility value proposition
- Moves you into crowded "camera app" category

### ❌ Don't use SwiftUI for camera UI (yet)

As of 2026, AVFoundation + UIKit is more stable for camera apps.
SwiftUI migration possible (App 010 did 6-phase), but start with UIKit.

### ❌ Don't charge subscription for simple utility

Users won't pay monthly for a stamp feature.
One-time purchase = higher conversion = happier users.

---

## Related Documents

- [App 010 Retrospective](../../ios-memory/apps/ios010-gps-camera/retrospective-gps-camera.md) — Technical lessons
- [Case Study 018: Unit Economics Validation](../case-studies/018-unit-economics-validation.md) — 7.7x ROI proof
- [Portfolio Overview](../../ios-memory/apps/PORTFOLIO-OVERVIEW.md) — All apps snapshot

---

**Status:** ✅ Validated Pattern (1 winner with 7.7x ROI)  
**Next:** Launch 2-3 more utility camera apps to confirm pattern holds  
**Owner:** Quoc Nguyen Van  
**Last Updated:** 2026-04-24
