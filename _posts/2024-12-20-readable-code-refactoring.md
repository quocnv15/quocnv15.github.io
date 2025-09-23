---
layout: post
title: "The Art of Readable Code"
date: 2024-12-18 10:00:00 +0700
categories: [iOS, Interview, Coding]
tags: [iOS, Interview, Swift, Career, Preparation]
---
# Tổng Quan về Viết Code Dễ Đọc và Tái Cấu Trúc Code

Viết code không chỉ là để máy tính hiểu, mà quan trọng hơn là để con người có thể hiểu và bảo trì [3]. **Nguyên tắc cốt lõi** là code phải dễ hiểu, và mục tiêu chính là **giảm thiểu thời gian người khác cần để hiểu được code của bạn** [4]. Code dễ hiểu thường dẫn đến kiến trúc tốt, ít lỗi hơn, dễ kiểm thử hơn và cuối cùng là giúp lập trình nhanh hơn [5, 6].

Để đạt được điều này, chúng ta cần hai kỹ năng song hành:
1.  **Viết code dễ đọc (Readable Code)**: Áp dụng các kỹ thuật giúp code trở nên trong sáng, dễ hiểu ngay từ đầu [7].
2.  **Tái cấu trúc (Refactoring)**: Một kỹ thuật có kỷ luật để cải thiện cấu trúc bên trong của code hiện có mà không làm thay đổi hành vi bên ngoài của nó [2, 8].

Bài viết này tổng hợp các kỹ thuật và nguyên tắc chính cho cả hai kỹ năng trên.

---

## Phần 1: Nghệ Thuật Viết Code Dễ Đọc (The Art of Readable Code)

Phần này tập trung vào các thay đổi có thể áp dụng để cải thiện chất lượng code, giúp code trở nên trong sáng và dễ bảo trì hơn [1, 7].

### I. Cải Thiện Bề Mặt (Surface-Level Improvements)

Đây là những thay đổi đơn giản, dễ áp dụng mà không cần tái cấu trúc (refactor) lớn, nhưng lại có tác động sâu rộng đến toàn bộ codebase [9].

#### 1. Đặt Tên Có Ý Nghĩa (Packing Information into Names)

Tên biến, hàm, hay lớp nên được xem như những "comment thu nhỏ", chứa đựng nhiều thông tin nhất có thể [10].

-   **Chọn từ ngữ cụ thể**: Tránh các từ chung chung như `Get`, `Size`, `Stop`. Thay vào đó, hãy dùng những từ mô tả chính xác hành động, ví dụ `FetchPage()` hay `DownloadPage()` thay cho `GetPage()` [11, 12].
-   **Tránh tên chung chung**: Các tên như `tmp`, `retval`, `foo` thường không mang nhiều ý nghĩa [12, 13]. Chỉ nên dùng `tmp` cho các biến có vòng đời rất ngắn và mục đích chính là lưu trữ tạm thời [14, 15].
-   **Sử dụng tên cụ thể thay vì trừu tượng**: Tên gọi nên mô tả trực tiếp hành động hoặc mục đích [3]. Ví dụ, `CanListenOnPort()` rõ ràng hơn `ServerCanStart()` [16, 17].
-   **Đính kèm thông tin quan trọng**:
    -   **Đơn vị**: Thêm đơn vị vào tên biến để tránh nhầm lẫn, ví dụ `delay_ms`, `size_mb` [18, 19].
    -   **Thông tin quan trọng khác**: Đánh dấu các biến cần chú ý đặc biệt, ví dụ `untrustedUrl`, `plaintext_password` để cảnh báo về trạng thái của dữ liệu [17, 20].
-   **Độ dài của tên**: Tên ngắn phù hợp với phạm vi (scope) hẹp. Tên dài và chi tiết hơn nên được dùng cho các biến có phạm vi lớn [17, 21].
-   **Định dạng tên để truyền tải ý nghĩa**: Sử dụng nhất quán các quy ước về viết hoa (CamelCase), gạch dưới (snake_case) để phân biệt các loại thực thể (lớp, biến, hằng số) [17, 22].

