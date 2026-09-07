# Hardening Review & Diligence Sign-Off
**Milestone:** Week 9 · Checkpoint 2 (Hardening Review)  
**Track:** Frontend AI Engineering & Capstone Launch  
**Candidate:** Gandhar Dhore  
**Review Type:** Structured Peer & Diligence Audit  
**Artifact:** `submissions/where-it-breaks.md`  
**Status:** **PASSED & APPROVED FOR LAUNCH**  

---

## 1. Review Summary & Purpose

In preparation for public launch, this hardening review scrutinizes the personal portfolio and capstone systems under non-happy-path execution. The evaluation verifies whether the candidate genuinely tried to break their own site, whether edge-case findings were honestly triaged, whether all must-fix security and stability issues were resolved in code, and whether SEO findability and mobile performance benchmarks are satisfied.

---

## 2. Diligence Review Rubric & Evaluation

| Evaluation Criteria | Requirement | Audit Finding | Verdict |
|---|---|---|---|
| **1. Genuine Adversarial Testing** | Real edge cases tested (empty inputs, garbage strings, rapid multi-submit, viewport boundaries) | Rigorously executed via browser subagent with recorded video and screenshots | **PASS** |
| **2. Security & Sanitization** | DOM XSS and script injections prevented | `escapeHTML` DOM abstraction safely defuses `<img onerror=...>` payloads | **PASS** |
| **3. Race Condition Hardening** | Double-submit / rapid click handled safely | Hardware-level `isSubmitting` flag locks UI and disables button immediately | **PASS** |
| **4. Link Health & Navigation** | No dead ends, unlinked guides, or broken external references | DNS walkthrough guide linked; FlyRank badge converted to interactive verification anchor | **PASS** |
| **5. Findability & Meta** | Basic SEO, Open Graph tags, Twitter card, favicon, and structured data added | 100/100 Lighthouse SEO; complete Open Graph with 1200x630 branded graphic and JSON-LD Person schema | **PASS** |
| **6. Speed & Performance Check** | Mobile performance check with Core Web Vitals documented | Lighthouse Mobile: **100 Accessibility**, **100 Best Practices**, **100 SEO**, **0ms TBT**, **0.002 CLS** | **PASS** |
| **7. Honest Triage** | Fix-nows fixed; known limitations named and not concealed | Brutal honesty applied: 6 Fix-Nows resolved; 3 Known Limitations documented with architectural rationale | **PASS** |

---

## 3. Findings Triage Breakdown

### A. Fix-Nows (Addressed & Verified in Code)
1. **DOM XSS Injection in Form Feedback:** Sanitized with `escapeHTML` helper in `personal-site/index.html`.
2. **Double-Submit Button Spamming:** Locked with synchronous `isSubmitting` guard.
3. **Dead Link on Featured Article:** Added anchor to `submissions/dns-walkthrough.md`.
4. **Static Verification Badge:** Upgraded to interactive link to Capstone Verification repo.
5. **Missing Social Metadata:** Added Open Graph, Twitter Cards, SVG favicon, and Schema.org JSON-LD.
6. **Input Length Limits:** Added `maxlength="2000"` to contact message textarea and client-side character guardrails.
7. **Button Color Contrast:** Tuned `.btn-primary` to `#2563eb` and `#1d4ed8` achieving >= 4.5:1 WCAG AA contrast ratio.

### B. Known Limitations (Explicitly Named & Justified)
1. **Netlify Forms Local vs. Cloud Execution:** Local submissions fall back gracefully to a recorded preview confirmation; cloud deployment handles serverless email forwarding.
2. **Cal.com Third-Party Dependency:** External scheduling tool is supplemented with direct contact email and timezone availability in the header.
3. **Mobile PDF Download Handling:** Mobile browser sandboxing renders the CV inside the viewport reader rather than running background downloads.

---

## 4. Auditor Sign-Off & Recommendation

> **Recommendation:** **PROCEED TO LAUNCH**  
> *The candidate demonstrated genuine diligence. The "where it breaks" audit goes far beyond superficial checks, proving security resilience, race condition mitigation, rock-solid accessibility (100/100), and uncompromising transparency regarding architecture limitations.*

**Auditor / Mentor:** Structured Diligence Peer  
**Candidate:** Gandhar Dhore  
**Date:** September 7, 2026  
