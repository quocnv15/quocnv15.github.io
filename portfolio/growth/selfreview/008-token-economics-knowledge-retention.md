---
layout: portfolio-detail
title: "Token Economics & Knowledge Retention"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/008-token-economics-knowledge-retention/
---

# 💸 Self-Review: Token Economics & Knowledge Retention

> **Ngày:** 2026-03-14 | **Data:** 145M input tokens, 7.8M output tokens, 596M cache reads
> **Focus:** Token waste, ROI tối ưu, và knowledge retention across sessions

---

## 1. Token Waste Analysis

| Category | Tokens | % Total |
|----------|--------|---------|
| **Total input tokens** | 145M | 100% |
| **Estimated wasted** (heavy iteration 30%) | 27.8M | **19.2%** |
| **Productive tokens** | 117.2M | 80.8% |

**Công thức:** Sessions với >10 user messages → ước tính 30% input tokens là wasted (retries, re-reads, context reload).

### Nếu quy đổi chi phí (Claude Opus pricing estimate):
| | Input | Output | Total |
|---|---|---|---|
| **Total spent** | ~$2,175 | ~$117 | **~$2,292** |
| **Wasted** | ~$417 | ~$35 | **~$452** |

> ⚠️ ~$452 wasted tokens do iteration overhead. Cải thiện prompt quality 20% → tiết kiệm ~$90/tháng.

---

## 2. Amplification Ratio Evolution

```
Amplification = AI output chars / User input chars

2024-06  ███                           3.5x  ← Beginner (ít dùng)
2024-08  ███████████████████           19.1x ← Discover AI power
2024-09  ███████████████████████████   53.5x ← Peak delegation
2024-10  ████████████████              16.6x
2025-02  ███████████████████           19.6x
2025-05  ████████                      8.6x  ← Viết prompt kỹ hơn
2025-07  ██████████                    10.8x
2025-11  ████                          4.6x  ← Significant shift
2025-12  ████████                      8.5x
2026-01  ██████████████████            18.3x ← Volume spike
2026-02  ███                           3.7x  ← Claude Code deep sessions
2026-03  ██                            2.9x  ← MOST BALANCED
```

### Trend Analysis

**Phase 1 (2024):** Amplification 16-53x → "AI viết hộ gần hết". User chỉ gửi lệnh ngắn.

**Phase 2 (2025 H1):** 8-20x → User bắt đầu viết prompts chi tiết hơn, provide context.

**Phase 3 (2025 H2-2026):** 2.9-8.5x → **Healthy balance.** User viết nhiều hơn (plans, specs, reviews), AI output targeted hơn.

**Insight:** Ratio giảm KHÔNG phải vì AI kém đi, mà vì bạn **viết prompts chất lượng hơn** → AI không cần generate nhiều garbage output.

---

## 3. Cache Efficiency (Claude Code)

| Metric | Value |
|--------|-------|
| Cache reads | 596M tokens |
| Input tokens | 2.1M |
| **Cache-to-input ratio** | **284:1** |

**Tuyệt vời!** Claude Code tận dụng prompt caching cực tốt. 284:1 nghĩa là 99.6% context được load từ cache thay vì re-process. Đây là lý do Claude Code cost-efficient nhất.

---

## 4. Knowledge Retention Problems

### Repeated Topic Sessions
| Topic | Lần lặp | Vấn đề |
|-------|---------|--------|
| Project documentation updates | 3 | Cùng task, 3 sessions riêng |
| Git commit and push | 3 | Routine nhưng mở session mới |
| Localization brainstorm | 4 | Scope chưa rõ từ session 1 |
| Architecture adjustments | 3 | Cùng refactor concept |
| iOS skills consolidation | 2 | Tiếp tục chưa xong |

**Root Cause:**
1. **Không có session summary** → session mới không biết session trước làm gì
2. **Scope creep** → session 1 chưa xong, mở session 2 với slightly different approach
3. **Context loss** → AI trong session mới không nhớ quyết định từ session trước

### Knowledge Loss Cost
- 15 sessions lặp × ~117K avg tokens = **~1.75M tokens lãng phí** do knowledge không được persist

---

## 5. Project Lifecycle Intelligence

### Active Project Windows

| Project | Duration | Sessions | Insight |
|---------|----------|----------|---------|
| **ios006-silly-smile** | 4 months | 93 | Longest active project |
| **moondate-flutter** | 4 months | 50 | Flutter exploration phase |
| **ios-hub** | 2 months | 48 | Meta-project, always-on |
| **ios-kit** | 3 months | 45 | Tooling investment |
| **ios009-emoji-merge** | 4 months | 51 | Feature-rich app |
| **ios-drjoy** | 7 months!! | 22 | Long-tail outsource |

**Patterns:**
1. **BKPlus apps:** Intensive burst (50-93 sessions in 2-4 months) → ship → move on
2. **Outsource:** Low frequency, long duration (DrJoy: 22 sessions over 7 months)
3. **Tooling:** Continuous investment (ios-kit, ios-hub)

### Project Velocity
```
BKPlus apps:   ~25 sessions/month = SPRINT mode
Outsource:     ~3 sessions/month  = MAINTENANCE mode
Tooling:       ~20 sessions/month = INVESTMENT mode
```

---

## 6. Cost Optimization Strategies

### Quick Wins (Tuần 1-2)
| Action | Est. Savings |
|--------|-------------|
| Prompt dài hơn 20% → giảm retries | ~8% tokens |
| Session scope gate → ít marathon | ~5% tokens |
| Summary file giữa sessions → ít rework | ~3% tokens |
| **Total** | **~16% (~$370/tháng)** |

### Medium-term (Tháng 1-2)
| Action | Est. Savings |
|--------|-------------|
| Slash commands cho routine tasks | ~3% tokens |
| @workspace thay vì mô tả context | ~2% tokens |
| Claude Code cho thinking, Cursor cho execution | Already doing ✅ |

### Knowledge Retention Fix
1. **Session closing protocol:** Trước khi đóng session, tạo 3-line summary
2. **Cross-session linking:** File `session-log.md` với links giữa các sessions
3. **Decision log:** Khi ra quyết định kiến trúc → ghi vào `DECISIONS.md` ngay

---

## 7. ROI Scorecard

| Investment | Sessions | Est. Token Cost | Output Value |
|------------|----------|-----------------|-------------|
| **ios006** (app shipped) | 93 | ~$300 | ✅ Revenue-generating |
| **ios-kit** (tooling) | 45 | ~$150 | ✅ Force multiplier |
| **ios-hub** (meta) | 48 | ~$160 | ✅ Long-term knowledge |
| **Flutter experiments** | 50 | ~$165 | 🟡 Learning investment |
| **Outsource projects** | 55 | ~$180 | ✅ Income |

**Insight:** Phần lớn token spend (70%+) đổ vào projects tạo giá trị (apps, income, tooling). Chỉ ~$165 cho pure learning (Flutter) — đây là allocation hợp lý.

---

## See also
[[memory_bank/knowledge/ios-expertise/rules-of-engagement]], [[memory_bank/memory/4-operational/selfreview/009-holistic-self-portrait]], [[memory_bank/knowledge/ai-tools/claude-code/metrics]], [[memory_bank/knowledge/ai-tools/claude-code/overview]], [[memory_bank/knowledge/ios-expertise/cc-cost-optimization]], [[memory_bank/memory/memory-MOC]]
