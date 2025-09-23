---
layout: post
title: "The Art of Readable Code"
date: 2024-12-18 10:00:00 +0700
categories: [iOS, Interview, Coding]
tags: [iOS, Interview, Swift, Career, Preparation]
---

# Tổng Quan về Nghệ Thuật Viết Code Dễ Đọc (The Art of Readable Code)

Viết code không chỉ là để máy tính hiểu, mà quan trọng hơn là để con người có thể hiểu và bảo trì. **Nguyên tắc cốt lõi** là code phải dễ hiểu, và mục tiêu chính là **giảm thiểu thời gian người khác cần để hiểu được code của bạn**. Code dễ hiểu thường dẫn đến kiến trúc tốt, ít lỗi hơn và dễ kiểm thử hơn.

Bài viết này tổng hợp các kỹ thuật và nguyên tắc chính để cải thiện chất lượng code, giúp code trở nên trong sáng, dễ đọc và dễ bảo trì hơn.

## Phần 1: Cải Thiện Bề Mặt (Surface-Level Improvements)

Đây là những thay đổi đơn giản, dễ áp dụng mà không cần tái cấu trúc (refactor) lớn, nhưng lại có tác động sâu rộng đến toàn bộ codebase.

### 1. Đặt Tên Có Ý Nghĩa (Packing Information into Names)

Tên biến, hàm, hay lớp nên được xem như những "comment thu nhỏ", chứa đựng nhiều thông tin nhất có thể.

- **Chọn từ ngữ cụ thể**: Tránh các từ chung chung như `Get`, `Size`, `Stop`. Thay vào đó, hãy dùng những từ mô tả chính xác hành động, ví dụ `FetchPage()` hay `DownloadPage()` thay cho `GetPage()`.
- **Tránh tên chung chung**: Các tên như `tmp`, `retval`, `foo` thường không mang nhiều ý nghĩa. Chỉ nên dùng `tmp` cho các biến có vòng đời rất ngắn và mục đích chính là lưu trữ tạm thời.
- **Sử dụng tên cụ thể thay vì trừu tượng**: Tên gọi nên mô tả trực tiếp hành động hoặc mục đích. Ví dụ, `CanListenOnPort()` rõ ràng hơn `ServerCanStart()`.
- **Đính kèm thông tin quan trọng**:
  - **Đơn vị**: Thêm đơn vị vào tên biến để tránh nhầm lẫn, ví dụ `delay_ms`, `size_mb`.
  - **Thông tin quan trọng khác**: Đánh dấu các biến cần chú ý đặc biệt, ví dụ `untrustedUrl`, `plaintext_password` để cảnh báo về trạng thái của dữ liệu.
- **Độ dài của tên**: Tên ngắn phù hợp với phạm vi (scope) hẹp. Tên dài và chi tiết hơn nên được dùng cho các biến có phạm vi lớn, xuyên suốt nhiều màn hình code.
- **Định dạng tên để truyền tải ý nghĩa**: Sử dụng nhất quán các quy ước về viết hoa (CamelCase), gạch dưới (snake_case) để phân biệt các loại thực thể (lớp, biến, hằng số).

### 2. Chọn Tên Không Gây Hiểu Lầm (Names That Can’t Be Misconstrued)

Hãy tự hỏi: "Tên này có thể bị hiểu theo nghĩa nào khác không?" để tìm ra những cái tên dễ gây nhầm lẫn.

- **Giới hạn (Limits)**: Sử dụng `max_` hoặc `min_` cho các giới hạn bao hàm (inclusive), ví dụ `MAX_ITEMS_IN_CART`.
- **Phạm vi (Ranges)**:
  - Dùng `first` và `last` cho các khoảng bao hàm cả hai đầu (inclusive ranges).
  - Dùng `begin` và `end` cho các khoảng bao hàm đầu nhưng loại trừ cuối (inclusive/exclusive ranges).
- **Biến Boolean**: Tên biến boolean nên rõ ràng về ý nghĩa `true`/`false`. Thêm các tiền tố như `is`, `has`, `can` và tránh các từ phủ định.
- **Đáp ứng kỳ vọng của người dùng**: Tránh đặt tên đi ngược lại với quy ước chung. Ví dụ, hàm `get()` thường được hiểu là một thao tác nhẹ, không tốn nhiều tài nguyên. Nếu hàm của bạn thực hiện một tính toán phức tạp, hãy đặt tên là `compute()`.

### 3. Thẩm Mỹ (Aesthetics)

Code được trình bày đẹp mắt giúp người đọc lướt qua và nắm bắt thông tin nhanh hơn.

- **Bố cục nhất quán**: Sắp xếp code theo một khuôn mẫu nhất quán. Code tương tự nên trông giống nhau.
- **Căn chỉnh theo cột**: Khi có nhiều dòng khai báo hoặc gọi hàm tương tự, việc căn chỉnh các thành phần theo cột giúp dễ dàng quét và phát hiện lỗi.
- **Thứ tự hợp lý**: Sắp xếp các khai báo hoặc các câu lệnh theo một thứ tự có ý nghĩa (ví dụ: theo thứ tự quan trọng, theo bảng chữ cái) và duy trì thứ tự đó một cách nhất quán.
- **Chia code thành các "đoạn văn"**: Sử dụng dòng trống để nhóm các dòng code liên quan lại với nhau, tạo thành các khối logic dễ theo dõi.

