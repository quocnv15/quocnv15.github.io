---
layout: portfolio-detail
title: "Live Photo Conversion Optimization"
permalink: /portfolio/showcase/case-studies/019-live-photo-conversion-optimization/
back_url: /portfolio/showcase/
back_label: "← Showcase"
---

# Case Study 019 — Live Photo Conversion Optimization

> **Title:** Giải mã Blackbox của iOS Live Photo: Từ Lỗi Vặt Đến Tối Ưu Trải Nghiệm
> **Author:** Quoc Nguyen Van
> **Date:** 2026-04-30
> **Sản phẩm:** SillySmile (App 006)

---

## 1. Hook — Kết Quả Trước

**Biến video 10s thành Live Photo sắc nét mà không bị iOS reject.**

- Trước tối ưu: Video bị accelerate quá mức (0.9s), nhòe do upscale, hoặc Live Photo không chạy do vi phạm giới hạn của iOS.
- Sau tối ưu: Live Photo mượt mà ở độ dài **3s** (tăng tốc ~3.3x), độ nét cao với codec **HEVC 15Mbps**, **không upscale blur**.

**Bài học lớn nhất:** iOS có những giới hạn ngầm định nghiêm ngặt về Live Photo (max 5s, timing frame, identifier) mà không tài liệu nào ghi rõ. Cần phải thử nghiệm thực tế (empirical experiments) thay vì đoán mò.

---

## 2. Bối Cảnh — Vấn Đề Thực Tế

### Problem Statement

Tính năng biến video thành Live Photo Wallpaper của SillySmile gặp nhiều rào cản kỹ thuật. Video đầu vào từ backend thường dài ~10s với độ phân giải 720x1546. Khi convert sang Live Photo:

- **Lỗi hiển thị:** Khi giữ nguyên video 10s, iOS lưu ảnh thành công nhưng Live Photo animation không chạy.
- **Lỗi timing:** Khi cắt/tăng tốc, video quá nhanh (dưới 1s) làm hỏng trải nghiệm người dùng.
- **Lỗi chất lượng:** App tự động upscale từ 720x1546 lên 1080x1920 khiến ảnh bị mờ.
- **Artifacts:** Codec mặc định (H.264) sinh ra nhiều artifacts khi nén.

### Constraints

- Không có tài liệu chính thức chi tiết từ Apple về giới hạn thời gian (duration) cụ thể của video đi kèm Live Photo.
- Thao tác xử lý video nặng (resize, encode) cần đảm bảo hiệu năng, không làm crash app trên máy yếu.

---

## 3. Quá Trình "Vật Lộn" Cùng AI

Ban đầu, các đoạn code sinh ra dựa trên lý thuyết chuẩn (standard `AVAssetExportSession` hoặc `AVAssetWriter`), cắt ghép đơn giản và fix frame. 

**Vấn đề của "Standard Playbook":**
- AI gợi ý giữ nguyên thời lượng (trim 3s hoặc giữ 10s) ➔ Thực tế: iOS Live Photo không play nếu video quá dài (>5s). Thử nghiệm 7s thất bại hoàn toàn.
- AI gợi ý scale fill to fit 1080x1920 ➔ Thực tế: Video gốc 720p bị kéo giãn, gây upscale blur nghiêm trọng.

Sự khác biệt giữa code "chạy được trên IDE" và code "chạy đúng ý định của iOS" đòi hỏi con người phải can thiệp bằng các thực nghiệm có hệ thống.

---

## 4. Thực Nghiệm & Tối Ưu (20% Judgment)

Để tìm ra điểm cân bằng giữa chất lượng và giới hạn hệ thống, tôi đã thực hiện 8 bài test liên tiếp, đúc kết lại các quyết định sau:

### 4.1. Insight #1 — Giải mã giới hạn 5 giây
- **Phát hiện:** iOS ngầm định giới hạn video paired của Live Photo không được quá 5s. Nếu truyền video 7s, hệ thống sẽ tự cắt hoặc không play animation.
- **Giải pháp:** Accelerate video 10s gốc thành 3s (tăng tốc ~3.3x) hoặc 5s (~2x). 
- **Quyết định:** Chọn **3s** thay vì 5s. Tại sao? Animation 3 giây ngắn gọn, súc tích và dễ hiểu nhất đối với một hình nền (Wallpaper).

