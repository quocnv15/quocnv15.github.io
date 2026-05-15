---
layout: portfolio-detail
title: "Harness Self-Review"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/010-harness-self-review/
---

# Self-Review: Harness Cho Cách Mình Làm Việc Với AI Agent

> **Ngày:** 2026-05-14  
> **Nguồn mentor:** Uncle Dao, Bang Hoang, Archon, Anthropic/Claude Skills, Karpathy agentic workflow  
> **Bối cảnh hiện tại:** iOS/mobile template work, Swift/SwiftUI, Flutter, Tuist, SPM, Fastlane Swift DSL, SwiftLint, GitHub Actions, Bitrise, CodeMagic

---

## 1. Nhận Định Cốt Lõi

Mình đang bước qua giai đoạn dùng AI như chatbot hoặc pair-programmer rời rạc. Hướng đúng hơn là xây **harness**: một lớp điều khiển giúp agent hiểu repo, thao tác đúng quyền, đi theo quy trình, kiểm chứng kết quả và tự sửa sai có bằng chứng.

Câu quan trọng không còn là: "model nào thông minh hơn?"  
Câu đúng hơn là: **repo và workflow của mình có đủ rõ để agent làm việc đáng tin không?**

Theo mentor notes, harness không chỉ là test, docs hay CI. Nó là phần nối giữa ý định của human và hành động có kiểm soát của agent: context, map, skill, workflow, validation gate, sandbox, memory, quyền hạn và review loop.

---

## 2. Ý Tưởng Mentor Mình Rút Ra

### 2.1 Uncle Dao: Harness là dây cương, không phải đồ trang trí

Uncle Dao giúp mình nhìn harness như phần "không" tạo ra cái "dụng". Model là phần dễ thấy: benchmark, tên model, tốc độ, khả năng reasoning. Nhưng harness mới là phần biến năng lực đó thành hành động dùng được: quyền hạn, bối cảnh, công cụ, sandbox, điểm dừng, telemetry và trách nhiệm con người.

Điểm mình cần giữ lại: **model tạo ra suy nghĩ; harness biến suy nghĩ thành hành động có kiểm soát.** Vì vậy, khi đánh giá AI workflow, mình không nên chỉ hỏi model nào mạnh hơn. Mình phải hỏi hệ thống quanh model có đủ tốt để tránh sai lệch, mất kiểm soát và "done" giả hay không.

### 2.2 Bang Hoang: Harness là Trust Layer của repository

Bang Hoang đặt harness rất gần với công việc thực tế của software engineer: harness là lớp điều khiển của repo, gồm maps, quy chuẩn, docs, workflow, scripts, tests và validation gates. App là thứ user thao tác; harness là thứ agent thao tác.

Điểm mình cần giữ lại: repo trong kỷ nguyên agent không chỉ cần clean code. Repo cần biết tự giải thích, tự validation và dẫn agent đi qua thay đổi có kiểm soát. Khi agent làm sai, harness tốt phải giúp nó sai theo cách có thể chẩn đoán: sai ở context, sai ở spec, sai ở test, sai ở assumption hay sai ở implementation.

### 2.3 Archon: Prompt không đủ, workflow phải được mã hóa

Archon đẩy ý tưởng harness sang hướng deterministic workflow: thay vì hy vọng agent nhớ SOP qua prompt, ta mã hóa quy trình thành DAG/YAML/workflow, có worktree isolation, verification gates và audit trail. Đây là bước chuyển từ "chat với AI" sang "thiết kế hệ thống để agent chạy".

Điểm mình cần giữ lại: nếu một bước là bắt buộc, nó không nên chỉ nằm trong lời nhắc. Nó nên thành gate hoặc checklist có thể kiểm chứng. Với repo mobile/template, các gate như lint, generate, test, placeholder scan, flavor/config validation nên được xem là một phần của harness chứ không phải việc phụ.

### 2.4 Anthropic/Claude Skills: Đóng gói năng lực thành skill tái sử dụng

Claude Skills gợi ý rằng năng lực của agent không chỉ đến từ model, mà còn từ cách đóng gói context, procedure, examples và guardrails. Một skill tốt có trigger rõ, scope rõ, input/output rõ và có cách refine qua thực tế.

Điểm mình cần giữ lại: những workflow lặp lại trong iOS/Flutter work không nên được prompt lại từ đầu mỗi lần. Nếu mình thường xuyên phải yêu cầu agent kiểm tra architecture, test, CI, docs hoặc generated output, đó là tín hiệu để biến chúng thành skill/checklist/script.

### 2.5 Karpathy: Từ vibe coding sang agentic workflow

