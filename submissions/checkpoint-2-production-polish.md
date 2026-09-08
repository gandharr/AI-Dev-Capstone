# Phase Build (Polish) · Checkpoint 2: Production Promotion & Final README

> **Phase:** Build (polish) · Checkpoint 2  
> **Candidate:** Gandhar Dhore — AI & Full-Stack Engineer  
> **Production Live URL:** [https://ai-dev-capstone.vercel.app/](https://ai-dev-capstone.vercel.app/)  
> **Interactive Chat Experience:** [https://ai-dev-capstone.vercel.app/chat](https://ai-dev-capstone.vercel.app/chat)  
> **Personal Portfolio URL:** [https://gandhar-dhore.netlify.app/](https://gandhar-dhore.netlify.app/)  
> **Git Branch:** `feature/build-polish`  
> **Date:** September 8, 2026  

---

## 1. Executive Summary & Why It Matters

> *"A public URL that works and a README a recruiter can follow are the two artifacts that keep working for you after graduation."*

This milestone transitions the AI Lead Qualification Agent from a staged project into a hardened, production-ready system. We have:
1. Promoted the application to production on Vercel with verified HTTPS edge deployments.
2. Hardened the streaming AI route against public credit exhaustion via **sliding-window IP rate limiting**, **message character caps**, and **history depth limits**.
3. Authored the **publication-grade README** (`README.md`) enabling any reviewer to clone and run the application with zero friction or external API dependencies.
4. Cleaned and structured the Git history using **Conventional Commits 1.0.0**.

---

## 2. Live Production Deployments & Cross-Browser Verification

The companion application is live and publicly accessible on Vercel Edge with zero authentication gates on the core demo flow:

- **Root Application:** [`https://ai-dev-capstone.vercel.app/`](https://ai-dev-capstone.vercel.app/)
- **Chat Copilot:** [`https://ai-dev-capstone.vercel.app/chat`](https://ai-dev-capstone.vercel.app/chat)
- **3D Neural Core:** [`https://ai-dev-capstone.vercel.app/3d`](https://ai-dev-capstone.vercel.app/3d)

### Cross-Browser Matrix:

| Browser / Environment | Engine | Resolution / Viewport | Result | Notes |
|---|---|---|---|---|
| **Google Chrome (Desktop)** | Blink 128 | 1920 x 1080 | **PASS** | Full SSE streaming, Generative UI tool cards render instantly. |
| **Mozilla Firefox (Desktop)** | Gecko 129 | 1440 x 900 | **PASS** | CSS Grid & Flexbox alignment verified, smooth tool card animation. |
| **Apple Safari (macOS / WebKit)** | WebKit 17 | 1440 x 900 | **PASS** | Native font rendering, zero hydration mismatch. |
| **Mobile Safari (iOS iPhone 15)** | WebKit Mobile | 393 x 852 | **PASS** | Touch targets >= 48px, keyboard avoidance, responsive SVG charts. |

---

## 3. Production Hygiene & Abuse Protection

To prevent strangers or automated bots from draining Gemini API credits or executing prompt injection denial-of-service attacks, `/api/chat` enforces three layers of server-side defense:

```
[Incoming Request] ──> [1. IP Sliding Window Rate Limiter] (12 req/min)
                           │
                           ├── Exceeded? ──> 429 Too Many Requests (Retry-After: 60)
                           │
                       [2. Payload Validation & History Depth] (<= 25 messages)
                           │
                           ├── Exceeded? ──> 400 Bad Request
                           │
                       [3. Message Character Cap] (<= 1,500 chars/msg)
                           │
                           ├── Exceeded? ──> 400 Bad Request
                           │
                       [4. Streaming Execution maxDuration = 30s] ──> [Gemini / Mock Cascade]
```

### Implementation Highlights (`capstone-app/src/app/api/chat/route.ts`):
1. **Sliding-Window IP Rate Limiter:**
   - Tracks requests per client IP within a 60-second sliding window.
   - Throttles at **12 requests / minute**.
   - Returns `HTTP 429 Too Many Requests` with `Retry-After: 60` and actionable JSON error details.
2. **Conversation History Depth Cap:**
   - Strictly limits conversation arrays to **25 messages**, preventing quadratic context token explosion.
3. **Input Length Cap:**
   - Caps individual message text at **1,500 characters**, preventing prompt-injection DOS attacks.
4. **Execution maxDuration:**
   - Configured with `export const maxDuration = 30;` to ensure serverless edge invocations terminate predictably.

---

## 4. Automated Testing & Verification Proof

Our Vitest test suite verifies both UI components and the new abuse protection safeguards:

```
 RUN  v4.1.11 C:/Users/dhore/OneDrive/Desktop/AI-Dev/capstone-app

 ✓ src/app/api/chat/route.test.ts (4 tests)
     ✓ rejects requests with malformed or non-array messages with HTTP 400
     ✓ rejects conversation histories exceeding 25 messages with HTTP 400
     ✓ rejects messages exceeding 1,500 characters with HTTP 400
     ✓ triggers HTTP 429 rate limiting when requests exceed threshold for an IP
 ✓ src/components/chat/tools/ScoreLeadTool.test.tsx (2 tests)
 ✓ src/components/chat/MessageBubble.test.tsx (5 tests)
 ✓ src/components/chat/Chat.test.tsx (3 tests)
 ✓ src/components/settings/SettingsForm.test.tsx (4 tests)

 Test Files  5 passed (5)
      Tests  18 passed (18)
   Duration  9.32s
```

---

## 5. Final Publication-Grade README Structure

The real README has been authored in the workspace root (`README.md`) and updated in `capstone-app/README.md`:

- **Section 1: What It Does** — Plain-English executive summary of the Autonomous Lead Qualification Agent, Generative UI tool cards, and market trend charts.
- **Section 2: Visual Proof** — Screenshots of tool cards, 3D Neural Core, and shader hero.
- **Section 3: Run Instructions** — Frictionless 3-step clone & run guide with zero-config fallback mode.
- **Section 4: Environment Variables Table** — Documenting all variables (`GOOGLE_GENERATIVE_AI_API_KEY`, `NODE_ENV`, `PORT`).
- **Section 5: System Architecture** — Mermaid flowchart of the App Router, React 19 Client Tier, Serverless API Tier, and Resilient Cascade.
- **Section 6: Decisions & Rationale** — Honest trade-off matrix explaining Next.js 16, inline SVG charts, and mock resilience.
- **Section 7: "How AI Tools Built This"** — Specific, concrete technical breakdown detailing the division of labor between AI generation (Zod schemas, GLSL formulas, test scaffolding) and human engineering (domain scoring math, XSS sanitization, WCAG contrast audits).

---

## 6. Git History Hygiene

All commits on `feature/build-polish` follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification:

- `feat(polish): add production hygiene rate limiting, input caps, and final comprehensive README`
- `fix(settings): add missing SettingsForm import to resolve build type error`
- `docs: add test-suite-walkthrough.md submission file`
- `docs: add CI green test suite passing screenshot`
- `feat(test): set up Vitest, RTL component test suites, Playwright E2E, and GitHub Actions CI`
