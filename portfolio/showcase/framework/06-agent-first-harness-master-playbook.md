---
layout: portfolio-detail
title: "Agent-First Master Playbook"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/06-agent-first-harness-master-playbook/
---

# Master Playbook: Agent-First Harness System

> **Tầm nhìn:** Chuyển đổi Repository từ "Kho lưu trữ code" thành "Môi trường vận hành Agent" (Agent Runtime Environment).
> **Sự tổng hợp từ:** OpenAI (Harness Engineering), Bang Hoang (Trust Layer), Matt Pocock (Lockdown Tests), Matthew Miller (IDE Harness), và GoClaw (Orchestration).

---

## 1. Định Nghĩa "Harness" (Lớp Yên Cương)

Theo **Bang Hoang**, Harness không chỉ là bộ test. Nó là **Trust Layer** (Lớp Tin Cậy) của kỷ nguyên Agent.
- **App** là thứ người dùng thao tác.
- **Harness** là thứ Agent thao tác.
Nó là tập hợp các bản đồ (maps), quy chuẩn, tài liệu, workflow, scripts, và rào chắn kiểm tra giúp Agent làm việc tin cậy bên trong một codebase.

---

## 2. Các Trụ Cột Kỹ Thuật (Sơ đồ Tổng hợp)

### 2.1. Thiết kế Môi trường (Environment Design - OpenAI)
- **Rigid Architecture:** Kiến trúc phân lớp cứng nhắc là điều kiện tiên quyết. Chỉ phụ thuộc "Forward" (Types → Config → Repo → Service → UI).
- **Mechanical Enforcement:** Sử dụng Linters tùy chỉnh để ép xung "Taste" (khẩu vị kiến trúc) và quy chuẩn đặt tên. Khi Agent sai, hệ thống tự động tiêm hướng dẫn sửa lỗi vào context.
- **System of Record:** Mọi thứ phải nằm trong Repo. Nếu không có trong Markdown/Code, Agent coi như nó không tồn tại.

### 2.2. Kiểm soát Luồng & Xung đột (Orchestration - GoClaw)
- **Lane-Based Concurrency:** Tách biệt tài nguyên giữa luồng Chat người dùng, luồng Team Task, và luồng Cron Job.
- **Post-Turn Dispatch:** Tránh Race Condition bằng cách chỉ dispatch task sau khi Lead kết thúc lượt (turn).
- **Blocker Escalation:** Khi Agent "bí", nó phải tự động báo `blocker` để hủy session và leo thang (escalate) lên con người/lead thay vì cố làm sai.

### 2.3. Khung Bảo vệ & Chống Slop (Lockdown - Matt Pocock)
- **Deep Module Harness:** Bao bọc các module quan trọng bằng bộ test chặt chẽ.
- **No False Done:** AI chỉ được coi là "Xong" khi vượt qua bộ Harness.
- **De-slop:** Dùng Harness để giữ cho AI không sinh ra code rác khi refactor các hệ thống cũ (Legacy).

### 2.4. Trải nghiệm & Hiệu năng (IDE & Benchmarking - Matthew Miller)
- **Planning Mode:** Agent phải breakdown task thành các bước nhỏ (Sub-tasks) trước khi thực thi.
- **Benchmarking (Bridgebench):** Đo lường hiệu suất Agent trên các task thực tế thay vì chỉ trên lý thuyết.

---

## 3. Quy Trình Vận Hành Harness (Standard Workflow)

Áp dụng quy trình **Think-Plan-Do-Review-Ship** tích hợp Harness:

1.  **Map Discovery (START):** Agent đọc `AGENTS.md` (Table of Contents) để tìm bản đồ kiến trúc.
2.  **Execution Plan (PLAN):** Tạo một bản kế hoạch thực thi (Execution Plan) được phiên bản hóa trong `docs/exec-plans/`.
3.  **Isolated Execution (DO):** Chạy trên một Git Worktree riêng biệt với hệ thống Observability (Logs/Metrics) cô lập.
4.  **Recovery Loop (REVIEW):** 
    - **Ralph Wiggum Loop:** Agent tự review và nhờ Agent khác review (Agent-to-Agent).
    - **Verification Pyramid:** L1 (Static) → L2 (Unit) → L3 (Build) → L4 (Smoke) → L5 (E2E).
5.  **Garbage Collection (SHIP):** Chạy các Agent "Doc-gardening" để dọn dẹp tài liệu cũ và đồng bộ hóa lại Harness.

---

## 4. Triết lý "Thin Harness, Fat Skills"

Để hệ thống di chuyển nhanh, chúng ta cần:
- **Thin Harness (Khung xương mỏng):** Bộ khung điều hành tối giản, trơn tru.
- **Fat Skills (Cơ bắp dày):** Đóng gói tri thức, heuristics và quy trình vào các "Skills" độc lập. Giá trị của con người nằm ở việc **Thiết kế Skills** và **Bảo trì Harness**.

---

## 5. Kết luận: Vai trò mới của Kỹ sư

Trong thế giới Agent-First, công việc của bạn không còn là viết code logic. Công việc của bạn là **Environment Designer**:
- Thiết kế các Building Blocks.
- Cung cấp công cụ (Skills).
- Xây dựng các vòng lặp phản hồi (Feedback Loops).
- Thiết kế các rào chắn kiến trúc (Guardrails).

> **Tầm nhìn OpenAI:** Humans steer. Agents execute. Hệ thống được xây dựng trong 1/10 thời gian truyền thống nhờ sự kỷ luật của Harness.

---
**Xem thêm:**
- [05-harness-engineering-framework.md](./05-harness-engineering-framework.md) — Chi tiết 5 hệ thống kiểm soát.
- [07-capability-engineering-framework.md](./07-capability-engineering-framework.md) — Cách tạo Fat Skills.
- [GoClaw Project](../../growth/mentors/goclaw/README.md) — Thực thi multi-agent orchestration.
