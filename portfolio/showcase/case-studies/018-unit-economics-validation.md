# Case Study 018 — Unit Economics Validation

> **Title:** Từ Blueprint đến Business: 3 Apps, 3 Bài Học về Unit Economics  
> **Author:** Quoc Nguyen Van  
> **Date:** 2026-04-24  
> **Sản phẩm:** Moboco App Portfolio (Apps 006, 009, 010)

---

## 1. Hook — Kết Quả Trước

**3 app, 3 chiến lược monetization, 3 bài học.**

- App 006: $600 ad spend → $660 revenue (1.1x ROI) → **Break-even nhưng chưa scale**
- App 009: Just launched → 9 IAP purchases → **Early traction, chưa optimize**
- App 010: $13 ad spend → ~$100 IAP revenue (**7.7x ROI**) → **Star performer, cần scale**

**Bài học lớn nhất:** Không phải app nào cũng nên scale. Unit economics determine winner, không phải gut feeling.

---

## 2. Bối Cảnh — Vấn Đề Thực Tế

### Problem Statement

Tháng 4/2026, tôi có 6 app live, đang tích hợp thêm 4 app mới. Vấn đề:

- **Chưa biết app nào đáng scale** — Cả 6 app đều có revenue, nhưng không biết ROI
- **Ad spend đang "burn"** — Running ads nhưng không track unit economics
- **Decision paralysis** — Hết nên build app mới hay optimize app hiện tại?

### Constraints

- **Solo operation** — Không team để manage campaigns 24/7
- **Limited runway** — Không thể burn tiền vô hạn để test
- **Time fragmentation** — Quá nhiều projects cùng lúc

### Tại sao không trivial?

AI có thể suggest "run more ads" nhưng không thể:
- Phân tích được context của từng app (market fit, competition, seasonality)
- Quyết định được khi nào scale vs khi nào stop
- Tối ưu được creative và targeting dựa trên real-world feedback

---

## 3. AI Suggest Gì (80% Solution)

Claude khi được hỏi về app monetization:

**Suggestion:**
> "Tích hợp IAP cho tất cả app, chạy Apple Search Ads basic, track revenue weekly. Monetize top performers."

**AI-generated output:**
- ✅ IAP integration code (functionally correct)
- ✅ Basic ASO suggestions (keywords, descriptions)
- ✅ Revenue tracking structure (Spent, Revenue, Profit)

**Tại sao "trông gần xong":**
Về mặt kỹ thuật, AI đúng. Tích hợp IAP, chạy ads, track revenue — đó là standard playbook. Nhưng:

- ❌ Không biết **pricing psychology** cho từng app category
- ❌ Không biết **ad creative variables** ảnh hưởng CTR như thế nào
- ❌ Không biết **khi nào stop** burning money vào app không có unit economics

---

## 4. Tôi Quyết Định Khác Gì (20% Judgment)

### 4.1 Insight #1 — Unit Economics First, Scale Later

**AI nói:** "Scale tất cả apps có revenue"

**Tôi quyết định:** Track unit economics per app BEFORE scaling

**Tại sao?**
- $600 spent để kiếm $660 (App 006) → KHÔNG scale
- $13 spent để kiếm $100 (App 010) → SCALE ngay

**Evidence:**
- Andrew Chen's framework: CAC < LTV/3 là healthy unit economics
- My calculation: App 010 có immediate payback, App 006 cần nhiều tháng

### 4.2 Insight #2 — App Category Monetization Mismatch

**AI nói:** "Standard IAP tiers: $0.99, $1.99, $4.99"

**Tôi quyết định:** Custom pricing per app category

**Tại sao?**
- App 009 (productivity) → High willingness to pay → Higher tiers
- App 010 (utility) → Impulse buy → Low friction pricing
- App 006 (entertainment) → Ads-heavy IAP-light → Different model

