---
layout: portfolio-detail
title: "Communication Structure Analysis"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/001-communication-structure-analysis/
---

# Brainstorming: Cải Thiện Kỹ Năng Trình Bày & Giao Tiếp Cho Solo Developer

## 1. Problem Statement & Context
Bạn là một Solo Developer (Indie Publisher) với mindset hệ thống ("Build systems, not features"). Bạn đang gặp khó khăn trong việc trình bày vấn đề rõ ràng, thiếu cấu trúc khi nói chuyện, đặc biệt khi cần giao tiếp ý tưởng phức tạp (architecture, trade-offs, roadmap).

**Constraints & Context (từ `SOUL.md` & `IDENTITY.md`):**
- **Thế mạnh:** Systems thinking, nhìn big picture, thiết kế architecture vững.
- **Điểm yếu:** Khó delegate, quen tự làm, đôi khi bỏ qua planning khi muốn code nhanh.
- **Phong cách:** Ngắn gọn, trực tiếp, không vòng vo. Explain phức tạp thường dùng concrete example/thực tế.
- **Tính chất công việc:** Solo, tương tác chủ yếu với AI (Cursor, Claude) và thỉnh thoảng đối tác kinh doanh (họ lo Biz/Marketing, bạn lo Tech).

## 2. Root Cause Analysis (Tại sao Solo Dev thường gặp vấn đề này?)

Nhiều solo dev gặp vấn đề về trình bày vì:
- **Tư duy phi tuyến tính (Non-linear thinking):** Bạn nhìn thấy toàn bộ hệ thống cùng lúc (A liên kết B, B ảnh hưởng C) nên khi nói, bạn muốn truyền đạt tất cả ngay lập tức, dẫn đến thiếu mạch lạc (nonlinear delivery).
- **Curse of Knowledge (Lời nguyền của kiến thức):** Bạn hiểu hệ thống quá sâu nên vô thức bỏ qua các concept cơ bản mà người nghe (hoặc AI nếu prompt không đủ context) cần biết trước.
- **Thiếu vòng lặp phản hồi (Feedback loop):** Làm việc một mình ít có cơ hội bị người khác "challenge" (hỏi vặn lại) để rèn giũa cách giải thích hằng ngày.

## 3. Recommended Frameworks & Approaches

Dựa trên nguyên tắc YAGNI, KISS và phong cách "trực tiếp, ngắn gọn" của bạn, dưới đây là các approaches tối ưu:

### Approach A: Áp dụng BLUF (Bottom Line Up Front)
*Nguyên tắc quân đội: Nói thẳng kết quả/quyết định/vấn đề trước, sau đó mới giải thích.*

- **Pros:** Cực kỳ hợp với phong cách ngắn gọn của bạn. Tiết kiệm thời gian cho đối tác (Biz/Marketing). Bắt buộc bạn phải chắt lọc ý cốt lõi trước khi mở miệng.
- **Cons:** Đôi khi cảm giác hơi cụt lủn nếu đối tác thuộc tuýp thích bối cảnh.
- **Thực hành:** 
  - Thay vì: *"Hệ thống DTO hiện tại đang bị A, B, C... dẫn đến việc khi gọi API X thì xảy ra lỗi Y. Nên tôi nghĩ mình nên cấu trúc lại..."*
  - BLUF: *"Tôi quyết định đập đi xây lại hệ thống DTO (Kết luận). Lý do là vì kiến trúc cũ đang gây lỗi API X (Lý do cốt lõi). Detail tôi có thể giải thích thêm (Context)."*

### Approach B: Pyramid Principle (Nguyên lý Kim Tự Tháp - McKinsey)
*Tuyệt chiêu cấu trúc ý tưởng logic, đặc biệt hiệu quả khi giải thích kiến trúc hoặc thuyết phục đối tác.*

- **Pros:** Fix triệt để bệnh "trình bày thiếu cấu trúc". Tương thích tuyệt đối với tư duy hệ thống (Systems Thinking) của bạn.
- **Cons:** Cần một chút thời gian chuẩn bị (mental planning) trước khi nói/viết.
- **Thực hành:** 
  1. **Core Idea:** Luận điểm chính (Ví dụ: "Mình cần 3 ngày để refactor ASOSyncViewModel").
  2. **Supporting Arguments:** Các nhánh support (1. Nó đang thành God Object, 2. AI sửa thường xuyên sinh bug, 3. Chặn đường scale sau này).
  3. **Evidence:** Phân tích data (Ví dụ: File bị edit 30 lần, 70 session linter error...). *Đây chính là cách bạn hay dùng "concrete examples"*!

