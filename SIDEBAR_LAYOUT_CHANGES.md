# Thay Đổi Layout Trang Home - Sidebar Layout

## Tổng Quan

Đã chuyển layout trang home sang dạng lưới với sidebar bên trái (giống ví dụ trong hình), giữ nguyên toàn bộ nội dung hiện có.

## Các Thay Đổi Chính

### 1. File `index.md`

**Thay đổi:**

- Thêm cấu trúc sidebar container bao bọc toàn bộ nội dung
- Sidebar bên trái hiển thị:
  - Danh sách categories với số lượng bookmarks
  - Tags section với top 15 tags
- Main content area bên phải giữ nguyên toàn bộ nội dung cũ
- Thêm view toggle buttons (Grid/Alphabetically) trong header
- Thêm JavaScript xử lý:
  - Toggle sidebar trên mobile
  - Smooth scroll khi click category
  - Active state cho category links
  - View toggle functionality

### 2. File `css/override.css`

**Thêm mới CSS:**

#### Sidebar Layout

```css
.post-list-container {
  display: flex;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.sidebar {
  width: 280px;
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 100px);
}
```

#### Sidebar Content Styling

- `.sidebar-content`: Card styling với border và shadow
- `.sidebar-header`: Header section với emoji và subtitle
- `.category-nav`: Vertical navigation menu
- `.category-item`: Category links với hover effects
- `.category-count`: Badge hiển thị số lượng
- `.tags-section`: Tags cloud section
- `.tag-item`: Individual tag buttons

#### View Toggle

- `.view-toggle-group`: Container cho toggle buttons
- `.view-toggle-btn`: Button styling với icons
- Active states và hover effects

#### Mobile Responsive

- Sidebar chuyển thành slide-in menu trên mobile
- Toggle button floating bottom-right
- Overlay backdrop khi sidebar mở
- Full-width layout trên mobile

### 3. File `preview-sidebar-layout.html`

**Mục đích:**

- Preview layout mới với sample data
- Test responsive design
- Demo các tính năng interactive

## Tính Năng Mới

### Desktop (> 1024px)

✅ Sidebar cố định bên trái, scroll độc lập
✅ Main content responsive grid (2-3 columns)
✅ View toggle: Grid view / Alphabetical view
✅ Category navigation với active states
✅ Smooth scroll khi click category
✅ Tags cloud với hover effects

### Mobile (≤ 1024px)

✅ Sidebar ẩn mặc định, slide-in từ bên trái
✅ Floating toggle button (☰) bottom-right
✅ Backdrop overlay khi sidebar mở
✅ Single column layout
✅ Touch-friendly buttons (min-height 44px)

## Các File Được Thay Đổi

1. ✅ `/index.md` - Cấu trúc HTML và JavaScript
2. ✅ `/css/override.css` - Styling cho sidebar layout
3. ✅ `/preview-sidebar-layout.html` - File demo (mới)
4. ✅ `/SIDEBAR_LAYOUT_CHANGES.md` - File tài liệu này (mới)

## Cách Kiểm Tra

### Option 1: Jekyll Build

```bash
cd /Volumes/Workspace/1-Automation-Blog/content-management-system/apps/personal-blog
bundle exec jekyll serve
# Mở http://localhost:4000
```

### Option 2: Preview File

```bash
# Mở file preview trong browser
open preview-sidebar-layout.html
```

## Tương Thích

### Browsers

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Screen Sizes

- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

## So Sánh Trước/Sau

### Trước

- Layout full-width, centered
- Categories trong dropdown filter
- Không có persistent navigation
- Search và filters ở top

### Sau

- **Layout 2-column với sidebar**
- **Categories trong sidebar navigation**
- **Persistent sidebar (desktop)**
- **View toggle buttons trong header**
- Giữ nguyên search và filters
- Giữ nguyên toàn bộ nội dung

## Lưu Ý

1. **Nội dung giữ nguyên 100%**: Tất cả sections, posts, search, filters đều giữ nguyên
2. **Backward compatible**: Layout cũ vẫn hoạt động nếu cần rollback
3. **Performance**: Sidebar sử dụng `position: sticky` - hiệu năng tốt
4. **Accessibility**:
   - ARIA labels cho buttons
   - Keyboard navigation
   - Screen reader friendly
5. **Mobile-first**: Touch targets ≥ 44px

## Troubleshooting

### Sidebar không hiển thị

- Check CSS file được load đúng
- Verify `.post-list-container` class
- Check viewport width > 1024px

### JavaScript errors

- Check console logs
- Verify IDs: `post-sidebar`, `sidebar-toggle`, `sidebar-overlay`
- Check DOM ready state

### Styling issues

- Clear browser cache
- Check CSS specificity
- Verify no conflicting styles

## Next Steps (Optional)

Có thể cải tiến thêm:

1. Add category icons/emojis cho sidebar
2. Implement category filtering từ sidebar
3. Add collapsible subcategories
4. Persist sidebar state (localStorage)
5. Add search trong sidebar
6. Sticky header cho mobile
7. Dark mode support
8. Animation transitions

## Contact

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ qua:

- GitHub Issues
- Email support

---

**Last Updated:** November 7, 2025
**Version:** 1.0.0
