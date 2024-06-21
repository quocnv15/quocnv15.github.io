## What is the difference between the frame and bounds properties?

---

### What is the difference between the frame and bounds properties?

In programming, particularly when dealing with graphical user interfaces (GUIs), the terms "frame" and "bounds" often refer to properties of visual elements like views or windows. Here's the difference between them:

#### Frame: Defines where the view is located and how big it is within its parent view

```Frame Property
The frame property defines the position and size of a view within its superview's coordinate system.
It is usually represented as a rectangle (CGRect in iOS development), which contains the x and y coordinates (the top-left corner of the view) and the width and height of the view.
The frame is relative to the superview's coordinate system, meaning it defines where the view is located and how big it is within its parent view.
```

#### Bounds: Defines the view's internal coordinate system and content size

```Bounds Property
The bounds property defines the internal coordinate system of a view.
It is also represented as a rectangle (CGRect), which contains the origin (typically (0, 0) unless the coordinate system is adjusted) and the width and height of the view.
The bounds is relative to the view's own coordinate system, meaning it defines the view's content area.
Modifying the bounds origin can change the visible portion of the view's content, which is useful for tasks like scrolling.
```

---

### What is the difference between the frame and bounds properties? (VN)

Trong lập trình, đặc biệt là khi làm việc với giao diện người dùng đồ họa (GUI), các thuật ngữ "frame" và "bounds" thường liên quan đến các thuộc tính của các phần tử hiển thị như các view hoặc cửa sổ. Dưới đây là sự khác biệt giữa chúng:

#### Frame: Xác định vị trí của view và kích thước của nó trong view cha

```Frame:

Thuộc tính frame xác định vị trí và kích thước của một view trong hệ tọa độ của superview (view cha).
Thường được biểu diễn dưới dạng hình chữ nhật (CGRect trong lập trình iOS), bao gồm tọa độ x và y (góc trên bên trái của view) và chiều rộng, chiều cao của view.
Frame là tương đối với hệ tọa độ của superview, nghĩa là nó xác định vị trí của view và kích thước của nó trong view cha.
```

#### Bounds: Xác định hệ tọa độ nội bộ của view và kích thước nội dung

```Bounds:

Thuộc tính bounds xác định hệ tọa độ nội bộ của một view.
Cũng được biểu diễn dưới dạng hình chữ nhật (CGRect), bao gồm điểm gốc (thường là (0, 0) trừ khi hệ tọa độ được điều chỉnh) và chiều rộng, chiều cao của view.
Bounds là tương đối với hệ tọa độ của chính view, nghĩa là nó xác định khu vực nội dung của view.
Việc thay đổi điểm gốc của bounds có thể thay đổi phần nội dung hiển thị của view, điều này hữu ích cho các tác vụ như cuộn nội dung.
```

## Ví dụ

### Ví dụ 1: View đơn giản

Giả sử bạn có một view màu đỏ (redView) nằm trong một view cha (superView).
 superView có kích thước 400x400 và tọa độ (0, 0).
 redView có kích thước 100x100 và tọa độ (50, 50) trong superView.
Frame của redView:

```swift
redView.frame = CGRect(x: 50, y: 50, width: 100, height: 100)
Điều này có nghĩa là redView nằm tại (50, 50) trong superView và có kích thước 100x100.
```

Bounds của redView:

```swift
redView.bounds = CGRect(x: 0, y: 0, width: 100, height: 100)
Điều này có nghĩa là hệ tọa độ nội bộ của redView bắt đầu từ (0, 0) và có kích thước 100x100.
```

#### Ví dụ 2: Thay đổi bounds để cuộn nội dung

Giả sử redView chứa một nội dung lớn hơn kích thước của nó và bạn muốn cuộn để xem nội dung.

Thay đổi bounds để cuộn nội dung:

```swift
redView.bounds = CGRect(x: 0, y: 50, width: 100, height: 100)
```

Điều này có nghĩa là bạn đã cuộn nội dung của redView lên 50 đơn vị trong hệ tọa độ nội bộ của nó.

#### Ví dụ 3: Thay đổi frame để di chuyển view

Giả sử bạn muốn di chuyển redView sang phải 50 đơn vị.

Thay đổi frame để di chuyển redView:

```swift
redView.frame = CGRect(x: 100, y: 50, width: 100, height: 100)
```

Điều này có nghĩa là redView bây giờ nằm tại (100, 50) trong superView, nhưng kích thước của nó vẫn không thay đổi.

#### Ví dụ 4: Thay đổi bounds để thay đổi hệ tọa độ nội bộ

Giả sử bạn muốn thay đổi hệ tọa độ nội bộ của redView.

Thay đổi bounds để thay đổi hệ tọa độ nội bộ:

```swift
redView.bounds = CGRect(x: 10, y: 10, width: 100, height: 100)
```

Điều này có nghĩa là hệ tọa độ nội bộ của redView bắt đầu từ điểm (10, 10) thay vì (0, 0).

#### Ví dụ 5: Nested Views

Giả sử bạn có một view cha (superView) chứa hai view con (childView1 và childView2).

superView có kích thước 300x300 và tọa độ (0, 0).
childView1 có kích thước 100x100 và tọa độ (20, 20) trong superView.
childView2 có kích thước 150x150 và tọa độ (50, 50) trong superView.
Frame của childView1 và childView2:

```swift
childView1.frame = CGRect(x: 20, y: 20, width: 100, height: 100)
childView2.frame = CGRect(x: 50, y: 50, width: 150, height: 150)
```

Điều này có nghĩa là childView1 nằm tại (20, 20) và childView2 nằm tại (50, 50) trong superView.

Bounds của childView1 và childView2:

```swift
childView1.bounds = CGRect(x: 0, y: 0, width: 100, height: 100)
childView2.bounds = CGRect(x: 0, y: 0, width: 150, height: 150)
```

Điều này có nghĩa là hệ tọa độ nội bộ của cả hai view bắt đầu từ (0, 0) và tương ứng với kích thước của chúng.
