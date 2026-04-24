# Case Study 014: Zero-Dependency — Triết lý tối giản để bảo trì app trọn đời

> **"Sức mạnh đến từ sự thuần khiết."**
> Tại sao Quoc ưu tiên xây dựng ứng dụng không dùng thư viện bên thứ 3 (No Alamofire, no external SDKs) để giảm 90% chi phí bảo trì dài hạn.

---

## 1. Vấn đề: Sự phụ thuộc độc hại (Dependency Hell)

Hầu hết các lập trình viên hiện nay đều "nghiện" thư viện: `Alamofire` cho networking, `SnapKit` cho layout, `Kingfisher` cho ảnh. Nhưng sự phụ thuộc này mang lại 3 rủi ro khổng lồ:
1.  **Dung lượng app:** Các thư viện khiến app phình to nhanh chóng.
2.  **Bảo trì:** Khi Apple cập nhật iOS mới nhất, app thường bị crash nếu thư viện chưa kịp update.
3.  **Bảo mật:** Mỗi thư viện là một lỗ hổng tiềm năng.

## 2. Giải pháp: Kiến trúc Native Mastery (Zero-Dependency)

Quoc tin rằng để xây dựng một hệ thống 14+ app tự vận hành trong nhiều năm, **sự đơn giản là chìa khóa**.

### 1. Networking Layer thuần URLSession:
Thay vì dùng `Alamofire`, Quoc xây dựng một bộ Networking wrapper bằng `URLSession` kết hợp với `async/await`. Nó cực kỳ nhẹ, nhanh và luôn tương thích với mọi bản iOS của Apple.

### 2. Layout & UI thuần SwiftUI/UIKit:
Sử dụng các công cụ gốc của Apple để đảm bảo hiệu năng 60fps/120fps (ProMotion) mượt mà nhất mà không cần các layer trung gian.

### 3. Persistence Layer thuần SwiftData/CoreData:
Tận dụng tối đa giải pháp lưu trữ gốc để đảm bảo tính nhất quán của dữ liệu và hiệu năng cao nhất trên thiết bị.

## 3. Kết quả & Lợi ích thực tế

- **Dung lượng app siêu nhẹ:** Các ứng dụng của Quoc thường có dung lượng dưới 10MB, giúp tăng 20-30% tỷ lệ chuyển đổi tải app (vượt qua giới hạn tải bằng data di động).
- **Chi phí bảo trì tiệm cận 0:** Một ứng dụng viết từ 2 năm trước vẫn chạy mượt mà trên iOS mới nhất mà không cần sửa một dòng code nào.
- **Tính an toàn cao:** Không có các "hộp đen" (thư viện lạ) trong source code, đảm bảo dữ liệu người dùng luôn được bảo vệ bởi chính sách của Apple.

## 4. Giá trị kinh doanh

Showcase này chứng minh Quoc là một **Kỹ sư iOS chuyên sâu (Native Specialist)**:
1.  **Trình độ kỹ thuật thực thụ:** Có khả năng xây dựng mọi tính năng mà không cần "vay mượn" kiến thức từ thư viện bên ngoài.
2.  **Tầm nhìn dài hạn:** Xây dựng sản phẩm bền vững, không nợ kỹ thuật (Technical Debt).
3.  **Tối ưu hóa kinh doanh:** Tăng tỷ lệ chuyển đổi nhờ app nhẹ và mượt.

---

## See Also
- [iOS Technical Standards](../../me/IOS-STANDARDS.md)
- [Hệ sinh thái ứng dụng moboco.com](../../identity/IDENTITY.md)
- [Case Study 003: SwiftUI Hybrid Migration](003-swiftui-hybrid-migration.md)
