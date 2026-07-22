# Project Overview & Product Development Requirements (PDR)

## Executive Summary

**quocnv15.github.io** is a personal portfolio and technical blog for an iOS indie developer. It serves as a public-facing hub to showcase professional work, technical case studies, and thoughts on iOS development, AI agents, and software architecture.

The site demonstrates modern web development practices: Jekyll for static site generation, TypeScript 5.9+ for frontend logic, and esbuild for optimized bundling. It balances simplicity (no database, GitHub Pages hosting) with sophistication (dark mode, mobile-first design, 13KB production bundle).

## Product Goals

### Primary Goals
1. **Professional Showcase**: Display iOS indie projects and past client work
2. **Technical Content**: Share knowledge via blog posts and case studies
3. **Portfolio Board**: Maintain a curated view of professional achievements
4. **Operator Hub**: Personal systems and weekly priorities (Work mode)
5. **Case Study Repository**: Numbered public case studies (001-023+) with categorization

### Secondary Goals
- Demonstrate modern frontend architecture (TypeScript, state management, testing)
- Maintain high performance (13KB bundle, <1.5s FCP)
- Ensure accessibility (WCAG 2.1 AA compliance)
- Practice continuous deployment to GitHub Pages
- Integrate with private memory systems (`ios-memory` repo)

## Target Audience

| Segment | Use Case | Primary Content |
|---------|----------|-----------------|
| **Potential Clients** | Evaluate capabilities & past work | Projects, case studies, CV, testimonials |
| **iOS Community** | Learn iOS development practices | Blog posts, technical deep-dives, architecture articles |
| **Personal Reflection** | Track growth & operational systems | Work mode, portfolio board, self-review section |
| **Recruiters/Hiring** | Assess technical depth | Case studies, code quality, project variety |
| **Fellow Developers** | Share knowledge & best practices | Writing, open-source projects, playbooks |

## Project Scope

### In Scope
- Personal portfolio website (quocnv15.github.io)
- Blog engine (Jekyll + Markdown posts)
- Custom TypeScript frontend (dark mode, navigation, copy-code, TOC)
- Project showcase (iOS apps, portfolio cases)
- Case study system (numbered, categorized)
- Work/operator hub (priorities, systems, frameworks)
- Performance optimization & bundle analysis
- Accessibility compliance (WCAG 2.1 AA)
- Testing framework (Vitest)
- CI/CD automation (GitHub Pages deployment)

### Out of Scope
- Private memory systems (`ios-memory` repo is separate)
- Client project details (public versions only)
- User authentication/accounts
- Comments or user interactions (static content)
- E-commerce or monetization
- Mobile app (web-only)

## Success Metrics

### Performance Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Production Bundle | <150KB | 13KB | ✅ Exceed by 91% |
| First Contentful Paint | <1.5s | <1.5s | ✅ On target |
| Largest Contentful Paint | <2.5s | <2.5s | ✅ On target |
| Theme Switch Time | <300ms | <300ms | ✅ On target |
| Build Time | <1s | ~718ms | ✅ On target |

### Content Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Blog Posts | 50+ | 50+ ✅ |
| Project Case Studies | 20+ | 23+ ✅ |
| iOS Projects Showcased | 10+ | 11+ ✅ |
| Portfolio Cases (Work Mode) | 20+ | 23+ ✅ |

### Quality Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| TypeScript Strict Coverage | 100% | 100% | ✅ |
| Accessibility (WCAG 2.1 AA) | Compliant | Compliant | ✅ |
| Test Coverage Framework | Ready | Ready | ✅ |
| Browser Support (2019+) | Chrome, Firefox, Safari, Edge | All supported | ✅ |

### Engagement Metrics
- Monthly unique visitors (target: 1K+)
- Case study views (target: track top 5)
- Blog post readership (target: measure via external analytics)
- GitHub stars (target: 10+)
- Referral traffic quality (target: high-intent visitors)

## Technical Requirements

### Frontend Stack
- **Language**: TypeScript 5.9+ (ES2019 target, strict mode)
- **Bundler**: esbuild 0.25+ (tree shaking, minification, source maps)
- **Testing**: Vitest 1.6+ (unit, integration, coverage)
- **DOM**: Type-safe utilities; accessibility first
- **State Management**: Reactive pattern, localStorage persistence
- **CSS**: CSS3 variables, light/dark theme, design tokens

### Backend/Infrastructure
- **Static Site Generator**: Jekyll (Ruby-based)
- **Hosting**: GitHub Pages (free, built-in CI/CD)
- **Content Source**: Markdown files in Git
- **Data**: JSON files for dynamic content (SwiftUI showcase)
- **Deployment**: Push to main branch → auto-build & deploy

### Developer Experience
- **npm Scripts**: Build, dev, test, analyze, lint (when configured)
- **Hot Module Reload**: TypeScript watch + Jekyll livereload + CSS injection
- **Type Safety**: Strict TypeScript; no implicit any
- **Testing**: Vitest with jsdom, setup.ts for common mocks
- **Documentation**: JSDoc comments, architecture docs, README

