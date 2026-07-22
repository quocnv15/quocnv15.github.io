# Design Guidelines

## Design Philosophy

The quocnv15.github.io site follows a **minimalist, functional design** philosophy:

- **Clarity**: Information hierarchy and typography guide attention
- **Simplicity**: Remove unnecessary elements; keep essential content
- **Consistency**: Unified design language across all pages
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Performance**: Design supports fast load times and smooth interactions
- **Responsive**: Mobile-first approach; scales to all screen sizes

## Color System

### Light Theme

```css
/* Primary Colors */
--bg: #ffffff              /* Main background */
--bg-alt: #f5f5f5         /* Secondary background (cards, sidebars) */
--surface: #ffffff         /* Surface for elevated elements */

/* Text Colors */
--text: #0f172a            /* Primary text (headings, body) */
--text-muted: #666666      /* Secondary text (captions, meta) */
--heading: #0f172a         /* Heading color */

/* Action Colors */
--solid: #2563eb           /* Buttons, primary actions */
--accent: #2563eb          /* Links, highlights */

/* Semantic Colors */
--success: #10b981         /* Success messages */
--error: #ef4444           /* Error messages */
--warning: #f59e0b         /* Warning messages */
--info: #3b82f6            /* Info messages */
```

### Dark Theme

```css
/* Primary Colors */
--bg: #0b1120              /* Main background */
--bg-alt: #1a2332          /* Secondary background */
--surface: #2a3548         /* Surface for elevated elements */

/* Text Colors */
--text: #e0e0e0            /* Primary text */
--text-muted: #999999      /* Secondary text */
--heading: #ffffff         /* Heading color */

/* Action Colors */
--solid: #6ea8ff           /* Buttons, primary actions */
--accent: #6ea8ff          /* Links, highlights */

/* Semantic Colors */
--success: #34d399         /* Success messages */
--error: #f87171           /* Error messages */
--warning: #fbbf24         /* Warning messages */
--info: #60a5fa            /* Info messages */
```

### Color Accessibility

**Contrast Ratios** (WCAG 2.1 AA):
- Light theme: Text on background = **16.5:1** (AAA)
- Dark theme: Text on background = **14.2:1** (AAA)
- Links on text = **4.5:1 minimum** (AA)

**Usage Rules**:
- Never rely on color alone to convey meaning
- Use sufficient contrast for all text
- Test color combinations with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Typography

### Font Stack

```css
/* Headings & Body */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue',
             Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

/* Monospace (code blocks) */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Alternative: Inter (if imported)
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Sizing Scale

```css
/* Headings */
h1 { font-size: 2.5rem; line-height: 1.2; font-weight: 700; }
h2 { font-size: 2rem;   line-height: 1.2; font-weight: 700; }
h3 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }
h5 { font-size: 1.125rem; line-height: 1.4; font-weight: 600; }
h6 { font-size: 1rem; line-height: 1.5; font-weight: 600; }

/* Body Text */
body { font-size: 1rem; line-height: 1.6; }
small { font-size: 0.875rem; line-height: 1.5; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
```

### Font Weights

```css
--font-weight-regular: 400;    /* Normal text */
--font-weight-medium: 500;     /* Slightly emphasized */
--font-weight-semibold: 600;   /* Emphasis */
--font-weight-bold: 700;       /* Strong emphasis */
```

## Spacing System

### 8pt Grid Scale

All spacing follows an 8pt grid for consistency:

```css
--space-xs: 0.25rem;    /* 4px - minimal spacing */
--space-sm: 0.5rem;     /* 8px - small spacing */
--space-md: 1rem;       /* 16px - default spacing */
--space-lg: 1.5rem;     /* 24px - large spacing */
--space-xl: 2rem;       /* 32px - extra large */
--space-2xl: 3rem;      /* 48px - section spacing */
--space-3xl: 4rem;      /* 64px - major sections */
```

### Application

```css
/* Padding */
button { padding: var(--space-sm) var(--space-md); }
card { padding: var(--space-lg); }

/* Margins */
h2 { margin-top: var(--space-2xl); margin-bottom: var(--space-md); }
p { margin-bottom: var(--space-md); }

/* Gaps */
.flex { gap: var(--space-md); }
```

## Component Styling

### Buttons

```css
.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms ease;
  
  /* Light theme */
  background: var(--solid);
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  /* Hover state */
  &:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  /* Focus state (accessibility) */
  &:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  
  /* Active state */
  &:active {
    transform: scale(0.98);
  }
}

.btn-secondary {
  background: var(--bg-alt);
  color: var(--text);
  box-shadow: inset 0 0 0 1px var(--text-muted);
  
  &:hover {
    background: #e5e5e5;
  }
}
```

### Links

```css
a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  transition: all 150ms ease;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  
  &:visited {
    opacity: 0.7;
  }
}
```

### Cards

```css
.card {
  background: var(--bg-alt);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: var(--space-lg);
  transition: all 200ms ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

/* Dark theme */
:root[data-theme="dark"] .card {
  border-color: rgba(255, 255, 255, 0.1);
}
```

### Forms

```css
input, textarea, select {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--text-muted);
  border-radius: 0.375rem;
  background: var(--bg);
  color: var(--text);
  transition: all 150ms ease;
  
  &:focus {
    outline: 2px solid var(--accent);
    border-color: var(--accent);
  }
  
  &:invalid {
    border-color: var(--error);
  }
}

