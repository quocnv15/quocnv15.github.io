---
layout: portfolio-detail
title: "Agent Teams & Progressive Disclosure"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/10-agent-teams-framework/
---

# Framework: Agent Teams & Progressive Disclosure
**Tác giả ý tưởng:** Mentor ThieuNV  
**Phân loại:** Quản trị thông tin ảo, LLM Orchestration, System Design

Một cỗ máy xịn, cấu hình mạnh nhưng nếu giao phó cho nó toàn bộ đầu việc của công ty cùng một lúc, cỗ máy sẽ khét lẹt và treo. Framework này định nghĩa lại tư duy làm việc đa luồng với AI (Phân luồng Team) và giới hạn nhồi nhét (Quy tắc mở dần).

---

## 1. Sự Kìm Kẹp Của "Đấng Toàn Năng" AI
*Tại sao dùng 1 AI làm từ A đến Z lại đẩy tới thất bại?*

- **Thói quen cũ:** Đa phần chúng ta gom hết 10 chức trách (Đọc yêu cầu, Lên kiến trúc, Code UI, Test API, Tối ưu Data) đưa cho một tab Chat AI duy nhất và ra lệnh "Làm cho tôi bằng xong!".
- **Nguyên lý sụp đổ:** AI (Agent độc lập) bị chứng "Context Rot" (thối rữa bộ nhớ). Khi nạp quá nhiều thông số phức tạp xoắn lấy nhau, IQ của AI giảm tụt dốc. Nó quên mất dòng lệnh đầu tiên, sinh ra mã lỗi chằng chịt và đưa ra quyết định lú lẫn.
- **Giải Pháp - Agent Teams (Phân luồng đội đặc nhiệm):** 
  - Đừng dùng 1 vị thần. Hãy ráp thành một "**Ban kiểm soát**". 
  - Một Agent chuyên đóng vai "Scout" (cầm đuốc đi dò map, đọc codebase xem file ở đâu).
  - Một Agent chuyên đóng vai "Lập kế hoạch".
  - Một Agent "Security" chuyên bắt bẻ lại Agent kế hoạch.
  - *Kết quả:* Nhờ bẻ nhỏ sự tập trung, từng Agent có IQ 100% trong lĩnh vực hẹp của nó. Chúng phản biện vòng tròn và triệt tiêu lỗi sót. Bạn từ Coder biến thành "Anh sếp ngồi giữa nghe nhân viên tranh luận".

## 2. Nghệ Thuật Khai Mở Tăng Dần (Progressive Disclosure)
*Quy tắc giới hạn 200 dòng để chống bội thực.*

- **Sự bội thực truyền thống:** Thêm hết 500 trang tài liệu Guideline vào Prompt là "Bức tử" thằng AI.
- **Nguyên tắc "Mở cửa từng lớp" (Progressive Disclosure):**
  - Giống hệt sếp công ty dạy việc NV mới. Ngày đầu đi làm, sếp (Bạn) không vứt cho NV (LLM) 500 trang ISO. 
  - Bạn chỉ đưa một mảnh giấy A4 tóm tắt (Metadata/Frontmatter).
  - Trên mặt giấy A4 ghi rõ: "Khi cần xử lý Database, giở ngăn tủ A. Khi cần UI, lấy file tài liệu B". (Quy tắc 200 dòng mỏ neo).
  - Nhờ vậy, Agent chỉ chủ động chui cắm ống hút vào file gốc *khi và chỉ khi* nó thực sự cần.

## 3. Lãnh Đạo Thông Tin Mới Là Số Dách
Từ framework này, rõ ràng năng lực tạo sự đột phá không đến từ việc bạn gõ Prompt dài tới đâu. Nút thắt (Bottleneck) nằm ở **Chất lượng cách bạn phân rã tổ chức thông tin** (Information Routing & Orchestration).
Bạn giống một tổng điểm đài giao thông - chỉ cần bật đúng đèn xanh, cho đúng người qua ngã tư vào đúng lúc, cỗ máy công ty sẽ sản sinh ra con số vạn đô mà không vướng 1 cái bug nào.

> **Kết luận:** Không có Superman nào gánh được tất cả. Xây dựng một Team Chuyên biệt (Multi-Agents), và dẫn góc chỉ đường cho tụi nó đi (bằng mỏ neo 200 dòng), chứ đừng rẽ rừng vác đá dẫn tụi nó từ đầu đến cuối chân núi.
