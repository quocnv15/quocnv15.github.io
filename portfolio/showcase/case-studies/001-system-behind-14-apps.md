# Case Study: Hệ Thống Đằng Sau 14 Apps

> **Tác giả:** Quoc Nguyen Van  
> **Format:** Blog post / Portfolio case study  
> **Target audience:** iOS developers, AI-augmented engineers, indie publishers  
> **Tagline:** *"Build systems, not features."*

---

> **TL;DR**
> - AI viết 80% code. Nhưng 80% đó tạo ra 15+ fix commits khi thiếu architecture decisions đúng.
> - 20% giá trị thật = Systems Thinking + Workflow Orchestration + Quality Judgment — phần AI không tự quyết được.
> - Bằng chứng: 14 apps, 1 system, solo — quyết định `enum CameraState` thay vì `boolean flags` ngày đầu = tránh 15 bug commits.

---

## Mở Đầu: AI Viết Code Tôi Giỏi Hơn Tôi. Vậy Tôi Làm Gì?

Tôi không viết code nhanh. AI viết nhanh hơn — **10.8 ký tự output cho mỗi 1 ký tự tôi gõ.** 97,132 messages, 1,241 sessions trong 12 tháng. Cursor là tay đua, tôi chỉ cầm vô-lăng.

Vậy thì tôi — con người — đóng góp gì?

Câu trả lời không phải "tôi code giỏi hơn AI." Câu trả lời là: **tôi biết cái gì AI đang làm sai mà nó không biết.** Và tôi xây hệ thống để nó không sai nữa.

14 apps. 1 system. Solo. Đây không phải câu chuyện về code — đây là câu chuyện về **20% mà AI không generate được.**

---

## Bối Cảnh: Những Con Số Thật

| Metric | Giá trị |
|--------|---------|
| Apps shipped | 14+ (live trên App Store) |
| Locales | 13 ngôn ngữ tự động |
| Thời gian | 12 tháng, song song full-time job |
| AI sessions | 1,241 sessions, 97,132 messages |
| Coding days | 212/365 (58%) |
| Tool stack | 4 AI tools, mỗi tool 1 vai trò |

Nhưng con số ấn tượng nhất không nằm ở "bao nhiêu":

> **43 brainstorm sessions** trước khi bắt đầu implement. Trong khi phần lớn developer mở IDE là gõ code, tôi dành 4.4% tổng sessions chỉ để **suy nghĩ.**

---

## Phần 1: Cái 80% — AI Làm Gì

Cursor (AI coding tool) viết ~63% code hàng ngày. Tỷ suất khuếch đại: **1 ký tự tôi gõ → 10.8 ký tự AI sinh ra.** Cụ thể:

- **Boilerplate:** MVVM setup, Coordinator pattern, DesignSystem tokens
- **UI implementation:** Dịch Figma → SwiftUI/UIKit, responsive layouts
- **Localization:** 13 ngôn ngữ × 14 apps = 182 bộ metadata, AI dịch, tôi review
- **Fix bugs:** Syntax, compiler warnings, basic logic errors
- **Documentation:** Draft README, plan files, retrospectives

> *"AI cho kết quả 80% trong 10 phút. Và hầu hết mọi người, khi nhìn vào cái 80% đó, sẽ nghĩ: 'gần xong rồi.'"* — Tony

Đúng vậy. Cursor output **trông** hoàn chỉnh. Nhưng "trông hoàn chỉnh" khác "hoàn chỉnh" ở đâu?

---

## Phần 2: Cái 20% — Phần AI Không Biết Nó Sai

### 2.1 Architecture Decisions — Chọn Cái Gì KHÔNG Làm

**Ví dụ thực: Dual Camera (ios017)**

AI suggest dùng `AVMutableComposition` cho dual camera recording. "Trông hợp lý" — API đúng, code sample đầy. Nhưng:

- `AVMutableComposition` là **post-processing** API, không phải **real-time capture**
- Implement theo hướng đó = 3-5 ngày lãng phí
- **Quyết định đúng:** `AVCaptureMultiCamSession` + feasibility study so sánh 2 approaches TRƯỚC khi viết dòng code nào

AI không biết approach nào đúng cho **bối cảnh cụ thể** (real-time dual recording, không phải video editing). Tôi biết vì tôi đã:

1. Viết `feasibility-study.md` — so sánh MultiCam vs Single-Lens Dual Crop
2. Phân tích app DualShot Recorder thật trên App Store
3. Deep research: giới hạn hardware, thermal behavior, API edge cases

> **20% ở đây = biết cái gì KHÔNG implement.** Tiết kiệm 3-5 ngày, tránh rewrite.

