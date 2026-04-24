# Case Study 015: Stack-Agnostic Architecture (Beads System)

> **Xây dựng hệ thống tự động hóa đa nền tảng thông qua Project Profile Pattern**

---

## 1. Bối cảnh & Vấn đề

Hệ thống lệnh `b-*` (Beads) ban đầu được thiết kế riêng cho iOS/Xcode. Khi mở rộng hệ sinh thái sang SwiftUI, Web, và Backend, hệ thống bộc lộ những hạn chế nghiêm trọng:
- **Hardcoded assumptions:** Các lệnh như `b-cook` luôn mặc định chạy `xcodebuild`, `b-plan` giả định chỉ khám phá dự án iOS.
- **Tight coupling:** Logic xử lý lệnh bị trộn lẫn với chi tiết thực thi của từng nền tảng.
- **No abstraction layer:** Thiếu lớp trừu tượng để cấu hình hành vi dựa trên loại dự án.

## 2. Giải pháp: 3-Layer Stack Adapter

Thay vì sửa đổi từng lệnh cho mỗi nền tảng mới, một kiến trúc 3 lớp đã được triển khai để tách biệt logic điều khiển và thực thi:

1.  **Layer 1: Generic commands (b-*)**: Chứa logic phổ quát (Universal logic), không quan tâm đến nền tảng.
2.  **Layer 2: Project profile (`.claude/project-profile.yaml`)**: Khai báo loại stack, framework, và các quy tắc kiểm tra chất lượng.
3.  **Layer 3: Stack profiles**: Chứa các triển khai cụ thể cho từng nền tảng (Apple App, Web, Backend, etc.)

---

## 3. Các cải tiến cốt lõi (The 20% Core)

### 1. Project Profile Schema
- Định nghĩa một cấu trúc YAML chặt chẽ để AI hiểu được ngữ cảnh dự án ngay từ đầu.
- Cho phép chỉ định `stack_kind`, `ui_framework`, `worker_skills`, và `epic_quality_gate`.

### 2. Multi-LLM Worker Protocol
- Tách biệt vai trò của các Agent (Manager vs. Worker) thông qua giao thức truyền tin chung.
- Đảm bảo các lệnh Beads có thể vận hành trơn tru bất kể Model AI nào đang thực thi.

### 3. Stack-Agnostic Validation
- Các lệnh kiểm tra (Verification) giờ đây được điều hướng bởi profile thay vì hardcode script.
- Ví dụ: `b-fix` sẽ tự động chạy `xcodebuild` cho iOS nhưng chạy `npm test` cho dự án Web dựa trên khai báo trong profile.

---

## 4. Kết quả & Tác động

- **Tính linh hoạt:** `ios-kit` không còn giới hạn ở iOS, có thể dùng để quản lý bất kỳ dự án phần mềm nào.
- **Khả năng mở rộng:** Thêm một stack mới chỉ mất 30 phút (tạo profile mới) thay vì sửa đổi toàn bộ codebase.
- **Tính nhất quán:** Trải nghiệm phát triển (Developer Experience) đồng nhất trên toàn bộ hệ sinh thái Moboco.

## 5. Bài học kinh nghiệm (The 20% Judgment)

> *"Sức mạnh của công cụ không nằm ở việc nó làm được bao nhiêu thứ, mà ở việc nó thích nghi nhanh như thế nào với những thứ mới. Project Profile Pattern là chìa khóa để AI hiểu được 'luật chơi' của từng dự án mà không cần chúng ta phải giải thích lại từ đầu."*

---

## See Also
- [Project Profile Schema](../../../ios-kit/docs/flywheel/references/project-profile.schema.md)
- [Beads Documentation](../../../ios-kit/docs/flywheel/references/beads.md)
- [Case Study 011: Co-Founder AI Quality Gate](../case-studies/011-quality-gate-co-founder.md)