### Performance & Optimization
- **Bundle Budget**: 150KB (currently 13KB)
- **Tree Shaking**: Remove unused code automatically
- **Minification**: esbuild production mode
- **Source Maps**: Debug production builds
- **CSS Optimization**: Unused styles removed by Jekyll
- **Image Optimization**: Responsive images, lazy loading ready

### Accessibility & Compliance
- **Standard**: WCAG 2.1 Level AA
- **Keyboard Navigation**: Tab, Escape, arrows fully functional
- **Screen Readers**: ARIA labels, semantic HTML
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus states on all interactive elements
- **Form Labels**: Proper label associations
- **Skip Links**: Jump to main content

## Feature Requirements

### Theme System
- **Auto-detection**: Use OS preference (prefers-color-scheme)
- **Manual Override**: Light/dark/system toggle
- **Persistence**: Save preference to localStorage
- **Smooth Transitions**: 300ms CSS transitions
- **Coverage**: All UI elements respect theme

### Mobile Navigation
- **Responsive**: Hidden on desktop, visible on mobile (<768px)
- **Hamburger Menu**: Icon button opens/closes navigation
- **Animations**: Smooth slide/fade transitions
- **Touch Support**: Swipe, tap, long-press gestures
- **Keyboard**: Escape closes menu, Tab navigates
- **Scroll Lock**: Prevent body scroll when menu open

### Copy Code Functionality
- **Clipboard API**: Use modern API with fallback
- **Visual Feedback**: Success state (2s timeout), error state
- **Keyboard Shortcut**: Ctrl+C or Cmd+C when focused
- **Button Placement**: Optimized for touch (top-right of block)
- **Universal**: Works on all code blocks (highlight.js, Prism, native)

### Table of Contents (TOC)
- **Auto-Generation**: Parse h2-h6 headings dynamically
- **Hierarchy**: Proper indentation for nested levels
- **Scroll Spy**: Highlight active section as user scrolls
- **Smooth Navigation**: Smooth scroll with offset
- **Responsive**: Mobile-optimized layout
- **Performance**: Throttle scroll events (100ms)

### Content Collections
- **Blog Posts**: Chronological, tag-based filtering
- **Projects**: Showcase iOS apps with links
- **Portfolio Cases**: Numbered (001+), categorized, searchable
- **Work Mode**: Daily priorities, operator systems
- **Tools**: Utility references and resources
- **Notes**: Technical notes and snippets

## Non-Functional Requirements

### Security
- **Content Validation**: Markdown parsing with safety checks
- **No User Input**: Static site, no form submissions
- **HTTPS**: GitHub Pages provides free SSL
- **Dependencies**: Regular npm/Bundler updates
- **Secrets**: No credentials in repo; use environment variables

### Reliability
- **Uptime**: 99.9%+ (GitHub Pages SLA)
- **Backup**: Git history as backup, push to GitHub
- **Content Preservation**: Markdown files version-controlled
- **Link Rot Prevention**: Internal links checked via CI
- **Performance Monitoring**: Build-time bundle analysis

### Maintainability
- **Code Standards**: TypeScript strict mode, JSDoc comments
- **Documentation**: README, architecture docs, code examples
- **Testing**: Vitest framework, sample tests included
- **Version Control**: Conventional commits, clear history
- **Scalability**: Modular architecture; easy to add features

### Compliance
- **Privacy**: No analytics (or privacy-first alternative)
- **Accessibility**: WCAG 2.1 AA compliance, tested
- **IP Rights**: Respect licenses for dependencies
- **Legal**: Terms of service on public pages if needed

## Architecture Decisions

### Why Jekyll + TypeScript?
- **Static**: Fast, secure, no backend needed
- **Simplicity**: Markdown content, Git-based workflow
- **TypeScript**: Type safety for frontend logic
- **GitHub Pages**: Free hosting with built-in CI/CD
- **Separation of Concerns**: Content (Jekyll) vs. behavior (TypeScript)

### Why Not Next.js/Nuxt/Hugo?
- **Next.js**: Overkill for static content; requires Node.js hosting
- **Hugo**: Faster builds but less familiar; Go-based
- **Gatsby**: Heavier, requires GraphQL; similar to Next
- **Jekyll**: Simpler, lighter, proven for GitHub Pages

### Why Vitest + jsdom?
- **Fast**: Near-native performance in development
- **TypeScript**: Built-in support, no extra config
- **jsdom**: Browser simulation without Selenium/Playwright overhead
- **ESM**: Native module support

### Why esbuild?
- **Speed**: 100-1000x faster than alternatives
- **Simplicity**: Minimal config needed
- **Output**: Optimized bundles with tree shaking
- **Integration**: Works seamlessly with TypeScript

## Development Roadmap

