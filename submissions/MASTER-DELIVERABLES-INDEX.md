# FlyRank AI Engineering Track: Master Deliverables Index

> **Candidate:** Gandhar Dhore — AI & Full-Stack Engineer  
> **Repository:** [https://github.com/gandharr/AI-Dev-Capstone](https://github.com/gandharr/AI-Dev-Capstone)  
> **Final Capstone Branch:** `feature/fl-10-capstone`  
> **Production Live Web App:** [https://ai-dev-capstone.vercel.app/](https://ai-dev-capstone.vercel.app/)  
> **Live Personal Portfolio:** [https://gandhar-dhore.netlify.app/](https://gandhar-dhore.netlify.app/)  
> **Date of Completion:** September 8, 2026  

---

## 🗺️ Curriculum Architecture & Deliverables Directory

This master index maps every deliverable from all 10 weeks of the FlyRank AI Engineering Track, providing direct links to verified code artifacts, technical documentation, architectural walkthroughs, and live production endpoints.

---

### Weeks 1–3: AI Fluency Foundations & Agent Protocols

| Week | Milestone / Assignment | Deliverable Document | Core Artifacts & Proof | Status |
|---|---|---|---|---|
| **Week 1** | **Prompting Fundamentals & Structured Specification** | `feature/vague-prompt` vs `feature/structured-prompt` | System prompts, few-shot prompt chaining, comparative eval outputs | **VERIFIED** |
| **Week 2** | **Spec-Driven Rapid Prototyping** | `task-manager`, `playground` | Initial state machines, component architecture scaffolding | **VERIFIED** |
| **Week 3** | **Agent Tool Integration & Model Context Protocol (MCP)** | [`explainer-agents-mcp.md`](./explainer-agents-mcp.md) | Standardized JSON-RPC tool contracts, MCP server wrappers, protocol explainer | **VERIFIED** |

---

### Weeks 4–6: Capstone Inception, Autonomous Agents & Generative UI

| Week | Milestone / Assignment | Deliverable Document | Core Artifacts & Proof | Status |
|---|---|---|---|---|
| **Week 4** | **Capstone Inception & Tech Stack Rationale** | [`README.md`](../README.md#key-architectural-decisions--rationale) | Next.js 16 (Turbopack), React 19, Vercel AI SDK, Google Gemini cascade | **VERIFIED** |
| **Week 5** | **Portfolio Case Study Scout Agent** | [`agent-design-doc.md`](./agent-design-doc.md) & [`pipeline-build-core.md`](./pipeline-build-core.md) | Autonomous crawler pipeline, security boundaries, telemetry logging | **VERIFIED** |
| **Week 6** | **Choreographed Motion & Generative UI Tool Execution** | [`motion-button-design.md`](./motion-button-design.md) | Physics-based spring animations, `scoreLead` scorecard, hand-rolled SVG time-series charts | **VERIFIED** |

---

### Weeks 7–8: Build Core, Quality Assurance & Production Hygiene

| Week | Milestone / Assignment | Deliverable Document | Core Artifacts & Proof | Status |
|---|---|---|---|---|
| **Week 7** | **Build Core & Mobile Audit Pass** | [`build-log-core.md`](./build-log-core.md) & [`mobile-fix-log.md`](./mobile-fix-log.md) | Viewport responsiveness, touch target fixes (>= 48px), DNS walkthrough ([`dns-walkthrough.md`](./dns-walkthrough.md)) | **VERIFIED** |
| **Week 7** | **Design Review Crit & Data Flow Explainer** | [`design-review-crit.md`](./design-review-crit.md) & [`backend-and-data-flow-explainer.md`](./backend-and-data-flow-explainer.md) | Proof chip, reassurance metadata, backend SSE data flow architecture | **VERIFIED** |
| **Week 8** | **Comprehensive Test Suite & CI Automation** | [`test-suite-walkthrough.md`](./test-suite-walkthrough.md) | Vitest RTL unit suites, Playwright E2E with SSE stream mocking, GitHub Actions CI workflow | **VERIFIED** |
| **Week 8** | **Production Hygiene, Abuse Protection & Rate Limiting** | [`checkpoint-2-production-polish.md`](./checkpoint-2-production-polish.md) | Sliding-window IP rate limiter (12 req/min), 1500-char input cap, conversation depth cap | **VERIFIED** |

---

### Weeks 9–10: Visual Signature, Hardening & Final Capstone Sign-off

| Week | Milestone / Assignment | Deliverable Document | Core Artifacts & Proof | Status |
|---|---|---|---|---|
| **Week 9** | **Interactive 3D Neural Core Configurator** | [`interactive-3d-experience.md`](./interactive-3d-experience.md) | Three.js WebGL geometry, PBR materials, custom GLB/GLTF drag-and-drop loader, layer explosion | **VERIFIED** |
| **Week 9** | **FE-10 Performance & Accessibility Audit** | [`AUDIT.md`](./AUDIT.md) | Lighthouse Mobile 92+ / Desktop 98, zero WAVE errors, keyboard skip-to-main navigation | **VERIFIED** |
| **Week 9** | **"Break Your Own Site" & Hardening Review** | [`where-it-breaks.md`](./where-it-breaks.md) & [`hardening-review.md`](./hardening-review.md) | Boundary testing: empty inputs, rapid double-submits, XSS sanitization, edge-case triage | **VERIFIED** |
| **Week 9** | **Launch Hygiene, Custom Domain & Analytics** | [`plant-your-flag.md`](./plant-your-flag.md) | Production HTTPS SSL/HSTS, GoatCounter analytics, FlyRank Graduate Badge in footer | **VERIFIED** |
| **Week 9** | **Fullscreen Cyber Aurora Fragment Shader Hero** | [`shader-hero.md`](./shader-hero.md) | Pure GLSL fragment shader, `u_time`/`u_mouse`/`u_resolution`, capped DPR, prefers-reduced-motion fallback | **VERIFIED** |
| **Week 10** | **Assignment 8.1 (FL-09): Documentation & Live Demo** | [`demo-script-and-guide.md`](./demo-script-and-guide.md) & [`README.md`](../README.md) | Stranger-reproducible README, v2 eval results, known limitations, 3–5 min video demo script | **VERIFIED** |
| **Week 10** | **Assignment 8.2 (FL-10): Final Capstone Retrospective** | [`retrospective.md`](./retrospective.md) | 500–800 word reflection for Week 1 self (shifts, next builds, 3 transferable skills) | **VERIFIED** |
| **Week 10** | **Assignment 8.2 (FL-10): Verified Hours Log** | [`hours-log.md`](./hours-log.md) | Audit-ready log of ~72 verified engineering hours across all phases | **VERIFIED** |
| **Week 10** | **Assignment 8.2 (FL-10): Build-in-Public Post** | [`build-in-public-post.md`](./build-in-public-post.md) | Public LinkedIn/X launch post explaining one real decision and one limitation | **VERIFIED** |

---

## 🎯 Verification Matrix & Rubric Compliance

- [x] **Every deliverable present:** All 22 technical documentation files and corresponding visual proofs are present in `submissions/` and reachable from this index.
- [x] **Public Production URLs:**
  - Capstone Application: [`https://ai-dev-capstone.vercel.app/`](https://ai-dev-capstone.vercel.app/)
  - Interactive Chat Flow: [`https://ai-dev-capstone.vercel.app/chat`](https://ai-dev-capstone.vercel.app/chat)
  - Personal Portfolio & Shader Hero: [`https://gandhar-dhore.netlify.app/`](https://gandhar-dhore.netlify.app/)
- [x] **Reproducible Setup:** Stranger-tested 3-step clone & run with zero-config resilient mock fallback.
- [x] **Honest Engineering Boundaries:** Rate limiting and context depth limitations documented publicly in `README.md` and explained on camera.
- [x] **AI Transparency Diligence:** Explicitly named what AI tools built and what human engineering verified.
