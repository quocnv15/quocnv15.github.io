# Case Study 012: Agentlytics — Quản trị hiệu suất bằng Data

> **"Không thể tối ưu hóa thứ bạn không đo lường được."**
> Cách Quoc dùng 1,241 phiên làm việc và 97,000 tin nhắn để giải mã DNA năng suất của chính mình.

---

## 1. Vấn đề: Cảm tính vs. Dữ liệu thực

Hầu hết các lập trình viên làm việc dựa trên cảm tính: "Hôm nay tôi code khá nhiều" hoặc "Tôi nghĩ tôi làm việc hiệu quả vào ban đêm". Nhưng trong mô hình "Factory" (Nhà máy sản xuất app), cảm tính là kẻ thù của sự ổn định.

Quoc cần biết chính xác:
- Mình mất bao nhiêu giờ để hoàn thành 1 feature?
- Thời điểm nào trong ngày mình đưa ra quyết định sai nhiều nhất?
- AI đóng góp bao nhiêu % vào tổng lượng code?

## 2. Giải pháp: Hệ thống Agentlytics

Quoc đã tích hợp hệ thống theo dõi toàn bộ phiên làm việc (sessions) giữa mình và các AI Agents (Claude, Cursor, GPT).

### Các chỉ số được theo dõi:
- **Volume:** Tổng số tin nhắn và phiên làm việc mỗi tháng.
- **Velocity:** Tốc độ từ lúc Planning đến lúc Ship.
- **Health:** Tỷ lệ làm việc ban đêm (Night owl) vs. Ban ngày.
- **Domain Focus:** Tỷ lệ thời gian cho Kỹ thuật (iOS) vs. Kinh doanh (ASO/Monetization).

## 3. Kết quả từ Data thực tế (Insight)

Dựa trên phân tích 1,241 sessions:
- **Tự tối ưu hóa nhịp sinh học:** Data cho thấy làm việc ban đêm (13% tổng thời gian) thường dẫn đến nhiều bug hơn và mệt mỏi vào sáng hôm sau. Quoc đã dùng insight này để chuyển dịch dần sang "Morning Coder" (mục tiêu 25%).
- **Đo lường sự cộng tác AI:** Xác định được "điểm rơi" năng suất khi dùng Cursor cho code lặp lại và Claude cho logic phức tạp. 
- **Khả năng dự báo:** Giờ đây, Quoc có thể tự tin tuyên bố: "Tôi có thể build 1 app chất lượng cao trong 40-60 giờ làm việc thực tế".

## 4. Giá trị kinh doanh

Đối với đối tác và nhà tuyển dụng, Agentlytics là minh chứng cho:
1.  **Sự minh bạch tuyệt đối:** Mọi giờ làm việc đều có dấu vết data.
2.  **Kỷ luật cao:** Khả năng tự soi xét và sửa đổi thói quen dựa trên con số.
3.  **Hiệu suất vượt trội:** Một hệ thống đã được tối ưu hóa qua hàng ngàn thử nghiệm.

---

## See Also
- [Bản phân tích DNA năng suất](../../me/AGENTLYTICS-PROFILE.md)
- [Self-Review 009: Holistic Self-Portrait](../../growth/selfreview/009-holistic-self-portrait.md)
