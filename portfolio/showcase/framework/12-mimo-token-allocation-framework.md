---
layout: portfolio-detail
title: "MiMo Token Allocation"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/12-mimo-token-allocation-framework/
---

---
type: framework
domain: ai-orchestration
tags: [mimo, tokens, llm, strategy, bluf, cost-optimization]
created: 2026-05-03
status: active
---

# Kế hoạch Vận hành & Tối ưu 1.6 Tỷ Token MiMo (BLUF Framework)

Mục tiêu cốt lõi: Không phải "xài cho đã", mà là biến 1.6B Token thành **hạ tầng tăng tốc cố định** cho `ios-memory`, `ios-hub` và các repo app. Cách dùng hiệu quả nhất là chia theo 3 tầng: Pro cho việc khó, base model cho việc thường ngày, TTS/Omni cho asset và QA.

## 1. Phân bổ Model Thực Dụng (Model Routing)

Hệ thống được thiết lập để tự động chuyển hướng task đến đúng model:
- **`MiMo-V2.5-Pro` (45% Quota):** Dùng cho cross-repo reasoning, refactor plan lớn, audit kiến trúc, đọc nhiều doc/rule cùng lúc. **Chỉ bật khi task thật sự cần long context (>100k) hoặc suy luận sâu.**
- **`MiMo-V2.5` hoặc `MiMo-V2-Omni` (35% Quota):** Dùng cho phần lớn việc hằng ngày như summarize, transform docs, extract task, phân tích screenshot, UI flow, multimodal QA.
- **`MiMo-V2.5-TTS` / `VoiceDesign` / `VoiceClone` (10% Quota):** Dùng cho demo app, onboarding voice, sample audio, marketing/video nội bộ. VoiceClone chỉ dùng khi voice ownership rõ ràng.
- **`MiMo-V2-Pro` / `MiMo-V2-Omni cũ` (10% Quota):** Chỉ dùng khi cần so benchmark hoặc nếu endpoint nào đó ổn định hơn.

## 2. Quy tắc Vận hành Cốt lõi (Operating Rules)

- **Cấm nhồi Full Repo:** Yêu cầu tạo "Repo Summary", "Architecture Map", "Decision log" trước rồi mới nạp phần cần thiết.
- **Dùng Pro đúng lúc:** Dùng V2.5-Pro cho task trên 100k context hoặc cần reasoning nhiều bước. Còn lại mặc định dùng V2.5.
- **Bắt buộc có Output:** Mọi workflow đều phải sinh ra artifact rõ ràng (plan.md, audit.md, repo-card.md, migration-checklist.md).
- **Cache Everywhere:** Cache mọi thứ lặp lại: AGENTS.md, coding standards, repo map, system prompt, memory summaries.

## 3. Top 5 Use-cases Đáng Tiêu Token Nhất

1. **Cross-repo architecture audit:** Đọc chéo `ios-hub`, `ios-memory`, và 2-4 repo app để tìm conflict giữa docs, rules, conventions.
2. **Migration planning:** Lên kế hoạch refactor/migration quy mô nhiều repo cùng lúc thay vì từng repo rời rạc.
3. **Knowledge compression:** Biến doc dài thành *repo cards, decision records, index files* để các model khác dùng lại rẻ hơn.
4. **Codebase review with memory:** Đưa changelog + AGENTS + standards + diff vào để review sát style hệ BKPlus hơn.
5. **Multimodal QA:** Dùng Omni/V2.5 để đọc screenshot, soi bug UI, App Store listing, UI flow.

## 4. Lộ Trình 30 Ngày (30-Day Execution Plan)

- **Tuần 1:** Setup provider, log usage, benchmark 20-30 task thật.
- **Tuần 2:** Build *Repo Summaries* cho toàn bộ các repo chính.
- **Tuần 3:** Chọn 3 workflow cố định để MiMo xử lý hằng ngày.
- **Tuần 4:** Đo ROI. Cắt ngay các workflow tốn token nhưng không tạo output dùng lại được.

## 5. 3 Workflow Phải Chạy Ngay
- **Docs-to-memory:** Đọc docs mới rồi sinh memory note chuẩn.
- **PR/review copilot:** Đọc diff + standards + related docs để review sâu.
- **Refactor planner:** Đọc nhiều module/repo rồi sinh execution plan trước khi code.

## 6. Những Việc TUYỆT ĐỐI KHÔNG NÊN LÀM (Anti-patterns)
- ❌ Dùng V2.5-Pro cho bug nhỏ hoặc tác vụ chỉ sửa 1 file.
- ❌ Spam prompt exploratory dài nhưng không lưu output.
- ❌ Nạp raw context lặp lại mỗi phiên thay vì tạo layer tóm tắt trung gian.
- ❌ Dùng quota lớn cho chat ad-hoc không gắn với artifact hay workflow.
