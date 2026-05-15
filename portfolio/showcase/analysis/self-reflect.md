---
layout: portfolio-detail
title: "Self-Reflect: 80/20 Divide"
permalink: /portfolio/showcase/analysis/self-reflect/
back_url: /portfolio/showcase/
back_label: "← Showcase"
---

# Bản Thảo Luận: Chuyển Dịch 20% Giá Trị Cốt Lõi (Quoc vs AI)

> **Mục đích:** Tài liệu này dùng để thảo luận, self-reflect và làm rõ các bước chiến lược tiếp theo để khuếch đại 20% giá trị cốt lõi của bản thân, dựa trên nhận định "AI làm tốt 80%, giá trị của chuyên gia nằm ở 20% còn lại".
> **Context tham chiếu:** Bài viết "AI không thay thế bạn. Nhưng nó làm bạn ít liên quan hơn" và "SOUL.md - Hồ sơ cá nhân".

---

## 1. Định Vị Ranh Giới (The 80/20 Divide)
*Chúng ta cần rõ ràng tuyệt đối: Đâu là thứ AI sẽ tự làm, và đâu là thứ chỉ mình được quyền quyết định?*

- **Cái 80% (Giao hoàn toàn cho AI / Cursor / Claude Code):**
  - Viết code boilerplate, implement UI từ design.
  - Setup API calls, database schema ban đầu.
  - Fix syntax error, viết test cases cơ bản.
  - Draft documentation.

- **Cái 20% (Giá trị độc bản của Quoc - The Orchestrator):**
  - **System Design:** Lựa chọn architecture, define constraints (ví dụ: chia layer trong Clean Architecture, quản lý state trong SwiftUI).
  - **Workflow Rules:** Quản trị luồng Spec-to-Ship, CASS context rituals, 4-layer agent orchestration.
  - **Masterpiece Judgment:** Đánh giá code có đủ clean chưa? Có sinh ra tech debt không? Có vi phạm guideline về scale không?

**👉 Câu hỏi để thảo luận:**
1. Trong tuần vừa rồi, có lúc nào mình đâm đầu vào tự gõ code (làm phần việc 80% của AI) chỉ vì "làm mẹ cho lẹ" (fix-first bias) không? 
2. Có tác vụ nào mình đang tự làm mà hoàn toàn có thể delegate cho AI qua một prompt cứng (Hard-prompt) không?

---

## 2. Số Hoá Sự Đánh Giá (Enforcement Mechanisms)
*Trích bài viết: "Giá trị đang chuyển từ khả năng tạo ra output sang khả năng đánh giá output."*

Thay vì dùng "kỷ luật cá nhân" để đánh giá 80% của AI, cần dùng "hệ thống" để ép AI tự đánh giá dựa trên tiêu chuẩn 20% của mình.

**Current State:**
- Đã có `checklist.py`, `gate-check.sh`.
- Có L1-L4 skill system để hướng AI đi đúng hướng.

**👉 Câu hỏi để thảo luận:**
1. Các Hard-Gates (`gate-check.sh`, `lint_runner`) hiện tại đã đủ "gắt" chưa? Có lọt bug do AI "hứa lèo" không?
2. Mình có thể viết thêm các tool tự động nào để bắt những lỗi Architecture mà AI hay phạm phải? (Ví dụ: script quét tìm Tight Coupling, quét UI không support Dynamic Type?)
3. Khi AI đưa ra 1 output "có vẻ 80% ổn", workflow nào buộc AI phải đi qua "chốt kiểm duyệt chất lượng" của mình trước khi được commit?

---

## 3. Trình Diễn 20% Giá Trị (Masterpiece Showcase)
*Trích bài viết: "Khả năng articulate tại sao 20% đó quan trọng... đang trở thành kỹ năng ngày càng hiếm."*

Nếu chỉ show cái app cuối cùng, người ta sẽ không thấy cái "system" đằng sau. Mà system mới là giá trị cốt lõi của định vị "System Architect".

**👉 Câu hỏi để thảo luận:**
1. Làm sao để show được `ios-kit` và `ios-memory` cho người khác thấy sự tinh vi trong luồng làm việc của mình? 
2. Nên viết bài (blog/portfolio case study) phân tích về "Cách tôi dùng AI xây dựng app này bằng Spec-to-Ship Flow" thay vì chỉ nói "Đây là app mới của tôi"?
3. Đâu là ngách (niche) mà sự kết hợp giữa "AI Builder + Strict Architecture" của mình sẽ là vô đối so với các coder thông thường?

---

## 4. Hành Động Tiếp Theo (Action Items)

- [ ] Phân tích 1 tool đang dùng (Cursor/Claude) và tìm cách tự động hoá 1 bước thủ công mình hay chêm vào giữa.
- [ ] Review lại `ARCHITECTURE.md` hoặc `SOUL.md`: Có điểm nào cần update để siết chặt AI hơn không?
- [ ] Chọn 1 app trong Portfolio và lên nội dung "Case Study: The System Behind the App" (showcase cái 20%).

---
*Ghi chú thêm (Có thể điền trong quá trình self-reflect):*
...
