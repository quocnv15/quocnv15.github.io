---
layout: portfolio-detail
title: "Case Study 023 — ClaudeKit: Architecture & Skills Consolidation"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/case-studies/023-claudekit-architecture-consolidation/
---

# Case Study 023 — ClaudeKit: Architecture & Skills Consolidation

> **Title:** Tổng hợp bài học từ quá trình tái cấu trúc Axiom sang ClaudeKit (4-Layer Architecture)
> **Author:** Quoc Nguyen Van
> **Date:** 2026-07-11
> **Status:** Completed
> **Sản phẩm:** `ios-kit`
> **Nguồn:** `ios-kit/docs/lessons-learned/`

---

## Lessons Learned: FigmaKit Migration (Archived Feb 26, 2026)
## 1. Metadata
- **Date Original:** 2026-02-26
- **Topic:** Migrating Figma integration to the standalone "FigmaKit" 4-Layer Architecture.
- **Original Source Plan:** `plans/archive/brainstorm-260226-figmakit-standalone.md`

## 2. Key Architectural Decisions
The legacy `.claude/commands/figma/` directory was bloated with both passive components (references) and active components (commands). We successfully decoupled this flat structure into the ios-kit standardized **4-Layer Hub pattern**:
- **L1 Orchestrator:** `figma-orchestrator` along with top-level commands `/figma-screen`, `/figma-extract`, `/figma-verify`.
- **L2 Hub Agents:** `figma-extractor`, `figma-generator`, `figma-validator`.
- **L4 Domain Skills:** `figma-extraction`, `figma-generation`, `figma-validation`. 

This clean separation means that an extraction run does not clutter the AI context window with Swift code generation patterns, leading to faster inference and lower token costs.

## 3. Human-in-the-Loop Workflow ("Numbered Wireframes")
Instead of forcing users to edit dense JSON structure (`design-specs-merged.json`), we introduced a **"Numbered Wireframe + Table"** workflow:
1. `figma-extractor` returns an ASCII layout wireframe with bracketed IDs (e.g. `[1]`, `[H1]`).
2. The agent pauses execution and requests the user to append unstructured feedback (like "make button red") to a Markdown table under a `## $ Comments` tag.
3. Upon saying "continue," the agent parses the Markdown diff, correctly associating the feedback to the JSON structure based on the label, and proceeds to code generation. 

*Takeaway:* Interactive Markdown is superior to JSON for non-technical or rapid design iteration.

## 4. Code Generation "No-Magic-Number" Policy
A major risk mitigated in this plan was the leakage of raw Figma Hex codes and DP measurements into the final Swift implementation.
We instituted the golden rule:
- `figma-generator` first attempts to map JSON token variables against `figma-token-mapping.json`.
- If missing, it statically infers from `AppColors.swift` and `AppSpacing.swift`.
- If all fails, it falls back to a raw value, but mandates appending a strict compile-time warning: `// TODO: [UNMAPPED] Color #ABC123`. 
This guarantees all generated views (whether SwiftUI or SnapKit) remain compliant with the overarching Design System.


---

## Lessons Learned: iOS Skills ClaudeKit Consolidation
**Plan ID:** `260224-1530-ios-skills-claudekit-consolidation`
**Date Archived:** 2026-02-26

## Overview
This plan focused on migrating 30 disparate Axiom agents and 14 workflows from `.agent/` into the ClaudeKit 4-layer architecture within `.claude/`.

## Key Takeaways
1. **Hub & Spoke Pattern:** Consolidating highly specialized, fragmented agents (e.g., separate accessibility, memory, and concurrency auditors) into unified L2 Hubs (`ios-qa-flow`, `ios-builder`) dramatically improves routing clarity and reduces duplication. 
2. **Knowledge Extraction:** Transferring actionable knowledge into L4 domain skills (`ios-audit-rules`, `ios-build`) ensures that the structural data is decoupled from the agent logic.
3. **Safe Migration Strategy:** Leaving the legacy `.agent/` directory intact as deprecated, rather than outright deleting it during the transition, prevents immediate breaking changes and provides a fallback.
4. **Cost Efficiency:** Configuring the resulting Hub agents to use `model: sonnet` (or equivalent efficient models) strikes the right balance between processing capability and operational cost.


---

## Lessons Learned: iOS Toolkit Optimization
**Plan ID:** `260224-2000-ios-toolkit-optimization`
**Date Archived:** 2026-02-26

## Overview
This plan aimed to complete the 4-layer iOS toolkit by adding 2 hub agents (`ios-dev-flow`, `ios-monetization`), 2 commands, updating 2 new guide pages, and modifying the appropriate configuration files.

## Key Takeaways
1. **Execution Sequencing is Critical:** Creating the actual agent files (`Phase 2`) *before* updating the guide pages (`Phase 1`) and configs ensures that documentation correctly references tangible, existing files rather than theoretical ones. 
2. **Accepting Known Gaps over Forced Architecture:** Several skills (`ios-system-integration`, `ios-networking`) were purposefully left unrouted rather than cramming them into loosely related hubs. Documenting these as known gaps in `architecture.md` keeps the architecture clean (KISS principle) and defers them gracefully to a future backlog.
3. **Strict Boundary Scoping:** When encountering overlaps—such as `ios-debugging` overlapping with a general `debugger` agent—it is better to explicitly restrict the specialized agent's scope (e.g., iOS-specific Instruments, crash logs) to prevent agent collision and routing ambiguity.
4. **Maintained Standardization:** Keeping up with foundational UX patterns (e.g., ensuring `command-finder.html` visually represents all tools within bounded SVG coordinates and striving for the 10-page guide standard) maintains a high-quality developer experience.


