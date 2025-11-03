# Hướng Dẫn Tạo Post & Note Mới

## 📁 Hệ Thư Mục

### Blog Posts (`_posts/`)
```
_posts/
├── AI/                    # AI & Strategy posts
├── architecture/          # Architecture & Design posts
├── code-quality/          # Code quality posts
├── coding/               # Programming posts
├── iOS/                  # iOS Development posts
├── reflection/           # Reflection & thoughts
└── swift/                # Swift Programming posts
```

### Knowledge Curation (`_notes/`)
```
_notes/
├── article-notes/        # Notes from blogs, articles, research papers
├── book-notes/          # Notes from books
├── case-study/          # Case studies & real-world examples
├── curation/            # Curated content from multiple sources
├── insights/            # Key takeaways & highlights
├── notes/               # Quick notes & thoughts
└── video-notes/         # Notes from YouTube, podcasts, video lectures
```

## 📝 Tạo Blog Post Mới

### 1. Front Matter Template

**For Original Posts:**
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM:SS +0700
tags: [tag1, tag2, tag3]
categories: [Category]
author: Your Name
---
```

**For Reposted Content:**
```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD HH:MM:SS +0700
tags: [tag1, tag2, tag3, repost]
categories: [Category]
author: Original Author Name
source: 
  url: "https://original-url.com/post"
  name: "Original Blog/Publication Name"
  type: "repost"
---
```

### 2. Naming Convention
- Format: `YYYY-MM-DD-title-in-kebab-case.md`
- Ví dụ: `2025-10-02-clean-architecture-patterns.md`

### 3. Category Mapping
| Content Type | Directory | Tags Priority |
|--------------|-----------|---------------|
| AI & Strategy | `AI/` | AI, Strategy, Productivity |
| Architecture | `architecture/` | Architecture, Clean-Architecture, Design-Patterns |
| Code Quality | `code-quality/` | Code-Quality, Refactoring, Performance |
| iOS Development | `iOS/` | iOS, Swift, Interview, Career |
| Swift Programming | `swift/` | Swift, Testing, Data-Structures |
| General Coding | `coding/` | Coding, Algorithms, Data-Structures |
| Personal Thoughts | `reflection/` | Personal, Reflection, Mindset |

## 📚 Tạo Knowledge Curation Note Mới

### 1. Front Matter Template
```yaml
---
layout: note
title: "Your Note Title"
date: YYYY-MM-DD HH:MM:SS +0700
tags: [tag1, tag2, tag3]
---
```

### 2. Naming Convention
- Format: `YYYY-MM-DD-title-in-kebab-case.md`
- Ví dụ: `2025-10-02-atomic-habits-book-notes.md`

### 3. Note Type Classification
| Note Type | Directory | Use For |
|-----------|-----------|---------|
| **article-notes** | `article-notes/` | Blog posts, news articles, research papers |
| **book-notes** | `book-notes/` | Book summaries, key insights, highlights |
| **case-study** | `case-study/` | Real-world examples, success stories |
| **curation** | `curation/` | Curated content from multiple sources |
| **insights** | `insights/` | Key takeaways, quotable insights |
| **notes** | `notes/` | Quick thoughts, brainstorming |
| **video-notes** | `video-notes/` | YouTube, podcasts, video lectures |

## 🏷️ Tag Guidelines

### English Tags Only (System Consistency)
- Use kebab-case for multi-word tags
- Prioritize existing tags from tag system
- 3-5 tags per post/note

### Core Tag Sets
**Technical Tags:**
- `ai`, `strategy`, `productivity`, `tools`
- `architecture`, `clean-architecture`, `design-patterns`
- `swift`, `ios`, `testing`, `code-quality`
- `flutter`, `solid`, `performance`

**Personal Development Tags:**
- `critical-thinking`, `mental-models`, `decision-making`
- `emotional-intelligence`, `relationships`, `vulnerability`
- `personal-development`, `learning`, `leadership`
- `productivity`, `systems`, `habits`, `time-management`

**Content Type Tags:**
- `education`, `knowledge-sharing`, `teaching`
- `career`, `interview`, `preparation`

## ✅ Post Creation Checklist

### Before Publishing:
- [ ] Choose correct directory (posts vs notes)
- [ ] Use proper naming convention
- [ ] Set correct layout (`post` vs `note`)
- [ ] Add appropriate front matter
- [ ] If reposting, add `source` field with original URL and `repost` tag
- [ ] Use English tags only
- [ ] Check for typos and grammar
- [ ] Test local build: `bundle exec jekyll serve`

### Content Structure:
- [ ] Start with compelling intro/hook
- [ ] Use clear headings (H2, H3)
- [ ] Include bullet points for readability
- [ ] Add code blocks where needed
- [ ] Include actionable takeaways
- [ ] End with summary or next steps

### SEO Best Practices:
- [ ] Include keywords in title
- [ ] Use meta description (if needed)
- [ ] Add alt text for images
- [ ] Internal links to related posts
- [ ] External links open in new tabs

## 🛠️ Quick Commands

### Create New Post:
```bash
# Create new blog post
touch "_posts/[category]/$(date +%Y-%m-%d)-post-title.md"

