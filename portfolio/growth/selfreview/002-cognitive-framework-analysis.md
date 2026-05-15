---
layout: portfolio-detail
title: "Cognitive Framework Analysis"
back_url: /portfolio/growth/
back_label: "← Growth"
permalink: /portfolio/growth/selfreview/002-cognitive-framework-analysis/
---

# Brainstorming: Xác Định & Tinh Chỉnh Khung Tư Duy (Cognitive Framework)

## 1. Context (Bối cảnh)
Dựa trên phân tích 11 conversation gần nhất (chủ đề: Prompt Engineering, Agent Frameworks, AI Enforcement, Deploy Refactor...) và toàn bộ dữ liệu từ `memory/`, khung tư duy hiện tại của Quoc đang hoạt động như một "kiến trúc sư trưởng" điều khiển một team AI, chứ không còn là một coder thông thường.

## 2. Framework Hiện Tại & Lỗi Thường Gặp

Dưới đây là 4 trụ cột trong khung tư duy của bạn, đi kèm với các "Bẫy" (Traps) đang làm giảm hiệu suất:

### A. The "Systems Architect" Bias (Tư duy hệ thống sắc bén nhưng dễ sa đà)
- **Mindset:** Mọi vấn đề (từ code dở đến quy trình chậm) đều có thể giải quyết bằng cách xây một "hệ thống", "agent", hoặc "tool" mới. Hội thoại cũ cho thấy bạn liên tục tạo *AI Enforcement*, *Master Prompts*, *QMD Pipeline*.
- **Lỗi hay mắc (Over-engineering):** Đôi khi bạn dùng system để vá lỗi thói quen (vd: bắt Cursor tự review code thay vì bạn tự nhìn diff). Nguy cơ rơi vào "Meta-work" (làm tool để quản lý tool) thay vì "Product-work" (làm app kiếm tiền).
- **Điểm mù:** Quá chú trọng vào "Luật" (Enforcement) cho AI mà quên mất AI cũng có tỷ lệ hallucination.

### B. The "Execution Impatience" (Thiếu kiên nhẫn khi thực thi)
- **Mindset:** "Architecture và Plan đã chốt xong (với Claude/Antigravity), phần còn lại là việc chân tay, cứ để Cursor chạy max tốc độ."
- **Lỗi hay mắc (Blind Trust):** Tỷ lệ Cursor Write vs Review của bạn là **7000:0**. Bạn nhắm mắt bấm `Cmd+Enter` liên tục. Hậu quả là sinh ra **70 sessions "đánh nhau với linter/compiler"** và tạo ra các *Marathon Sessions* (>100 messages) chỉ để bắt AI tự đi dọn rác do chính nó đẻ ra.
- **Điểm mù:** Tưởng rằng AI gõ nhanh là tiết kiệm thời gian, nhưng thực tế thời gian debug linter/logic lật ngược lại làm giảm velocity tổng thể.

### C. The "Horizontal Scaling" Trap (Bẫy mở rộng chiều ngang)
- **Mindset:** Bạn mang tư duy "Factory Model" — ship volume lớn, scale nhiều app (14+ apps, 13 locales). 
- **Lỗi hay mắc (Context Fragmentation):** Nhảy 5-9 projects MỖI NGÀY (như lịch sử commit liên tục). Code cùng một logic (vd màn hình Premium, xử lý Location) đi lặp lại ở nhiều repo rời rạc thay vì gom lại.
- **Điểm mù:** Não người (và cả AI config context) bị tốn phí hao tổn cực lớn cho mỗi lần switch project. Bạn đang tự bào mòn thanh RAM não của mình.

### D. The "Night-Owl Endurance" Illusion (Ảo tưởng năng lượng ban đêm)
- **Mindset:** "Tôi deep-work tốt nhất vào ban đêm, khi không ai làm phiền."
- **Lỗi hay mắc (Quality Drop):** 13% session diễn ra từ 0-6h sáng. Ở những khung giờ này, sức lực cạn kiệt khiến bạn có xu hướng thỏa hiệp với Non-negotiables (tặc lưỡi chấp nhận code rác miễn là chạy được). Lượng commit "Commit Local Changes" gộp chung chung xuất hiện nhiều.
- **Điểm mù:** Xây nợ kỹ thuật (Tech Debt) ngay trong lúc tưởng mình đang làm việc năng suất nhất.

## 3. Actionable Protocols (Cách Điều Chỉnh)

Để nâng cấp chất lượng công việc, hãy áp dụng các nguyên tắc sau (có thể format theo BLUF + Rule of 3 nếu bạn đồng ý):

1. **Slow down to speed up (Để đi nhanh, hãy đi chậm lại):** 
   - Không mù quáng bấm Confirm cho Cursor. Bất cứ khi nào AI đẻ ra > 50 dòng code, **bắt buộc manual review/diff** trước khi tiếp tục. Thà tốn 1 phút đọc code còn hơn tốn 30 phút debug compiler.
2. **Module-centric thay vì App-centric:** 
   - Dừng việc copy-paste code giữa các app. Nhận diện các component trùng lặp (Premium, Ads, Settings) và đóng gói ngay thành 1 SPM (Swift Package) nội bộ. 
3. **Giới hạn Context-Switching (Tối đa 3):**
   - Đặt hard limit: 1 ngày KHÔNG MỞ QUÁ 3 PROJECTS. Nếu nay làm app A, B, C thì dứt khoát không đụng tới app D dù có bug nhỏ. Gom bug D sang ngày mai.

## 4. Strategic Consultation Report (Next Actions)

- **Đóng gói Core UI & Monetization (Module-centric):** Tách màn hình `PremiumVC`, IAP, Ads thành SPM nội bộ (vd `MobocoFoundation`) để xoá 60% bugs lặp lại ở 14 apps.
- **Thiết lập "Hàng rào Linter":** Tạo `.cursorrules` ép Cursor đọc `git diff` và verify build trước khi đóng file, tránh Marathon Sessions đi dọn rác.
- **Giới hạn Context Switching (WIP Limit):** 1 ngày KHÔNG MỞ QUÁ 3 PROJECTS Xcode. Tránh ảo giác context cho não bộ và AI.

---

## See also
[[memory_bank/knowledge/ai-tools/antigravity/metrics]], [[memory_bank/me/growth/002-cognitive-framework-analysis]], [[memory_bank/knowledge/ios-expertise/cc-cost-optimization]], [[memory_bank/knowledge/ios-expertise/CONSOLIDATED_SUMMARY]], [[memory_bank/me/identity/IDENTITY]], [[memory_bank/memory/memory-MOC]]
