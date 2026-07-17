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

## 6b. Evidence Log — Phase 1 Test Bench trên ios-kit (2026-07-11)

Chạy E2E đầu tiên trên hạ tầng thật (runner `Quoc_Mini`, Manking-155/ios-kit, `dry_run: true`).
Issue test: [Manking-155/ios-kit#21](https://github.com/Manking-155/ios-kit/issues/21).

| Test | Kết quả | Evidence |
| --- | --- | --- |
| Smoke PATH/auth (4 CLI qua `NVM_BIN`) | ✅ | Session log 2026-07-11 |
| Label `ai-analyze` → analysis → `ai-analyzed` | ✅ | Run 29137849152 |
| Trigger `/analyze` qua comment | ✅ | Run 29137939936/29137939940 |
| `/lgtm` → authorize → dry-run block (không branch/PR) | ✅ | Run 29139019552 |
| Approval grammar `/ok-route` → label `ai-approved` | ✅ | Run 29139626213 |
| `/needs-rework <reason>` → re-analysis có reason | ✅ | Run 29139655895, 29140021399 |
| 5 re-analyses → `ai-max-retries` + ⛔ comment | ✅ | Run cuối 2026-07-11, issue #21 labels |
| Protected paths (động) | ⏸ chờ Phase 3 | `dry_run: true` chặn trước ai-implement |

Bug tìm ra và fix (tất cả sửa tại `templates/` ios-pipeline rồi re-deploy):

1. Guardrail protected-path là no-op: pattern glob đưa vào `grep -E` (invalid ERE) + `|| true` nuốt lỗi → thay bằng fnmatch matcher, fail-loud.
2. Heredoc indent sai trong router → bước Authorize/Dry-run chết exit 2 (may là fail-closed) → chuyển sang multi-line string.
3. CCS profile `gemini` không tồn tại → primary re-analysis luôn fail 3 retry → chuyển role-based profile chains (`models:` trong `ai-pipeline.yml`) có fallback khi hết quota.
4. Race `opened`+`labeled` khi tạo issue kèm label → run hợp lệ bị concurrency cancel; workaround: gắn label sau khi tạo issue.
5. Đổi tên generic mọi workflow/step (bỏ tên vendor sai lệch Codex/Gemini/Claude).

### Artifacts & links

- Issue test: <https://github.com/Manking-155/ios-kit/issues/21> (labels cuối: `ai-analyzed`, `ai-approved`, `ai-max-retries`)
- Runs tiêu biểu: [analysis 29137849152](https://github.com/Manking-155/ios-kit/actions/runs/29137849152) · [/lgtm dry-run block 29139019552](https://github.com/Manking-155/ios-kit/actions/runs/29139019552) · [/ok-route 29139626213](https://github.com/Manking-155/ios-kit/actions/runs/29139626213) · [re-analysis #5 role-chain 29141862259](https://github.com/Manking-155/ios-kit/actions/runs/29141862259)
- Commits ios-pipeline (templates): `d9acd0c` guardrail fnmatch · `77121ed` heredoc router · `2f042a1` ccs xio · `0718825` approval grammar · `ce304b5` role chains + generic naming
- Commits ios-kit (re-deploy): `1cf189c`, `b89979b`
- Runner: `Quoc_Mini` (launchd, labels `self-hosted, ai-mac-runner`), máy Manking-155

### Trạng thái so với mục §6 (Evidence Cần Có Khi Hoàn Thành V1)

| Yêu cầu §6 | Trạng thái |
| --- | --- |
| Issue test có comment approve | ✅ (`/lgtm`, `/ok-route` — grammar strict mode, không phải `LGTM` trần) |
| Branch đúng convention + xcodebuild log + PR mở | ⏸ chờ Phase 3 tắt `dry_run` |
| Comment problem → re-analysis | ✅ ×5 |
| 5 re-analyses → `ai-max-retries` | ✅ |
| Protected paths không bị sửa | ⏸ test động chờ Phase 3; matcher đã fix + unit test |
| Scope limits đúng | ⏸ chờ Phase 3 |

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
