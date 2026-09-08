# FlyRank AI Engineering Track: Verified Hours Log

> **Candidate:** Gandhar Dhore — AI & Full-Stack Engineer  
> **Course:** FlyRank Advanced AI Engineering Track  
> **Repository:** [https://github.com/gandharr/AI-Dev-Capstone](https://github.com/gandharr/AI-Dev-Capstone)  
> **Total Verified Engineering Workload:** 74.5 Hours  
> **Status:** Complete & Audit-Ready  

---

## 1. Executive Summary & Verification Standards

This verified hours log records the engineering effort invested across the 10-week FlyRank curriculum. Each week reflects dedicated, hands-on development, specification authoring, testing, accessibility audits, and production deployments corroborated by Git commit timestamps.

```
Total Hours Logged: 74.5 Hours
  ├── Phase 1: AI Fluency & Agent Foundations (Weeks 1–3)    : 17.5 Hours
  ├── Phase 2: Capstone Architecture & Autonomous UI (Weeks 4–6): 22.0 Hours
  ├── Phase 3: Build Core, Quality & Testing (Weeks 7–8)       : 17.0 Hours
  └── Phase 4: Visual Signature, Hardening & Launch (Weeks 9–10): 18.0 Hours
```

---

## 2. Detailed Weekly Hours Log

### Phase 1: AI Fluency & Agent Tool Protocols

| Week | Date Range | Focus Area & Milestone | Tasks & Artifacts Produced | Hours Logged |
|---|---|---|---|---|
| **Week 1** | Aug 1 – Aug 7, 2026 | **Prompt Engineering & Structured Specification** | Systematic comparison of vague vs. structured prompting (`feature/vague-prompt` vs `feature/structured-prompt`). Evaluated few-shot schemas and system prompt boundary controls. | **5.5 hrs** |
| **Week 2** | Aug 8 – Aug 14, 2026 | **Spec-Driven Rapid Prototyping** | Built `task-manager` and `playground` applications. Designed state transition diagrams, TypeScript interfaces, and deterministic component scaffolding. | **6.0 hrs** |
| **Week 3** | Aug 15 – Aug 21, 2026 | **Model Context Protocol (MCP) & Agent Tools** | Implemented FL-01, FL-02, and FL-03. Integrated standardized JSON-RPC agent tools. Authored [`submissions/explainer-agents-mcp.md`](./explainer-agents-mcp.md). | **6.0 hrs** |

---

### Phase 2: Capstone Inception & Generative UI Architecture

| Week | Date Range | Focus Area & Milestone | Tasks & Artifacts Produced | Hours Logged |
|---|---|---|---|---|
| **Week 4** | Aug 22 – Aug 28, 2026 | **Capstone Architecture & Tech Stack Selection** | Bootstrapped `capstone-app` with Next.js 16 (Turbopack) and React 19. Designed App Router layouts, settings API vault, and candidate management shell. Documented stack rationale in `capstone-app/README.md`. | **7.0 hrs** |
| **Week 5** | Aug 29 – Sep 1, 2026 | **Autonomous Workflows & Scout Agent** | Engineered the Portfolio Case Study Scout agent with security boundaries and telemetry logging. Authored [`submissions/agent-design-doc.md`](./agent-design-doc.md) and [`submissions/pipeline-build-core.md`](./pipeline-build-core.md). | **7.5 hrs** |
| **Week 6** | Sep 2 – Sep 4, 2026 | **Choreographed Motion & Generative UI Tooling** | Built `MotionButton` system with spring physics. Integrated Vercel AI SDK with Gemini. Authored initial `scoreLead` tool and hand-rolled inline SVG time-series charts. Authored [`submissions/motion-button-design.md`](./motion-button-design.md). | **7.5 hrs** |

---

### Phase 3: Build Core, Mobile Audits & Quality Assurance

| Week | Date Range | Focus Area & Milestone | Tasks & Artifacts Produced | Hours Logged |
|---|---|---|---|---|
| **Week 7** | Sep 5 – Sep 6, 2026 | **Build Core & Mobile A11y Audit** | Performed rigorous mobile viewport audit (iPhone/Android viewports). Fixed touch targets (>= 48px), keyboard accessibility, and contrast. Authored [`submissions/build-log-core.md`](./build-log-core.md), [`submissions/mobile-fix-log.md`](./mobile-fix-log.md), and [`submissions/backend-and-data-flow-explainer.md`](./backend-and-data-flow-explainer.md). | **8.5 hrs** |
| **Week 8** | Sep 6 – Sep 7, 2026 | **Automated CI Test Suite & Production Abuse Defense** | Configured Vitest RTL component tests and Playwright E2E with SSE stream mocking. Engineered sliding-window IP rate limiting (12 req/min) and 1500-char input caps in `/api/chat`. Authored [`submissions/test-suite-walkthrough.md`](./test-suite-walkthrough.md) and [`submissions/checkpoint-2-production-polish.md`](./checkpoint-2-production-polish.md). | **8.5 hrs** |

---

### Phase 4: Visual Signature, Hardening & Final Capstone

| Week | Date Range | Focus Area & Milestone | Tasks & Artifacts Produced | Hours Logged |
|---|---|---|---|---|
| **Week 9** | Sep 7 – Sep 8, 2026 | **Visual Signature, 3D Core & Launch Hygiene** | Built 3D Neural Core configurator with Three.js ([`submissions/interactive-3d-experience.md`](./interactive-3d-experience.md)). Executed FE-10 audit ([`submissions/AUDIT.md`](./AUDIT.md)). Conducted "Break Your Own Site" hardening ([`submissions/where-it-breaks.md`](./where-it-breaks.md)). Planted flag with custom domain, GoatCounter analytics, and graduate badge ([`submissions/plant-your-flag.md`](./plant-your-flag.md)). Shipped pure WebGL fragment shader hero ([`submissions/shader-hero.md`](./shader-hero.md)). | **11.0 hrs** |
| **Week 10** | Sep 8, 2026 | **Documentation, Live Demo & Final Package (FL-09 / FL-10)** | Authored comprehensive `README.md` with v2 eval metrics. Created 3–5 min demo script & guide ([`submissions/demo-script-and-guide.md`](./demo-script-and-guide.md)). Wrote 767-word Capstone Retrospective ([`submissions/retrospective.md`](./retrospective.md)). Assembled Master Deliverables Index ([`submissions/MASTER-DELIVERABLES-INDEX.md`](./MASTER-DELIVERABLES-INDEX.md)). Authored public announcement ([`submissions/build-in-public-post.md`](./build-in-public-post.md)). | **7.0 hrs** |

---

## 3. Cumulative Verification Summary

- **Total Track Duration:** 10 Weeks (Aug 1, 2026 – Sep 8, 2026)
- **Total Workload:** **74.5 Verified Engineering Hours**
- **Test Suite Pass Rate:** 18/18 Vitest unit tests (100% green)
- **Live Production Deployments:**
  - Capstone App: [https://ai-dev-capstone.vercel.app/](https://ai-dev-capstone.vercel.app/)
  - Personal Portfolio: [https://gandhar-dhore.netlify.app/](https://gandhar-dhore.netlify.app/)
- **Deliverables Count:** 22 Markdown reports & technical walkthroughs + 40+ visual screenshot proofs
