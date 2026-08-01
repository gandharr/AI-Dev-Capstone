# Project Rules

1. **Forms and Validation:** Always use `react-hook-form` combined with `zod` schema validation. Do not use plain uncontrolled inputs or manual state-based validation.
2. **Component Testing:** All new UI components must be accompanied by a React Testing Library test file (`.test.jsx`). The tests must verify accessibility roles (e.g., `screen.getByRole`) and error states, not just the happy path.
3. **Strict Validation Timing:** Form validation should trigger on interaction (e.g., `mode: 'onTouched'` or `onBlur`) to avoid aggressively highlighting empty inputs before the user has a chance to type. Disable submit buttons while submitting and ensure proper loading states.