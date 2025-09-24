# NGUYEN VAN QUOC - Senior iOS Developer

A Jekyll-based static blog and personal portfolio showcasing iOS development projects, technical articles, and professional experience.

## 🚀 Live Site

[https://quocnv15.github.io](https://quocnv15.github.io)

## 📱 About

Welcome to my personal blog and portfolio! I'm **NGUYEN VAN QUOC**, a Senior iOS Developer with 8+ years of experience in mobile application development. This site features:

- Technical blog posts about iOS development and programming
- Project showcases and portfolio pieces
- Professional experience and skills
- Cross-platform development insights

## 🛠️ Tech Stack

- **Framework**: Jekyll (Ruby-based static site generator)
- **Theme**: Minima (customized)
- **Styling**: Custom CSS with responsive design
- **Hosting**: GitHub Pages
- **Languages**: Swift, Objective-C, Flutter, C#, C/C++, Golang
- **Platforms**: iOS, macOS, Windows, Linux

## 📂 Project Structure

```
.
├── _config.yml          # Jekyll configuration
├── _posts/              # Blog posts (YYYY-MM-DD-title.md)
├── _projects/           # Project showcases
├── _layouts/            # Custom HTML layouts
├── _includes/           # Reusable components
├── css/                 # Custom CSS overrides
├── js/                  # Custom JavaScript
├── images/              # Images and assets
├── about.md            # About page
├── archive.md          # Blog archive
├── index.md            # Homepage
├── projects.md         # Projects page
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Ruby (version 2.5.0 or higher)
- Bundler

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/quocnv15/quocnv15.github.io.git
   cd quocnv15.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

### Local Development

```bash
# Serve locally (http://localhost:4000)
bundle exec jekyll serve

# Serve with draft posts
bundle exec jekyll serve --drafts

# Serve with live reload
bundle exec jekyll serve --livereload

# Build the site
bundle exec jekyll build
```

### Testing

```bash
# Check for build errors
bundle exec jekyll build --verbose

# Validate site configuration
bundle exec jekyll doctor
```

## 📝 Content Management

### Adding Blog Posts

1. Create a new file in `_posts/` with format: `YYYY-MM-DD-title.md`
2. Add front matter:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   tags: ["iOS", "Swift", "Development"]
   ---
   ```

### Adding Projects

1. Create a new file in `_projects/` directory
2. Add appropriate front matter with project metadata

### Customization

- **CSS**: Modify `css/override.css` for custom styles
- **Layouts**: Edit files in `_layouts/` for HTML structure
- **Components**: Update `_includes/` for reusable elements
- **Configuration**: Modify `_config.yml` for site settings

## 🎨 Features

- **Responsive Design**: Optimized for mobile and desktop
- **Social Sharing**: Integrated social media sharing links
- **Blog Archive**: Tag-based organization of posts
- **Project Portfolio**: Showcase of development work
- **SEO Optimized**: Proper meta tags and structured data
- **Fast Loading**: Static site generation for performance

## 📱 Mobile Optimization

The site is fully responsive and optimized for mobile devices with:
- Touch-friendly navigation
- Optimized image loading
- Mobile-first CSS approach
- Adaptive layouts for different screen sizes

## 🔧 Customization Options

### Site Configuration
Edit `_config.yml` to modify:
- Site title and description
- Author information
- Social media links
- Default post tags
- Collections and plugins

### Styling
Custom CSS variables in `css/override.css`:
- Color scheme
- Typography
- Layout spacing
- Component styles

### Content Organization
- Posts organized by date and tags
- Projects displayed in dedicated portfolio section
- Archive page for easy content discovery

## 🚀 Deployment

This site is automatically deployed to GitHub Pages. Simply push to the `main` branch to trigger deployment:

```bash
git add .
git commit -m "Update content"
git push origin main
```

## 📧 Contact

- **Email**: quocnv155@gmail.com
- **LinkedIn**: [nguyen-quoc-3a16a6226](https://linkedin.com/in/nguyen-quoc-3a16a6226)
- **GitHub**: [quocnv15](https://github.com/quocnv15)
- **Location**: Hanoi, Vietnam

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📊 Stats

- **Posts**: 26+ technical articles
- **Projects**: Multiple iOS development showcases
- **Technologies**: iOS, Swift, Objective-C, Flutter, and more
- **Experience**: 8+ years in mobile development

---

Built with ❤️ using Jekyll and hosted on GitHub Pages