#### 2. Chọn Tên Không Gây Hiểu Lầm (Names That Can’t Be Misconstrued)

Hãy tự hỏi: "Tên này có thể bị hiểu theo nghĩa nào khác không?" để tìm ra những cái tên dễ gây nhầm lẫn [23].

-   **Giới hạn (Limits)**: Sử dụng `max_` hoặc `min_` cho các giới hạn bao hàm (inclusive), ví dụ `MAX_ITEMS_IN_CART` [24, 25].
-   **Phạm vi (Ranges)**:
    -   Dùng `first` và `last` cho các khoảng bao hàm cả hai đầu (inclusive ranges) [25, 26].
    -   Dùng `begin` và `end` cho các khoảng bao hàm đầu nhưng loại trừ cuối (inclusive/exclusive ranges) [25, 27].
-   **Biến Boolean**: Tên biến boolean nên rõ ràng về ý nghĩa `true`/`false`. Thêm các tiền tố như `is`, `has`, `can` và tránh các từ phủ định [25, 28].
-   **Đáp ứng kỳ vọng của người dùng**: Tránh đặt tên đi ngược lại với quy ước chung [29]. Ví dụ, hàm `get()` thường được hiểu là một thao tác nhẹ, không tốn nhiều tài nguyên. Nếu hàm của bạn thực hiện một tính toán phức tạp, hãy đặt tên là `compute()` [30, 31].

#### 3. Thẩm Mỹ (Aesthetics)

Code được trình bày đẹp mắt giúp người đọc lướt qua và nắm bắt thông tin nhanh hơn [32].

-   **Bố cục nhất quán**: Sắp xếp code theo một khuôn mẫu nhất quán. Code tương tự nên trông giống nhau [32, 33].
-   **Căn chỉnh theo cột**: Khi có nhiều dòng khai báo hoặc gọi hàm tương tự, việc căn chỉnh các thành phần theo cột giúp dễ dàng quét và phát hiện lỗi [33, 34].
-   **Thứ tự hợp lý**: Sắp xếp các khai báo hoặc các câu lệnh theo một thứ tự có ý nghĩa (ví dụ: theo thứ tự quan trọng, theo bảng chữ cái) và duy trì thứ tự đó một cách nhất quán [33, 35].
-   **Chia code thành các "đoạn văn"**: Sử dụng dòng trống để nhóm các dòng code liên quan lại với nhau, tạo thành các khối logic dễ theo dõi [33, 36].

#### 4. Bình Luận (Commenting)

Mục đích của comment là **giúp người đọc biết được những gì người viết đã biết** [37].

-   **Những gì KHÔNG nên comment**:
    -   Những điều hiển nhiên có thể suy ra nhanh chóng từ chính đoạn code [38, 39].
    -   Đừng comment để bù đắp cho một cái tên tồi, hãy sửa tên đó [39, 40].
-   **Những gì NÊN comment**:
    -   **Ghi lại suy nghĩ của bạn**: Ghi lại những insight, ví dụ tại sao bạn chọn một giải pháp này thay vì giải pháp khác, hoặc những đánh đổi đã thực hiện [41, 42].
    -   **Bình luận về các thiếu sót**: Sử dụng các đánh dấu như `TODO:`, `FIXME:`, `HACK:` để ghi chú những phần code chưa hoàn thiện hoặc cần cải tiến [42, 43].
    -   **Giải thích các hằng số**: Lý giải tại sao một hằng số có giá trị cụ thể đó [42, 44].
    -   **Đặt mình vào vị trí người đọc**:
        -   **Dự đoán các câu hỏi**: Comment những phần code có thể khiến người đọc phải dừng lại và tự hỏi "Huh?" [45, 46].
        -   **Cảnh báo những cạm bẫy**: Ghi chú về những hành vi bất ngờ hoặc những cách sử dụng sai có thể xảy ra [46, 47].
        -   **Comment "tầm cao" (Big Picture)**: Ở đầu file hoặc lớp, hãy thêm những bình luận tổng quan về vai trò và sự tương tác của nó trong hệ thống [46, 48].
        -   **Tóm tắt các khối code**: Giúp người đọc nắm được ý chính trước khi đi vào chi tiết [46, 49].