### 2.2 State Machine vs Boolean Flags — Bài Học Đắt Giá

GPS Camera có stamp overlay: preview coordinates ≠ capture coordinates. Bug fix mất **6+ commits.**

Khi fork sang Dual Camera, AI lại dùng boolean flags cho camera state. Kết quả: **15+ fix commits** cho export pipeline + session state.

**20% ở đây = nhận ra pattern lặp lại.** Sau đó enforce rule:

```
Hardware-level API = state machine bắt buộc ngày 1
Encode contract thành enum, không phải if/else
```

AI viết code state machine hoàn hảo — **nhưng nó không biết PHẢI viết state machine.** Quyết định "dùng gì" là của tôi.

**Cùng so sánh:**

```diff
- // AI default: boolean flags phân tán
- var isRecording = false
- var isSaving = false
- var isPreparing = false
- // → 15 fix commits vì edge case: rapid taps, memory pressure, mode switch

+ // 20% judgment: state machine ngày 1
+ enum CameraState {
+     case idle, preparing, recording, stopping, saving, done
+ }
+ // → 0 state-related bugs. Edge cases handled by design.
```

### 2.3 Factory Model — Build System, Not Product

Thay vì ship 14 apps bằng tay, tôi xây:

```
ios-kit         → Workflows, slash commands, agent rules
ios-memory      → Retrospectives, decisions, identity
ios-pipeline    → CI/CD, automated releases
ios-hub   → Knowledge base, templates
```

Kết quả:
- **App mới = 7 ngày** (từ concept → App Store), nhờ template + automation
- **13 locales tự động** — AI dịch, pipeline validate, Fastlane push
- **Release = 1 command** — `/commit-push` + Craft Agents label

> **20% ở đây = thiết kế hệ thống.** AI ship 1 app. System ship 14.

---

## Phần 3: 4-Layer AI Orchestra — Right Tool, Right Job

Đây là phần mà hầu hết "AI-powered developers" Miss:

```
Layer 4: PORTFOLIO OPS    → Craft Agents (deploy, ASO, health check)
Layer 3: DEEP PROBLEMS    → Claude Code (root cause, 1 session = 1 bug)
Layer 2: DAILY CODING     → Cursor (Swift gen, multi-file, 63% usage)
Layer 1: PLANNING         → Antigravity (task.md, plan.md, walkthrough)
```

| Tool | Vai trò | Write:Read Ratio | Insight |
|------|---------|------------------|---------|
| Cursor | Execute | 0.97 (balanced) | Workhorse — edit ngang bằng đọc |
| Antigravity | Plan | 0.81 | Đọc nhiều hơn viết — strategic |
| Claude Code | Think | 0.39 | Đọc gấp 2.5x viết — deep exploration |

**Ý nghĩa:** Không phải "dùng AI nhiều" = "dùng AI giỏi." Tool selection intelligence — biết KHI NÀO dùng tool NÀO — là 20% mà AI không tự quyết được.

---

## Phần 4: Enforcement Mechanisms — Khi 20% Được Hệ Thống Hóa

Tony viết: *"Giá trị đang chuyển từ khả năng tạo ra output sang khả năng đánh giá output."*

Tôi không dùng "kỷ luật cá nhân" để đánh giá AI output. Tôi xây **hệ thống ép buộc:**

| Mechanism | Chức năng |
|-----------|-----------|
| `gate-check.sh` | Block commit nếu không pass lint |
| `checklist.py` | Audit project theo priority: Security → Lint → Tests → UX |
| SOUL.md | AI đọc file này để hiểu cách tôi ra quyết định |
| DECISIONS.md | Ecosystem rules: khi nào dùng SPM, khi nào fork, khi nào start fresh |
| Retrospectives | Mỗi app xong → viết tổng kết → feed vào apps tiếp theo |

> **20% ở đây = xây luật chơi.** AI chơi game, tôi thiết kế game.

---

## Phần 5: Bằng Chứng — Khi Thiếu 20%, Chuyện Gì Xảy Ra

### GPS Camera: 7+ release attempts cho v1.0

Nguyên nhân: không có pre-release checklist, không dry-run, ads gating chưa test.

### Silly Smile: Commit messages vô nghĩa

"update ads", "update logic" — 6 tháng sau không ai (kể cả tôi) biết đã update gì. Bài học: commit message = documentation.

### Dual Camera: 3 deploy attempts cho 1 release

`NSUserTrackingUsageDescription` sót từ fork, `app_review_detail` nil khi chưa submit. 2 lỗi tránh được bằng 1 checklist.

