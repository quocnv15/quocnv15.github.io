# Case Study 10: Shared Monetization Infrastructure - Quản Trị Hệ Sinh Thái Ads Tại Quy Mô 14 Apps

## 1. Ngữ Cảnh: Đồng Bộ Hóa Doanh Thu
App không tạo ra tiền không phải là Business. Hệ thống 14 ứng dụng của chúng tôi yêu cầu các hình thức kiếm tiền linh hoạt từ Subscriptions (IAP) tới Quảng Cáo (Banner, Interstitial, Rewarded, AOA, Native). Vấn đề là nếu mỗi App tự viết tách biệt logic Ads thì khi chính sách thay đổi, cả team sẽ sụp đổ dưới đống rác Maintainance.

## 2. Vấn Đề: Lỗi Kép (The Doppelgänger Bug)
Khác biệt giữa một Junior và một Senior ở mảng kiếm tiền là cách xử lý các điều kiện đua mạng (Race Conditions):
* **Cái Bẫy 80%:** Việc gắn thư viện Firebase hay Google AdMob rất dễ. Vấn đề nảy sinh khi tôi soi dữ liệu từ `ios006-silly-smile` và `ios009-emoji-merge` và phát hiện ra **cùng một con Bug "App Open Ad (AOA) Splash Race Condition"** đánh sập trải nghiệm người dùng ở cả 2 App. 
* Lỗi này xảy ra khi máy load App khởi động, nó đồng thời kiểm tra Premium (IAP) và đòi load Ads (AOA) cùng một lúc. Màn hình Slash chớp tắt loạn xạ vô thời hạn, hủy hoại ấn tượng đầu tiên (First Impression) của user.

## 3. Giải Pháp: Trừu Tượng Hóa Lõi Doanh Thu (The Shared Library Judgment)
Nhận ra sự lặp lại chết người này, tôi cấm tuyệt đối việc code rời rạc. Tôi trừu tượng hóa toàn bộ mảng kiếm tiền thành một **Core Library Chung (Shared Library)** cho cả 14 dự án:
* **The AOA Resolver:** Thiết lập một Rule State-Machine chặt chẽ: `Check Premium trước -> Đợi Premium báo Failed -> Mới được Fetch AOA -> Đặt Timeout cứng max 5 giây để đóng màn Splash`.
* **Ads Dependency Injection:** Xây dựng `AdHelper`, `AdCooldownManager` (tránh spam ads user), và `UMPConsentManager` hoàn toàn độc lập với phần UI (User Interface) của Game. Nhúng luồng "Rewarded Unlock" thuần thông qua các Protocol.
* Nhờ vậy, nếu Apple/Google đổi luật, tôi chỉ sửa ở 1 nơi (Shared Framework) và nó tự động Apply cho cả 14 App phần còn lại của nhóm.

## 4. Kết Quả Thực Tiễn & Tầm Nhìn
* Chặn đứng dứt điểm bệnh "AOA Splash Crash". Giữ mượt mà vòng đời khởi động của tất cả các App mới về sau.
* **Tư Duy Để Lại (Takeaway):** Fix bug ở tầng App là giải quyết hậu quả. Fix bug ở tầng Shared Library là ngăn chặn thảm họa tương lai ở điểm mấu chốt nhất. Khi bạn quản lý 14 app, một bug xử lý sai luồng Ads có thể cướp đi hàng ngàn Dollar doanh thu của tổ chức chỉ trong chớp mắt.


---
**Nguồn Dữ Liệu Thực Tế:**
> Xem thêm: [Retrospective: Emoji Merge](../../../apps/ios009-emoji-merge/retrospective-emoji-merge.md)
> Xem thêm: [Retrospective: Zipper Wallpaper](../../../apps/ios014-zipper-wallpaper/retrospective-zipper-wallpaper.md)
