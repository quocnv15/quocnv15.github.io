---
layout: portfolio-detail
title: "Context Engineering (R-P-I)"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/framework/08-context-engineering-framework/
---

# Framework: Context Engineering (Quy Trình R-P-I)
**Tác giả ý tưởng:** Mentor Zuey  
**Phân loại:** Context Management, Workflow Engineering, Tối ưu hóa não bộ LLM

Giống như con người, AI cũng bị hội chứng "Quá tải thông tin" (Information Overload). Framework này vạch ra cách dọn dẹp vùng nhớ của LLM để nó đạt chỉ số IQ cao nhất khi làm việc.

---

## 1. Hội Chứng "Bữa Tiệc Buffet" & Điểm Chết Dumb Zone
*Nhiều thông tin không làm bạn thông minh lên, nó làm bạn ngộp thở.*

- **Thực tiễn đau thương:** Thói quen của đa số Coder là gắn trọn bộ toàn bộ thư mục dự án (hàng trăm file) vào prompt rồi gõ: *"Hiểu code này và viết cho tôi tính năng A"*. Việc này quăng LLM vào một "Bữa tiệc buffet" quá nhiều món, khiến nó bị ngộ độc thực phẩm (Context Rot).
- **Vùng cấm địa (Dumb Zone):** Khi vùng nhớ bị lấp đầy tới **40%**, năng lực tư duy logic và nhớ lại (Recall) của AI giảm tụt dốc. Nó bắt đầu sinh ra "Code Rác" (Slop code/Code churn) – làm đi làm lại một dòng code hư rập khuôn.
- **Vai trò thực sự của Sub-agents:** Đừng tạo những con Sub-agents mang tên "Chuyên gia Frontend" hay "Chuyên gia QA" để đóng kịch. Sub-agents thực chất là **Những Kẻ Trinh Sát (Scouts)**. 
Bạn đẩy con trinh sát đi đọc mớ hỗn độn 100 file đó, và bắt nó nhả về đúng 1 mẩu giấy gọn lỏn: *"Đoạn code anh cần ở file A, dòng số 12"*. Não của con AI chính (Main Agent) vẫn sạch tinh tươm để tập trung năng lực viết Code thần sầu.

## 2. R-P-I Workflow (Ép Nén Có Chủ Ý)
Để không rơi vào vùng Dumb Zone, bắt buộc phải chia quy trình làm 3 bước đứt đoạn (Intentional Compaction):
1. **Research (Trinh sát):** Cử Agent nhỏ đi đọc hệ thống và lấy data về. Chú ý: *Tuyệt đối không bắt sinh code ở bước này.*
2. **Plan (Lên Thực Đơn):** Nén toàn bộ dữ liệu trinh sát thành một file `plan.md` cực kỳ cụ thể. **Đây là bước quan trọng nhất.** "Một bảng thiết kế tồi sẽ sinh ra một cái nhà sập". Tương tự, một dòng Plan lủng củng sẽ sinh ra 100 dòng Code rác. (Bạn phải Review bằng măt ở bước này).
3. **Implement (Thi hành với não sạch):** Reset memory của chat! Mở một phiên làm việc trắng tinh (Fresh Context), chỉ nạp duy nhất cái file `plan.md` đó vào và bảo AI: *"Viết code đúng theo y đúc tờ giấy này"*.

## 3. Bản Chất Của "Đặc Tả" (Spec-Driven)
Rất nhiều người rỉ tai nhau phương pháp "Spec-driven" (Làm việc dựa trên tài liệu đặc tả) và biến nó thành cuộc thi "Viết Prompt PRD dài nhất". 
Nhưng linh hồn thực thụ của Spec-Driven là **Kỹ thuật kỹ sư ngữ cảnh (Context Engineering)**:
Đó là tạo ra một vòng lặp nhả ra: **Đúng thông tin sạch (Right Info) -> Đúng lúc (Right Time) -> Đúng định dạng (Right Format)**.
Mục tiêu tối thượng chỉ có một: Giữ cho cái bộ nhớ (Memory) của LLM lúc nào cũng mỏng, sạch, và nhẹ.

> **Kết luận:** Nếu bạn bắt một vị giáo sư gánh theo sau mình 100 cuốn từ điển bách khoa, ông ấy sẽ đi loạng choạng. Bỏ đống sách đó xuống, chỉ đưa cho ông ấy cuốn cần dùng nhất lúc này, ông ấy sẽ giải đúng bài toán thế kỷ.
