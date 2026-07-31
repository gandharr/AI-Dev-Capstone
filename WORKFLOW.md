# AI Workflow Drill: Vague vs Precise Prompting

## Comparison

### Round 1: Vague Prompt
- **Prompt:** "Make a settings form"
- **Result:** A basic, uncontrolled or naive React form with simple state (`useState`), no field validation, no strict schema, and no accessibility features.
- **Time/Effort:** ~1 minute of prompting, but to get it production-ready would require a complete rewrite.
- **Diff:** The diff clearly highlights the addition of `react-hook-form` and `zod` for validation, structured form control, ARIA labels, and error messaging. The first round completely missed validation logic. 

### Round 2: Precise Prompt
- **Prompt:** Provided explicit file references, constraints (`react-hook-form` + `zod`, TailwindCSS), example behaviors (submit disabled until touched + valid), and a verification step (writing React Testing Library tests).
- **Result:** A production-ready form with robust, schema-driven validation, accessible error messages, loading states, and unit tests.
- **Time/Effort:** Writing the precise prompt took more upfront thought (~3-5 minutes), but the execution was completely end-to-end. I didn't have to manually refactor the form, add validation, or write tests from scratch. It was ultimately much faster.

### AI Mistakes Caught
During development (or similar workflows), a common AI mistake is forgetting to add `mode: 'onTouched'` to `useForm` when instructed to only validate on interaction, which can lead to aggressive early validation. By explicitly providing constraints and having the AI write and verify tests, this issue is avoided. Also, the AI might hallucinate invalid Tailwind classes if not explicitly constrained, which the tests/visual check will catch.

## Conclusion
Precise prompting with a plan-execute-verify loop is significantly faster for shipping production code than blindly accepting naive output and rewriting it.