### 4. Bình Luận (Commenting)

Mục đích của comment là **giúp người đọc biết được những gì người viết đã biết**.

- **Những gì KHÔNG nên comment**:
  - Những điều hiển nhiên có thể suy ra nhanh chóng từ chính đoạn code.
  - Đừng comment để bù đắp cho một cái tên tồi, hãy sửa tên đó.
- **Những gì NÊN comment**:
  - **Ghi lại suy nghĩ của bạn**: Ghi lại những insight, ví dụ tại sao bạn chọn một giải pháp này thay vì giải pháp khác, hoặc những đánh đổi đã thực hiện.
  - **Bình luận về các thiếu sót**: Sử dụng các đánh dấu như `TODO:`, `FIXME:`, `HACK:` để ghi chú những phần code chưa hoàn thiện hoặc cần cải tiến.
  - **Giải thích các hằng số**: Lý giải tại sao một hằng số có giá trị cụ thể đó.
  - **Đặt mình vào vị trí người đọc**:
    - **Dự đoán các câu hỏi**: Comment những phần code có thể khiến người đọc phải dừng lại và tự hỏi "Huh?".
    - **Cảnh báo những cạm bẫy**: Ghi chú về những hành vi bất ngờ hoặc những cách sử dụng sai có thể xảy ra.
    - **Comment "tầm cao" (Big Picture)**: Ở đầu file hoặc lớp, hãy thêm những bình luận tổng quan về vai trò và sự tương tác của nó trong hệ thống.
    - **Tóm tắt các khối code**: Giúp người đọc nắm được ý chính trước khi đi vào chi tiết.

## Phần 2: Đơn Giản Hóa Vòng Lặp và Logic

Mục tiêu là giảm thiểu "gánh nặng tinh thần" khi đọc code bằng cách làm cho các luồng điều khiển, biểu thức logic và biến trở nên dễ theo dõi hơn.

### 1. Luồng Điều Khiển Dễ Đọc (Control Flow)

- **Thứ tự đối số trong điều kiện**: Nên đặt giá trị hay thay đổi ở bên trái và giá trị ổn định hơn ở bên phải. Ví dụ: `if (length >= 10)` dễ đọc hơn `if (10 <= length)`.
- **Thứ tự của khối `if/else`**: Ưu tiên xử lý trường hợp khẳng định (`if (debug)`), trường hợp đơn giản, hoặc trường hợp thú vị trước.
- **Hạn chế lồng ghép (Nesting)**: Code lồng ghép sâu rất khó theo dõi. Hãy cố gắng giảm thiểu số cấp lồng ghép bằng cách sử dụng **return sớm** (early return) hoặc **continue** trong vòng lặp để xử lý các trường hợp đặc biệt ngay từ đầu.

### 2. Chia Nhỏ Các Biểu Thức Lớn (Giant Expressions)

Các biểu thức lớn và phức tạp nên được chia thành các phần nhỏ hơn để dễ hiểu hơn.

- **Biến giải thích (Explaining Variables)**: Giới thiệu một biến mới để chứa một biểu thức con, giúp giải thích ý nghĩa của nó.
- **Biến tóm tắt (Summary Variables)**: Ngay cả khi một biểu thức không quá khó hiểu, việc đặt nó vào một biến có tên tóm tắt cũng giúp code dễ đọc hơn.
- **Tìm một cách tiếp cận khác**: Đôi khi, một biểu thức logic phức tạp là dấu hiệu cho thấy có một cách tiếp cận vấn đề đơn giản hơn. Ví dụ, thay vì kiểm tra tất cả các trường hợp "giao nhau" (overlap), hãy kiểm tra trường hợp ngược lại là "không giao nhau".

### 3. Biến và Khả Năng Đọc (Variables and Readability)

Việc sử dụng biến một cách cẩu thả làm chương trình khó hiểu hơn. Ba vấn đề chính cần giải quyết là: quá nhiều biến, phạm vi biến quá lớn, và biến thay đổi quá thường xuyên.

- **Loại bỏ biến không cần thiết**: Gỡ bỏ các biến tạm thời không giúp làm rõ code hay giảm sự phức tạp.
- **Thu hẹp phạm vi của biến**: Biến nên được khai báo ở phạm vi hẹp nhất có thể. Biến chỉ được thấy bởi một số ít dòng code sẽ giảm gánh nặng cho người đọc.
- **Ưu tiên biến chỉ ghi một lần (Write-Once Variables)**: Biến được gán giá trị một lần duy nhất (hằng số, `const`, `final`) dễ theo dõi hơn nhiều so với các biến thay đổi liên tục.

## Phần 3: Tái Tổ Chức Code (Reorganizing Your Code)

Đây là những thay đổi ở cấp độ hàm và chức năng để giúp code có cấu trúc tốt hơn.

