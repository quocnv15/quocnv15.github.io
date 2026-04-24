# Case Study 03: 6-Phase SwiftUI Migration - Kiến Trúc Cầu Nối (Hybrid Bridge)

## 1. Ngữ Cảnh: Áp Lực Công Nghệ Lên Sản Phẩm Cốt Lõi
Sản phẩm di động cốt lõi của chúng tôi (như GPS Camera) đã hoạt động mượt mà nhiều năm bằng kiến trúc UIKit và RxSwift. Tuy nhiên, trước bối cảnh Apple đẩy mạnh SwiftUI, team UI/UX mong muốn đưa vào các hiệu ứng animation phức tạp và layout mới. Chúng tôi đối mặt với áp lực phải hiện đại hóa toàn bộ lớp giao diện để duy trì tốc độ phát triển (velocity) cho chặng đường dài.

## 2. Vấn Đề: Cái Bẫy "Big-Bang Rewrite"
* Đa phần các developers có xu hướng chọn đập đi xây lại (Big-bang rewrite): Xóa toàn bộ layer UIKit và build lại từ đầu bằng SwiftUI. Nghe có vẻ dễ dàng nhờ sự hỗ trợ sinh code của AI.
* **Sự thật đằng sau 80% Output:** AI có thể gen ra UI bằng SwiftUI chỉ trong vài giây, nhưng 20% còn lại là "địa ngục" gỡ lỗi. Các vấn đề nghiêm trọng bắt đầu xuất hiện: **State Ownership Desync** (Bất đồng bộ trạng thái), màn hình bị re-render vô hạn, mất đi các edge-case mà UIKit đã gánh vác 6 năm qua, và sự sai lệch về Theme/Assets. Một quyết định Big-bang có thể khiến team tê liệt 6 tháng chỉ để vất vả tái hiện lại sự ổn định cũ.

## 3. Giải Pháp: Chiến Lược "Cầu Nối" (The 20% Judgment)
Tôi cự tuyệt việc đập đi xây lại. Tha vào đó, tôi thiết kế chiến lược **Hybrid Migration (Chuyển đổi Lai)** chia làm 6 giai đoạn, bóc tách và chuyển đổi dần dần (Incremental):

1. **Giữ nguyên Core Engine:** Lớp xử lý dữ liệu và Business Logic (RxSwift, Clean Architecture) là bất khả xâm phạm.
2. **Xây Dựng Infrastructure `RxCombineBridge`:** Tự viết một cầu nối hai chiều, bọc (wrap) qua lại giữa `Observable` của RxSwift và `Publisher` của Combine để State được nối thẳng tắp từ Base cũ sang SwiftUI View.
3. **Migrate 6-Phase Bài Bản: (Case model từ GPS Camera 322 commits):** Chia chặng cực gắt từ không state đến nhiều state. Phase 1 (Language) -> Phase 2 (Settings) -> Phase 3 (Collection) -> Phase 4 (Premium) -> Phase 5 (Stamp) -> Phase 6 (Xóa UIKit Splash cũ). Không đụng vào luồng rễ cho đến khi rễ mới chắc.
4. **Kiểm Soát Rủi Ro Bằng Dữ Liệu:** Đóng form giao diện thông qua `UIHostingController`. Thiết lập các "Mapping Audit" tự động đối chiếu các biến UserDefaults để kiểm tra State có trôi dạt (Drift) không.

## 4. Kết Quả Thực Tiễn & Tầm Nhìn
* **Business Continuity:** Ứng dụng không bỏ lỡ bất cứ kì release tính năng mới nào. Đội ngũ không phải treo dự án để "chờ code lại".
* **Độ Ổn Định:** Giảm thiểu 90% lỗi hồi quy (regression bugs) so với các dự án rewrite khác vì Core Logic vẫn đang vận hành thứ code đã được kiểm chứng thực tế trong nhiều năm.
* **Tư Duy Để Lại (Takeaway):** Công nghệ mới sinh ra để phục vụ Business, không phải bắt Business dừng lại để chạy theo công nghệ. Sự nhạy bén của một kỹ sư hệ thống là biết thiết lập ranh giới giao tiếp giữa cái Cũ và cái Mới.


---

## Field Evidence (from Retrospectives)

### RxCombineBridge & NavigationTestHelpers — Testing proof cho Hybrid Architecture
GPS Camera (ios010) xây dựng `RxCombineBridge` wrap RxSwift Observable → Combine Publisher, cùng với `NavigationTestHelpers` cho phép test navigation layer độc lập. Kiến trúc navigation trừu tượng hóa qua `DependencyContainer`, `NavigationProtocols`, `BaseCoordinator` — tất cả đều mockable và testable, minh chứng hybrid bridge không chỉ hoạt động mà còn kiểm thử được.
> Source: [Retrospective GPS Camera](../../../apps/ios010-gps-camera/retrospective-gps-camera.md)

---
**Nguồn Dữ Liệu Thực Tế:**
> Xem thêm: [Retrospective: GPS Camera](../../../apps/ios010-gps-camera/retrospective-gps-camera.md)
> Xem thêm: [Retrospective: Dual Camera](../../../apps/ios017-dual-camera/retrospective-dual-camera-1.0.md)