**Evidence:**
- App 009: 9 IAP purchases early signals pricing works
- App 010: $13 → $100 conversion shows impulse pricing works

### 4.3 Insight #3 — Early Traction > Perfection

**AI nói:** "Optimize everything before launch"

**Tôi quyết định:** Launch early, track metrics, optimize AFTER

**Tại sao?**
- App 009 just launched → 9 IAP already
- Perfection delay = Lost learning time
- Real user behavior ≠ Lab assumptions

**Evidence:**
- App 010 launched "imperfect" → 7.7x ROI immediately
- If waited for perfection, would have missed early market feedback

---

## 5. Kết Quả + Con Số

### Portfolio Snapshot (April 2026)

| App | Ad Spend | Ads Revenue | IAP Revenue | Total | Net | ROI | Status |
|-----|----------|-------------|-------------|-------|-----|-----|--------|
| **006** | $600 | $260 | $400 | $660 | **+$60** | 1.1x | ⚠️ Break-even |
| **009** | - | - | 9 IAP | TBD | TBD | - | 🔄 Early traction |
| **010** | $13 | - | ~$100 | ~$100 | **+$87** | **7.7x** | 🚀 Scale ready |

### Before vs After (20% Impact)

| Metric | Before (AI suggestion) | After (20% judgment) |
|--------|------------------------|---------------------|
| **Strategy** | Scale all apps | Scale only winners |
| **Tracking** | Revenue only | Unit economics per app |
| **Pricing** | Standard tiers | Category-optimized |
| **Decision speed** | Analysis paralysis | Clear stop/scale signals |

### Business Impact

**Direct numbers:**
- Portfolio net: +$147 (60 + 87)
- Star performer identified: App 010 (7.7x ROI)
- Saved from bad scale: App 006 (would have burned more)

**Strategic value:**
- Clarity on what to build next (more like 010)
- Framework for future app launches
- Proof that system works in real market, not just theory

---

## 6. Bài Học Rút Ra

### 1. Unit Economics là vua
AI có thể build features, nhưng chỉ human có thể decide khi nào features worth burning money. Track CAC, LTV, payback period BEFORE scaling.

### 2. Category matters more than features
Productivity app monetizes differently than entertainment. AI doesn't understand user psychology per category without explicit context.

### 3. Launch imperfect, optimize with data
App 010 launched "quick and dirty" but with unit economics tracking built-in. That's more valuable than perfect app without metrics.

### 4. Stop loss is a feature
App 006 break-even sounds "okay" but actually signals "don't scale." AI would suggest optimize creative; I suggest check if market fit exists first.

### 5. Small data > Big assumptions
9 IAP purchases (App 009) tells me more than 100 AI suggestions about pricing. Real user behavior trumps theoretical models.

---

## 7. Kết Luận — Một Câu

> **"AI builds the factory; human decides which products to run on the assembly line."**

System (ios-kit, agents, workflow) giúp tôi ship apps nhanh. Nhưng unit economics, market fit, pricing psychology — những thứ quyết định revenue — vẫn cần 20% judgment từ real-world execution.

---

## Next Actions

- [ ] Scale App 010 by 20-30% budget (test if ROI holds)
- [ ] Deep dive App 006 ad creative + targeting (why CAC so high?)
- [ ] Price test App 009 IAP tiers (optimize ARPU)
- [ ] Build automated dashboard for daily tracking
- [ ] Document learnings into reusable "Launch Checklist"

---

**Related Case Studies:**
- [002-drjoy-growth-story.md](002-drjoy-growth-story.md) — First monetization journey
- [010-shared-monetization-infrastructure.md](010-shared-monetization-infrastructure.md) — IAP system design
- [011-quality-gate-co-founder.md](011-quality-gate-co-founder.md) — AI review workflow

**External Validation:**
- Metrics tracked in real-time (not hypothetical)
- Actual ad spend and revenue numbers
- Decision log with evidence/reasoning
