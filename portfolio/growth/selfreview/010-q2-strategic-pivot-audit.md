---
layout: portfolio-detail
title: "Q2 Strategic Pivot Audit"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/010-q2-strategic-pivot-audit/
---

> **Public-safe:** Dollar amounts and precise finance targets are redacted on this public mirror.


# 🪞 Self-Review: #010 — The Factory Pivot (May 2026 Audit)

> **Bối cảnh:** 1.5 tháng sau bản "Holistic Portrait" (W11-2026). Đây là kỳ rà soát giữa Quý 2 để đánh giá hiệu quả của việc chuyển dịch từ "Xây Tool" sang "Xây App" và tích hợp kiến trúc "Harness System".

---

## 1. Kiểm chứng "The Star Performer" (App 010)

Data từ `PORTFOLIO-OVERVIEW.md` (2026-04-24) cho thấy một bước ngoặt quan trọng:
- **GPS Camera (ios010):** Đạt **[redacted]x ROI** với chỉ [redacted] ad spend. 
- **Ý nghĩa:** Đây là "Proof of Concept" cho toàn bộ hệ thống. Bạn đã tìm thấy **Winner**.
- **Hành động:** Thay vì tiếp tục xây "Tool tổng quát", nhiệm vụ số 1 là **Replicate cái Winner này**. (Xem: [Pattern Detection Framework](../../showcase/framework/11-pattern-detection-50apps.md)).

---

## 2. ROI của "Harness System" — Hệ thống có đang tự cứu chính nó?

Các bài học từ OpenAI và GoClaw về **Harness Engineering** vừa được tổng hợp chính là lời giải cho các "Căn bệnh hệ thống" được chỉ ra trong tháng 3:

| Căn bệnh (Tháng 3) | Triệu chứng trong Apps (Tháng 4) | Thuốc giải (Harness System) |
|-------------------|---------------------------------|-----------------------------|
| **Dirty Git History** | ~50% duplicate commits (006, 009) | **Post-Turn Dispatch:** Chặn việc commit vô tội vạ của Agent. |
| **0.0.0 Releases** | Lặp lại lỗi versioning (014) | **Mechanical Enforcement:** Linter chặn release nếu thiếu metadata. |
| **AOA Splash Bug** | Lỗi race condition lặp lại | **Rigid Architecture:** Đẩy logic vào Shared Library/Infrastructure. |
| **Over-Investment** | 80% thời gian build tooling | **Thin Harness, Fat Skills:** Chỉ build khung mỏng, dồn lực vào Skill. |

---

## 3. Cảnh báo đỏ: Sự bền bỉ của "Night Owl"

Mặc dù Product đã có tiến triển, nhưng dấu hiệu **Burnout** vẫn còn đó:
- **Triệu chứng:** "Dirty git history" và "Fix iterations" liên tục (10+ commits cho export pipeline ở 017) là biểu hiện đặc trưng của việc **thiếu tỉnh táo khi điều phối AI**.
- **Trạng thái:** Protocol "Hard stop 23h" và "Rest days" dường như chưa được thực thi triệt để hoặc chưa đủ để hồi phục.
- **Hệ quả:** Bạn đang dùng AI để "đốt cháy giai đoạn" nhưng lại tạo ra "Software Entropy" (rác hệ thống) nhanh hơn mức bạn có thể dọn.

---

## 4. Định hướng Chiến lược Q2 (Pivot to Mastery)

### 4.1 Ngừng "Dò dẫm" - Hãy "Nhân bản"
Bạn đã có pattern thắng tại App 010 (Impulse IAP + Utility). Đừng thử nghiệm các Category "Low ROI" như Wallpaper nữa. Hãy dồn 80% lực vào **Utility Camera / GPS Tools**.

### 4.2 Chuyển từ "Cố vấn" sang "Kiến trúc sư môi trường"
Đừng dạy AI cách code (Prompting). Hãy xây cái **Harness** (Linter, Tests, CI) để AI không thể làm sai.
- **Goal:** Giảm tỷ lệ "Duplicate commits" xuống < 10% bằng cách ép AI dùng `br` (Beads) và Atomic Commits chuẩn.

### 4.3 Khâu nối "Showcase" và "Revenue"
Mọi thứ bạn đang build (Harness, Exocortex) phải phục vụ mục tiêu: **Ship app nhanh hơn 10 lần với chất lượng Senior Architect**. 
- Nếu Tooling không giúp ship app 015 nhanh hơn app 010, hãy **Sun-set cái tool đó**.

---

## 5. Action Items (30 ngày tới)

1. **[Product]** Launch 3 apps "vệ tinh" quanh GPS Camera (Pattern replication).
2. **[System]** Áp dụng `agent-first-harness` cho đúng 1 dự án (ios15) để triệt tiêu lỗi Version 0.0.0 và Dirty Git.
3. **[Self]** Thực thi nghiêm ngặt: **No Code after 23:00**. AI Agent có thể chạy AFK, nhưng Human Architect phải đi ngủ để giữ Judgment (Taste).

---

> **Kết luận:** Bạn không còn là một "Builder cô đơn xây nhà máy trong đêm". Bạn đang là **CEO của một Factory đã có sản phẩm thắng**. Hãy ngừng sửa máy (Tooling) và bắt đầu điều hành dây chuyền (Orchestration) để đạt mục tiêu doanh thu private.
