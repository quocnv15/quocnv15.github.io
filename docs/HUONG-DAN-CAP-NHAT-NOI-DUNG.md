# Hướng Dẫn Cập Nhật Nội Dung Website

Tài liệu này hướng dẫn cách cập nhật nội dung cho các trang chính: **About**, **Home**, và đặc biệt là **Projects** cùng với các bài viết blog.

## 📋 Mục Lục

1. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
2. [Cập Nhật Trang About](#cập-nhật-trang-about)
3. [Cập Nhật Trang Home](#cập-nhật-trang-home)
4. [Cập Nhật Trang Projects](#cập-nhật-trang-projects)
5. [Viết Bài Post Mới](#viết-bài-post-mới)
6. [Quản Lý Categories](#quản-lý-categories)
7. [Build và Deploy](#build-và-deploy)

## 📁 Cấu Trúc Thư Mục

```
quocnv15.github.io/
├── _includes/           # Components header, footer
├── _layouts/           # Layout cho các trang
├── _posts/             # Bài viết blog (YYYY-MM-DD-ten-bai.md)
├── _projects/          # Dự án (nếu có)
├── css/                # CSS custom
├── docs/               # Tài liệu (thư mục này)
├── images/             # Hình ảnh
├── about.md            # Trang About
├── index.md            # Trang Home
├── projects.md         # Trang Projects
└── archive.md          # Trang lưu trữ bài viết
```

## 👤 Cập Nhật Trang About

**File:** `about.md`

### 1. Thông Tin Cá Nhân Cơ Bản
```markdown
---
layout: page
title: About Me
permalink: /about/
---
```

### 2. Thông Tin Profile
```markdown
<div class="profile-details">
  <p class="profile-birth"><strong>Date of Birth:</strong> 15/05/1993</p>
  <p class="profile-phone"><strong>Phone:</strong> +84 3636 34765</p>
  <p class="profile-email"><strong>Email:</strong> quocnv155@gmail.com</p>
  <p class="profile-skype"><strong>Skype:</strong> kidboy_155</p>
</div>
```

### 3. Skills & Expertise
```markdown
<div class="skills-grid">
  <div class="skill-category">
    <h4>Core Skills</h4>
    <ul>
      <li>Develop SDK (framework) and application on multi-OS (iOS, Windows, Linux)</li>
      <li>OS: knowledge of iOS/macOS/windows/linux environment</li>
      <!-- Thêm/cập nhật skills -->
    </ul>
  </div>
  
  <div class="skill-category">
    <h4>Programming Languages</h4>
    <ul>
      <li>Swift, SwiftUI</li>
      <li>Objective-C</li>
      <!-- Thêm/cập nhật ngôn ngữ -->
    </ul>
  </div>
</div>
```

### 4. Kinh Nghiệm Làm Việc
```markdown
<div class="experience-item">
  <h4>Senior Developer</h4>
  <p class="experience-company">Tên Công Ty, Địa Điểm | Tháng/Năm - Tháng/Năm</p>
  <ul>
    <li>Mô tả công việc 1</li>
    <li>Mô tả công việc 2</li>
    <li>Environment: iOS</li>
    <li>Programming language: Swift</li>
  </ul>
</div>
```

### 5. Hình Ảnh Avatar
- Đưa ảnh vào thư mục: `images/user/avatar.jpeg`
- Kích thước recommended: 150x150px
- Format: JPEG hoặc PNG

---

## 🏠 Cập Nhật Trang Home

**File:** `index.md`

### 1. Structure Hiện Tại
Trang home hiển thị các bài viết được phân loại theo 4 categories:
- 📱 **iOS Development**: Các bài về iOS, GCD, memory, testing
- 🔧 **Data Structures & Algorithms**: Các bài về cấu trúc dữ liệu
- 🏗️ **Architecture & Design**: Các bài về architecture, design patterns
- 💻 **Swift Programming**: Các bài về Swift programming

### 2. Categories Tự Động
Các bài viết được tự động phân loại dựa trên tên file:
- **iOS Development**: File chứa `GCD`, `memory-leak`, `testing`
- **Data Structures**: File chứa `data-structure`
- **Architecture**: File chứa `Architecture`, `layers`, `technical-design`
- **Swift Programming**: File chứa `map`

### 3. Thay Đổi Categories Hoặc Tiêu Chí
Nếu muốn thay đổi cách phân loại, cập nhật trong `index.md`:

```liquid
<!-- Ví dụ: Thay đổi category iOS Development -->
{% for post in site.posts %}
  {% if post.path contains 'GCD' or post.path contains 'memory-leak' or post.path contains 'testing' %}
    <!-- Hiển thị bài viết -->
  {% endif %}
{% endfor %}
```

---

## 🚀 Cập Nhật Trang Projects (Đặc Biệt Quan Trọng)

**File:** `projects.md`

Trang này được thiết kế để hiển thị các dự án một cách chuyên nghiệp.

### 1. Tạo Dự Án Mới

Tạo file mới trong thư mục `_projects/` với format:
`_projects/ten-du-an.md`

### 2. Front Matter Cho Dự Án
```yaml
---
layout: project
title: "Tên Dự Án"
date: 2024-07-20
status: completed  # completed, in-progress, planned
image: "/images/projects/ten-du-an-preview.jpg"
description: "Mô tả ngắn gọn về dự án, technologies sử dụng, và kết quả đạt được"
technologies: [Swift, SwiftUI, Firebase, CoreML]
demo_url: "https://demo-url.com"
github_url: "https://github.com/quocnv15/ten-du-an"
app_store_url: "https://apps.apple.com/app/id"
---
```

### 3. Nội Dung Chi Tiết Dự Án
```markdown
## Mô Tả Dự Án

Mô tả chi tiết về dự án, vấn đề giải quyết, và giải pháp implemented.

## Tính Năng Nổi Bật

- **Tính năng 1**: Mô tả tính năng
- **Tính năng 2**: Mô tả tính năng
- **Tính năng 3**: Mô tả tính năng

## Thách Thức và Giải Pháp

### Thách Thức 1
Mô tả thách thức
**Giải pháp**: Cách giải quyết

### Thách Thức 2
Mô tả thách thức
**Giải pháp**: Cách giải quyết

## Công Nghệ Sử Dụng

- **Frontend**: Swift, SwiftUI
- **Backend**: Node.js, MongoDB
- **Tools**: Xcode, Git, Figma

## Kết Quả Đạt Được

- Performance improvement: 50%
- User retention: 80%
- App Store rating: 4.8/5.0

## Bài Học Kinh Nghiệm

Những bài học rút ra được sau khi hoàn thành dự án.
```

### 4. Các Tham Số Hỗ Trợ

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String | ✅ | Tên dự án |
| `date` | Date | ✅ | Ngày bắt đầu/thành lập |
| `status` | String | ❌ | completed, in-progress, planned |
| `image` | String | ❌ | Đường dẫn ảnh preview |
| `description` | String | ✅ | Mô tả ngắn (150-200 chars) |
| `technologies` | Array | ❌ | Danh sách technologies |
| `demo_url` | URL | ❌ | Link demo trực tiếp |
| `github_url` | URL | ❌ | Link GitHub repository |
| `app_store_url` | URL | ❌ | Link App Store (nếu có) |

### 5. Chuẩn Bị Hình Ảnh Cho Dự Án

- **Kích thước recommended**: 1200x800px
- **Format**: JPEG, PNG hoặc WebP
- **Đường dẫn**: `/images/projects/ten-du-an-preview.jpg`
- **Compression**: Dưới 200KB cho tốc độ load tốt

---

## ✍️ Viết Bài Post Mới

### 1. Tạo File Bài Mới

Format tên file: `YYYY-MM-DD-ten-bai-viet.md`
Ví dụ: `2024-07-20-clean-architecture-swift.md`

### 2. Front Matter Cơ Bản
```yaml
---
layout: post
title: "Clean Architecture trong Swift"
date: 2024-07-20 10:00:00 +0700
categories: [iOS, Architecture]
tags: [Swift, Architecture, Clean Code]
---
```

### 3. Cấu Trúc Bài Viết Đề Xuất
```markdown
# Tiêu Đề Bài Viết

## Giới Thiệu
Giới thiệu ngắn gọn về chủ đề và tầm quan trọng

## Vấn Đề/Context
Mô tả bối cảnh hoặc vấn đề cần giải quyết

## Giải Pháp
Giải thích chi tiết giải pháp

## Code Examples (nếu có)
```swift
// Code ví dụ
func example() {
    // Implementation
}
```

## Kết Quả và Benefits
Kết quả đạt được và lợi ích

## Kinh Nghiệm và Best Practices
Những bài học rút ra

## Kết Luận
Tóm tắt và kết luận
```

### 4. Tối Ưu SEO

- **Title**: 50-60 characters, chứa keywords chính
- **Meta description**: 150-160 characters
- **URL**: Ngắn gọn, chứa keywords
- **Headings**: Sử dụng H1, H2, H3 hợp lý
- **Images**: Alt text mô tả rõ ràng

---

## 🏷️ Quản Lý Categories

### 1. Categories Hiện Tại
- **iOS Development**: Swift, Objective-C, iOS SDK
- **Architecture**: Design patterns, Clean Architecture, MVP/MVVM
- **Data Structures**: Array, Dictionary, Set, Stack, Queue
- **Swift Programming**: Language features, operators, functions

### 2. Thêm Category Mới

1. **Cập nhật `index.md`**: Thêm section category mới
2. **Thêm CSS** nếu cần style đặc biệt
3. **Cập nhật bài viết** với front matter `categories`

### 3. Tags System
Sử dụng tags trong front matter để phân loại chi tiết:
```yaml
tags: [Swift, SwiftUI, iOS, Architecture, Performance]
```

---

## 🚀 Build và Deploy

### 1. Local Development
```bash
# Install dependencies
bundle install

# Build site
bundle exec jekyll build

# Serve locally
bundle exec jekyll serve

# Serve with drafts
bundle exec jekyll serve --drafts
```

### 2. Test Trước Khi Deploy
- Kiểm tra tất cả links
- Test responsive design trên mobile
- Validate HTML/CSS
- Check load times

### 3. Deploy (GitHub Pages)
```bash
# Commit changes
git add .
git commit -m "Update content: add new project/article"

# Push to main branch
git push origin main
```

Site sẽ tự động deploy trong 1-2 phút.

---

## 💡 Tips Best Practices

### 1. Content Writing
- **Tiêu đề hấp dẫn**: Dạng câu hỏi hoặc số (7 Ways to...)
- **Structure rõ ràng**: Use headings, bullet points, numbered lists
- **Code examples**: Đầy đủ và có giải thích
- **Visual content**: Screenshot, diagram khi cần

### 2. Project Documentation
- **Problem-solution format**: Vấn đề → Giải pháp → Kết quả
- **Metrics driven**: Số liệu hóa kết quả khi có thể
- **Technical depth**: Chi tiết về technologies và challenges
- **Lessons learned**: Rút ra bài học kinh nghiệm

### 3. SEO Optimization
- **Keyword research**: Tìm keywords phù hợp
- **Internal linking**: Link giữa các bài viết liên quan
- **Image optimization**: Alt text, compression
- **Meta descriptions**: Hấp dẫn để tăng CTR

### 4. File Organization
```
images/
├── user/               # Avatar, profile images
├── projects/           # Project preview images
├── posts/              # Blog post images
└── general/            # General assets
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Build errors**: Check Liquid syntax, YAML formatting
2. **Images not showing**: Check file paths and case sensitivity
3. **Links broken**: Use `{{ relative_url }}` for internal links
4. **CSS not updating**: Hard refresh browser, check file paths

### Get Help
- Jekyll Docs: https://jekyllrb.com/docs/
- Liquid Templating: https://shopify.github.io/liquid/
- GitHub Issues: Create issue in repository

---

**Note:** Document này sẽ được cập nhật thường xuyên khi có thay đổi về structure hoặc thêm tính năng mới.