label {
  font-weight: 500;
  margin-bottom: var(--space-sm);
  display: block;
}
```

## Layout

### Container Widths

```css
.container {
  max-width: 52rem;         /* 832px - ideal for reading */
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.container-lg {
  max-width: 64rem;         /* 1024px - wider layout */
}

.container-full {
  max-width: 100%;          /* Full width */
}
```

### Responsive Breakpoints

```css
/* Mobile first approach */

/* Small screens (mobile) */
/* 0px and up - default styles */

/* Medium screens (tablet) */
@media (min-width: 768px) {
  /* tablet styles */
}

/* Large screens (desktop) */
@media (min-width: 1024px) {
  /* desktop styles */
}

/* Extra large screens */
@media (min-width: 1280px) {
  /* large monitor styles */
}
```

### Flexbox & Grid

```css
/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { justify-content: center; align-items: center; }
.flex-between { justify-content: space-between; align-items: center; }
.gap-md { gap: var(--space-md); }

/* Grid utilities */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
```

## Dark Mode

### Theme Switch Flow

```
1. User clicks theme toggle
   ↓
2. Update AppState.theme
   ↓
3. Apply data-theme attribute to <html>
   :root[data-theme="dark"] { --bg: #0b1120; ... }
   ↓
4. CSS variables update automatically
   ↓
5. All components respect new colors
   ↓
6. Save to localStorage for persistence
```

### Implementation

```typescript
// Apply theme
document.documentElement.setAttribute('data-theme', 'dark');

// CSS responds automatically
:root[data-theme="dark"] {
  --bg: #0b1120;
  --text: #e0e0e0;
  /* all colors update */
}
```

### Theme-Specific Images

If images need theme variations:

```html
<!-- Picture element for responsive theme images -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="image-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="image-light.png">
  <img src="image-light.png" alt="Description">
</picture>
```

## Animation & Motion

### Transitions

```css
/* Global transition speed */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-linear: linear;
```

### Examples

```css
/* Button hover */
button {
  transition: all var(--transition-base) var(--ease-out);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* Theme switch */
* {
  transition: background-color var(--transition-slow),
              color var(--transition-slow),
              border-color var(--transition-slow);
}
```

### Accessibility & Performance

- Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Icons & Images

### Icon Guidelines

- **Size**: Use 24px grid (16px, 24px, 32px)
- **Weight**: Consistent stroke weight (1.5px)
- **Format**: SVG preferred (scalable, accessible)
- **Emoji**: For casual, friendly feel (🌙, ☀️, ✅)

### Image Optimization

```html
<!-- Responsive images -->
<img 
  srcset="image-400w.jpg 400w, image-800w.jpg 800w"
  src="image-800w.jpg"
  alt="Descriptive alt text"
>

<!-- Picture element for art direction -->
<picture>
  <source media="(max-width: 600px)" srcset="image-mobile.jpg">
  <img src="image-desktop.jpg" alt="Description">
</picture>
```

### Alt Text Guidelines

- Describe image purpose, not appearance
- Avoid "image of", "picture of"
- Keep under 100 characters
- Examples:
  - ❌ "Photo of iPhone screen"
  - ✅ "iOS app showing memory timeline interface"

## Accessibility

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```css
/* Focus indicator */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default outline only if custom focus is present */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Readers

```html
<!-- Semantic HTML -->
<nav aria-label="Main navigation">
  <a href="/">Home</a>
</nav>

<!-- ARIA labels for icon buttons -->
<button aria-label="Toggle dark mode">
  🌙
</button>

<!-- Skip link for keyboard users -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### Color Contrast

- **AA Standard**: 4.5:1 for normal text
- **AAA Standard**: 7:1 for normal text
- **Minimum**: 3:1 for large text (18pt+)

Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Mobile Design

### Touch Targets

- **Minimum size**: 44px × 44px for touch targets
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual feedback for touches

```css
button {
  min-width: 44px;
  min-height: 44px;
  
  /* Add padding if content is smaller */
  padding: 0.75rem 1rem;
}
```

### Mobile Viewport

```html
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1, 
               viewport-fit=cover">
```

### Mobile-First Approach

```css
/* Base styles for mobile */
body { font-size: 1rem; }

/* Enhancements for larger screens */
@media (min-width: 768px) {
  body { font-size: 1.125rem; }
}
```

## Code Block Styling

```css
pre {
  background: var(--bg-alt);
  border: 1px solid var(--text-muted);
  border-radius: 0.375rem;
  padding: var(--space-md);
  overflow-x: auto;
  line-height: 1.5;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
}

/* Inline code */
:not(pre) > code {
  background: var(--bg-alt);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}
```

## Content Styling

### Blog Post Typography

```css
article {
  .post-title {
    font-size: 2.5rem;
    line-height: 1.1;
    margin-bottom: var(--space-lg);
    font-weight: 700;
  }
  
  p {
    font-size: 1.0625rem;
    line-height: 1.75;
    margin-bottom: var(--space-lg);
  }
  
  h2 {
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-md);
  }
  
  blockquote {
    border-left: 4px solid var(--accent);
    padding-left: var(--space-md);
    margin-left: 0;
    color: var(--text-muted);
  }
}
```

## Design Tokens Validation

Run design token checker:

```bash
npm run check:design

# Validates:
# - Color contrast ratios
# - Spacing scale consistency
# - Typography scales
# - Missing CSS variables
# - Token naming conventions
```

## Best Practices Checklist

- [ ] Use CSS variables for all colors and spacing
- [ ] Follow 8pt grid for spacing
- [ ] Maintain sufficient color contrast (WCAG AA)
- [ ] Provide focus indicators for keyboard navigation
- [ ] Use semantic HTML elements
- [ ] Test on mobile devices
- [ ] Respect `prefers-reduced-motion`
- [ ] Provide alt text for images
- [ ] Use responsive images
- [ ] Test with screen readers
- [ ] Avoid color-only indicators
- [ ] Keep animations performant

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-22  
**Next Review**: 2026-10-22
