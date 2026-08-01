# Component Accessibility & Implementation Notes

This document compares hand-rolled accessible React components against their robust library equivalents (shadcn/ui + Radix UI) to identify concrete gaps and better understand what modern component libraries handle under the hood.

## Concrete Gaps in My Custom Implementations

While my custom components implement the basic W3C ARIA Authoring Practices (roles, basic keyboard navigation, focus trapping), reading the generated `shadcn/ui` source code and understanding the underlying Radix primitives reveals several areas where the hand-rolled implementations fall short:

### 1. The Modal (Dialog)
*   **Body Scroll Locking**: My custom modal traps keyboard focus, but it completely misses scroll locking. A user can still scroll the background page (`<body>`) while the modal is open. Radix UI (used by shadcn) handles this gracefully by removing the scrollbar and adding padding to prevent layout shift.
*   **DOM Portals**: My implementation renders the modal in-place where it's declared in the component tree. This makes it vulnerable to parent `z-index` contexts or `overflow: hidden` properties. Shadcn/ui uses a `DialogPortal` to render the modal at the root of the document, completely bypassing these CSS stacking context issues.
*   **Screen Reader Text**: Shadcn includes `<span className="sr-only">Close</span>` on its `X` icon button. My custom implementation just had a text button, but if I had used an icon, I would have likely forgotten the visually hidden descriptive text that screen readers need.
*   **Robust Dismissal**: My click-outside logic relies on an `onClick` event on the overlay background. Radix UI provides a dedicated `DismissableLayer` that handles complex scenarios, like nested dialogs and preventing dismissal when dragging the mouse from inside to outside the modal.

### 2. Tabs
*   **Roving tabindex and Focus Handling**: While my custom tabs handle left/right arrow keys to switch tabs, they don't properly implement the "roving tabindex" pattern in a robust way that accounts for disabled tabs or dynamic tab insertion/removal.
*   **Composability via Context/Refs**: The `shadcn/ui` tabs use React Context and `forwardRef` to allow developers to compose the `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` in any structure. My custom `Tabs` component takes a rigid `tabs` array prop, which drastically limits how you can style or structure the tabs (e.g., placing something else inside the tab list).
*   **State Attributes**: Shadcn relies heavily on `data-[state=active]` for styling. My custom implementation uses string interpolation (`className={\`...\`}`) to toggle classes based on React state. The `data-*` attribute approach is much cleaner for CSS/Tailwind targeting and ensures the visual state always matches the logical state.

### 3. General (All Components)
*   **Ref Forwarding**: None of my custom components forward refs (`React.forwardRef`). This means they cannot be easily composed with animation libraries like Framer Motion, nor can parent components access the underlying DOM nodes if necessary.
*   **Animation Support**: Shadcn components support unmount animations using `data-[state=closed]:animate-out`. My custom implementations immediately unmount from the DOM (e.g., `if (!isOpen) return null`), making exit animations impossible without adding a library like React Transition Group or writing complex delay logic.

## Conclusion
Building components by hand is an excellent exercise to internalize ARIA specs and keyboard interactions. However, production-grade component libraries solve deeply complex edge cases (scroll locking, portals, nested focus scopes, exit animations) that are often missed in naive implementations.