-   **Bình luận chính xác và cô đọng**:
    -   Sử dụng các từ ngữ súc tích, có tỷ lệ thông tin/không gian cao [50].
    -   Sử dụng các ví dụ đầu vào/đầu ra để minh họa các trường hợp biên [51].
    -   Sử dụng các từ ngữ giàu thông tin như "heuristic", "brute-force", "naive solution" để mô tả các mẫu hình lập trình phổ biến [52].

### II. Đơn Giản Hóa Vòng Lặp và Logic

Mục tiêu là giảm thiểu "gánh nặng tinh thần" khi đọc code bằng cách làm cho các luồng điều khiển, biểu thức logic và biến trở nên dễ theo dõi hơn [53].

#### 1. Luồng Điều Khiển Dễ Đọc (Control Flow)

-   **Thứ tự đối số trong điều kiện**: Nên đặt giá trị hay thay đổi ở bên trái và giá trị ổn định hơn ở bên phải [54]. Ví dụ: `if (length >= 10)` dễ đọc hơn `if (10 <= length)` [54, 55].
-   **Thứ tự của khối `if/else`**: Ưu tiên xử lý trường hợp khẳng định (`if (debug)`), trường hợp đơn giản, hoặc trường hợp thú vị trước [55, 56].
-   **Hạn chế lồng ghép (Nesting)**: Code lồng ghép sâu rất khó theo dõi. Hãy cố gắng giảm thiểu số cấp lồng ghép bằng cách sử dụng **return sớm** (early return) hoặc **continue** trong vòng lặp để xử lý các trường hợp đặc biệt ngay từ đầu [57, 58].

#### 2. Chia Nhỏ Các Biểu Thức Lớn (Giant Expressions)

Các biểu thức lớn và phức tạp nên được chia thành các phần nhỏ hơn để dễ hiểu hơn [59].

-   **Biến giải thích (Explaining Variables)**: Giới thiệu một biến mới để chứa một biểu thức con, giúp giải thích ý nghĩa của nó [60, 61].
-   **Biến tóm tắt (Summary Variables)**: Ngay cả khi một biểu thức không quá khó hiểu, việc đặt nó vào một biến có tên tóm tắt cũng giúp code dễ đọc hơn [60, 61].
-   **Sử dụng luật De Morgan**: Đôi khi việc áp dụng các luật logic như De Morgan có thể làm cho một biểu thức boolean trở nên dễ đọc hơn [62, 63].
-   **Tìm một cách tiếp cận khác**: Đôi khi, một biểu thức logic phức tạp là dấu hiệu cho thấy có một cách tiếp cận vấn đề đơn giản hơn. Ví dụ, thay vì kiểm tra tất cả các trường hợp "giao nhau" (overlap), hãy kiểm tra trường hợp ngược lại là "không giao nhau" [63, 64].

#### 3. Biến và Khả Năng Đọc (Variables and Readability)

Việc sử dụng biến một cách cẩu thả làm chương trình khó hiểu hơn. Ba vấn đề chính cần giải quyết là: quá nhiều biến, phạm vi biến quá lớn, và biến thay đổi quá thường xuyên [65].

-   **Loại bỏ biến không cần thiết**: Gỡ bỏ các biến tạm thời không giúp làm rõ code hay giảm sự phức tạp [66, 67].
-   **Thu hẹp phạm vi của biến**: Biến nên được khai báo ở phạm vi hẹp nhất có thể [68]. Biến chỉ được thấy bởi một số ít dòng code sẽ giảm gánh nặng cho người đọc [67, 69].
-   **Ưu tiên biến chỉ ghi một lần (Write-Once Variables)**: Biến được gán giá trị một lần duy nhất (hằng số, `const`, `final`) dễ theo dõi hơn nhiều so với các biến thay đổi liên tục [67, 70].

### III. Tái Tổ Chức Code (Reorganizing Your Code)

Đây là những thay đổi ở cấp độ hàm và chức năng để giúp code có cấu trúc tốt hơn [71].

