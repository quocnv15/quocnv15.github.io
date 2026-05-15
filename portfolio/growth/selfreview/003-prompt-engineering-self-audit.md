---
layout: portfolio-detail
title: "Prompt Engineering Self-Audit"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/003-prompt-engineering-self-audit/
---

# 🎯 Self-Review: Prompt Engineering Quality Audit

> **Ngày:** 2026-03-14 | **Data:** 6,308 user messages, 1,241 sessions
> **Nguồn:** `cache.db` — tất cả platforms (Cursor, Claude Code, Antigravity, VSCode, Gemini CLI)

---

## 1. Vấn Đề Cốt Lõi

**69.4% tin nhắn của bạn dưới 200 ký tự.** Phần lớn là lệnh ngắn gọn kiểu:
- `"fix error"` — không nói error gì, ở đâu
- `"sửa lại giúp tôi"` — không nói sửa cái gì, mong muốn gì
- `"I want two item in row"` — không nói screen nào, constraint gì

**Hệ quả:** AI phải đoán intent → tốn thêm iteration → marathon sessions.

### Phân Bổ Độ Dài

| Phân loại | % | Đánh giá |
|-----------|---|----------|
| < 50 chars | 28.8% | ⚠️ Quá ngắn cho task phức tạp |
| 50-200 chars | 40.6% | 🟡 Đủ cho simple edits |
| 200-500 chars | 13.7% | ✅ Context tốt |
| 500+ chars | 16.9% | ✅ Chi tiết (thường paste code/logs) |

---

## 2. Anti-Patterns Phát Hiện

### 2.1 "Naked Error" Pattern (Paste lỗi không context)
```
❌ Jackfruit/BaseVC.swift:185: Fatal error: Unexpectedly 
   found nil while implicitly unwrapping an Optional value

✅ 🐛 Context: Đang implement AIMainTabVC, crash khi mở tab mới
   Error: BaseVC.swift:185 — force unwrap nil
   Steps: App launch → tap AIMainTab → crash
   Đã thử: Check outlet connections OK
   Nghi ngờ: presenter chưa inject khi viewWillAppear
```

**Tần suất:** Chiếm phần lớn tin nhắn 200-1000 chars trên VSCode — copy-paste raw error.

### 2.2 "Vague Fix" Pattern
```
❌ "sửa lại giúp tôi" (5 lần)
❌ "hãy sửa đi" (2 lần)
❌ "fix error" (3 lần)

✅ "Sửa HomeVC.swift: cell size iPad không match CategoryVC. 
    Mong muốn: 3 cols iPad, 2 cols iPhone, spacing 8pt"
```

### 2.3 "Try Again Without Why" Pattern
```
❌ "@agent Try Again" (25 lần)

✅ "@agent Try Again — Button position sai (cần bottom-right), 
    font 14pt→16pt, thiếu shadow"
```

### 2.4 "Duplicate Send" Pattern
- Nhiều tin nhắn gửi trùng (2 lần nội dung giống nhau liên tiếp)
- Nguyên nhân: network delay hoặc impatience
- Tốn thêm tokens vô ích

---

## 3. Framework Đề Xuất: **3C Prompt**

Mỗi prompt nên có 3 thành phần:

| C | Tên | Ví dụ |
|---|------|-------|
| **C**ontext | Đang ở đâu, làm gì | "Đang ở HomeVC, fix collection layout cho iPad" |
| **C**ommand | Muốn AI làm gì | "Resize cell thành 3 columns, spacing 8pt" |
| **C**riteria | Output mong muốn | "Match layout của CategoryVC" |

### Áp dụng theo độ phức tạp:

**Simple edit (1C — Command only):**
```
"Đổi font size tiêu đề từ 14pt → 16pt"
```

**Medium task (2C — Context + Command):**
```
"Ở HomeVC.swift, resize cell iPad thành 3 columns giống CategoryVC"
```

**Complex task (3C đầy đủ):**
```
Context: Đang refactor ASOSyncViewModel — file 800 dòng, God Object
Command: Tách thành 3 files: State, Pipeline, FileParser
Criteria: Giữ nguyên public API, test pass, < 200 dòng/file
```

---

## 4. Checklists Trước Khi Gửi Prompt

### Quick Check (5 giây)
- [ ] AI có đủ context để hiểu mình đang ở đâu không?
- [ ] Có nêu rõ mong muốn output không?
- [ ] Nếu paste error → có kèm "tôi đang làm gì" không?

### Before "Try Again" Check
- [ ] Ghi rõ **cái gì sai** trong output trước
- [ ] Ghi rõ **mong muốn cụ thể** cho lần retry

---

## 5. Metrics Theo Dõi

| Metric | Hiện tại | Mục tiêu (1 tháng) |
|--------|----------|---------------------|
| Tin nhắn < 50 chars | 28.8% | < 15% (trừ slash commands) |
| "Try Again" không lý do | 25 lần/12 tháng | 0 |
| Avg prompt length | ~200 chars | > 300 chars cho task phức tạp |
| First-shot success rate | ~7.8% | > 20% |

---

## 6. Hành Động Tiếp Theo

1. **In 3C Framework** lên sticky note cạnh màn hình
2. **Cập nhật SOUL.md** — thêm rule "Không bao giờ gửi prompt < 20 chars cho task phức tạp"
3. **Review lại sau 2 tuần** — query cache.db lần nữa, so sánh metrics

---

## See also
[[memory_bank/knowledge/ios-expertise/rules-of-engagement]], [[memory_bank/memory/4-operational/selfreview/009-holistic-self-portrait]], [[memory_bank/knowledge/ios-expertise/cc-cost-optimization]], [[memory_bank/me/identity/SOUL]], [[memory_bank/memory/4-operational/prompts/developer-reflection-prompts]], [[memory_bank/memory/memory-MOC]]
