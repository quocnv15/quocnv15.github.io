---
layout: page
title: Memory Mentors Notes
permalink: /memory/mentors/
---

> Repo hiện chưa có thư mục mentors local độc lập; trang này tổng hợp các insight mentors xuất hiện trong case studies đã publish.

## Mentor Signals Available

### Tony - "20% Judgment" Lens

Nguồn tham chiếu trong case studies/frameworks:

- [001 - System Behind 14 Apps](/portfolio/showcase/case-studies/001-system-behind-14-apps.md)
- [011 - Co-Founder AI Quality Gate](/portfolio/showcase/case-studies/011-quality-gate-co-founder.md)
- [017 - Quality Gate Architecture](/portfolio/showcase/case-studies/017-quality-gate-architecture.md)
- **[Framework: The 20% Value](/portfolio/showcase/framework/the-20-percent-value-framework.md)**

Các ý chính được dùng xuyên suốt:

- Giá trị chuyển từ **generate output** sang **evaluate output**.
- AI làm 80%, nhưng 20% quyết định đúng/sai là phần của hệ thống tư duy.
- Chất lượng đến từ quality gate + checklist + feedback loop, không chỉ từ tốc độ code.

### ThieuNV - "Agent Teams & Progressive Disclosure"

Nguồn tham chiếu:
- **[Framework: Agent Teams & Progressive Disclosure](/portfolio/showcase/framework/agent-teams-framework.md)**

Pattern được áp dụng:
- Sử dụng nhiều Agent làm việc song song (Code, Review, Security) thay vì 1 Agent đa năng.
- Áp dụng quy tắc "200 dòng" để tránh Context Rot. Bắt đầu với Metadata -> CLAUDE.md -> Reference Detail.
- Nút thắt cổ chai không còn nằm ở tốc độ viết code, mà nằm ở chất lượng instruction.

### CuongVo - "First Principles (Từ bột ngọt đến bán dẫn)"

Nguồn tham chiếu:
- **[Framework: Từ Bột Ngọt Đến Bán Dẫn](/portfolio/showcase/framework/first-principles-framework.md)**

Pattern được áp dụng:
- Đào sâu vào nguyên lý máy (Clean Architecture, Rendering Loop, Memory Management).
- Khai thác tối đa thế mạnh chìm (tacit knowledge) để bảo vệ bản thân khi AI phổ cập. Tương tự câu chuyện Ajinomoto dùng lõi axit amin để độc quyền vật liệu bán dẫn ABF.

### Nguyen Ngoc Tuan - "Từ Chat sang Work & AI Effect"

Nguồn tham chiếu:
- **[Framework: Từ Chat sang Work & Hiệu Ứng AI](/portfolio/showcase/framework/tu-chat-sang-work-framework.md)**

Pattern được áp dụng:
- Xóa bỏ tư duy "Command and Control", chuyển sang "Collaborative Tone".
- Sử dụng EPCC (Explore-Plan-Code-Commit) để AI có budget token suy nghĩ trước khi "nhảy vào vá bug".
- Từ bỏ vị thế thợ code chuyển sang vị thế System Manager/Orchestrator.

### Uncle Dao - "Thin Harness, Fat Skills"

Nguồn tham chiếu:
- **[Framework: Thin Harness, Fat Skills](/portfolio/showcase/framework/thin-harness-fat-skills-framework.md)**

Pattern được áp dụng:
- Push intelligence up (cho LLM quyết định các vấn đề suy luận mờ ở Latent Space), Push execution down (cố định các thao tác máy móc ở Deterministic Space).
- Phát triển hệ tư duy vòng lặp **Investigation -> Diarization -> Rewrite Skill** giúp Agent trở thành "Hệ tự học" chứ không đơn thuần là "Máy phản biện".
- Duy trì Core tool mỏng nhẹ nhưng rèn luyện kho tàng "Kỹ năng đóng gói" cực dày.

### Zuey - "Context Engineering (RPI Workflow)"

Nguồn tham chiếu:
- **[Framework: Context Engineering](/portfolio/showcase/framework/context-engineering-framework.md)**

Pattern được áp dụng:
- Xoá bỏ ngộ nhận "Sub-agents = Human Roles" -> "Sub-agents = Context Enforcers/Scouts". Tránh hiện tượng Context Window tràn quá 40% (Dumb Zone).
- Bắt buộc áp dụng Workflow R-P-I (Research -> Plan -> Implement). Nén Intent ở bước Plan và Human Review khắt khe nhất ở đó.
- Code với Fresh Context để AI giữ được IQ tối đa.

---

## Co-Founder AI Mentorship Pattern

Case studies liên quan:

- [011 - Co-Founder AI Quality Gate](/portfolio/showcase/case-studies/011-quality-gate-co-founder.md)
- [012 - Agentlytics Data-Driven DNA](/portfolio/showcase/case-studies/012-agentlytics-data-driven-dna.md)

Pattern mentor hóa quy trình:

1. Enforce chuẩn (lint/build/compatibility).
2. Đánh giá giá trị business (speed, friction, retention).
3. Human judgment chỉ tập trung ở tầng quyết định chiến lược.

## Actionable Reading

- Nếu bạn muốn cải thiện kiến trúc: bắt đầu từ [001](/portfolio/showcase/case-studies/001-system-behind-14-apps.md).
- Nếu bạn muốn nâng quality system: đọc [011](/portfolio/showcase/case-studies/011-quality-gate-co-founder.md) và [017](/portfolio/showcase/case-studies/017-quality-gate-architecture.md).
- Nếu bạn muốn ra quyết định kinh doanh tốt hơn: đọc [018](/portfolio/showcase/case-studies/018-unit-economics-validation.md).

## Related

- [Memory Showcase Library](/memory/showcase/)
- [Memory Hub Summary](/memory/)
- [Dashboard](/dashboard/)
