# 📚 Documentation Center

Chào mừng bạn đến trung tâm tài liệu hướng dẫn cập nhật nội dung website. Dưới đây là danh sách các tài liệu có sẵn:

## 📖 Tài Liệu Hướng Dẫn

### 🚀 Bắt Đầu Nhanh
- **[Quick Start Guide](QUICK-START.md)** - Hướng dẫn nhanh cho các thao tác thường ngày
- **Commands Cheat Sheet** - Các lệnh Jekyll và Git phổ biến

### 📋 Hướng Dẫn Chi Tiết
- **[Hướng Dẫn Cập Nhật Nội Dung](HUONG-DAN-CAP-NHAT-NOI-DUNG.md)** - Tài liệu đầy đủ nhất
- **[Project Template](PROJECT-TEMPLATE.md)** - Template chi tiết cho dự án
- **[Blog Post Template](POST-TEMPLATE.md)** - Template viết bài blog

## 🎯 Mục Tiêu Tài Liệu

### Dành Cho Ai?
- **Bạn (NGUYEN VAN QUOC)** - Chủ website, muốn dễ dàng cập nhật nội dung
- **Người đóng góp** - Nếu có người khác muốn viết bài hoặc thêm dự án
- **Future reference** - Ghi nhớ cách làm việc với website

### Cover những gì?
1. **Cập nhật thông tin cá nhân** - Trang About
2. **Viết bài blog mới** - Structure và best practices
3. **Thêm dự án mới** - Portfolio/projects showcase
4. **Customize trang home** - Layout và content organization
5. **SEO và optimization** - Tips cho content và technical

## 🛠️ Tech Stack Website

### Platform
- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting và CI/CD
- **Markdown** - Content writing
- **Liquid** - Templating engine

### Structure
- **Minima Theme** - Base Jekyll theme
- **Custom CSS** - Override styles in `css/override.css`
- **Custom layouts** - Modified layouts in `_layouts/`
- **Components** - Reusable includes in `_includes/`

## 📝 Content Types

### 1. Blog Posts (`_posts/`)
- Format: `YYYY-MM-DD-ten-bai-viet.md`
- Categories: iOS Development, Architecture, Data Structures, Swift
- Auto-displayed on home page by category
- Full post layout with navigation

### 2. Projects (`_projects/`)
- Format: `ten-du-an.md`
- Custom project layout with images, tech stack, links
- Grid display on projects page
- Status tracking (completed, in-progress, planned)

### 3. Pages (`*.md`)
- **Home** (`index.md`) - Displays categorized posts
- **About** (`about.md`) - Personal information and skills
- **Projects** (`projects.md`) - Project portfolio showcase
- **Archive** (`archive.md`) - All posts by tags

## 🔄 Workflow Cập Nhật

### 1. Local Development
```bash
# Start local server
bundle exec jekyll serve

# Edit content
# View at http://localhost:4000
```

### 2. Content Creation
```bash
# Create new post
touch _posts/$(date +%Y-%m-%d)-new-post.md

# Create new project
touch _projects/new-project.md
```

### 3. Deploy
```bash
git add .
git commit -m "Update: add new content"
git push origin main
```

## 📱 Responsive Design

Website được thiết kế responsive cho:
- **Desktop** (> 1024px) - Full layout
- **Tablet** (768-1024px) - Adjusted grids
- **Mobile** (< 768px) - Single column, touch-friendly

## 🎨 Design System

### Colors
- **Primary:** #3498db (Blue)
- **Secondary:** #2c3e50 (Dark blue)
- **Text:** #5a6c7d (Gray)
- **Background:** #ffffff (White)
- **Border:** #e8e8e8 (Light gray)

### Typography
- **Headings:** -apple-system, BlinkMacSystemFont, Segoe UI
- **Body:** Same as headings for consistency
- **Code:** Monospace for code blocks

### Components
- **Cards:** For posts, projects, content sections
- **Navigation:** Sticky header with mobile menu
- **Buttons:** Primary (blue), secondary (gray)
- **Forms:** Styled inputs and validation

## 📊 Analytics (Future)

Có thể thêm:
- **Google Analytics** - Traffic tracking
- **Hotjar** - User behavior analysis
- **Search Console** - SEO monitoring

## 🔐 Security

- **HTTPS** - Enabled by GitHub Pages
- **No server-side code** - Static site only
- **No user data collection** - Privacy-first
- **No third-party scripts** - Fast and secure

## 🚀 Future Enhancements

### Planned Features
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Newsletter subscription
- [ ] Comment system
- [ ] Related posts suggestions
- [ ] Reading time estimation
- [ ] Print-friendly styles

### Technical Improvements
- [ ] Image optimization pipeline
- [ ] Lazy loading
- [ ] Service worker for offline
- [ ] Advanced SEO meta tags
- [ ] Structured data
- [ ] Webmentions support

## 🤝 Contributing

Nếu có người khác muốn đóng góp:
1. Fork repository
2. Create feature branch
3. Follow templates and guidelines
4. Submit pull request
5. Review and merge

## 📞 Contact

For questions about website maintenance:
- **Email:** quocnv155@gmail.com
- **GitHub:** [@quocnv15](https://github.com/quocnv15)
- **LinkedIn:** [nguyen-quoc-3a16a6226](https://linkedin.com/in/nguyen-quoc-3a16a6226)

---

**Last Updated:** July 2024  
**Maintainer:** NGUYEN VAN QUOC  
**Version:** 1.0

*Bắt đầu với [Quick Start Guide](QUICK-START.md) để cập nhật nội dung ngay!*