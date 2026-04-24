# Case Study 05: Socratic Gate - Sức Mạnh Của Việc "Hoãn Code" 3 Ngày Mở Đầu

## 1. Ngữ Cảnh: Kì Vọng Cho Sự Đột Phá
Dự án kiến trúc một ứng dụng đột phá ("Dual Camera" - Quay video đồng thời bằng camera trước và sau song song, hiển thị Picture-in-Picture) đòi hỏi mức độ kĩ thuật cực sâu ở tầng Low-Level của mảng Multimedia trên môi trường iOS.

## 2. Vấn Đề: Cám Dỗ Của "Làm Luôn" (Trial & Error Trap)
* Phản xạ tự nhiên của 80% developer khi tiếp nhận yêu cầu là tra cứu thư viện mã nguồn mở hoặc mở Xcode lao vào tạo layout, nhét tạm `AVMutableComposition` để kiểm tra kết quả ngay lập tức (instant gratification).
* **Bài toán phần cứng:** Đa số các luồng video xử lý đa lõi trên iOS thường dính phải các nút thắt về memory, buffer leak hoặc quá nhiệt thiết bị dẫn tới app văng (crash) tức tưởi. Cứ cắm cúi code mà không biết phần cứng đã bão hoà thì sẽ phải đập đi sửa lại (vòng lặp technical debt) mất hàng tháng trời, làm rệu rã tinh thần team.

## 3. Giải Pháp: Cửa Ải Socratic (Research First)
*Thay vì mở Xcode gõ bừa, tôi tự áp đặt cơ chế "Hoãn Code".*
* **3 Ngày Mổ Xẻ API:** Tôi khóa giao diện UI, tập trung vào việc đọc sâu tài liệu lập trình Apple Developer. Xây dựng các PoC (Proof of Concept) ở mức cốt lõi trần trụi nhất (nháp log và sensor input) để tìm giới hạn thực tế.
* **Thay Đổi Khung Kiến Trúc Dựa Trên Dữ Liệu:** Qua bản `feasibility-study.md` và `deep-research.md`, tôi quyết định chốt cứng `AVCaptureMultiCamSession` thay vì `AVMutableComposition`. Thiết lập một State Machine nghiêm ngặt để dự phòng các lỗi sập sâu ở Hardware-level (như mã lỗi -17281: Session Stolen đòi hỏi Force Restart 100%, hoặc xử lý XPC communication failed với 3x backoff retry).
* **Tách rời Service:** Thiết lập các chuẩn giao thức (Protocol-driven services) chia tách rạch ròi lớp `DualTopBar`, `DualModeSwitch`, đảm bảo luồng View không giữ bất cứ thông tin phần cứng nào.

## 4. Kết Quả Thực Tiễn & Tầm Nhìn
* Mặc dù "chậm" mất 3 ngày ở đầu quy trình, năng lực delivery tăng vọt với 80 commits, xử lý xuyên suốt 122 issues. Ước tính 3 ngày research đã cứu project khỏi 3-5 ngày code sai theo luồng Photo-mode vô bổ.
* Mặc dù tính phức tạp quá cao khiến tỉ lệ Fix/Feature đạt 1.9:1 (với hơn 15 fix liên quan đến Export Pipeline & Session State), tốc độ hội tụ (convergence) của bug diễn ra cực nhanh vì các Service đã được tách lập độc lập (Mocked Protocol-driven).
* **Tư Duy Để Lại (Takeaway):** Trong kỷ nguyên mà AI Gen Code ra cực nhanh, cái không gen ra nhanh được chính là Kiến trúc hệ thống dựa trên hiểu biết sát sườn phần cứng (Hardware Boundaries). 1 giờ lập kế hoạch sắc bén có thể cứu đội ngũ khỏi 10 giờ gỡ rối trong vô vọng.


---

## Field Evidence (from Retrospectives)

### Experiment Branch Không Kết Luận — Anti-pattern từ GPS Camera
GPS Camera (ios010) tạo 3 experiment branches (`dual-cam`, `dual-back-cam`, `demo-dualhorizon`) nhưng KHÔNG có document kết luận nào: approach nào khả thi, approach nào bỏ, lý do. Khi fork thành ios017, phải research lại từ đầu. Bài học: kết thúc experiment branch → viết `experiment-result.md` dù chỉ 5 dòng.
> Source: [Retrospective GPS Camera](../../../apps/ios010-gps-camera/retrospective-gps-camera.md)

### Export Pipeline 10+ Fix Commits — Hậu quả khi thiếu Contract Types
Dual Camera (ios017) có 10+ fix commits cho export pipeline vì output contract (selfie = 1 file, dual-lens = 2 file) không được encode thành type — code dùng if/else logic phân tán. Đây là bằng chứng thực tế: thiếu `enum RecordingOutput { case selfie(URL), dualLens(portrait: URL, landscape: URL) }` ngay ngày đầu = 10+ commits sửa sai.
> Source: [Retrospective Dual Camera](../../../apps/ios017-dual-camera/retrospective-dual-camera-1.0.md)

---
**Nguồn Dữ Liệu Thực Tế:**
> Xem thêm: [Retrospective: Dual Camera](../../../apps/ios017-dual-camera/retrospective-dual-camera-1.0.md)
> Xem thêm: [Retrospective: GPS Camera](../../../apps/ios010-gps-camera/retrospective-gps-camera.md)
