---
layout: portfolio-detail
title: "Retry/Failure Analysis"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/004-retry-failure-analysis/
---

# 🔄 Self-Review: Retry & Failure Pattern Analysis

> **Ngày:** 2026-03-14 | **Data:** 6,308 user messages
> **Focus:** Phân tích khi nào AI output sai và tại sao iteration kéo dài

---

## 1. Retry vs Continue vs Restart

| Pattern | Số lượng | Insight |
|---------|----------|---------|
| **Retry** ("try again", "sửa lại", "fix lại") | 807 | ⚠️ Con số rất cao — 1 trong 8 tin nhắn là retry |
| **Continue** ("tiếp tục", "continue", "proceed") | 620 | ✅ Momentum tốt |
| **Restart** ("tạo mới", "start over") | 4 | ✅ Gần như không bao giờ abandon session |

**Insight:** Retry:Continue = 1.3:1 — nghĩa là cứ 1.3 lần retry mới có 1 lần continue thành công. Đây là dấu hiệu **iteration overhead cao**.

---

## 2. Success Rate Proxy

| Pattern | Sessions | % | Avg AI Output |
|---------|----------|---|---------------|
| 🟢 Quick Success (≤2 user msgs) | 77 | 7.8% | 4,750 chars |
| 🟡 Normal Iteration (≤5 msgs) | 149 | 15.1% | 5,969 chars |
| 🟠 Extended Iteration (≤10 msgs) | 605 | **61.3%** | 29,123 chars |
| 🔴 Heavy Iteration (10+ msgs) | 156 | 15.8% | 98,899 chars |

**Critical:** 77% sessions cần extended/heavy iteration → AI hiếm khi "đúng ngay lần đầu".

### Tại sao?
1. **Prompt thiếu context** (69% < 200 chars) → AI phải đoán → sai → retry
2. **Scope creep** — bắt đầu task A, giữa chừng thêm B, C
3. **Visual tasks** — UI/Design (18% sessions) khó mô tả bằng text → nhiều iteration

---

## 3. Mẫu Sửa Lỗi Thường Gặp

### 3.1 Correction Vocabulary
| Phrase | Count | Cách dùng |
|--------|-------|-----------|
| `@agent Try Again` | 25 | Retry không context |
| `The issue has been fixed. Please clean up` | 20 | Tự fix xong, nhờ cleanup |
| `sửa lại giúp tôi` | 5 | Vague fix request |
| `sửa lại code giúp tôi` | 4 | Slightly better — nói rõ là code |
| `fix error` | 3 | Lazy prompt |
| `hãy sửa đi` | 2 | Imperative, no context |
| `chỉnh sửa lại UI cho đúng đi` | 2 | Kèm partial context (UI) |

### 3.2 Pattern: Tự Fix Rồi Nhờ Cleanup
- 20 lần: "The issue has been fixed. Please clean up the instrumentation"
- **Insight:** Bạn tự debug hiệu quả hơn AI, nhưng vẫn delegate cleanup → **good pattern.** Tuy nhiên, nên cho AI biết bạn fix gì để nó learn context.

### 3.3 Pattern: Escalation Path
```
Vague → Specific → Paste Error → Self-fix → Cleanup
"fix error" → "fix BaseVC line 185" → [paste full error] → [tự sửa] → "clean up debug logs"
```

---

## 4. Debug Session Trend

| Tháng | Total | Debug | Debug % | Trend |
|-------|-------|-------|---------|-------|
| 2025-09 | 16 | 8 | **50%** | 🔴 Nửa tháng fix bugs |
| 2025-10 | 21 | 5 | 24% | 🟠 |
| 2025-11 | 80 | 9 | 11% | 🟡 |
| 2025-12 | 104 | 4 | **3.8%** | 🟢 Ít bug nhất |
| 2026-01 | 236 | 9 | 3.8% | 🟢 Ổn định |
| 2026-02 | 231 | 28 | **12%** | 🟠 Tăng đột biến |
| 2026-03 | 150 | 11 | 7.3% | 🟡 Đang giảm |

**Insight:** Feb 2026 debug spike → coincides with multi-tool transition (thêm Claude Code + Antigravity). Context switching giữa 3+ tools có thể tạo thêm bugs.

---

## 5. Giảm Iteration: Hành Động Cụ Thể

### 5.1 "First Prompt Right" Checklist
Trước mỗi session, hỏi bản thân:
- [ ] Task scope rõ ràng? (1 mục tiêu duy nhất)
- [ ] Có file/function name cụ thể?
- [ ] Có reference (screenshot, existing code)?
- [ ] Criteria thành công rõ ràng?

### 5.2 "Smart Retry" Template
Khi cần retry, dùng format:
```
❌ Output trước sai vì: [lý do cụ thể]
✅ Mong muốn: [mô tả chính xác]
📎 Reference: [file/screenshot/example]
```

### 5.3 "Scope Gate" Rule
- Session bắt đầu bằng 1 dòng scope: "Session này CHỈ làm X"
- Nếu phát sinh task mới → ghi vào TODO → session mới
- Mục tiêu: Giảm extended iteration từ 61% → 40%

---

## 6. Metrics Tracking

| Metric | Hiện tại | Target (4 tuần) |
|--------|----------|-----------------|
| Retry:Continue ratio | 1.3:1 | < 0.8:1 |
| Quick Success rate | 7.8% | > 15% |
| Extended Iteration | 61.3% | < 45% |
| "Try Again" no-context | 25 | 0 |
| Debug session % | 8.7% | < 5% |

---

## See also
[[memory_bank/knowledge/ios-expertise/rules-of-engagement]], [[memory_bank/memory/4-operational/selfreview/009-holistic-self-portrait]], [[memory_bank/knowledge/ai-tools/claude-code/metrics]], [[memory_bank/memory/4-operational/selfreview/008-token-economics-knowledge-retention]], [[memory_bank/knowledge/ai-tools/claude-code/overview]], [[memory_bank/memory/memory-MOC]]
