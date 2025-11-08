---
layout: post
title: "Claude Code Deep Dive: 4 Features You Need to Master"
date: 2025-11-08 10:00:00 +0700
tags: [ai, claude-code, agent-skills, mcp-servers, productivity, tools]
categories: [AI Tools & Workflow]
author: NGUYEN VAN QUOC
---

# Claude Code Deep Dive: 4 Tính năng bạn cần làm chủ

> Tổng hợp chi tiết về 4 tính năng chính của Claude Code: Agent Skills, MCP Servers, Sub-agents, và Custom Slash Commands. Bài viết cung cấp bảng so sánh trực quan và hướng dẫn sử dụng hiệu quả để tối ưu công việc.

## Tổng quan 4 tính năng chính

Claude Code mang đến 4 tính năng cốt lõi, mỗi tính năng có mục đích sử dụng riêng biệt:

1. **Agent Skills** - Đơn vị composition ở mức cao
2. **MCP Servers** - Tích hợp hệ thống bên ngoài
3. **Sub-agents** - Xử lý song song
4. **Custom Slash Commands** - Đơn vị nguyên thủy cơ bản nhất

## Bảng so sánh 4 tính năng chính

| Tính năng | Mục đích chính | Quản lý Context | Trigger Type | Modularity | Song song hóa | Composability | Best Use Case |
|-----------|----------------|-----------------|--------------|------------|--------------|---------------|---------------|
| **Agent Skills** | Đóng gói workflow tự động lặp lại, được agent tự động gọi | Tiết kiệm (progressive disclosure) | Tự động bởi agent | Cao | Không | Cao - có thể compose tất cả | Git worktree manager, Style guide detection |
| **MCP Servers** | Kết nối với hệ thống bên ngoài (API, database, Figma...) | Tốn kém (explode context window) | Manual/Programmatic | Trung bình | Không | Trung bình | Connect Figma, Jira, Database |
| **Sub-agents** | Thực thi task song song với context riêng biệt | Cách ly (isolated context) | Tự động bởi agent | Trung bình | Có | Trung bình | Security audit, Fix bugs at scale, Parallel development |
| **Custom Slash Commands** | Prompt thủ công cho tác vụ đơn giản - đơn vị nguyên thủy | Sử dụng context chung | Manual - user kích hoạt | Thấp | Không | Cao - là primitive unit | Generate commit messages, Create components |

### Điểm quan trọng cần nhớ

- **Agent Skills và Sub-agents** được agent tự động kích hoạt
- **MCP Servers** dành riêng cho tích hợp hệ thống bên ngoài  
- **Sub-agents** là tính năng **DUY NHẤT** hỗ trợ song song hóa
- **Custom Slash Commands** là đơn vị nguyên thủy (primitive) quan trọng nhất

## Agent Skills: Đánh giá chi tiết

### Đánh giá tổng thể: 8/10

Agent Skills là tính năng mạnh mẽ nhưng **KHÔNG** thay thế các tính năng khác - nó là một "compositional unit" ở level cao hơn.

#### Ưu điểm của Agent Skills

✅ **Tự động hóa workflow** - Skills có thể tự động kích hoạt khi cần thiết  
✅ **Quản lý nhiều elements** - Hoàn hảo cho tasks phức tạp có nhiều bước  
✅ **Composition cao** - Có thể kết hợp MCP servers + sub-agents + slash commands  
✅ **Reusable solution** - Dễ dàng tái sử dụng cho các tasks tương tự  

#### Nhược điểm của Agent Skills

❌ **Learning curve** - Cần thời gian để hiểu cách hoạt động  
❌ **Overkill cho simple tasks** - Không hiệu quả cho tasks đơn giản  
❌ **Complex debugging** - Khó debug khi có nhiều elements kết hợp  

#### Common mistakes với Agent Skills

🚫 **Convert tất cả slash commands thành skills** - Đây là sai lầm phổ biến nhất  
🚫 **Dùng skills cho tasks đơn giản** - Lãng phí tài nguyên và thời gian  
🚫 **Bỏ qua fundamental prompt engineering** - Mất nền tảng quan trọng  

## Use Cases và Khuyến nghị chi tiết

### Quy tắc vàng khi chọn tính năng

**Thấy từ khóa "automatic" → dùng Skill**

- Khi cần tự động hóa toàn bộ workflow
- Khi muốn agent tự quyết định khi nào kích hoạt

**Thấy từ khóa "parallel" → dùng Sub-agent**  

- Khi cần xử lý nhiều tasks cùng lúc
- Khi muốn tối ưu thời gian bằng song song hóa

**Cần kết nối external system → dùng MCP Server**

- Khi cần truy cập database
- Khi cần gọi API bên ngoài
- Khi cần tích hợp với third-party services

**Task đơn giản một bước → dùng Slash Command**

