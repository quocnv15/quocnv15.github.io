---
layout: portfolio-detail
title: "ios-pipeline V1: LGTM to PR"
permalink: /portfolio/showcase/case-studies/021-ios-pipeline-v1-lgtm-to-pr/
back_url: /portfolio/showcase/
back_label: "← Showcase"
---

# Case Study 021 — ios-pipeline V1: From LGTM Comment To Verified PR

> **Title:** Biến comment `LGTM` thành pipeline tạo branch, chạy build và mở PR có kiểm soát
> **Author:** Quoc Nguyen Van
> **Date:** 2026-05-14
> **Status:** In Progress — V1
> **Sản phẩm:** `ios-pipeline`
> **Nguồn:** `/Users/djv033/work-quocnv15/ios-pipeline/TODO.md`

---

## 1. Hook — Kết Quả Muốn Đạt

Mục tiêu của V1 là đưa `ios-pipeline` vượt khỏi bước phân tích issue đơn thuần. Pipeline cần phản ứng với comment `LGTM`, tạo branch, chạy `xcodebuild`, và mở PR cho repo mục tiêu `ios-kit`.

Điểm showcase không nằm ở việc "AI tự code", mà ở việc xây một **quality gate workflow** cho AI-generated change: human xác nhận intent bằng `LGTM`, pipeline triển khai trong scope giới hạn, build kiểm chứng, rồi mới tạo PR.

---

## 2. Bối Cảnh — Vì Sao V1 Quan Trọng

MVP tập trung vào luồng: issue được label → AI phân tích → comment analysis. Đây là bước giúp repo hiểu yêu cầu và trả lại nhận định ban đầu.

V1 là bước chuyển từ **analysis** sang **controlled execution**:

1. Human review analysis.
2. Human comment `LGTM` để cho phép hành động.
3. Pipeline tạo branch thay vì sửa trực tiếp vào main.
4. Pipeline chạy build để tránh "done" giả.
5. Pipeline mở PR để human review bằng diff và evidence.

Với hướng harness, đây là điểm rất quan trọng: agent không được tự ý đi từ ý tưởng đến merge. Nó cần gate, scope, retry limit, protected paths và review surface.

---

## 3. V1 Scope Theo TODO

Theo `TODO.md`, V1 hiện tập trung vào `LGTM → PR` cho `ios-kit`:

| Item | Mục tiêu |
| --- | --- |
| Comment `LGTM` | Verify pipeline tạo branch, chạy `xcodebuild`, mở PR |
| Comment problem | Verify pipeline quay lại re-analysis thay vì làm tiếp sai hướng |
| 5 re-analyses | Verify gắn label `ai-max-retries` để dừng loop |
| Protected paths | Verify các file nhạy cảm không bị modified |
| Scope limits | Verify agent chỉ sửa trong phạm vi được cho phép |

---

## 4. Giá Trị Showcase

### 4.1 Harness thay vì prompt rời rạc

V1 thể hiện rõ triết lý harness: không chỉ hỏi AI "fix issue này", mà đặt AI vào một workflow có điều kiện, quyền hạn và điểm dừng.

`LGTM` không phải là lời khen. Trong pipeline này, nó là một **authorization gate**.

### 4.2 Human-in-the-loop có cấu trúc

Human không cần micromanage từng command, nhưng vẫn giữ quyền quyết định:

- issue nào được phân tích,
- analysis nào đủ tốt để triển khai,
- PR nào được merge,
- khi nào retry loop phải dừng.

Đây là mô hình thực tế hơn so với agent tự chạy end-to-end mà không có trách nhiệm rõ.

### 4.3 No False Done

V1 đưa build vào workflow trước khi PR xuất hiện. Điều này giảm rủi ro agent báo xong khi code chưa compile.

Với iOS, gate này đặc biệt quan trọng vì lỗi có thể nằm ở project config, scheme, signing, generated files hoặc native build environment, không chỉ ở syntax.

### 4.4 Scope và protected paths

Protected paths và scope limits là phần biến pipeline từ automation nguy hiểm thành automation có kiểm soát.

Agent có thể sửa nhanh, nhưng không được tự do sửa mọi thứ. Đây là điểm khác biệt giữa "AI coding bot" và "AI contributor trong harness".

---

## 5. Rủi Ro Cần Theo Dõi

- `LGTM` trigger quá đơn giản nếu không kiểm tra đúng author/permission.
- Retry loop có thể tốn tài nguyên nếu re-analysis không cải thiện chất lượng.
- `xcodebuild` có thể fail vì môi trường runner thay vì lỗi code thật.
- Protected paths cần được test bằng case cố tình vi phạm.
- Scope limits cần đủ chặt để tránh sửa lan sang config, secrets, signing hoặc generated artifacts.

---

## 6. Evidence Cần Có Khi Hoàn Thành V1

Để case study này chuyển từ "In Progress" sang "Completed", cần có bằng chứng:

- Issue test có comment `LGTM`.
- Branch được tạo đúng convention.
- `xcodebuild` chạy và log rõ pass/fail.
- PR được mở với summary và test evidence.
- Comment problem kích hoạt re-analysis.
- Sau 5 lần re-analysis, label `ai-max-retries` được gắn.
- Test protected paths không bị sửa.
- Test scope limits hoạt động đúng.

---

## 7. Bài Học Đang Hình Thành

### Lesson 1: Comment là interface, không chỉ là text

Trong agent workflow, comment như `LGTM` trở thành API giữa human và pipeline. Vì vậy, comment trigger phải được thiết kế như một interface có permission, trạng thái và failure handling.

### Lesson 2: PR là review surface tốt hơn raw agent output

Agent output dễ dài và khó audit. PR gom lại diff, commits, checks, logs và conversation. Đây là bề mặt review tự nhiên hơn cho engineering team.

### Lesson 3: iOS automation cần kiểm chứng native thật

Với iOS, chỉ phân tích bằng LLM là chưa đủ. Pipeline cần chạm vào native build/test layer để phát hiện lỗi scheme, build settings, dependencies và platform assumptions.

---

## 8. Next Step

Hoàn tất V1 bằng cách chạy các test trong `TODO.md`, ghi lại evidence, rồi cập nhật case study này thành bản completed với link PR/log cụ thể.