> **Pattern:** Mỗi lần thiếu 20% (planning, checklist, review), 80% (code, deploy) phải làm lại 2-3 lần. 20% tưởng "tốn thời gian" nhưng thực ra **tiết kiệm thời gian tổng.**

---

## Kết Luận: 20% Không Phải "Thêm Chút"

Cái 20% tôi đưa vào mỗi app:
- **Không nhìn thấy** trong App Store listing
- **Không code bằng Swift**
- **Không AI nào tự generate**

Nhưng thiếu nó, 14 apps này sẽ là 14 đống code rời rạc, mỗi cái có bug riêng, architecture riêng, không reuse được gì.

> *"AI không thay thế bạn. Nhưng nó làm bạn ít liên quan hơn."* — Tony

Câu hỏi không phải "AI có viết code giỏi hơn tôi không." Câu hỏi là: **"Tôi đang tạo giá trị ở đâu trong chuỗi công việc?"** Nếu câu trả lời là "viết code" — thì đúng, bạn đang bị thay thế. Nếu câu trả lời là "thiết kế hệ thống để code được viết đúng cách" — bạn vẫn còn rất liên quan.

---

*Quoc Nguyen Van — iOS Developer & Systems Builder*  
*"Build systems, not features."*


---

## Field Evidence (from Retrospectives)

### Zombie Plan Anti-pattern — 2 plans song song = 1 plan chết
Dual Camera (ios017) tạo 2 implementation plans cùng ngày: `260403-2212-dual-camera-mvp` (implemented ✅) và `260403-dualshot-recorder-rewrite` (0 commits ❌). Plan thứ hai có effort thiết kế đáng kể nhưng thành "zombie plan" — tốn context, gây phân vân. Bài học hệ thống: 1 feature = 1 plan, research doc đánh dấu `type: research-only`.
> Source: [Retrospective Dual Camera](../../../apps/ios017-dual-camera/retrospective-dual-camera-1.0.md)

### Deploy Dry-run 3-Attempt Story — Checklist cứu release
Dual Camera deploy 3 lần cho 1 release: lần 1 lỗi fastlane nil guard, lần 2 lỗi `NSUserTrackingUsageDescription` sót từ fork, lần 3 mới thành công. Cả 2 lỗi tránh được bằng `fastlane deliver --skip_submission` dry-run + audit `Info.plist` sau fork.
> Source: [Retrospective Dual Camera](../../../apps/ios017-dual-camera/retrospective-dual-camera-1.0.md)

### Research-First Pattern — Evolution proof từ project mới nhất
Clap Find Phone (ios15) — project mới nhất, chưa có source code Swift — đã áp dụng research-first: 3 discovery docs (`discovery.md`, `architecture-evaluation.md`, `improvement-review.md`) + `screen_flow.md` trước 0 dòng code. Minh chứng pattern đã trở thành thói quen hệ thống, không chỉ là quyết định 1 lần ở Dual Camera.
> Source: [Retrospective Clap Find Phone](../../../apps/ios15-clap-find-phone/retrospective-clap-find-phone.md)

---
**Nguồn Dữ Liệu Thực Tế:**
> Xem thêm: [Retrospective: Silly Smile](../../../apps/ios006-silly-smile/retrospective-silly-smile.md)
> Xem thêm: [Retrospective: GPS Camera](../../../apps/ios010-gps-camera/retrospective-gps-camera.md)
> Xem thêm: [Retrospective: Clap Find Phone](../../../apps/ios15-clap-find-phone/retrospective-clap-find-phone.md)

---

## Strategic Insights (from ios-hub Knowledge Base)

**iOS Porting Priority Framework** — Khi quyết định port app nào sang iOS, ranking dựa trên feasibility × market opportunity: (1) AI & Creative — CoreML advantage, premium pricing; (2) GPS & Camera — AVFoundation + MapKit mature; (3) Multimedia — AirPlay differentiator; (4) Personalization — cần pivot vì iOS không có lock screen customization; (5) Utility — iOS sandboxing giới hạn nhiều tính năng; (6) Communication — CallKit restrictions.
> Source: ios-hub: memory_bank/knowledge/project-insights/category-summary-matrix.md

**Game Category Insight** — Trong 5 game projects (1,082 commits), gameplay feature commits chỉ chiếm 16% trong khi monetization + bugfix chiếm gần 30%. Điều này cho thấy gameplay commits quá ít so với thời gian đổ vào monetization — pattern phổ biến khi "60% dev time = monetization" áp dụng vào game category.
> Source: ios-hub: memory_bank/knowledge/project-insights/category-game-report.md