---

## Lessons Learned: iOS Skill Consolidation
**Plan ID:** `260225-0030-ios-skill-consolidation`
**Date Archived:** 2026-02-26

## Overview
This major refactor consolidated 120 legacy `axiom-*` skills into 20 well-defined `ios-*` domain folders, expanded to 6 L2 Hub agents, and set up dynamic reference loading to solve identity confusion and configuration clutter.

## Key Takeaways
1. **Addressing Naming Duality:** Operating with two branding conventions (`axiom-*` and `ios-*`) causes measurable identity confusion for routing layers. Strictly standardizing onto `ios-*` eliminated this ambiguity.
2. **Mitigating Context Bloat via Granular Loading:** 120 skills loaded at once scales poorly. The adopted pattern—using a single `SKILL.md` index file for a domain that dynamically loads `references/*.md` granularly—proved highly effective at managing large volumes of documentation gracefully.
3. **Strict Sequential Deprecation:** With large scale code/knowledge base moves, a rigid sequential approach (Create New Domains -> Update Existing -> Create Hubs -> Update Configs -> Final Cleanup) prevented data loss and allowed verifiable integrity checks before the final 120-folder deletion phase.


---

## Lessons Learned: Axiom + Gemini Optimization
**Plan ID:** `axiom/gemini-optimization`
**Date Archived:** 2026-02-26

## Overview
This plan addressed severe context bloat from 131 Axiom skills and underutilized Gemini quota by implementing runtime skill filtering, explicit LLM model routing, and the `/ios-init` configuration command.

## Key Takeaways
1. **Model-Specific Routing:** Assigning tasks based on LLM strengths (Claude for Planning/Research/Review; Gemini for Implementation/Testing) creates an optimal balance between context handling, quota efficiency, and task aptitude.
2. **Protecting Core Dependencies:** Enforcing auto-inclusion of `CORE` template skills without requiring the user to explicitly define `extends` prevents broken environments and simplifies the developer onboarding experience (`/ios-init`).
3. **UX for Filtered State:** Instead of completely hiding disabled skills, showing them with a `[disabled]` tag provides a "soft filter" UI. This surfaces toolkit capabilities to the developer while keeping the active context window minimal.
4. **Graceful Degradation:** Implementing a 2-retry logic before utilizing a fallback model (e.g., reverting to Claude if Gemini fails) ensures reliability in automated task execution pipelines. 


---

## Lessons Learned: Architecture Reports & Brainstorms Archive
**Date Archived:** 2026-02-26
**Scope:** 20 brainstorm, research, and review reports from the `/plans/reports/` directory generated during the `ios-kit` and `claude-kit` consolidation processes.

## Overview
This document synthesizes the key insights, architectural decisions, and anti-patterns identified across numerous strategy and code review reports.

## Key Takeaways

### 1. Architecture & Orchestration
* **On-Demand Context Loading:** Consolidating 120+ micro-skills into domain folders with an index (`SKILL.md`) that dynamically loads specific `references/*.md` is the only sustainable way to prevent context bloat.
* **Specialist L2 Hubs prevent Monoliths:** When adding new routing paths, it is better to create focused L2 Hub agents (e.g., `ios-dev-flow`, `ios-media-flow`) rather than expanding existing hubs (`ios-qa-flow`) into monolithic routing bottlenecks.
* **Model-Specific Task Routing:** Explicitly routing tasks based on language model strengths (e.g., Claude for planning/review, Gemini for implementation/auditing) yields the best balance of context retention and cost efficiency.

### 2. Prompt Engineering & Reliability
* **Standardized Agent Examples:** Programmatic and reliable invocation of agents relies on keeping `<example>` blocks in prompts identically formatted. Variations (like prefixing with "Context:") degrade the autonomous tool selection.
* **Routing Table Optimization:** Duplications in an agent's intent classification table waste context tokens linearly with every invocation and risk confusing the routing engine if they diverge.

### 3. Product Direction & YAGNI
* **Focus on Immediate Bottlenecks:** System design brainstorms revealed that building overly complex abstractions (like full GitHub Issue-to-PR ADW pipelines) should be deferred. Focus must remain on the actual daily bottlenecks: the Figma-to-iOS pipeline, and the generated-code validation loop.
* **Standalone Toolkits:** The "Sidecar Toolkit" pattern (e.g., extracting Figma logic into its own complete architecture `FigmaKit` with L1 commands, L2 hubs, and L4 skills) allows features to scale without polluting the core iOS toolkit namespace.

### 4. Code & Documentation Sync
* **Documentation as Code:** Code reviewers consistently caught configuration drift, where the architecture docs, `CLAUDE.md`, and actual on-disk tools fell out of sync. Strictly maintaining documentation synchronously with architectural updates prevents broken routing endpoints.


---

## Track record

| Ngày | Hoạt động | Kết quả | Ghi chú |
|---|---|---|---|
| 2026-07-12 | Selective port engineer 2.20.0 → ios-kit (branch `port/engineer-2.20.0-into-ios-kit`, 8 commit) | held | Hooks/rules/agents/skills sync; integrity cleanup (refs 12→0, stow FAIL→PASS); validation GREEN. Giữ divergent forks (cook v3.0.0 ahead upstream). Token-budget debt (96/119) hoãn. |

Bài học khóa đợt này: khi upstream dùng namespace `ck:*` mà target de-namespace, scout inventory hay đoán sai "replace candidate" — phải verify frontmatter + diff-thật trước khi replace, nếu không sẽ đè mất customization cục bộ.

---