Karpathy giúp mình phân biệt giai đoạn khám phá nhanh với giai đoạn sản xuất thật. Vibe coding tốt cho prototype và tìm cảm giác sản phẩm. Nhưng càng gần production, càng cần agentic workflow: context rõ, tool use đúng, feedback loop nhanh, validation thật và recovery loop khi sai.

Điểm mình cần giữ lại: mình không cần bỏ vibe coding, nhưng phải biết điểm chuyển pha. Khi task chạm vào template, CI, release, signing, architecture hoặc nhiều platform, mình phải chuyển từ vibe sang harness.

### 2.6 Tổng hợp thành nguyên tắc cá nhân

- **Model là năng lực thô; harness là năng lực vận hành.**
- **Prompt tốt là khởi đầu, workflow/gate mới là thứ giữ chất lượng ổn định.**
- **Docs không chỉ viết cho người đọc, mà còn là map để agent hành động.**
- **Tests/CI không chỉ bảo vệ code, mà còn là feedback loop cho agent.**
- **Human không biến mất; human chuyển sang thiết kế harness và review bằng chứng.**

---

## 3. Self-Review Hiện Tại

### Điểm mạnh

- Mình đã có thói quen dùng AI cho nhiều lớp công việc: research, planning, coding, review, docs, debugging.
- Mình hiểu mobile tech stack hiện tại tương đối rõ: Swift/SwiftUI, Flutter, Clean-ish layering, Tuist, SPM, Fastlane Swift DSL, SwiftLint, multi-CI.
- Repo `ios-templates` đã có nhiều điểm phù hợp để xây harness: `CLAUDE.md`, wiki docs, build/test commands, template generator, CI workflows, placeholder rules.
- Mình bắt đầu nhìn AI workflow như hệ thống, không chỉ là prompt đơn lẻ.

### Điểm yếu

- Prompt đôi khi vẫn quá ngắn, khiến agent phải đoán intent và tự mở rộng phạm vi.
- Harness hiện tại còn phụ thuộc vào trí nhớ và kỷ luật của mình hơn là workflow được mã hóa rõ.
- Validation chưa đủ "No False Done": agent có thể nói xong trước khi build/test/template generation được kiểm chứng đầy đủ.
- Chưa có bản đồ failure modes riêng cho iOS template: placeholder bị thay sai, SwiftUI-only bị phá, Tuist manifest lệch, Fastlane/CI không đồng bộ, generated project không build.
- Review vẫn dễ rơi vào đọc diff thủ công thay vì review dựa trên bằng chứng: spec, affected files, tests, command output, CI matrix.

---

## 4. Harness Phù Hợp Với Mình

Harness của mình nên bắt đầu mỏng nhưng chắc: **thin harness, fat skills**. Không cần tạo platform lớn ngay. Trước mắt, nên biến repo thành môi trường agent có thể đọc, làm, kiểm và sửa.

### 4.1 Context Layer

Mục tiêu: agent hiểu repo trước khi sửa.

Cần duy trì:

- `CLAUDE.md` làm luật chính cho agent.
- Wiki docs cho cấu trúc template, dependencies, configurations, Fastlane.
- File map hoặc docs ngắn cho các vùng rủi ro cao: generator, Tuist helpers, Fastlane, CI, placeholders.

Với iOS template, context phải nhắc rõ:

- Không thay placeholder `{PROJECT_NAME}`, `{BUNDLE_ID_STAGING}`, `{BUNDLE_ID_PRODUCTION}` thành giá trị thật.
- Không reintroduce UIKit scaffolding.
- Domain không phụ thuộc UI/framework nặng.
- Thay đổi build/signing/CI phải giữ GitHub Actions, Bitrise, CodeMagic nhất quán.

### 4.2 Workflow Layer

Mục tiêu: agent không nhảy bước.

Một workflow tối thiểu cho thay đổi template nên là:

1. Xác định vùng ảnh hưởng: app template, modules, generator, Tuist, Fastlane, CI hay docs.
2. Đọc docs/CLAUDE/wiki liên quan.
3. Khoanh vùng file cần sửa và file phụ thuộc.
4. Sửa nhỏ, đúng scope.
5. Chạy validation phù hợp.
6. Cập nhật docs nếu pattern/template thay đổi.
7. Review bằng bằng chứng, không chỉ bằng cảm giác.

### 4.3 Validation Layer

Mục tiêu: không có "done" giả.

Validation nên khớp với failure modes của repo:

