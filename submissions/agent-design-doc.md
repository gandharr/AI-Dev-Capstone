# Agent Design Document: The Portfolio Case Study Scout

## 1. Job to be Done (Scope)
The **Portfolio Case Study Scout** is an autonomous developer tool designed to solve a single problem: the manual drag of writing detailed, technically-accurate case studies for a software developer's portfolio. 

Given a local codebase path or a public GitHub repository URL, the agent autonomously scans the project, analyzes its architecture and package dependencies, maps its data model/schema, and generates a structured, technical, no-fluff case study in MDX format.

### Target User & Frequency
* **User:** Me (a full-stack software engineer building and showcasing projects).
* **Frequency:** Used 1-2 times per week (whenever a new feature or project is ready for showcase).

---

## 2. Tools, Data, & Access Plan
For the agent to understand a codebase, it must interact with the filesystem and API endpoints.

| Data Source / Tool | Description | Access Plan |
|---------------------|-------------|-------------|
| **Local File Reader** | Reads the contents of individual text/source files (JS, TS, PY, JSON, YAML). | Standard Python `os` and `open()` filesystem APIs. Limited to the target workspace folder. |
| **Directory Tree Scanner** | Scans the codebase directory structure to build a project tree map. | Python `pathlib` and `glob` libraries. |
| **GitHub Repository Fetcher** | Fetches code files directly from a public GitHub repository. | HTTP client calling the public GitHub REST API (`https://api.github.com/repos/{owner}/{repo}/contents/`). |
| **AST Parser (Optional/Future)** | Parses file ASTs to map imports and exports. | Out of scope for the 10-hour build; directory structure and direct file reads are sufficient. |

---

## 3. Draft Instructions (The System Prompt)
The agent operates under the following instructions:

```instructions
You are the Portfolio Case Study Scout, an autonomous technical writer and senior software architect. 
Your goal is to analyze a codebase and write a zero-fluff, technically-dense case study in MDX format.

To accomplish this, follow these steps:
1. Scan the project structure to understand the layout and identify the main entry points (e.g. package.json, requirements.txt, src/app/api).
2. Read the configuration files and main API route files to map the architecture and technology stack.
3. Search for database schemas or configuration files (like Prisma schemas, SQL files, or Firestore config) to map the data model.
4. Synthesize your findings and output a markdown document using the standard MDX portfolio template:
   - Metadata (title, summary, stack list)
   - Core Problem (what this codebase solves, inferred from code comments or README)
   - Technical Solution (architecture block diagram, API flow, database schema)
   - Tech Stack analysis (why each tool was chosen based on code structures)
   - Edge Cases & Handled Errors (how the code handles API failure, rate limits, or empty input)

Constraints:
- Never use marketing buzzwords ("revolutionary", "seamlessly", "cutting-edge").
- Focus entirely on concrete implementation details, routing, and data flow.
- If a detail is missing (e.g., latency metrics), leave an explicit markdown placeholder warning the user to insert real numbers.
```

---

## 4. Risks & Guardrails

| Identified Risk | Severity | Guardrail / Action |
|-----------------|----------|--------------------|
| **Path Traversal / Security** | High | The file-reading tools must strictly restrict access to the target workspace directory. Any path containing `..` or pointing outside the target directory must throw an access error immediately. |
| **Accidental Code Execution** | High | The agent is prohibited from executing scripts (`eval`, `subprocess.run`, `bash`). It must only read text contents. |
| **Local File Overwriting** | Medium | The agent must never write to or overwrite any existing source code files. It is only permitted to write its output MDX case study to a dedicated, new file in a specified `/output` directory. |
| **Rate Limit / API Quota Consumption** | Low | Limit file reads to a maximum of 20 files per run. If the project contains more files, the agent must prioritize scanning entry points first. |

---

## 5. Five Evaluation Cases
Before writing any agent code, the following test cases will be used to evaluate performance:

1. **Test Case 1: Simple React + Next.js App**
   * *Target:* A small static site repo with a `package.json`, a few components, and no backend.
   * *Expected Output:* Correctly identifies React/Next.js stack, extracts component names, and documents a static/frontend-only architecture.
2. **Test Case 2: Full-Stack Python (FastAPI) + PostgreSQL**
   * *Target:* A backend repo containing SQL schemas, FastAPI routes, and a `requirements.txt`.
   * *Expected Output:* Infers database tables, lists API endpoints, and correctly maps the backend architecture.
3. **Test Case 3: Empty or Malformed Directory**
   * *Target:* An empty directory or one containing only unstructured temp files.
   * *Expected Output:* Gracefully terminates, outputting a clear error message stating that no valid project entry points or codebases could be found.
4. **Test Case 4: Project with Error-Trigger Cases**
   * *Target:* A codebase containing explicit error handling or tool states (like our chat API route).
   * *Expected Output:* Correctly extracts how edge cases/failures are handled under the "Edge Cases & Handled Errors" section.
5. **Test Case 5: Large Repository (Size Stress Test)**
   * *Target:* A repository with 100+ files including `node_modules` or `venv` directories.
   * *Expected Output:* Omit scanning ignored directories (`node_modules`, `dist`, `.git`) and focus strictly on source directories (`src`, `app`, `lib`), respecting the 20-file read limit.

---

## 6. Platform Choice & Justification
For this build, I have chosen a **Scripted Agent (Python)**. 

### Comparison against Alternatives:
* **Claude Project / Custom GPT (Alternative):**
  * *Pros:* Very easy to configure via UI; no code writing needed.
  * *Cons:* **Cannot access the local filesystem autonomously.** I would have to manually upload files one-by-one or copy-paste codebases into the chat window, defeating the purpose of an autonomous scout.
* **Scripted Agent (Chosen Platform):**
  * *Pros:* Standard Python execution has direct, safe access to the local filesystem using OS APIs. It can query local files, run regex/AST lookups, parse directory maps automatically, and directly write the output `.mdx` file to my portfolio directory in one click.
  * *Cons:* Requires writing about 150 lines of boilerplate Python code to wire the model's tool calls to filesystem functions, which is well within the 10-hour build limit.
