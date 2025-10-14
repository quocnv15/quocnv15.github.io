
**SITUATION:**
"Trong quá trình vận hành ứng dụng iOS tại DrJoy Vietnam, tôi nhận được phản ánh từ người dùng rằng thiết bị của họ nóng lên và pin bị hao nhanh khi khởi động app. Đây là vấn đề nghiêm trọng ảnh hưởng trực tiếp đến trải nghiệm người dùng."

**TASK:**
"Nhiệm vụ của tôi là phân tích nguyên nhân gây ra hiện tượng CPU usage cao và tiềm năng có memory leak hoặc infinite layout loop, từ đó xác định và đề xuất phương án khắc phục để cải thiện hiệu năng của ứng dụng."

**ACTION:**
"Tôi tiến hành xử lý theo các bước:

1. Sử dụng Xcode Instruments với Time Profiler và Leaks template để đo và phân tích hiệu suất ứng dụng.
2. Phát hiện CPU usage tăng đột biến đến 200-300% ngay khi app khởi động, điều này là dấu hiệu bất thường.
3. Khi phân tích sâu hơn, phát hiện hàm `reLayoutBadges` được gọi từ hơn 10 vị trí khác nhau, gây ra vòng lặp gọi liên tục (infinite loop) trong quá trình layout.
4. Xem xét logic hàm thấy việc gọi `setNeedsLayout` xảy ra nhiều lần không cần thiết do xử lý sort và apply transforms cho tất cả các subview.
5. Đề xuất refactor code cải tiến bằng cách giảm thiểu các lần gọi `setNeedsLayout` chỉ khi state thực sự thay đổi, sử dụng caching kết quả transforms để tránh tính toán lại không cần thiết.
6. Đồng thời sử dụng Memory Graph Debugger để kiểm tra retain cycles và memory leak tiềm ẩn trong closure hoặc delegate."

**RESULT:**
"Sau khi các thay đổi được áp dụng, CPU usage giảm từ mức đỉnh 300% còn khoảng 20-30%, thời gian launch app cải thiện khoảng 60%, và các phản ánh về tình trạng thiết bị nóng, pin hao đều giảm xuống gần như không còn."

**LESSONS LEARNED:**
"Từ bài học này, tôi nhận thấy tầm quan trọng của việc kiểm soát vòng đời layout và re-layout trong iOS, cùng với việc sử dụng công cụ Instruments và Memory Graph thường xuyên giúp phát hiện sớm các vấn đề hiệu năng và memory leak."


# English version


## STAR Answer: Debugging a Memory Leak in an iOS Application

**SITUATION:**
During the operation of the iOS application at DrJoy Vietnam, we received user reports indicating that their devices were overheating and the battery was draining rapidly upon app launch. This was a critical issue negatively impacting user experience.

**TASK:**
My responsibility was to analyze the cause of the excessive CPU usage and potential memory leaks or infinite layout loops and to identify and propose solutions to improve app performance and stability.

**ACTION:**
I approached the issue systematically with the following steps:

1. Used Xcode Instruments with the Time Profiler and Leaks templates to monitor app performance and memory usage.
2. Observed a CPU usage spike reaching 200-300% immediately after the app launched, which was highly unusual.
3. Analyzed the call stack and identified that the method `reLayoutBadges` was being triggered from more than 10 different locations, causing an infinite layout loop.
4. Reviewed the method implementation and found that excessive calls to `setNeedsLayout` were made unnecessarily during sorting and applying transform operations on all subviews, leading to repeated layout recalculations.
5. Proposed refactoring the code to limit calls to `setNeedsLayout` only when the view state actually changed, leveraging caching of transform results to avoid redundant computations.
6. Additionally, used Memory Graph Debugger to examine retain cycles and ensure there were no memory leaks caused by strong references in closures or delegates.

**RESULT:**
After the optimizations were implemented, CPU usage dropped from 300% to a baseline of approximately 20-30%. The app launch time improved by about 60%, and user complaints related to device overheating and rapid battery drain were nearly eliminated.

**LESSONS LEARNED:**
This experience taught me the importance of controlling UI layout cycles and re-layout triggers to maintain performance in iOS apps. Regular use of Instruments and Memory Graph Debugger is essential for early detection of performance issues and memory leaks.