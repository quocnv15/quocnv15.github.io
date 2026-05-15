---
layout: portfolio-detail
title: "Capability Engineering (9-Layer)"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/07-capability-engineering-framework/
---

# Khung Kiến Trúc: 9-Layer Capability Engineering

> **Tác giả:** System Architect  
> **Nguồn tri thức:** CES Global Academy & Cuong Vo  
> **Phiên bản:** 1.0 (Áp dụng từ tac-15)  

## 1. Từ Prompting Đến Capability Engineering
Trong kỷ nguyên Agentic, Prompting thủ công là không đủ. Hệ thống Exocortex Agentic OS chuyển đổi sang **Capability Engineering** — Kỹ nghệ đóng gói năng lực. Mỗi "Agent Skill" không còn là một file text chứa lời dặn dò, mà là một hệ thống phần mềm siêu nhỏ có kiến trúc rõ ràng.

Nguyên tắc thiết kế cốt lõi là **Tiết lộ lũy tiến (Progressive Disclosure)**:
- **Tầng 1 (100 tokens):** YAML Metadata — Để AI quyết định có bật Skill hay không.
- **Tầng 2 (500 dòng):** Hướng dẫn chính — Để AI biết luồng công việc.
- **Tầng 3 (0 tokens ban đầu):** Tài liệu tham khảo (References) — Để AI tra cứu chuyên sâu.

## 2. Mô Hình 9 Lớp (9-Layer Model)
Mọi Core Skill / Complex Skill trong hệ thống đều phải tuân thủ cấu trúc thư mục và quy trình 9 lớp sau đây:

### L0: Use Case & Trigger Map
Xác định chính xác Vấn đề, Mục tiêu, và Lập bản đồ các tình huống mà người dùng sẽ gọi Skill này.

### L1: Metadata ("Biển Hiệu" của Skill)
File `metadata.yaml` (hoặc phần YAML Frontmatter trong `SKILL.md`). Đây là yếu tố sống còn quyết định 80% tỷ lệ Skill được AI gọi. Tối ưu theo 5 quy tắc:
1. Có ít nhất 5 **Trigger Phrases** (Câu nói thực tế của người dùng).
2. Viết theo **Tình huống (Situations)** thay vì liệt kê tính năng.
3. Dùng cụm từ điều kiện: *"BẤT CỨ KHI NÀO user..."*
4. Đưa ví dụ gõ thực tế từ Chat History.
5. Dưới 1024 ký tự và **KHÔNG dùng dấu tiếng Việt** để tối ưu khả năng đọc hiểu của Claude.

### L2: Core Skill (The Soul)
File `SKILL.md`. Chứa **Brain Logic** — Quy trình từng bước (SOP) mà Agent phải làm theo.
- Viết dưới dạng Markdown.
- Áp dụng các Design Pattern (Ví dụ: Tuần tự, Phối hợp Đa MCP, Tinh chỉnh Lặp lại).

### L3: References (Kiến thức Domain)
Thư mục `references/`. Chứa các tài liệu kỹ thuật dài, API docs, hoặc guideline chi tiết. Agent sẽ chỉ đọc các file này khi thật sự cần thiết, giúp tiết kiệm 90% chi phí Context.

### L4: Examples (Few-shot Learning)
Thư mục `examples/`. Chứa dữ liệu đầu vào / đầu ra mẫu. 
- **Bắt buộc:** Phải có các **Anti-examples** (Ví dụ sai, lỗi phổ biến) để ngăn chặn hội chứng Hallucination (Ảo giác) của AI.

### L5: Scripts (Validators / Helpers)
Thư mục `scripts/`. Chứa code thực thi (Python, Bash) hỗ trợ Skill. Ví dụ: Tool parse dữ liệu, script gọi API bên ngoài để tránh việc AI phải tự viết code lại mỗi lần.

### L6: Tools / Assets
Thư mục `assets/`. Chứa các tệp tĩnh như Template (mẫu báo cáo, mẫu code), Fonts, Biểu tượng.

### L7: QC / Output Contract
Hợp đồng kiểm soát chất lượng. Bộ checklist đánh giá (Checklist) ở cuối file `SKILL.md` hoặc một file `.py` riêng, bắt buộc AI phải "pass 100%" trước khi trả kết quả cho User.

### L8: Governance
File `registry.yml`. Hệ thống quản trị Skill, chứa lịch sử cập nhật (Changelog), người chịu trách nhiệm, và vòng lặp tự học (Self-learning loop) — Agent phải tự thêm bài học vào Skill sau khi làm sai.

## 3. Lợi ích
- **Tái sử dụng tuyệt đối:** Viết 1 lần, AI tự động gọi chính xác 90% số lần cần thiết.
- **Chống phình to bộ nhớ (Token Optimization):** Dung lượng Context của một Skill không bao giờ vượt quá 5% tổng cửa sổ 200k tokens của Claude.
- **An toàn:** Bị giới hạn rủi ro bởi Anti-examples và QC Contract.

## References
- **Harness Engineering**: [05-harness-engineering-framework.md](./05-harness-engineering-framework.md) — 5 Hệ thống kiểm soát môi trường Agent.
- **Exocortex First Brain**: [09-exocortex-first-brain-architecture.md](./09-exocortex-first-brain-architecture.md) — Triết lý First Brain + Self-Learning Loop.
- **Skill Creation SOP**: [07-agent-skill-creation-sop.md](../playbook/SOPs/agent-skill-creation-sop.md) — Quy trình 4 bước tạo Skill chuẩn.
- **Mentor Sources**: CES Global Academy (9-Layer Model, Progressive Disclosure), Cuong Vo (5 Quy tắc Description).