### Phase 1: Foundation (Completed)
- ✅ Jekyll site setup with custom theme
- ✅ TypeScript toolchain integration
- ✅ Bundle optimization (13KB target)
- ✅ Dark mode system
- ✅ Mobile-first navigation

### Phase 2: Features (Completed)
- ✅ Copy code functionality
- ✅ Table of contents auto-generation
- ✅ Scroll spy highlighting
- ✅ Keyboard navigation
- ✅ Accessibility compliance (WCAG 2.1 AA)

### Phase 3: Content & Portfolio (Current)
- ✅ Blog posts (50+ articles)
- ✅ Project showcase (11+ projects)
- ✅ Case studies (23+ numbered cases)
- ✅ Work/operator hub
- ✅ Portfolio board dashboard

### Phase 4: Polish & Integration (In Progress)
- ✅ Design system overhaul (minimalist slate theme)
- ✅ Custom site footer
- ✅ Homepage layout refinements
- ✅ Memory timeline integration
- ⏳ SwiftUI component gallery enhancements
- ⏳ Growth/skill review section
- ⏳ Playbook templates

### Phase 5: Analytics & Optimization (Future)
- ⏳ Privacy-first analytics (Plausible, Fathom, or Umami)
- ⏳ Search functionality (Lunr.js or Algolia)
- ⏳ Performance monitoring (Core Web Vitals)
- ⏳ Sitemaps and SEO optimization

### Phase 6: Community & Expansion (Future)
- ⏳ Newsletter integration (Substack embed)
- ⏳ Social sharing enhancements
- ⏳ Open-source contributions showcase
- ⏳ Speaking engagements archive
- ⏳ Mentorship resources

## Acceptance Criteria

### For Code Changes
- [ ] TypeScript strict mode compliance
- [ ] No console errors or warnings
- [ ] All tests pass (unit + integration)
- [ ] Bundle size <150KB (alert if exceeds)
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Performance metrics maintained (<1.5s FCP)
- [ ] Git commit message follows conventional format
- [ ] Pull request has clear description & testing notes

### For Content Additions
- [ ] Post/project frontmatter complete (title, date, tags)
- [ ] Markdown follows project conventions
- [ ] Links are internal or external verified
- [ ] Images are optimized (<500KB each)
- [ ] Accessibility: alt text on all images
- [ ] Spelling & grammar checked
- [ ] Category/tag classification correct

### For Releases
- [ ] All acceptance criteria above met
- [ ] Performance metrics verified
- [ ] Accessibility audit passes
- [ ] Link checker confirms no 404s
- [ ] GitHub Pages deployment succeeds
- [ ] Site renders correctly on target browsers
- [ ] Mobile testing on real device (if possible)

## Constraints & Trade-offs

### Constraints
- **Hosting**: Limited to GitHub Pages (static only)
- **Database**: No dynamic backend; content is static
- **Interactivity**: Limited to client-side JavaScript
- **User Data**: Cannot store user preferences server-side
- **Collaboration**: Requires Git knowledge for content updates

### Trade-offs Made
| Trade-off | Decision | Rationale |
|-----------|----------|-----------|
| Dynamic Features | Static site (Jekyll) | Simplicity & performance > features |
| Analytics | None (or privacy-first) | Privacy-first approach |
| Comments | None | Keep content curated; manage via email |
| Search | Global search (future Lunr) | Low priority; use browser find for now |
| Build Time | ~718ms | Acceptable; not performance-critical |
| Bundle Size | 13KB (vs. 50KB alternatives) | Lean frontend; feature-complete |

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Link Rot | Medium | Low | CI checks for broken links (future) |
| Content Loss | Low | High | Git history; automatic backups via GitHub |
| Performance Regression | Low | Medium | Bundle size tracking in CI; alerts if >150KB |
| Accessibility Issues | Low | Medium | a11y-audit.js; manual testing before release |
| Deployment Failure | Low | High | Test locally before push; GitHub Pages reliability |
| Dependency Vulnerabilities | Medium | Medium | npm audit; automated dependency updates |

## Team & Ownership

- **Owner**: Quoc Nguyen (quocnv155@gmail.com)
- **Designer**: Integrated (CSS/design in repo)
- **Contributors**: Open to pull requests (via GitHub)
- **Stakeholders**: iOS community, portfolio reviewers

## Communication Plan

- **Announcements**: Via blog posts + GitHub releases
- **Updates**: Commit messages document changes
- **Feedback**: GitHub issues for bugs; email for inquiries
- **Sync**: Weekly work mode update on `/work/`

## Success Definition

**The site succeeds when:**
1. It showcases professional iOS work effectively
2. Technical content reaches 1K+ monthly visitors
3. Case studies convert to client inquiries or job offers
4. Codebase remains maintainable and performant
5. All accessibility standards are met
6. Performance metrics stay within targets
7. Content remains up-to-date and fresh

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-22  
**Next Review**: 2026-10-22