- Khi chỉ cần một prompt để hoàn thành
- Khi không cần composition phức tạp
- Khi muốn giữ control trực tiếp

### Core Principles của Agentic Coding

#### "The Prompt is the Fundamental Unit"

Đây là message quan trọng nhất:

> **"The prompt is the fundamental unit of knowledge work and of programming. If you don't know how to build and manage prompts, you will lose."**

#### Core 4 của Agentic Coding

1. **Context** - Bối cảnh của task
2. **Model** - Mô hình AI sử dụng  
3. **Prompt** - Câu lệnh (quan trọng nhất)
4. **Tools** - Công cụ hỗ trợ

**Quan trọng:** Luôn bắt đầu với custom slash command (prompt thuần), chỉ nâng cấp lên skill khi cần giải pháp lặp lại cho nhiều bước.

## Ví dụ thực tế: Git Worktree Manager

Để minh họa sự khác biệt giữa các tính năng, hãy xem ví dụ tạo git worktree bằng 3 cách:

### 1. Sử dụng Skill - Quản lý toàn bộ workflow

```bash
/git-worktree-manager create feature-branch
/git-worktree-manager list
/git-worktree-manager remove old-branch
```

**Phù hợp khi:** Cần manage toàn bộ lifecycle của worktrees (create, remove, list, switch)

### 2. Sử dụng Sub-agent - Tạo nhiều worktrees song song

```bash
Tạo worktree cho branches: feature-auth, feature-ui, feature-api cùng lúc
```

**Phù hợp khi:** Cần tạo nhiều worktrees đồng thời để tiết kiệm thời gian

### 3. Sử dụng Prompt - Tạo một worktree đơn lẻ

```bash
Tạo worktree cho branch feature-login
```

**Phù hợp khi:** Chỉ cần tạo một worktree cụ thể

### Phân tích kết quả

- Nếu chỉ cần tạo một worktree → dùng prompt là đủ
- Khi cần manage worktrees (create, remove, list, switch) → dùng skill
- Khi cần tạo nhiều worktrees cùng lúc → dùng sub-agent

## Workflow Composition đề xuất

```
Prompt (Slash Command) → Primitive unit
    ↓ (khi cần parallel)
Sub-agent (nếu cần parallel)
    ↓ (khi cần manage nhiều elements)  
Skill (khi cần manage nhiều elements)
    ↓ (khi cần external data)
MCP Server (khi cần external data)
```

## Sai lầm phổ biến và cách khắc phục

### BIG MISTAKE: Convert tất cả slash commands thành skills

Nhiều kỹ sư đang cố gắng convert TẤT CẢ slash commands thành skills → đây là sai lầm lớn.

**Hậu quả:**

- Đánh mất nền tảng prompt engineering
- Complexity không cần thiết
- Khó debug và maintain

**Cách sử dụng ĐÚNG:**

```
Skills = Higher compositional level
Skills CÓ THỂ compose: MCP servers + sub-agents + slash commands
Nhưng Skills KHÔNG thay thế chúng
```

### Khi nào nên dùng Skills?

Dùng skills khi:

- "One prompt is not enough"
- Cần scale thành reusable solution  
- Cần manage nhiều elements trong workflow
- Cần tự động hóa theo context

---

# Claude Code Deep Dive: 4 Features You Need to Master

> After struggling with agent skills for a week, I've learned valuable lessons about using Claude Code's 4 main features correctly. Here's my detailed analysis with comparison tables and practical guidance to help you avoid wasting time.

## Overview

Claude Code offers 4 core features, each serving distinct purposes for different use cases:

1. **Agent Skills** - High-level composition units
2. **MCP Servers** - External system integrations
3. **Sub-agents** - Parallel processing
4. **Custom Slash Commands** - Basic primitive units

## Feature Comparison Table

| Feature | Main Purpose | Context Management | Trigger Type | Modularity | Parallelization | Composability | Best Use Case |
|---------|---------------|-------------------|--------------|------------|-----------------|---------------|---------------|
| **Agent Skills** | Package auto-repeating workflows, auto-called by agent | Efficient (progressive disclosure) | Auto by agent | High | No | High - can compose all | Git worktree manager, Style guide detection |
| **MCP Servers** | Connect to external systems (API, database, Figma...) | Expensive (explode context window) | Manual/Programmatic | Medium | No | Medium | Connect Figma, Jira, Database |
| **Sub-agents** | Execute parallel tasks with separate contexts | Isolated context | Auto by agent | Medium | Yes | Medium | Security audit, Fix bugs at scale, Parallel development |
| **Custom Slash Commands** | Manual prompts for simple tasks - primitive unit | Shared context | Manual - user triggered | Low | No | High - primitive unit | Generate commit messages, Create components |

### Key Points to Remember

- **Agent Skills and Sub-agents** are auto-triggered by the agent
- **MCP Servers** are specifically for external system integrations
- **Sub-agents** are the **ONLY** feature that supports parallelization
- **Custom Slash Commands** are the most important primitive unit

