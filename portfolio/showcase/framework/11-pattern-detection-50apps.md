---
layout: portfolio-detail
title: "Pattern Detection — 50 Apps"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/11-pattern-detection-50apps/
---

# Pattern Detection Framework — 50 App Portfolio

> **Mục tiêu:** Từ 50 apps → Identify winning patterns → Systemize and scale

---

## 1. Framework Overview

### Vision

```
Launch 50 Apps → Collect Data → Detect Patterns → Build Flywheel
     (6-12 tháng)      (daily)        (weekly)         (ongoing)
```

### Key Questions Framework Answers

| Question | Answer Source | Decision |
|----------|---------------|----------|
| **App nào worth scaling?** | Unit economics | Scale/Stop |
| **Category nào profitable?** | Cross-app analysis | Double down |
| **Feature nào drives revenue?** | Feature correlation | Standardize |
| **User behavior patterns?** | Funnel analysis | Optimize |
| **When to pivot vs persist?** | Trend detection | Strategic move |

---

## 2. Data Collection Layer

### Required Metrics Per App

#### Unit Economics (Daily)
```yaml
app_id: XXX
date: YYYY-MM-DD

spend:
  ads: $X
  total: $X

revenue:
  ads: $Y
  iap: $Z
  total: $Y + $Z

unit_economics:
  cac: $X / new_users
  ltv_7d: $Y / users * retention_7d
  ltv_30d: $Y / users * retention_30d
  payback_days: cac / arpu_daily
  roi: total_revenue / total_spend

status: "scale" | "maintain" | "fix" | "stop"
```

#### Funnel Metrics (Weekly)
```yaml
acquisition:
  impressions: N
  clicks: N
  ctr: N%
  installs: N
  cpi: $N

activation:
  d1_retention: N%
  d7_retention: N%
  first_action: N%

monetization:
  paid_users: N
  conversion_rate: N%
  arpu: $N
  arppu: $N
```

#### Feature Performance (Monthly)
```yaml
features:
  - name: "feature_X"
    usage_rate: N%
    revenue_contribution: N%
    user_satisfaction: N
  - name: "feature_Y"
    ...
```

### Collection Automation

**Daily Auto:**
- App Store Connect API → Revenue
- Ad networks API → Spend
- Custom analytics → Events

**Weekly Auto:**
- Aggregate metrics
- Calculate derived metrics (CAC, LTV, ROI)
- Flag anomalies

**Monthly Manual:**
- Feature audit
- Competitive analysis
- User feedback review

---

## 3. Pattern Detection Engine

### Level 1: App-Level Patterns (Individual Health)

#### Pattern A — Star Performer 🚀

**Signals:**
```
ROI > 3x AND payback_days < 7 AND trending_up
```

**Characteristics:**
- High viral coefficient (k > 1)
- Strong word-of-mouth
- Organic installs > paid installs

**Action: SCALE**
- Increase ad budget by 50%
- Expand to new markets/locales
- Document winning formula

**Examples:** App 010 (7.7x ROI, immediate payback)

---

#### Pattern B — Break-Even Stable ⚖️

**Signals:**
```
0.8x < ROI < 1.5x AND stable_for_30_days
```

**Characteristics:**
- Consistent but not growing
- Market fit exists but small
- Unit economics borderline

**Action: OPTIMIZE**
- Test new creatives
- Adjust pricing
- Improve retention

**If ROI > 1.2x after optimization → SCALE**

**Examples:** App 006 (1.1x ROI, needs optimization)

---

#### Pattern C — Early Traction 🔥

**Signals:**
```
days_live < 30 AND (purchases > 5 OR viral_growth)
```

**Characteristics:**
- Not enough data for ROI
- Early positive signals
- Need more time

**Action: WATCH**
- Maintain spend
- Track daily
- Document learnings

**Examples:** App 009 (9 IAP early, not enough data)

---

#### Pattern D — Declining 📉

**Signals:**
```
roi < 0.8x AND declining_for_14_days
```

**Characteristics:**
- Market fit weak or gone
- Competition increased
- Seasonality ended

**Action: STOP**
- Kill ad spend
- Archive learnings
- Pivot or sunset

