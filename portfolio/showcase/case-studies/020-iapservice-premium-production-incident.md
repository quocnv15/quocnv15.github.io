---
layout: portfolio-detail
title: "IAPService Premium Production Incident"
permalink: /portfolio/showcase/case-studies/020-iapservice-premium-production-incident/
back_url: /portfolio/showcase/
back_label: "← Showcase"
---

# Case Study 020 — IAPService+Premium Production Incident

> **Title:** Một Dòng Code `return true` Làm Mất Toàn Bộ Doanh Thu Ads & IAP Trong 1 Ngày
> **Author:** Quoc Nguyen Van
> **Date:** 2026-05-01
> **Severity:** 🔴 Critical — Revenue Loss
> **Sản phẩm:** Nhiều app BKPlus ecosystem

---

## 1. Hook — Kết Quả Trước

**Một thay đổi nhỏ trong file `IAPService+Premium.swift` khiến tất cả user trở thành Premium, bypass toàn bộ ads và IAP — và bản build đó được Apple approved lên Production.**

- **Thiệt hại:** Mất toàn bộ doanh thu ads (AdMob Banner, Interstitial, Rewarded, App Open) và IAP purchases trong ngày 2026-05-01.
- **Nguyên nhân gốc:** File `IAPService+Premium.swift` bị sửa để luôn `return true` cho trạng thái premium trong quá trình debug/develop, nhưng không revert lại trước khi submit build.
- **Thời gian phát hiện:** Sau khi Apple đã approve và bản build đã live trên App Store.

---

## 2. Bối Cảnh — Chuyện Gì Đã Xảy Ra

### Chuỗi sự kiện

```
Developer sửa IAPService+Premium.swift → return true (để test UI premium)
    ↓
Quên revert lại giá trị gốc
    ↓
Commit + Push code lên repo
    ↓
Build & Submit lên App Store Connect
    ↓
Apple Review → APPROVED ✅
    ↓
Bản build live trên Production
    ↓
100% users = Premium → Ads bị tắt hoàn toàn → IAP không hiện
    ↓
💸 Mất toàn bộ revenue trong ngày
```

### Tại sao không phát hiện sớm hơn?

1. **Không có code review gate** cho file sensitive này.
2. **File `IAPService+Premium.swift` không có protection** — bất kỳ ai (hoặc agent) đều có thể sửa.
3. **QA/Testing không cover** trường hợp "premium bypass" — vì khi test, mọi thứ trông "hoàn hảo" (UI premium đẹp, không crash).
4. **Không có automated check** để verify giá trị return của `isPremium()` trước khi submit.

---

## 3. Phân Tích Kỹ Thuật

### File bị ảnh hưởng

```swift
// IAPService+Premium.swift
extension IAPService {
    func isPremium() -> Bool {
        return true  // ← BUG: Hard-coded true cho mục đích debug
        // Code gốc: return UserDefaults.standard.bool(forKey: "isPremium")
    }
}
```

### Tác động dây chuyền

| Component | Hành vi bình thường | Hành vi khi `isPremium = true` |
|-----------|---------------------|-------------------------------|
| **AdMob Banner** | Hiện banner quảng cáo | ❌ Ẩn hoàn toàn |
| **Interstitial Ads** | Hiện sau mỗi action | ❌ Không bao giờ trigger |
| **Rewarded Ads** | User xem ads để unlock | ❌ Skip, unlock miễn phí |
| **App Open Ads** | Hiện khi mở app | ❌ Không hiện |
| **IAP Purchase UI** | Hiện paywall, nút mua | ❌ Ẩn hoặc skip paywall |
| **Premium Features** | Locked cho free users | ✅ Mở hết cho tất cả |

### Tại sao đây là "silent failure"

- App **không crash**, không có error log.
- UI hoạt động **hoàn hảo** — thậm chí trông đẹp hơn (vì không có ads).
- Apple reviewer thấy app **chạy tốt** → Approve ngay.
- Chỉ phát hiện khi **kiểm tra dashboard revenue** và thấy doanh thu về 0.

---

## 4. Biện Pháp Khắc Phục Đã Thực Hiện

### Immediate (Ngày 2026-05-01)