### Approach C: Kỹ Thuật "Rubber Ducking" Kết Hợp AI
*Thay vì giải thích cho con vịt cao su, hãy sử dụng Claude như một "đối tác khó tính".*

- **Pros:** Tận dụng sẵn công cụ bạn đang dùng hằng ngày (Claude/Antigravity). Khắc phục điểm yếu "thiếu vòng lặp phản hồi".
- **Cons:** Tốn thêm input token và một ít thời gian setup session.
- **Thực hành:** Trước khi trình bày vấn đề thực sự với đối tác kinh doanh hoặc viết spec, hãy ném nó cho Claude với prompt: *"Tôi định giải thích với đối tác về việc thay vì dùng Firebase, tôi sẽ dùng ccpoke. Đây là bản draft của tôi: [Draft]. Hãy đóng vai một người không biết kỹ thuật, vạch lá tìm sâu xem chỗ nào khó hiểu, dài dòng hoặc thiếu thuyết phục."*

### Approach D: Khung SCQA (Situation - Complication - Question - Answer)
*Dành cho việc viết Proposal, Plan.md hoặc khi khởi tạo một session AI lớn.*

- **Pros:** Tạo bối cảnh cực rõ ràng, chống "Hallucination" cho AI và chống "lạc đề" cho chính bạn.
- **Cons:** Hơi formal cho các cuộc nói chuyện hằng ngày.
- **Thực hành:**
  - **S (Bối cảnh):** App của chúng ta đang dùng Firebase để push thông báo.
  - **C (Vấn đề):** Mất quá nhiều thời gian maintain và chi phí scale.
  - **Q (Câu hỏi):** Làm sao để vẫn đẩy thông báo được nhưng giảm 50% effort?
  - **A (Giải pháp):** Chuyển sang dùng ccpoke qua Telegram.

## 4. Final Recommendation & Implementation Plan

Đối với một Solo iOS Developer có mindset thiên về Architecture và thích sự ngắn gọn, tôi khuyên bạn kết hợp **BLUF (kết luận trước)** cho giao tiếp hằng ngày và **Pyramid Principle (Kim tự tháp)** khi phải giải thích thiết kế hệ thống. Bỏ qua SCQA vì có thể rườm rà không cần thiết.

**Kế hoạch thực thi (Actionable Steps):**

1. **Rule of 3 (Quy tắc số 3):** Từ nay, bất cứ khi nào trình bày options/lý do, **chỉ đưa ra tối đa 3 ý**. Tự ép mình nhét mọi thứ vào 3 bullet points. Tư duy của bạn rất tốt, chỉ cần ép vào khuôn rập 3 ý, nó sẽ tự động trở nên có cấu trúc.
2. **Mental Drafting (Phác thảo trong đầu):** Trước khi chat với đối tác hoặc viết prompt lớn cho AI, dừng 10 giây định hình:
   - Câu đầu tiên mình nói là gì? (Kết luận - BLUF)
   - 3 ý bổ trợ là gì? (Pyramid)
3. **Refactor cách prompt AI:** Bạn đã có rule *"Luôn cung cấp constraints rõ trước khi yêu cầu code"* trong `SOUL.md`. Hãy format các prompt đó thành bullet points thay vì đoạn văn dài. Cấu trúc bạn áp đặt lên AI cũng sẽ rèn luyện cấu trúc tư duy của bạn.

## 5. Next Steps
Bạn thấy approach nào (BLUF hay Pyramid) phản ánh đúng nhất cách bạn MONG MUỐN giao tiếp? Nếu đồng ý, chúng ta có thể cập nhật `SOUL.md` (phần Communication Style) để chính các Agent AI sau này cũng phải bắt chước format này khi trao đổi với bạn, tạo thành một "cơ chế ép buộc" (enforcement mechanism) giúp bạn quen dần qua thẩm thấu.

---

## See also
[[memory_bank/knowledge/ios-expertise/README]], [[memory_bank/me/growth/001-communication-structure-analysis]], [[memory_bank/me/identity/SOUL]], [[memory_bank/knowledge/ios-expertise/CONSOLIDATED_SUMMARY]], [[memory_bank/me/growth/002-cognitive-framework-analysis]], [[memory_bank/memory/memory-MOC]]