### 1. Trích Xuất Các Bài Toán Con Không Liên Quan (Extracting Unrelated Subproblems)

Hãy tách những đoạn code giải quyết một bài toán con, độc lập, ra khỏi logic chính.

- **Quy trình**:
  1.  Xác định mục tiêu cấp cao của hàm/khối code.
  2.  Với mỗi dòng code, tự hỏi nó có trực tiếp phục vụ mục tiêu đó không, hay nó đang giải một bài toán phụ?
  3.  Nếu có đủ số dòng code giải quyết một bài toán phụ, hãy trích xuất chúng thành một hàm riêng.
- **Lợi ích**: Code chính trở nên gọn gàng, dễ tập trung vào logic chính. Hàm được trích xuất thường là các hàm tiện ích có thể tái sử dụng và dễ kiểm thử hơn.

### 2. Mỗi Lần Chỉ Làm Một Việc (One Task at a Time)

Code nên được tổ chức để mỗi phần chỉ thực hiện một nhiệm vụ duy nhất tại một thời điểm.

- **Quy trình**:
  1.  Liệt kê tất cả các "nhiệm vụ" mà code đang làm.
  2.  Tách các nhiệm vụ đó ra thành các hàm riêng biệt hoặc ít nhất là các khu vực logic riêng trong cùng một hàm.
- **Ví dụ**: Thay vì vừa "phân tích" giá trị của một vote (ví dụ: 'Up' -> +1, 'Down' -> -1) vừa cập nhật điểm số trong cùng một khối `if/else` phức tạp, hãy tách thành hai bước: một hàm để chuyển đổi vote thành giá trị số, và một hàm khác để cập nhật điểm số dựa trên giá trị đó.

### 3. Biến Suy Nghĩ Thành Code (Turning Thoughts into Code)

Mô tả logic bằng ngôn ngữ tự nhiên trước có thể giúp bạn viết ra code trong sáng hơn.

- **Quy trình**:
  1.  Mô tả những gì code cần làm bằng "tiếng Anh đơn giản".
  2.  Chú ý đến các từ khóa và cụm từ chính trong mô tả.
  3.  Viết code sao cho khớp với mô tả đó.
- **Ví dụ**: Thay vì một cây logic `if-else` lồng nhau phức tạp để kiểm tra quyền truy cập, hãy mô tả: "Người dùng được cấp quyền NẾU họ là admin HOẶC họ sở hữu tài liệu". Code viết theo mô tả này sẽ trở nên thẳng thắn và dễ hiểu hơn.

### 4. Viết Ít Code Hơn (Writing Less Code)

**Code dễ đọc nhất là không có code nào cả**. Mỗi dòng code bạn viết đều cần được kiểm thử và bảo trì.

- **Đừng vội triển khai tính năng**: Các lập trình viên thường đánh giá quá cao số lượng tính năng thực sự cần thiết và đánh giá thấp công sức để hoàn thiện chúng. Hãy đặt câu hỏi và phân tích kỹ yêu cầu để giải quyết phiên bản đơn giản nhất của vấn đề.
- **Làm quen với các thư viện**: Việc nắm vững các thư viện chuẩn giúp bạn tránh phải viết lại những đoạn code đã có sẵn, giúp codebase gọn nhẹ hơn.
- **Loại bỏ code không sử dụng**: Hãy "cắt tỉa" những tính năng không dùng đến hoặc code không còn được gọi tới. Đừng ngại xóa code, vì bạn luôn có thể khôi phục lại từ hệ thống quản lý phiên bản (version control).

## Phần 4: Các Chủ Đề Khác (Selected Topics)

### 1. Kiểm Thử và Tính Dễ Đọc (Testing and Readability)

Code kiểm thử (test code) cũng cần phải dễ đọc như code chính.

- **Làm cho test dễ đọc và bảo trì**: Test code khó hiểu sẽ khiến các lập trình viên ngại sửa đổi code chính hoặc ngại thêm các bài test mới.
- **Tạo các hàm trợ giúp (helper functions)**: Để che giấu các chi tiết không quan trọng và làm nổi bật những gì bài test đang kiểm tra.
- **Tạo "ngôn ngữ mini"**: Sử dụng các chuỗi hoặc cấu trúc dữ liệu đơn giản để mô tả các kịch bản test một cách ngắn gọn, súc tích.
- **Thông báo lỗi dễ đọc**: Khi một bài test thất bại, thông báo lỗi cần phải cung cấp đủ thông tin để người đọc nhanh chóng xác định vấn đề.
- **Chọn đầu vào tốt cho test**: Sử dụng bộ đầu vào đơn giản nhất có thể nhưng vẫn kiểm tra được đầy đủ các trường hợp của code.
- **Đặt tên hàm test có ý nghĩa**: Tên hàm nên mô tả rõ ràng hàm/tình huống đang được kiểm tra, ví dụ: `Test_<FunctionName>_<Situation>`.

---

Bằng cách áp dụng những nguyên tắc và kỹ thuật này, bạn không chỉ tạo ra code hoạt động đúng mà còn xây dựng một codebase lành mạnh, dễ dàng cho việc phát triển và bảo trì trong tương lai.