#### 1. Trích Xuất Các Bài Toán Con Không Liên Quan (Extracting Unrelated Subproblems)

Hãy tách những đoạn code giải quyết một bài toán con, độc lập, ra khỏi logic chính [72].

-   **Quy trình**:
    1.  Xác định mục tiêu cấp cao của hàm/khối code [72].
    2.  Với mỗi dòng code, tự hỏi nó có trực tiếp phục vụ mục tiêu đó không, hay nó đang giải một bài toán phụ? [72]
    3.  Nếu có đủ số dòng code giải quyết một bài toán phụ, hãy trích xuất chúng thành một hàm riêng [72].
-   **Lợi ích**: Code chính trở nên gọn gàng, dễ tập trung vào logic chính. Hàm được trích xuất thường là các hàm tiện ích có thể tái sử dụng và dễ kiểm thử hơn [73].

#### 2. Mỗi Lần Chỉ Làm Một Việc (One Task at a Time)

Code nên được tổ chức để mỗi phần chỉ thực hiện một nhiệm vụ duy nhất tại một thời điểm [74].

-   **Quy trình**:
    1.  Liệt kê tất cả các "nhiệm vụ" mà code đang làm [75].
    2.  Tách các nhiệm vụ đó ra thành các hàm riêng biệt hoặc ít nhất là các khu vực logic riêng trong cùng một hàm [75].
-   **Ví dụ**: Thay vì vừa "phân tích" giá trị của một vote (ví dụ: 'Up' -> +1, 'Down' -> -1) vừa cập nhật điểm số trong cùng một khối `if/else` phức tạp, hãy tách thành hai bước: một hàm để chuyển đổi vote thành giá trị số, và một hàm khác để cập nhật điểm số dựa trên giá trị đó [76, 77].

#### 3. Biến Suy Nghĩ Thành Code (Turning Thoughts into Code)

Mô tả logic bằng ngôn ngữ tự nhiên trước có thể giúp bạn viết ra code trong sáng hơn [78].

-   **Quy trình**:
    1.  Mô tả những gì code cần làm bằng "ngôn ngữ tự nhiên đơn giản" [78].
    2.  Chú ý đến các từ khóa và cụm từ chính trong mô tả [78].
    3.  Viết code sao cho khớp với mô tả đó [78].
-   **Ví dụ**: Thay vì một cây logic `if-else` lồng nhau phức tạp để kiểm tra quyền truy cập, hãy mô tả: "Người dùng được cấp quyền NẾU họ là admin HOẶC họ sở hữu tài liệu" [79]. Code viết theo mô tả này sẽ trở nên thẳng thắn và dễ hiểu hơn [80].

#### 4. Viết Ít Code Hơn (Writing Less Code)

**Code dễ đọc nhất là không có code nào cả**. Mỗi dòng code bạn viết đều cần được kiểm thử và bảo trì [81].

-   **Đừng vội triển khai tính năng**: Các lập trình viên thường đánh giá quá cao số lượng tính năng thực sự cần thiết và đánh giá thấp công sức để hoàn thiện chúng [82]. Hãy đặt câu hỏi và phân tích kỹ yêu cầu để giải quyết phiên bản đơn giản nhất của vấn đề [83].
-   **Làm quen với các thư viện**: Việc nắm vững các thư viện chuẩn giúp bạn tránh phải viết lại những đoạn code đã có sẵn, giúp codebase gọn nhẹ hơn [84, 85].
-   **Loại bỏ code không sử dụng**: Hãy "cắt tỉa" những tính năng không dùng đến hoặc code không còn được gọi tới [86]. Đừng ngại xóa code, vì bạn luôn có thể khôi phục lại từ hệ thống quản lý phiên bản (version control) [86].

### IV. Kiểm Thử và Tính Dễ Đọc (Testing and Readability)

Code kiểm thử (test code) cũng cần phải dễ đọc như code chính [87].

