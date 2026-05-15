---
layout: portfolio-detail
title: "Harness Engineering Framework"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/05-harness-engineering-framework/
---

# Khung Kiến Trúc: Harness Engineering Framework

> **Tác giả:** System Architect  
> **Nguồn tri thức:** CES Global Academy  
> **Phiên bản:** 1.0 (Áp dụng từ tac-15)  

## 1. Triết Lý Cốt Lõi (Core Philosophy)

> **Tài liệu tổng hợp:** Xem [06. Agent-First Harness Master Playbook](./06-agent-first-harness-master-playbook.md) để có cái nhìn toàn cảnh từ OpenAI, GoClaw và các Mentor.

**Harness Engineering** là bước tiến hóa từ "Vibe Coding" (phó mặc hoàn toàn cho AI đoán ý) sang "System Architect" (kiểm soát chủ động môi trường làm việc của AI). Triết lý này xây dựng một hệ thống "dây cương" (harness) vững chắc để kìm hãm ảo giác (hallucination), chống trôi dạt ngữ cảnh (context drift) và đảm bảo chất lượng code đầu ra tuyệt đối.

Thay vì nhồi nhét mọi thứ vào Agent, hệ thống áp dụng chiến lược **"Thin Harness, Fat Skills"** — Dây cương (Orchestrator) cực mỏng, và Kỹ năng (Skills) cực dày.

## 2. 5 Hệ Thống Kiểm Soát (The 5 Subsystems)

Để kìm cương Agent, hệ thống yêu cầu 5 mảnh ghép phối hợp:

### 2.1. Instructions (Hệ thống Chỉ dẫn lũy tiến)
Sử dụng nguyên tắc **Progressive Disclosure** để tránh quá tải token (Context Pollution):
- **Tier 0:** Global Rules (luôn luôn có mặt trong `maestro.md`).
- **Tier 1:** Domain Knowledge (chỉ load khi vào đúng dự án/thư mục).
- **Tier 2:** Feature Spec (chỉ load khi làm đúng task đó).

### 2.2. State Management (Hệ thống Trạng thái 3 lớp)
Chấm dứt việc AI quên việc đang làm bằng cách thiết lập **System of Record (SoR)** phân tán:
- **Lớp 1 (Machine-readable):** `feature_list.json` - Danh sách task, test steps, và trạng thái (Pending/In-progress/Done).
- **Lớp 2 (Human-readable):** `claude-progress.md` - Nhật ký tường thuật phiên làm việc để bàn giao (handoff) bối cảnh cho Agent đời sau.
- **Lớp 3 (Global Memory):** `ios-memory` - Lưu trữ định hướng chiến lược.

> **Trạng thái triển khai:** Hiện tại state được lưu tại `claude/session-state/` (canonical runtime path, đã có dữ liệu). Target migration sang `.agent/state/` chưa thực hiện — sẽ migrate khi có thí điểm.

### 2.3. Verification Pyramid (Kim Tự Tháp Kiểm Chứng 5 Tầng)
Thực thi quy tắc **"No False Done"** để chống lại tình trạng chiến thắng sớm (Premature Victory). Lớp kiểm chứng này được bóc tách ra khỏi luồng code thông thường (`/cook`) và đặt vào họ lệnh độc lập chuyên biệt đã triển khai tại `ios-kit/claude/commands/`:
- **`/q-gate`** — Verification Pyramid, **default L1-L3** (Static + Unit + Build). Dùng `--level 5` hoặc `--epic` để chạy full L1-L5.
- **`/q-verify`** — Quick L1 Static Analysis, chạy bất cứ lúc nào.
- **`/q-audit`** — Đánh giá chất lượng Agent Skills theo chuẩn 9-Layer.

- **Lvl 1 (Static):** Linter + Type-check.
- **Lvl 2 (Unit):** XCTest / Xunit.
- **Lvl 3 (Build):** Khởi chạy bộ biên dịch (`xcodebuild`).
- **Lvl 4 (Smoke):** Khởi động App thành công, ping API thành công.
- **Lvl 5 (E2E):** Chạy UI Tests / Playwright.

> **Quyết định kiến trúc:** Để giữ vững "Tier 1 Build Strategy" (Code siêu tốc không bị kìm hãm), kim tự tháp này **không** được kích hoạt tự động sau mỗi Bead, mà được gọi thủ công qua lệnh `/q-gate` khi đóng Epic.

### 2.4. Scope Control (Hệ thống Khoanh vùng)
Agent không được phép "cào" (grep) toàn bộ dự án nếu không cần thiết.
- Áp dụng các script như `safegrep.sh` để giới hạn số lượng kết quả trả về.
- Agent chỉ tập trung xử lý **MỘT** task duy nhất tại một thời điểm (One-Task Policy).

### 2.5. Session Lifecycle (Vòng đời 4 pha)
Quản lý chặt chẽ vòng đời của một phiên làm việc (Session) thông qua các Pipeline:
1. **START:** Chạy script khởi tạo môi trường, load State (Lớp 1 & Lớp 2).
2. **SELECT:** Nhặt chính xác MỘT task chưa hoàn thành.
3. **EXECUTE:** Thực hiện code và tự sửa lỗi bằng LSP.
4. **WRAP-UP:** Chạy Quality Gate (`/q-gate`), ghi nhận log vào State, thực hiện Atomic Commit.

## 3. Lợi Ích & Áp Dụng
- Giảm thiểu 90% lỗi phá vỡ hệ thống do Agent can thiệp lung tung.
- Tiết kiệm Token đáng kể do cơ chế quản lý Scope và Instructions lũy tiến.
- Tốc độ phát triển có thể chậm lại ở giai đoạn đầu (do phải setup Harness), nhưng tăng tốc theo cấp số nhân ở giai đoạn bảo trì.

## References
- **Capability Engineering**: [07-capability-engineering-framework.md](./07-capability-engineering-framework.md) — Mô hình 9-Layer cho việc tạo Skills.
- **Exocortex First Brain**: [09-exocortex-first-brain-architecture.md](./09-exocortex-first-brain-architecture.md) — Triết lý First Brain + Self-Learning Loop.
- **Skill Creation SOP**: [07-agent-skill-creation-sop.md](../playbook/SOPs/agent-skill-creation-sop.md) — Quy trình 4 bước tạo Skill chuẩn.
- **Mentor Sources**: CES Global Academy (Harness Engineering), Thanh Đô (Thin Harness/Fat Skills), Cuong Vo (Description Optimization).