1. **`git update-index --skip-worktree`** — Freeze file `IAPService+Premium.swift` trên tất cả 5 repos:
   - `ios006-silly-smile`
   - `ios009-emoji-merge`
   - `ios010-gps-camera`
   - `ios014-zipper-wallpaper`
   - `ios017-dual-camera`

2. **Hiệu quả:** Git sẽ bỏ qua mọi thay đổi local trên các file này. Dù developer có sửa file trên máy, `git status` sẽ không hiện, `git add` sẽ không thêm, và `git commit` sẽ không bao gồm.

### Hạn chế của giải pháp

- `skip-worktree` là **cài đặt local per-machine**. Clone mới hoặc máy khác cần set lại.
- Nếu cần sửa file thật sự (ví dụ thêm product ID mới), phải tạm bỏ flag:
  ```bash
  git update-index --no-skip-worktree <file>
  # Sửa file
  git add <file> && git commit
  git update-index --skip-worktree <file>  # Set lại
  ```

---

## 5. Bài Học Rút Ra (Lessons Learned)

### 🔴 Lesson 1: File Sensitive Cần Protection Layer

Không phải file nào cũng nên được sửa tự do. Các file quyết định logic monetization (`isPremium`, `isAdEnabled`, `isSubscribed`) cần ít nhất **1 layer bảo vệ**:
- `skip-worktree` (đã áp dụng)
- Pre-commit hook kiểm tra pattern `return true` trong file IAP
- CI check: grep các file sensitive cho hard-coded values

### 🔴 Lesson 2: "Chạy Đẹp" ≠ "Chạy Đúng"

Đây là dạng bug nguy hiểm nhất: **silent revenue killer**. App không crash, UI đẹp, Apple approve — nhưng business logic sai hoàn toàn. Cần có **revenue smoke test** trước khi submit:
- Verify ads hiện trên free account
- Verify paywall hiện khi chưa mua
- Verify premium features locked khi chưa có subscription

### 🔴 Lesson 3: Debug Code Không Bao Giờ Được Commit

Quy tắc tuyệt đối: **Không bao giờ commit debug overrides vào production code.** Nếu cần test premium UI:
- Dùng `#if DEBUG` flag
- Dùng biến môi trường (`ProcessInfo.processInfo.environment`)
- Dùng build configuration riêng (`Debug Staging` vs `Release Production`)
- **KHÔNG BAO GIỜ** hard-code `return true` trong source code

### 🟡 Lesson 4: Agent Cũng Có Thể Sửa File Này

Trong workflow multi-agent (Claude Code, Gemini CLI), agent có thể vô tình sửa `IAPService+Premium.swift` khi được yêu cầu "fix IAP" hoặc "test premium flow". Flag `skip-worktree` ngăn chặn điều này ở tầng Git.

---

## 6. Checklist Phòng Ngừa (Prevention)

### Pre-Submit Checklist (bắt buộc trước mỗi App Store submission)

- [ ] Verify `IAPService+Premium.swift` KHÔNG chứa `return true` hard-coded
- [ ] Test app với **free account** — confirm ads hiện đúng
- [ ] Test paywall — confirm IAP purchase flow hoạt động
- [ ] Check AdMob test device mode đã tắt
- [ ] Review diff của tất cả file trong `Helper/IAP/` trước khi submit

### Automated Guards

```bash
# Pre-commit hook example
# Thêm vào .git/hooks/pre-commit
if git diff --cached --name-only | grep -q "IAPService+Premium"; then
    echo "⚠️  WARNING: IAPService+Premium.swift is being committed!"
    echo "⚠️  Verify this is intentional and not a debug override."
    exit 1
fi
```

---

## 7. Kết Luận — Một Câu

> **"Một dòng `return true` có thể biến một ngày doanh thu thành con số 0 — và điều đáng sợ nhất là không ai nhận ra cho đến khi nhìn vào dashboard."**

Sự cố này không đến từ bug phức tạp hay crash nghiêm trọng. Nó đến từ một thay đổi nhỏ, tầm thường, mà không có bất kỳ safety net nào ngăn chặn. Bài học đắt giá nhất: **monetization logic cần được bảo vệ như credentials — không ai được tự do sửa mà không có review.**

---

## Related Knowledge

- [[020-iapservice-premium-production-incident]] — This document
- `IAPService+Premium.swift` — File gốc trong tất cả app repos
- `git update-index --skip-worktree` — Mechanism bảo vệ đang sử dụng