-   **Làm cho test dễ đọc và bảo trì**: Test code khó hiểu sẽ khiến các lập trình viên ngại sửa đổi code chính hoặc ngại thêm các bài test mới [88].
-   **Tạo các hàm trợ giúp (helper functions)**: Để che giấu các chi tiết không quan trọng và làm nổi bật những gì bài test đang kiểm tra [89].
-   **Tạo "ngôn ngữ mini"**: Sử dụng các chuỗi hoặc cấu trúc dữ liệu đơn giản để mô tả các kịch bản test một cách ngắn gọn, súc tích [90].
-   **Thông báo lỗi dễ đọc**: Khi một bài test thất bại, thông báo lỗi cần phải cung cấp đủ thông tin để người đọc nhanh chóng xác định vấn đề [91, 92].
-   **Đặt tên hàm test có ý nghĩa**: Tên hàm nên mô tả rõ ràng hàm/tình huống đang được kiểm tra, ví dụ: `Test_<FunctionName>_<Situation>` [93].

---

## Phần 2: Tái Cấu Trúc - Cải Thiện Thiết Kế Code Hiện Có (Refactoring)

Tái cấu trúc là một kỹ thuật có kỷ luật để tái cấu trúc một khối code hiện có, thay đổi cấu trúc bên trong của nó mà không thay đổi hành vi bên ngoài [8, 94].

### I. Tại Sao Cần Tái Cấu Trúc?

Mặc dù code có thể đang hoạt động tốt, việc tái cấu trúc vẫn rất quan trọng, đặc biệt khi cần thay đổi hoặc thêm tính năng mới [95].

1.  **Cải thiện Thiết kế của Phần mềm**: Nếu không có tái cấu trúc, kiến trúc bên trong của phần mềm có xu hướng xuống cấp theo thời gian [96]. Tái cấu trúc thường xuyên giúp **loại bỏ code trùng lặp**, đảm bảo rằng mọi thứ chỉ được nói một lần và đúng một nơi, đây là bản chất của một thiết kế tốt [97, 98].
2.  **Làm cho Phần mềm Dễ Hiểu hơn**: Lập trình không chỉ là cuộc đối thoại với máy tính mà còn với những lập trình viên khác [97]. Tái cấu trúc giúp code truyền đạt mục đích của nó một cách rõ ràng hơn [99].
3.  **Giúp Tìm ra Lỗi**: Quá trình tái cấu trúc buộc bạn phải hiểu sâu về code, làm rõ các giả định và cấu trúc, từ đó giúp phát hiện ra các lỗi tiềm ẩn [100, 101].
4.  **Giúp Lập trình Nhanh hơn**: Một thiết kế nội bộ tốt cho phép bạn thêm các tính năng mới nhanh hơn vì code có tính mô-đun cao và dễ hiểu [102]. Đây được gọi là **Giả thuyết về Sức bền Thiết kế (Design Stamina Hypothesis)**: nỗ lực vào một thiết kế nội bộ tốt sẽ làm tăng sức bền của dự án phần mềm, cho phép đi nhanh hơn và lâu hơn [102].

### II. Quy Trình Tái Cấu Trúc

1.  **Xây dựng Bộ Kiểm thử Vững chắc (Solid Suite of Tests)**: **Đây là bước đầu tiên và thiết yếu**. Các bài kiểm thử hoạt động như một "máy dò lỗi", bảo vệ bạn khỏi những sai lầm của chính mình [103, 104]. Các bài kiểm thử này phải có khả năng tự kiểm tra (self-checking), tự động báo cáo kết quả thành công hay thất bại [105, 106].
2.  **Thực hiện Từng Bước Nhỏ và Kiểm thử Thường xuyên**: Tái cấu trúc bao gồm việc áp dụng một chuỗi các thay đổi nhỏ, và sau mỗi thay đổi, bạn phải **biên dịch và chạy lại bộ kiểm thử** [107, 108]. Nếu một bài kiểm thử thất bại, bạn chỉ cần xem xét sự thay đổi nhỏ vừa thực hiện để tìm lỗi [109].
3.  **Tách Biệt Giữa Tái cấu trúc và Thêm Chức năng (The Two Hats)**: Kent Beck đề xuất phép ẩn dụ về "hai chiếc mũ" [110]. Khi bạn đang thêm chức năng, bạn không nên thay đổi code hiện có. Khi bạn đang tái cấu trúc, bạn không nên thêm chức năng mới [110]. Nguyên tắc là: **"Khi bạn cần thêm một tính năng, nhưng code không được cấu trúc một cách thuận tiện, trước tiên hãy tái cấu trúc chương trình để dễ dàng thêm tính năng, sau đó mới thêm tính năng đó"** [111, 112].

