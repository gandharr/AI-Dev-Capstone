# Capstone Portfolio Entry: Production AI Lead Qualification Agent

> **Candidate:** Gandhar Dhore — AI & Full-Stack Engineer  
> **Course:** FlyRank AI Engineering Track — Final Capstone  
> **Repository:** [https://github.com/gandharr/AI-Dev-Capstone](https://github.com/gandharr/AI-Dev-Capstone)  
> **Active Branch:** `feature/fl-10-capstone`  
> **Date:** September 9, 2026  

---

## 1. Project Brief

**The AI Lead Qualification Agent & Autonomous Screening Copilot** is a production-grade Generative UI web application that eliminates the 15+ hours B2B sales and recruiting teams spend each week manually reviewing unstructured prospect messages, querying CRM data, and calculating qualification scores. Designed for high-velocity revenue and talent acquisition teams who need instant, deterministic assessments without wading through conversational fluff, the application allows prospects to interact with an AI interviewer that doesn't just chat, but autonomously executes typed backend tools—scoring lead fit, analyzing market benchmarks, and rendering interactive, accessible SVG trend charts directly in the stream. I chose this idea because text-only chatbots fail modern enterprise workflows; turning semantic user intent into structured, visual data cards with resilient fallbacks bridges the gap between raw LLM intelligence and real software engineering.

---

## 2. Live, Deployed Application

* **Primary Application (Production Edge):** [https://ai-dev-capstone.vercel.app/](https://ai-dev-capstone.vercel.app/)
* **Interactive AI Chat & Tool Execution Flow:** [https://ai-dev-capstone.vercel.app/chat](https://ai-dev-capstone.vercel.app/chat)
* **Interactive 3D Neural Core Configurator:** [https://ai-dev-capstone.vercel.app/3d](https://ai-dev-capstone.vercel.app/3d)
* **Engineer Portfolio & Fragment Shader Hero:** [https://gandhar-dhore.netlify.app/](https://gandhar-dhore.netlify.app/)

### Accessibility & Functionality Verification
* **Functional Guarantee:** The application is fully interactive and runs in production. Clicking suggested prompts (e.g. *"I represent an enterprise healthcare company with 500 seats"*) triggers real-time SSE streaming, autonomously executes the `scoreLead` tool, and renders an interactive scorecard.
* **WCAG 2.1 AA Standards:** 
  * All interactive buttons, text inputs, and suggestion chips meet or exceed the **48x48px touch target** standard.
  * Contrast ratio exceeds **7:1 (WCAG AAA)** across light and dark tokens.
  * Keyboard navigation supported via skip-to-main link (`#main-content`), explicit focus rings (`focus:ring-2 focus:ring-cyan-500`), and `aria-live="polite"` stream announcements.

---

## 3. Repository with Complete README

* **GitHub Repository:** [https://github.com/gandharr/AI-Dev-Capstone](https://github.com/gandharr/AI-Dev-Capstone)
* **Full Production README:** [README.md](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/fl-10-capstone/README.md)

### Setup & Local Run Instructions (Reproducible in < 3 Minutes)
```bash
# 1. Clone the repository
git clone https://github.com/gandharr/AI-Dev-Capstone.git
cd AI-Dev-Capstone/capstone-app

# 2. Install dependencies (strictly managed package-lock)
npm install

# 3. Start development server (Turbopack enabled)
npm run dev
# App is immediately live at http://localhost:3000
```
> **Zero-Config Resilient Fallback:** If no `GOOGLE_GENERATIVE_AI_API_KEY` is provided, the application seamlessly activates an internal deterministic `MockLanguageModelV4`, allowing evaluators to experience full tool calling, scoring algorithms, and SVG rendering offline.

### System Architecture Overview
```
┌──────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                     │
├───────────────────────────────┬──────────────────────────────┤
│ Client Tier (React 19)        │ Server Tier (Edge Runtime)   │
│ - Chat Interface & Hooks      │ - POST /api/chat             │
│ - Generative UI Components    │ - IP Sliding-Window Limiter  │
│   • ScoreLeadTool Card        │ - Input & History Validator  │
│   • MarketTrendChart (SVG)    │ - Google Gemini 2.5 Flash    │
│   • MessageBubble             │ - Resilient Mock Cascade     │
└───────────────────────────────┴──────────────────────────────┘
```

### Meaningful AI Integration & Structured Tool Execution
* **Why an LLM?** Natural human conversation is inherently unstructured and ambiguous. The LLM acts as an autonomous semantic classifier, mapping messy conversational statements into strict typed parameters for deterministic tools.
* **Tools Defined with Zod:**
  1. `scoreLead`: Computes a 0–100 qualification index based on company size, budget, and deployment timeline.
  2. `searchKnowledgeBase`: Queries corporate documentation, SLA tiers, and pricing matrices.
* **System Prompt Guardrails:** Explicitly directs the model to behave as a senior solutions architect, probe for qualification criteria, and invoke tools immediately when criteria are met rather than emitting conversational platitudes.

### Known Limitations & Roadmap
1. **In-Memory Rate Limiting:** Current rate limiter uses an in-memory `Map` suitable for single-region edge instances. *Roadmap:* Upgrade to distributed Upstash Redis for global multi-region consistency.
2. **Context Window Depth:** Capped at 25 messages to avoid quadratic token costs on public demos.
3. **Session Persistence:** State is currently client-side in React state. *Roadmap:* Add PostgreSQL / Prisma vector persistence for cross-session resume.

---

## 4. Testing Evidence

### Test Suite Execution Output (18/18 Passing Across 5 Suites)
```bash
$ npm test -- --run

 RUN  v4.1.11 C:/Users/dhore/OneDrive/Desktop/AI-Dev/capstone-app

 ✓ src/app/api/chat/route.test.ts (4 tests) 383ms
     ✓ rejects requests with malformed or non-array messages with HTTP 400
     ✓ rejects conversation histories exceeding 25 messages with HTTP 400
     ✓ rejects messages exceeding 1,500 characters with HTTP 400
     ✓ triggers HTTP 429 rate limiting when requests exceed threshold for an IP
 ✓ src/components/chat/tools/ScoreLeadTool.test.tsx (2 tests) 467ms
     ✓ renders completed tool output with score, company name, and tier
     ✓ handles missing optional parameters gracefully
 ✓ src/components/settings/SettingsForm.test.tsx (4 tests) 2103ms
     ✓ renders the form with accessible labels and submit button
     ✓ displays error alert when key prefix is invalid
     ✓ successfully validates and invokes onSave callback with valid key
 ✓ src/components/chat/MessageBubble.test.tsx (5 tests) 288ms
 ✓ src/components/chat/Chat.test.tsx (3 tests) 620ms
     ✓ renders pending/empty state with suggestions and triggers send on click

 Test Files  5 passed (5)
      Tests  18 passed (18)
   Duration  9.32s
```

### End-to-End Test Verification (Playwright)
* **File:** `capstone-app/e2e/chat.spec.ts`
* **Flow Verified:** Loads `/chat`, verifies empty state suggestion chips, simulates user query, asserts SSE stream handling, and verifies that the `ScoreLeadTool` DOM card renders with score and tier badges.

---

## 5. Performance & Accessibility Audit

### Lighthouse Audit Scores (Production URL: `https://ai-dev-capstone.vercel.app/`)
* **Performance:** **92 / 100** (Mobile) | **98 / 100** (Desktop)
* **Accessibility:** **100 / 100**
* **Best Practices:** **100 / 100**
* **SEO:** **100 / 100**

### Accessibility Audit (WAVE & axe DevTools)
* **Violations Found:** **0 errors, 0 contrast warnings**.
* **Form Labels & Inputs:** Every input possesses explicit `<label for="...">` associations and `aria-describedby` error bindings.

### Concrete Improvement Made Based on Audit Findings:
* **The Issue:** Initial mobile Lighthouse testing flagged touch target overlap on suggestion chips (< 36px) and missing keyboard bypass navigation for screen readers.
* **The Fix:** 
  1. Increased suggestion chip padding to `min-h-[48px]` and added explicit `aria-label` tags.
  2. Implemented a keyboard-accessible `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` link at the root layout.
  3. Added `aria-live="polite"` container wrapping the message list so newly streamed chunks are announced without interrupting screen reader users.

---

## 6. Deployment & Operation Checklist

### Production Checklist (Signed Off)
| Check | Requirement | Verified Status |
|---|---|:---:|
| **Environment Variables** | `GOOGLE_GENERATIVE_AI_API_KEY` set in Vercel Production Environment | **PASS** |
| **Abuse Protection** | Sliding-window IP limiter (12 req/min) active with HTTP 429 response | **PASS** |
| **Payload Guardrails** | Message text <= 1,500 chars, conversation array <= 25 items | **PASS** |
| **Execution Caps** | `export const maxDuration = 30;` set on edge streaming routes | **PASS** |
| **Cross-Browser** | Tested on Chrome, Firefox, Safari Desktop, and iOS Mobile Safari | **PASS** |
| **SSL / HTTPS** | TLS 1.3 edge termination with strict HTTP Strict Transport Security (HSTS) | **PASS** |

### Safe Failure & Error States
* **API Key Missing / Exhausted:** Seamless fallback to `MockLanguageModelV4`; user never sees an ugly white screen or broken JSON dump.
* **Rate Limit Exceeded:** Emits HTTP 429 with `{ error: "Rate limit exceeded. Please wait 60s." }` and `Retry-After: 60` header, rendered as a dismissible amber toast in the UI.
* **Network Disconnection:** Offline toast notification with retry button.

### Rollback Plan & Monitoring
* **Instant Rollback:** Vercel atomic immutable deployments enable 1-click instantaneous rollback to the previous deployment SHA (`c3c9479` / `2998512`) without rebuilding.
* **Telemetry & Monitoring:** Edge runtime logs monitored via Vercel Real-time Observability + GoatCounter privacy-friendly analytics tracking visitor telemetry without cookies.

---

## 7. Reflection

### What Was Hardest? Why?
The single hardest architectural challenge was choreographing **streaming Generative UI with asynchronous tool execution**. Streaming raw text from an LLM via Server-Sent Events (SSE) is straightforward, but streaming partial JSON chunks while an AI decides to invoke `scoreLead`, awaiting the tool's execution, and dynamically rendering a React 19 component inside a scrolling chat list without causing layout thrashing or hydration mismatches required three separate iterations of the `Chat.tsx` state machine.

### What Would You Do Differently Next Time?
Next time, I would design the **rate limiting and session caching layer with distributed Redis from Day 1**. Relying on in-memory maps during early prototyping required a full rewrite during the production polish phase to account for serverless cold starts and multi-region routing.

### One Thing Learned That Surprised You:
What surprised me most was that **building the AI prompt was only 10% of the work; the remaining 90% was traditional frontend and systems engineering**—input sanitization, sliding-window throttling, WCAG contrast ratios, error boundaries, and mock cascades. AI doesn't replace software engineering; it drastically raises the stakes for robust software architecture.

---

## Final Verification Summary
* **Live App:** [https://ai-dev-capstone.vercel.app/chat](https://ai-dev-capstone.vercel.app/chat)
* **GitHub Branch:** `feature/fl-10-capstone`
* **Test Suite:** 18/18 Unit Tests Passing • Playwright E2E Verified • Lighthouse 92+