| Thay đổi | Gate tối thiểu |
| --- | --- |
| Swift source/template | `swiftlint`, build/test lane nếu khả thi |
| Tuist manifest/project structure | `tuist generate` |
| Generator CLI | `swift test` hoặc `swift run --package-path Scripts/Swift/iOSTemplateMaker ... make` |
| Fastlane | kiểm tra Swift DSL compile/lane liên quan |
| CI/CD | kiểm tra GitHub Actions + Bitrise + CodeMagic không lệch ý định |
| Placeholder/template | generate project mới và grep placeholder sai |
| Docs/wiki | kiểm tra link và consistency với repo hiện tại |

Điểm quan trọng: validation không nên là nghi thức. Nó phải trả lời: **thay đổi này có phá cách template được sinh ra không?**

### 4.4 Review Layer

Mục tiêu: review agent như review một contributor có log làm việc.

Mỗi task nên có bằng chứng:

- Intent ban đầu.
- Files touched.
- Assumptions.
- Commands đã chạy.
- Tests/gates pass/fail.
- Risk còn lại.
- Phần nào chưa kiểm chứng được.

Mình nên tránh review kiểu "đọc từng dòng từ đầu" nếu harness đã cung cấp bằng chứng tốt. Thay vào đó, review tập trung vào invariants: SwiftUI-only, placeholders, module boundaries, CI consistency, generated output.

---

## 5. Định Hướng Tech Stack Hiện Tại

Với `ios-templates`, harness không nên copy từ web/backend. Nó phải phản ánh iOS template stack:

- **Swift/SwiftUI:** kiểm tra compile, lint, SwiftUI-only boundaries.
- **Flutter:** kiểm tra `flutter analyze`, `flutter test`, flavor/config, platform channel và native integration khi có thay đổi liên quan.
- **Tuist:** project generation là gate bắt buộc khi đụng manifests hoặc structure.
- **SPM:** dependency changes phải rõ target/module impact.
- **Fastlane Swift DSL:** lanes là code Swift, cần tránh sửa shell-style tùy tiện.
- **CI providers:** GitHub Actions, Bitrise, CodeMagic phải được xem như một hệ thống, không phải ba file riêng lẻ.
- **Template generator:** mọi thay đổi template nên nghĩ đến generated project, không chỉ source repo.

Điểm tự nhắc: **App là thứ user thao tác; harness là thứ agent thao tác.** Với repo template, generated app là sản phẩm cuối, còn harness phải bảo vệ cả repo gốc lẫn output được generate.

---

## 6. Nguyên Tắc Cá Nhân Khi Làm Với Agent

1. **Prompt phải có intent và scope.** Nếu task phức tạp, không gửi lệnh trống kiểu "sửa đi".
2. **Không tin "done" nếu chưa có gate.** Done phải đi kèm command hoặc lý do không thể chạy.
3. **Chia nhỏ harness theo failure mode.** Bắt đầu từ lỗi hay xảy ra nhất, không xây framework quá rộng.
4. **Docs viết cho agent đọc được.** Docs không chỉ để người đọc, mà là map để agent điều hướng.
5. **Human vẫn giữ trách nhiệm.** Harness không thay thế judgment; nó làm judgment có bằng chứng hơn.

---

## 7. Roadmap Nhẹ, Mở Rộng Từ Từ

### Giai đoạn 1: Làm rõ map

- Tạo hoặc cập nhật docs ngắn cho các vùng rủi ro: generator, Tuist, CI, Fastlane, placeholders.
- Chuẩn hóa checklist cho mỗi loại thay đổi trong template.
- Gắn mỗi checklist với command thật.

### Giai đoạn 2: Tăng verification gates

- Script hóa validation phổ biến: lint, generate, generator smoke test, placeholder scan.
- Tách gate theo loại task thay vì chạy tất cả mọi lúc.
- Ghi rõ khi gate nào chưa chạy được.

### Giai đoạn 3: Agent workflow ổn định hơn

- Dùng worktree cho task song song hoặc thay đổi rủi ro cao.
- Có report ngắn sau mỗi task: intent, files, gates, risk.
- Dần mã hóa workflow thành reusable skill/script nếu lặp lại đủ nhiều.

---

## 8. Kết Luận

Harness là hướng đúng cho cách mình làm việc với AI trong iOS template repo. Mình không cần xây một hệ thống lớn ngay; điều cần hơn là biến những nguyên tắc đang nằm trong đầu thành context, workflow và validation rõ ràng.

Mục tiêu ngắn hạn: **agent không chỉ code nhanh hơn, mà làm việc trong repo này đúng hơn, kiểm chứng tốt hơn và sai theo cách dễ chẩn đoán hơn.**