### 4.2. Insight #2 — Smart Resize (Nói không với Upscale)
- **Vấn đề:** Ảnh gốc nhỏ hơn target size (720x1546 vs 1080x1920). Upscale làm vỡ nét.
- **Quyết định:** Viết thuật toán `Smart Resize` — Chỉ downscale khi ảnh lớn hơn target size. Nếu ảnh nhỏ hơn, giữ nguyên kích thước gốc. Điều này triệt tiêu hoàn toàn hiện tượng upscale blur. Đi kèm với đó là gán `generator.maximumSize = .zero` để khớp chính xác.

### 4.3. Insight #3 — Đẩy Quality lên mức "Overkill"
- **Vấn đề:** Ngay cả khi không upscale, H.264 mặc định vẫn bị mờ khi set làm wallpaper.
- **Quyết định:** 
  1. Chuyển codec từ **H.264 sang HEVC (H.265)**.
  2. Nâng Bitrate từ **5 Mbps lên 15 Mbps**.
  3. Ép **Keyframe interval = 1** (Tất cả các frame đều là keyframe) và tắt B-frame reordering.
- **Kết quả:** Đoạn video ngắn 3s nét căng, không gặp artifacts nén.

---

## 5. Kết Quả + Con Số

### Bảng Tóm Tắt Thực Nghiệm (Evolution)

| Giai đoạn | Phương pháp | Kết quả | Vấn đề còn tồn đọng |
|-----------|------------|---------|---------------------|
| **V0** | Tăng tốc 10s xuống 0.9s | FAILED | Video chạy quá nhanh (~3.2x) |
| **V1** | Giữ nguyên 10s | FAILED | iOS từ chối play Live Photo >5s |
| **V2** | Accelerate xuống 3s | OK | Chất lượng còn kém (mờ, vỡ hạt) |
| **V3** | HEVC + 5 Mbps | Tốt hơn | Vẫn bị blur do Upscale |
| **V4** | Tăng tốc xuống 5s | OK | Dài quá, tốc độ 2x |
| **V5** | Test video 7s | FAILED | Bị cắt khung hình (Confirm giới hạn 5s) |
| **FINAL**| **3s + Smart Resize + HEVC 15Mbps + Keyframe = 1** | **BEST** | Sắc nét, animation gọn, không upscale blur |

---

## 6. Bài Học Rút Ra (Lessons Learned)

### 1. iOS Blackbox Constraints
Khi làm việc với các định dạng đặc thù của Apple (như Live Photo), không bao giờ được tin tưởng hoàn toàn vào document chung. Phải tự tay dò tìm các "soft limits":
- Paired video max = 5s.
- `still-image-time` metadata (0.0s) phải match hoàn toàn.
- Identifier của HEIC và MOV phải là một.

### 2. Smart Resize > Fix Size
Luôn kiểm tra kích thước gốc trước khi crop/scale. Trong xử lý media trên di động, việc upscale ảnh độ phân giải thấp lên màn hình Retina/Super Retina là một "tội ác" UX. Chỉ downscale, không bao giờ upscale.

### 3. Tận dụng tối đa HEVC & Keyframes
Đối với video siêu ngắn (<5s) làm Wallpaper, dung lượng không phải là rào cản lớn nhất, mà là chất lượng. Đừng ngại dùng HEVC, đẩy bitrate lên 15 Mbps và set `Keyframe Interval = 1`. Đánh đổi một chút dung lượng (chỉ vài MB cho 3s) lấy độ nét tuyệt đối là một trade-off hoàn toàn xứng đáng.

### 4. Code dọn dẹp (Clean Logging)
Trong quá trình thử nghiệm, có hàng chục lệnh in log được rải khắp nơi. Khi chốt giải pháp cuối, việc xoá bỏ các log thừa thãi là bắt buộc để duy trì "tín hiệu" sạch trong console, giúp phát hiện lỗi thật dễ dàng hơn.

---

## 7. Kết Luận — Một Câu

> **"Để chiến thắng những API đóng của Apple, lý thuyết là không đủ, bạn cần một tư duy thực nghiệm (empirical mindset) tàn nhẫn."**

Sự hoàn hảo của tính năng Live Photo không đến từ một đoạn code ma thuật do AI viết ra, mà đến từ 8 lần thử nghiệm kiên nhẫn để bóc tách từng giới hạn của iOS và đưa ra những quyết định đánh đổi (trade-off) chính xác.

---

## Related Knowledge
- `ios_live_photo_processing_patterns`
- `ios006-silly-smile/plans/live-photo-experiments.md`