### III. Khi Nào Nên Tái Cấu Trúc?

Tái cấu trúc nên được tích hợp vào quy trình làm việc hàng ngày, thay vì là một hoạt động riêng biệt [113].

*   **Tái cấu trúc Chuẩn bị (Preparatory Refactoring)**: Thời điểm tốt nhất để tái cấu trúc là **ngay trước khi bạn cần thêm một tính năng mới** [114, 115].
*   **Tái cấu trúc để Hiểu (Comprehension Refactoring)**: Khi bạn phải nỗ lực để hiểu một đoạn code, hãy tái cấu trúc nó để làm cho sự hiểu biết đó trở nên rõ ràng hơn trong chính đoạn code [116, 117].
*   **Tái cấu trúc Dọn rác (Litter-Pickup Refactoring)**: Khi bạn thấy code được viết một cách tồi tệ, hãy dọn dẹp nó ngay [118]. Luôn luôn tuân theo "quy tắc cắm trại": **để lại khu code sạch sẽ hơn so với lúc bạn tìm thấy nó** [119, 120].
*   **Quy tắc Ba Lần (The Rule of Three)**: Lần đầu tiên bạn làm gì đó, cứ làm thôi. Lần thứ hai bạn làm điều tương tự, bạn có thể nhăn mặt vì sự trùng lặp nhưng vẫn làm. Lần thứ ba bạn làm điều tương tự, hãy tái cấu trúc [121].

### IV. Các "Mùi Hôi" trong Code (Bad Smells)

"Mùi hôi" là những cấu trúc trong code gợi ý về khả năng cần tái cấu trúc [122].

*   **Tên Bí ẩn (Mysterious Name)**: Tên không truyền đạt rõ ràng mục đích của hàm, biến, hoặc lớp [123].
*   **Code Trùng lặp (Duplicated Code)**: Cùng một cấu trúc code xuất hiện ở nhiều nơi. Đây là mùi hôi phổ biến và cần được hợp nhất [124].
*   **Hàm Dài (Long Function)**: Các hàm càng dài càng khó hiểu. Hãy tích cực phân rã chúng [125]. Một nguyên tắc tốt là: **"bất cứ khi nào bạn cảm thấy cần phải bình luận một điều gì đó, hãy viết một hàm thay thế"** [126].
*   **Tham số Dài (Long Parameter List)**: Danh sách tham số dài có thể gây nhầm lẫn. Hãy thử gộp chúng lại bằng cách sử dụng **Introduce Parameter Object** [127, 128].
*   **Ghen tị Tính năng (Feature Envy)**: Một hàm trong một module dành nhiều thời gian giao tiếp với dữ liệu hoặc hàm của module khác hơn là của chính nó. Hàm đó nên được chuyển đến module mà nó "ghen tị" [129, 130].
*   **Lớp Lớn (Large Class)**: Một lớp cố gắng làm quá nhiều việc, thường có quá nhiều trường (field). Hãy sử dụng **Extract Class** để tách các trách nhiệm ra [131, 132].
*   **Bình luận (Comments)**: Thường thì bình luận được sử dụng như một "chất khử mùi" cho code tồi [133]. Thay vì viết bình luận để giải thích một đoạn code khó hiểu, hãy tái cấu trúc nó để nó trở nên rõ ràng [104, 134].

Tái cấu trúc là một kỹ năng thiết yếu giúp duy trì và cải thiện sức khỏe của một codebase theo thời gian. Bằng cách áp dụng các nguyên tắc này một cách có kỷ luật, bạn không chỉ giải quyết các vấn đề trước mắt mà còn xây dựng một nền tảng vững chắc cho sự phát triển trong tương lai.