# Case Study 016: Core System Refinement & Token Optimization

> **Tinh gọn hệ thống cốt lõi để đạt hiệu suất 100% Agent Coverage và tối ưu hóa chi phí vận hành**

---

## 1. Bối cảnh & Vấn đề

Repo `ios-kit` (Core) sau một thời gian phát triển đã trở nên cồng kềnh, dẫn đến:
- **Token Bloat:** Mỗi câu lệnh tiêu tốn quá nhiều context (lãng phí ~400 tokens/session).
- **Instruction Fatigue:** File `CLAUDE.md` quá dài khiến AI dễ bị nhầm lẫn hoặc bỏ qua các quy tắc quan trọng.
- **Dead Code:** Nhiều script cũ không còn sử dụng nhưng vẫn tồn tại, làm nhiễu quá trình tìm kiếm của AI.
- **Inconsistent Policy:** Thiếu quy định rõ ràng về việc sử dụng các Model AI khác nhau cho từng loại tác vụ.

## 2. Giải pháp: Refinement Blitz

Một đợt tổng tấn công vào sự phức tạp của hệ thống đã được thực hiện thông qua 5 giai đoạn:

1.  **Dead Code Cleanup:** Loại bỏ hoàn toàn các file rác và script lỗi thời.
2.  **Slim CLAUDE.md:** Tái cấu trúc file hướng dẫn, chuyển các chi tiết kỹ thuật sang các file tham chiếu riêng biệt.
3.  **Split Design Documentation:** Tách biệt tài liệu kiến trúc (Architecture) khỏi tài liệu vận hành (Playbook).
4.  **Model Policy Integration:** Thiết lập quy tắc chọn Model (Claude 3.5 Sonnet vs. Haiku vs. Opus) dựa trên độ phức tạp của task.
5.  **Unified /ios Command:** Hợp nhất các lệnh rời rạc vào một entry point duy nhất để giảm ma sát khi sử dụng.

---

## 3. Các cải tiến cốt lõi (The 20% Core)

### 1. Token-First Engineering
- Ưu tiên việc giảm dung lượng context mà không làm mất đi tính chính xác của hướng dẫn.
- Kết quả: Tiết kiệm ~400 tokens cho mỗi lượt hội thoại, trực tiếp giảm chi phí API.

### 2. Model-Task Alignment
- Định nghĩa rõ "Task Profile": Task sáng tạo dùng Opus, Task thực thi dùng Sonnet, Task lặp lại dùng Haiku.
- Giúp hệ thống vận hành với chi phí tối ưu nhất mà vẫn đảm bảo chất lượng.

### 3. Unified Interface
- Thay vì bắt AI nhớ 10 lệnh khác nhau, giờ đây chỉ cần `b-fix` hoặc `/ios` để kích hoạt logic tự động điều hướng.

---

## 4. Kết quả & Tác động

- **Efficiency:** Giảm 30% lượng token tiêu thụ trung bình mỗi session.
- **Reliability:** 100% Agent Coverage (25/25 agents hoạt động đúng theo policy mới).
- **Maintenance:** Việc bảo trì hệ thống trở nên dễ dàng hơn nhờ cấu trúc thư mục rõ ràng và không còn mã thừa.

## 5. Bài học kinh nghiệm (The 20% Judgment)

> *"Sự tinh tế không phải là khi không còn gì để thêm vào, mà là khi không còn gì để bớt đi. Một hệ thống AI tốt nhất là hệ thống cung cấp đủ ngữ cảnh để làm việc nhưng không quá nhiều để gây nhiễu."*

---

## See Also
- [CLAUDE.md (Refined)](../../../ios-kit/CLAUDE.md)
- [Agent Model Policy](../../../ios-kit/docs/flywheel/references/model-policy.md)
- [Case Study 014: Zero-Dependency Native Mastery](../case-studies/014-zero-dependency-native-mastery.md)