# Create new note
touch "_notes/[note-type]/$(date +%Y-%m-%d)-note-title.md"
```

### Local Development:
```bash
# Start local server
bundle exec jekyll serve

# Build and check for errors
bundle exec jekyll build --verbose
```

### Git Commands:
```bash
# Add new post
git add "_posts/[category]/new-post.md"
git add "_notes/[note-type]/new-note.md"

# Commit with format
git commit -m "Add: [Post/Note Title] in [Category]

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 📋 Templates

### Blog Post Template

**Original Post Template:**
```markdown
---
layout: post
title: "Post Title Here"
date: 2025-10-02 10:00:00 +0700
tags: [tag1, tag2, tag3]
categories: [Category]
author: Your Name
---

> Hook sentence that grabs attention

## Overview
Brief introduction to what the post covers and why it matters.

## Main Content
Your detailed content here...

## Key Takeaways
- Point 1
- Point 2
- Point 3

## Conclusion
Summary and call to action.
```

**Repost Template:**
```markdown
---
layout: post
title: "Original Post Title"
date: 2025-10-02 10:00:00 +0700
tags: [tag1, tag2, tag3, repost]
categories: [Category]
author: Original Author Name
source: 
  url: "https://original-blog.com/post-url"
  name: "Original Blog Name"
  type: "repost"
---

> [Optional: Add your own intro/context for why you're sharing this]

[Original content starts here...]

---

*Originally posted by [Author Name] on [Blog Name]. Read the original at [Original URL].*
```

### Video Note Template
```markdown
---
layout: note
title: "Video Title - Key Insights"
date: 2025-10-02 14:00:00 +0700
tags: [video-content, topic1, topic2]
---

## 📋 Video Information
- **Source:** Channel Name
- **Duration:** XX minutes
- **Language:** English/Vietnamese
- **Date Created:** YYYY-MM-DD

## Main Takeaways
### Point 1
**Key Insight:** [Main point]

**Why It Matters:** [Explanation]

**Actionable Steps:**
1. Step 1
2. Step 2
3. Step 3

## Personal Reflections
[Your thoughts and how you'll apply this]

## Related Resources
- [Link to related content]
- [Book recommendations]
```

### Book Note Template
```markdown
---
layout: note
title: "Book Title - Key Insights & Notes"
date: 2025-10-02 16:00:00 +0700
tags: [book-notes, topic1, topic2]
---

## 📚 Book Information
- **Title:** Book Title
- **Author:** Author Name
- **Published:** Year
- **Pages:** XXX
- **Reading Time:** X hours
- **Date Read:** YYYY-MM-DD

## Overview
Brief summary of the book's main premise.

## Key Insights
### Chapter 1: Chapter Title
**Main Idea:** [Core concept]

**Notable Quotes:**
> "Quote here"

**Personal Takeaways:**
- How this applies to my life/work
- Actionable insights

## Rating & Recommendation
**⭐ Rating:** X/5
**Best For:** [Who should read this]
**When to Read:** [Best timing/situation]

## Action Items
[ ] Action 1 based on book
[ ] Action 2 based on book
[ ] Action 3 based on book
```

---

## 🔄 Reposting Guidelines

### When to Repost:
- Content from other blogs that provides significant value
- Articles you want to preserve and reference later
- Posts from thought leaders that align with your blog's themes
- Content that might be useful to your audience

### Best Practices for Reposting:
1. **Always Credit:** Include original author and source information
2. **Add Context:** Explain why you're sharing this content
3. **Use `repost` tag:** Add `repost` to tags for filtering
4. **Complete Front Matter:** Fill in all `source` fields
5. **Preserve Original:** Don't modify the original content significantly
6. **Add Attribution:** Include attribution at the end of the post

### Front Matter for Reposts:
```yaml
source:
  url: "https://original-url.com/post"      # Required
  name: "Original Blog Name"                # Required  
  type: "repost"                            # Required
```

### Example Use Cases:
- Sharing insightful articles from industry leaders
- Preserving valuable content that might be removed
- Building a knowledge base of external resources
- Curating content for your audience's benefit

## 🚀 Pro Tips

1. **Consistency is Key:** Stick to the same format and style
2. **Quality Over Quantity:** Better to have fewer high-quality posts
3. **SEO Optimization:** Include relevant keywords naturally
4. **Internal Linking:** Connect related content
5. **Visual Elements:** Use emojis, formatting, and structure
6. **Call to Action:** End with what readers should do next
7. **Review Before Publishing:** Always proofread and test locally
8. **Proper Attribution:** Always credit original sources when reposting

---

*Last Updated: 2025-11-03*
*Maintained by: NGUYEN VAN QUOC*