## Agent Skills: Detailed Analysis

### Overall Rating: 8/10

Agent Skills are powerful but **NOT** replacements for other features - they're a higher-level "compositional unit."

#### Advantages of Agent Skills

✅ **Workflow automation** - Skills can auto-trigger when needed  
✅ **Multi-element management** - Perfect for complex multi-step tasks  
✅ **High composition** - Can combine MCP servers + sub-agents + slash commands  
✅ **Reusable solutions** - Easy to reuse for similar tasks  

#### Disadvantages of Agent Skills

❌ **Learning curve** - Takes time to understand how they work  
❌ **Overkill for simple tasks** - Inefficient for simple tasks  
❌ **Complex debugging** - Hard to debug with many combined elements  

#### Common Mistakes with Agent Skills

🚫 **Converting all slash commands to skills** - This is the most common mistake  
🚫 **Using skills for simple tasks** - Wastes resources and time  
🚫 **Ignoring fundamental prompt engineering** - Loses important foundation  

## Use Cases and Detailed Recommendations

### Golden Rules for Feature Selection

**See keyword "automatic" → Use Skill**

- When you need to automate entire workflows
- When you want the agent to decide when to trigger

**See keyword "parallel" → Use Sub-agent**  

- When you need to handle multiple tasks simultaneously
- When you want to optimize time through parallelization

**Need external system connection → Use MCP Server**

- When you need database access
- When you need to call external APIs
- When you need third-party service integrations

**Simple one-step task → Use Slash Command**

- When you only need one prompt to complete
- When you don't need complex composition
- When you want to maintain direct control

### Core Principles of Agentic Coding

#### "The Prompt is the Fundamental Unit"

This is the most important message:

> **"The prompt is the fundamental unit of knowledge work and of programming. If you don't know how to build and manage prompts, you will lose."**

#### Core 4 of Agentic Coding

1. **Context** - Task context
2. **Model** - AI model used  
3. **Prompt** - Command (most important)
4. **Tools** - Supporting tools

**Important advice:** Always start with custom slash commands (pure prompts), only upgrade to skills when you need repeatable solutions for multiple steps.

## Real-world Example: Git Worktree Manager

To illustrate the differences between features, let's look at creating git worktrees in 3 ways:

### 1. Using Skill - Manage entire workflow

```bash
/git-worktree-manager create feature-branch
/git-worktree-manager list
/git-worktree-manager remove old-branch
```

**Best for:** Managing entire worktree lifecycle (create, remove, list, switch)

### 2. Using Sub-agent - Create multiple worktrees in parallel

```bash
Create worktrees for branches: feature-auth, feature-ui, feature-api simultaneously
```

**Best for:** Creating multiple worktrees simultaneously to save time

### 3. Using Prompt - Create a single worktree

```bash
Create worktree for branch feature-login
```

**Best for:** Just creating one specific worktree

### Results Analysis

- If you only need to create one worktree → prompt is sufficient
- When managing worktrees (create, remove, list, switch) → use skill
- When creating multiple worktrees simultaneously → use sub-agent

## Recommended Workflow Composition

```
Prompt (Slash Command) → Primitive unit
    ↓ (if parallel needed)
Sub-agent (if parallel needed)
    ↓ (if managing multiple elements)  
Skill (if managing multiple elements)
    ↓ (if external data needed)
MCP Server (if external data needed)
```

## Common Mistakes and Solutions

### BIG MISTAKE: Converting all slash commands to skills

Many engineers are trying to convert ALL slash commands to skills → this is a big mistake.

**Consequences:**

- Loses prompt engineering foundation
- Unnecessary complexity
- Hard to debug and maintain

**Correct Usage:**

```
Skills = Higher compositional level
Skills CAN compose: MCP servers + sub-agents + slash commands
But Skills DON'T replace them
```

### When should you use Skills?

Use skills when:

- "One prompt is not enough"
- Need to scale into reusable solutions  
- Need to manage multiple elements in workflow
- Need context-based automation

## Key Takeaways

- **Start with slash commands** - Master prompt engineering fundamentals first
- **Use sub-agents for parallel tasks** - Optimize processing time
- **Use MCP servers for external integrations** - Connect with external systems
- **Use skills for complex workflows** - When high-level composition is needed
- **NEVER replace all prompts with skills** - Preserve the fundamental units

## Conclusion

> **"Master the fundamentals, you'll master the compositional units, you'll master the features, and then you'll master the tools. This is why it's so important to always lead with a custom slash command."**

### Final Rating: Agent Skills - 8/10

Agent Skills are a positive addition to the ecosystem:

- ❌ **NOT** a replacement for existing features
- ✅ Better way to **compose** features together
- ✅ Valuable when used with correct understanding

By understanding and applying each feature correctly, you'll optimize productivity and avoid common mistakes when using Claude Code.