---

#### Pattern E — Dead on Arrival 💀

**Signals:**
```
days_live > 14 AND installs < 100 AND revenue < $10
```

**Characteristics:**
- No market fit
- ASO failed
- Wrong timing/category

**Action: SUNSET**
- Remove from portfolio
- Document failure pattern
- Don't repeat

---

### Level 2: Cross-App Patterns (Portfolio Insights)

#### Pattern 1 — Category Winners

**Analysis:**
```sql
SELECT category, AVG(roi), SUM(revenue)
FROM apps
GROUP BY category
HAVING AVG(roi) > 2x
ORDER BY SUM(revenue) DESC
```

**Action:** Double down on winning categories
- Build more apps in category
- Share best practices
- Create category playbooks

**Example Discovery:** "Utility apps with impulse pricing (App 010) outperform entertainment apps with subscription model"

---

#### Pattern 2 — Feature Correlation

**Analysis:**
```python
# Correlate features with revenue
for feature in all_features:
    correlation = calculate_correlation(
        apps_with_feature.revenue,
        apps_without_feature.revenue
    )
```

**Action:** Standardize winning features
- Add to shared infrastructure
- Make default in new apps
- Create feature templates

**Example Discovery:** "Apps with onboarding tutorial have 2.3x higher retention"

---

#### Pattern 3 — Monetization Sweet Spots

**Analysis:**
```sql
SELECT pricing_model, AVG(conversion_rate), AVG(arppu)
FROM apps
GROUP BY pricing_model
```

**Action:** Optimize pricing strategy
- Category-specific pricing
- A/B test tiers
- Bundle features

**Example Discovery:** "$0.99 impulse purchases (App 010) convert 3x better than $4.99 premium (App 006)"

---

#### Pattern 4 — Locale/Market Patterns

**Analysis:**
```sql
SELECT locale, SUM(revenue), AVG(cac)
FROM apps
GROUP BY locale
HAVING SUM(revenue) > threshold
```

**Action:** Geographic expansion
- Prioritize high-ROI locales
- Localize for winning markets
- Avoid low-ROI regions

---

#### Pattern 5 — Seasonality & Timing

**Analysis:**
```python
# Time series analysis
for app in apps:
    detect_seasonality(app.daily_revenue)
```

**Action:** Strategic launch timing
- Launch before peak season
- Scale during high-demand periods
- Reduce spend during low season

---

### Level 3: System Patterns (Infrastructure Insights)

#### Pattern A — Build vs Buy Signals

**Detection:**
- Custom-built features used in < 3 apps → Should be library
- Custom-built features used in > 10 apps → Should be infrastructure

**Action:** Consolidate and standardize

---

#### Pattern B — Agent Effectiveness

**Detection:**
```yaml
agent_task: "ASO optimization"
success_rate: apps_where_traffic_increased / total_apps
time_to_result: avg(days_from_request_to_traffic_increase)
```

**Action:** Improve agents, update prompts, retire ineffective ones

---

## 4. Decision Matrix

### Scale Decision Tree

```
App ROI > 3x?
├─ YES → Payback < 7 days?
│   ├─ YES → 🚀 SCALE NOW (increase 50% budget)
│   └─ NO → ⚖️ MAINTAIN (optimize payback)
└─ NO → ROI > 1.5x?
    ├─ YES → 🔧 OPTIMIZE (test creatives/pricing)
    └─ NO → Days live > 30?
        ├─ YES → 💀 STOP (kill spend)
        └─ NO → 👀 WATCH (need more data)
```

### Resource Allocation Formula

```python
# Budget distribution for next week
total_budget = X

for app in portfolio:
    if app.status == "scale":
        app.budget = total_budget * 0.6  # 60% to stars
    elif app.status == "maintain":
        app.budget = total_budget * 0.3  # 30% to stable
    elif app.status == "optimize":
        app.budget = total_budget * 0.1  # 10% for testing
    else:  # stop/watch
        app.budget = 0
```

---

## 5. Implementation Roadmap

### Phase 1: Data Foundation (Week 1-2)

