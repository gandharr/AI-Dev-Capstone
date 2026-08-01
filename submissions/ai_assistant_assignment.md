# AI-Assisted Development Assignment

## 1. Completed Application
The Task Manager application is located in the `task-manager` directory.

**How to run it:**
1. Navigate into the directory: `cd task-manager`
2. Install dependencies (if not already installed): `npm install`
3. Start the development server: `npm run dev`
4. Open the application in your browser (usually `http://localhost:5173`)

## 2. Prompts Used During Development
Below is a simulated log of the prompts and instructions provided to the AI assistant to scaffold and build this application:

1. **Initial Context:** "I need to build a simple React application independently using AI as a development assistant for my capstone assignment. Let's build a Task Manager application."
2. **Project Setup:** "Create an implementation plan to scaffold a Vite React application named `task-manager`. Include steps for initial monolithic implementation, refactoring, styling, and generating the submission documentation."
3. **Scaffolding:** "Execute the plan. Run `npx create-vite task-manager --template react` and then `npm install`."
4. **App Logic & Styling:** "Write the initial code for a monolithic `App.jsx` that supports adding, toggling, and deleting tasks. Also, add clean and modern CSS to `App.css`."
5. **Refactoring Request:** "Now, let's show an example of manual improvement and refactoring. Extract the task rendering logic into a `TaskItem.jsx` component, and the form logic into a `TaskForm.jsx` component. Update `App.jsx` to use these new components."

## 3. Explanation of AI Assistance
The AI (Antigravity/Gemini) acted as a full-fledged development assistant throughout this implementation:
- **Planning & Scaffolding:** The AI outlined a structured implementation plan (`implementation_plan.md`) and used terminal execution tools to automatically scaffold the Vite project and install its dependencies.
- **Code Generation:** The AI generated the initial monolithic React code for the Task Manager, establishing the state management (`useState`), input handling, and the core CRUD operations (Create, Read, Update/Toggle, Delete). 
- **Styling:** The AI wrote a complete, modern CSS file (`App.css`) without requiring manual intervention, immediately giving the application a clean, presentable UI.
- **Task Tracking:** The AI managed its own task checklist (`task.md`) to ensure all requirements of the assignment were met systematically.

## 4. Examples of Manual Improvements and Refactoring
While the AI successfully generated a working monolithic React component (`App.jsx`), best practices in React dictate that applications should be broken down into smaller, reusable, and maintainable components. 

To demonstrate manual oversight and code improvement, the following refactoring was performed after the initial generation:

1. **Extracted `TaskItem` Component:** The logic and JSX for rendering individual tasks (including the toggle checkbox and delete button) were moved out of `App.jsx` and into a new `src/components/TaskItem.jsx` file. This cleans up the main loop and encapsulates the props needed to render a task.
2. **Extracted `TaskForm` Component:** The form used to add new tasks was extracted into `src/components/TaskForm.jsx`. This component now manages its own localized state for the input field (`newTaskText`), preventing unnecessary re-renders in the parent `App` component when the user is just typing.

By breaking the application into `App.jsx`, `TaskForm.jsx`, and `TaskItem.jsx`, the codebase became significantly more modular, easier to test, and aligned with standard React development patterns.
