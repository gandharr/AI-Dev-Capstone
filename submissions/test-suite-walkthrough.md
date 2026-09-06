# Automated Testing Suite & CI Verification (Build: Polish)

**GitHub Branch:** [https://github.com/gandharr/AI-Dev-Capstone/tree/feature/build-polish](https://github.com/gandharr/AI-Dev-Capstone/tree/feature/build-polish)  
**CI Workflow Run (Passing Green):** [https://github.com/gandharr/AI-Dev-Capstone/actions/runs/34020833169](https://github.com/gandharr/AI-Dev-Capstone/actions/runs/34020833169)  
**CI Screenshot Artifact:** [`submissions/ci-suite-green.png`](./ci-suite-green.png)

---

## 1. Test Files Submitted

| File | Type | What is Covered |
| :--- | :--- | :--- |
| [`capstone-app/src/components/chat/MessageBubble.test.tsx`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/capstone-app/src/components/chat/MessageBubble.test.tsx) | Component Test | User text bubble, markdown formatting (bold, lists), tool pending execution (`call`), tool completed scorecard (`result`), tool execution error card (`errorText`). |
| [`capstone-app/src/components/settings/SettingsForm.test.tsx`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/capstone-app/src/components/settings/SettingsForm.test.tsx) | Component Test | Validated form with accessible labels, required empty input alert, API key prefix validation (`AIza...`/`sk-...`), successful submit with status announcement. |
| [`capstone-app/src/components/chat/tools/ScoreLeadTool.test.tsx`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/capstone-app/src/components/chat/tools/ScoreLeadTool.test.tsx) | Component Test | Tool result component displaying metrics (score, company name, tier badge), tool failure state with accessible error alert. |
| [`capstone-app/src/components/chat/Chat.test.tsx`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/capstone-app/src/components/chat/Chat.test.tsx) | Component Test | **Pending state** (suggestions, greeting), **Streaming state** (stop button, live updates), **Error state** (error notice & retry button). Fully mocks `@ai-sdk/react`. |
| [`capstone-app/e2e/chat.spec.ts`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/capstone-app/e2e/chat.spec.ts) | Playwright E2E | Primary chat qualification flow: navigation to `/chat`, message submission, network-level AI route interception with mock SSE stream, UI rendering verification. |
| [`.github/workflows/ci.yml`](https://github.com/gandharr/AI-Dev-Capstone/blob/feature/build-polish/.github/workflows/ci.yml) | GitHub Actions CI | Automated CI pipeline running lint, Vitest unit suite, Playwright browser installation, and Playwright E2E suite on push and PR. |

---

## 2. Evaluation Criteria Checklist

* **At least six meaningful component tests; renaming a CSS class should not break them**:
  * We built **14 component tests** across 4 test suites.
  * Every test queries exclusively by accessible semantic roles and labels (`getByRole`, `getByLabelText`, `findByRole('alert')`, `findByRole('status')`). Zero `data-testid` and zero CSS class selectors are used, guaranteeing resilience to visual refactors.
* **Chat component tested across pending, streaming, and error states**:
  * Fully covered in `Chat.test.tsx` (tests pending suggestions, active streaming stop button, and error banner with retry trigger).
* **Mock the AI route in tests; never call the real API**:
  * Component tests mock `@ai-sdk/react`.
  * Playwright E2E tests intercept `**/api/chat` network requests and return simulated SSE streaming payloads.
* **One Playwright test covers the primary flow**:
  * Verified in `e2e/chat.spec.ts` against the Next.js dev server.
* **CI runs the suite on push and is green**:
  * GitHub Actions Run `#34020833169` completed with status `success`.
* **Autonomous AI test fix demonstrated**:
  * AI assistant ran the test suite, identified a jsdom `scrollTo` environment mismatch, applied a safe fallback in `use-auto-scroll.ts` and `vitest.setup.ts`, and verified all 14 tests passing green.