- [ ] Set up metrics collection (App Store Connect, Ad networks)
- [ ] Create centralized database (Sheet/Notion/DB)
- [ ] Build daily dashboard
- [ ] Document current 10 apps baseline

### Phase 2: Pattern Detection (Week 3-8)

- [ ] Implement app-level classification (A-E patterns)
- [ ] Weekly cross-app analysis
- [ ] Document first winning patterns
- [ ] Create first "Category Playbook"

### Phase 3: System Optimization (Week 9-16)

- [ ] Build standard features from winning patterns
- [ ] Update agents with pattern knowledge
- [ ] Create pricing strategy per category
- [ ] Optimize infrastructure

### Phase 4: Scale with Confidence (Week 17+)

- [ ] Launch to 50 apps using playbooks
- [ ] Real-time pattern detection
- [ ] Automated decision triggers
- [ ] Portfolio flywheel operational

---

## 6. Playbook Template

### Category Winner Playbook Template

```markdown
# [Category] Playbook — Winning Pattern

## Discovery
- First winner: App [XXX]
- Discovery date: [Date]
- Key metrics: ROI [X]x, Payback [X] days

## Pattern Characteristics

### Market
- Target user: [description]
- Pain point: [description]
- Competition level: [low/medium/high]

### Product
- Core feature: [description]
- Differentiation: [description]
- User delight moment: [description]

### Monetization
- Pricing model: [description]
- Price points: [$X, $Y, $Z]
- Conversion rate: [X]%

### Growth
- Primary channel: [description]
- CAC: $[X]
- Viral coefficient: [X]

## Execution Checklist

When launching new app in this category:

- [ ] Feature: [Must-have features]
- [ ] Pricing: [Default price tiers]
- [ ] ASO: [Keywords, description]
- [ ] Ads: [Creative approach]
- [ ] Launch timing: [Best timing]

## Success Signals

- Week 1: Install > [X]
- Week 2: IAP > [X]
- Week 4: ROI > [X]x

## Red Flags

- Week 1: Install < [X] → Revisit ASO
- Week 2: IAP < [X] → Check pricing
- Week 4: ROI < [X]x → Kill or pivot
```

---

## 7. Anti-Patterns (What to Avoid)

### ❌ Pattern Trap: False Positive

**Scenario:** App shows ROI > 3x in week 1 due to anomaly

**Detection:**
- Check if sustained for 14 days
- Verify not seasonal spike
- Confirm not ad network error

**Action:** Wait for confirmation before scaling

---

### ❌ Pattern Trap: Survivor Bias

**Scenario:** Only looking at winners, ignoring failures

**Prevention:**
- Document ALL apps (including dead)
- Analyze failure patterns
- Learn from sunsets

---

### ❌ Pattern Trap: Overfitting

**Scenario:** "Utility apps with blue icons on Tuesday convert better"

**Detection:**
- Statistical significance test
- Sample size validation
- Cross-validation

**Action:** Only trust patterns with N > 5 apps

---

## 8. Next Actions

### This Week
1. Set up metrics collection for current 10 apps
2. Create dashboard with daily snapshot
3. Classify current apps (A-E patterns)

### This Month
1. Launch 5 more apps using emerging patterns
2. Document first Category Playbook
3. Build feature correlation analysis

### This Quarter
1. Scale to 20 apps with pattern-informed decisions
2. Automate pattern detection triggers
3. Share learnings with community (content)

---

## 9. Success Metrics

**Portfolio Health:**
- % apps in "Scale" status: Target > 30%
- Average portfolio ROI: Target > 2x
- Time to pattern detection: Target < 7 days

**System Maturity:**
- Automated decision coverage: Target > 80%
- Playbook completeness: All categories documented
- Agent pattern awareness: All agents trained

**Business Output:**
- Monthly recurring revenue: Target $2K+
- Winner discovery rate: Target 1 winner per 5 apps
- Time from launch to scale decision: Target < 30 days

---

**Related Frameworks:**
- [20% Framework](../playbook/framework/04-monetize-20.md) — Human judgment layer
- [Quality Gate](../case-studies/011-quality-gate-co-founder.md) — Pre-launch validation
- [Metrics Tracker](../templates/moboco-metrics-tracker.md) — Data collection
