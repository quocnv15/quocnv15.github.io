# Quick Start Guide - Cập Nhật Nội Dung Website

Hướng dẫn nhanh cho các thao tác cập nhật nội dung thường xuyên.

## 🚀 Cập Nhật Nhanh

### 1. Viết Bài Blog Mới
```bash
# Tạo file bài viết mới
touch _posts/$(date +%Y-%m-%d)-ten-bai-viet.md

# Mở file và copy template từ docs/POST-TEMPLATE.md
# Build và test
bundle exec jekyll serve
```

### 2. Thêm Dự Án Mới
```bash
# Tạo file dự án mới
touch _projects/ten-du-an.md

# Copy template từ docs/PROJECT-TEMPLATE.md
# Thêm ảnh vào images/projects/
```

### 3. Cập Nhật Thông Tin Cá Nhân
- **File:** `about.md`
- **Avatar:** `images/user/avatar.jpeg`

## 📝 Template Sử Dụng

### Blog Post Template
```yaml
---
layout: post
title: "Tiêu đề bài viết"
date: 2024-07-20 10:00:00 +0700
categories: [iOS, Swift]
tags: [Swift, iOS, Best Practices]
excerpt: "Mô tả ngắn (150-200 ký tự)"
---

# Tiêu đề chính

## Giới thiệu
Nội dung giới thiệu...

## Nội dung chính
Nội dung chi tiết với code examples...

## Kết luận
Tóm tắt và kết luận...
```

### Project Template
```yaml
---
layout: project
title: "Tên Dự Án"
date: 2024-07-20
status: completed  # completed, in-progress, planned
image: "/images/projects/project-name-preview.jpg"
description: "Mô tả ngắn dự án"
technologies: [Swift, SwiftUI, Firebase]
demo_url: "https://demo.com"
github_url: "https://github.com/username/project"
app_store_url: "https://apps.apple.com/app/id"
---

## Mô tả dự án
Chi tiết về dự án...

## Tính năng
- Tính năng 1
- Tính năng 2

## Kết quả
- Metrics và achievements
```

## 🛠️ Commands Thường Dùng

### Development
```bash
# Install dependencies
bundle install

# Build site
bundle exec jekyll build

# Serve locally (http://localhost:4000)
bundle exec jekyll serve

# Serve with drafts
bundle exec jekyll serve --drafts
```

### Deploy
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Update content: add new post/project"

# Push to GitHub
git push origin main
```

## 📁 Cấu Trúc File Quan Trọng

```
├── index.md              # Trang home (hiển thị bài viết theo category)
├── about.md              # Trang thông tin cá nhân
├── projects.md           # Trang dự án
├── archive.md            # Trang lưu trữ
├── _posts/               # Bài viết blog (YYYY-MM-DD-ten-bai.md)
├── _projects/            # Chi tiết dự án (ten-du-an.md)
├── images/               # Hình ảnh
│   ├── user/            # Avatar, profile
│   ├── projects/        # Project images
│   └── posts/           # Blog post images
└── docs/                 # Tài liệu hướng dẫn
```

## 🏷️ Categories & Tags

### Default Categories
- **iOS Development**: Swift, Objective-C, iOS SDK
- **Architecture**: Design patterns, Clean Architecture
- **Data Structures**: Array, Dictionary, Set, Stack
- **Swift Programming**: Language features, operators

### Tags Phổ Biến
```yaml
tags: [Swift, SwiftUI, iOS, Architecture, Performance, Best Practices]
```

## 🖼️ Hình Ảnh Guidelines

### Avatar
- **Kích thước:** 150x150px
- **Đường dẫn:** `images/user/avatar.jpeg`
- **Format:** JPEG/PNG

### Project Preview
- **Kích thước:** 1200x800px
- **Đường dẫn:** `images/projects/ten-du-an-preview.jpg`
- **Format:** JPEG/PNG/WebP
- **Size:** < 200KB

### Blog Post Images
- **Kích thước:** Flexible, recommended 800x600px
- **Đường dẫn:** `images/posts/ten-bai-viet-image.jpg`
- **Alt text:** Required for SEO

## 🔍 SEO Tips

### Title & Description
- **Title:** 50-60 characters, chứa keywords
- **Description:** 150-160 characters, hấp dẫn
- **URL:** Ngắn gọn, chứa keywords

### Content Structure
```markdown
# H1 Title
## H2 Section
### H3 Subsection
- Bullet points
- Numbered lists
```code blocks```
```

### Internal Linking
```markdown
[Link text]({{ relative_url }}/path/to/page/)
```

## 📱 Testing Checklist

### Pre-Deploy Checklist
- [ ] Test trên desktop browser
- [ ] Test responsive design trên mobile
- [ ] Check tất cả links
- [ ] Validate HTML/CSS
- [ ] Test images loading
- [ ] Check spelling and grammar

### Performance
- [ ] Page load time < 3s
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile-friendly

## 🚨 Common Issues

### Build Errors
```bash
# Liquid syntax error - check YAML formatting
# Missing front matter - add ---
# Image not found - check file path
```

### Style Issues
- CSS not updating → Hard refresh (Ctrl+F5)
- Images not showing → Check case sensitivity
- Layout broken → Check HTML structure

## 📞 Support & Resources

### Documentation
- **Full Guide:** `docs/HUONG-DAN-CAP-NHAT-NOI-DUNG.md`
- **Project Template:** `docs/PROJECT-TEMPLATE.md`
- **Post Template:** `docs/POST-TEMPLATE.md`

### Getting Help
- **Jekyll Docs:** https://jekyllrb.com/docs/
- **GitHub Issues:** Create issue trong repository
- **Email:** quocnv155@gmail.com

---

**Remember:** Website sử dụng Jekyll + GitHub Pages, tự động deploy khi push code lên main branch.