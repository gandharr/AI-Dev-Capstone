# Prompt Ladder: Writing Technical Documentation (README & Setup Guides)

**Target Task (from FL-01 Audit):** Writing Technical Documentation (README & Setup Guides) for a React/FastAPI full-stack application.

**Sample Input Data for the Prompts:**
> "My project is a task manager. The backend is FastAPI running on port 8000. To start it, you run `pip install -r requirements.txt` and then `uvicorn main:app --reload`. The frontend is React running on port 3000. To start it, you run `npm install` and then `npm start`. It connects to the backend at `http://localhost:8000`."

---

## Baseline
**Prompt:** 
"Write a README for my React and FastAPI task manager project using this info: [insert notes]"

**Output Excerpt:**
> # Task Manager
> This is a task manager project using React and FastAPI.
> 
> ## How to run
> For the backend, it runs on port 8000. Run `pip install -r requirements.txt` and `uvicorn main:app --reload`.
> For the frontend, it runs on port 3000. Run `npm install` and `npm start`. It connects to the backend at `http://localhost:8000`.

**Notes:**
*   **What changed:** Nothing, this is the naive baseline.
*   **Analysis:** The output is just a slightly reformatted echo of my input. It lacks the professional polish, structure, and formatting expected of a standard open-source README.

---

## Version 1
**Layer Added:** Role Assignment
**Prompt:** 
"You are an expert technical writer and open-source maintainer. Write a README for my React and FastAPI task manager project using this info: [insert notes]"

**Output Excerpt:**
> # Task Manager Application
> 
> Welcome to the Task Manager! This full-stack application leverages the power of a FastAPI backend and a dynamic React frontend to help you manage your daily tasks efficiently.
> 
> ## Getting Started
> 
> ### Backend (FastAPI)
> The backend server operates on port 8000. To get it running:
> 1. Install dependencies: `pip install -r requirements.txt`
> 2. Start the server: `uvicorn main:app --reload`
> 
> ### Frontend (React)
> ...

**Notes:**
*   **What changed in the prompt:** I assigned the AI the role of an "expert technical writer and open-source maintainer."
*   **What improved in the output:** The tone instantly became more professional and welcoming. It added a proper introduction and started formatting the instructions into numbered lists with markdown headers.
*   **What still failed:** It includes slightly generic marketing fluff ("leverages the power of"). It also doesn't provide a clear, standardized structure for prerequisites versus installation.

---

## Version 2
**Layer Added:** Context and Motivation
**Prompt:** 
"You are an expert technical writer and open-source maintainer. I am publishing this project on GitHub as a portfolio piece to show potential employers. The documentation needs to be extremely clear so recruiters or other developers can clone and run it locally in under 2 minutes without debugging. Write a README using this info: [insert notes]"

**Output Excerpt:**
> # Task Manager Full-Stack Application
> 
> A lightweight, highly responsive Task Manager built with React and FastAPI. This project demonstrates clean architecture and seamless API integration.
> 
> ## Local Development Setup
> Follow these steps to get the project running locally in under 2 minutes.
> 
> ### 1. Backend Setup (FastAPI)
> Ensure you have Python installed.
> ```bash
> pip install -r requirements.txt
> uvicorn main:app --reload
> ```
> The API will be available at `http://localhost:8000`.

**Notes:**
*   **What changed in the prompt:** I explained *why* I need this README (portfolio piece) and *who* will be reading it (recruiters, developers looking to run it quickly).
*   **What improved in the output:** The AI added markdown code blocks (`bash`) for the terminal commands, which is a massive readability improvement. It also framed the introduction around "clean architecture" which appeals to recruiters.
*   **What still failed:** It assumed prerequisites (like "Ensure you have Python installed") but didn't list Node.js for the frontend. The structure is better but still left up to the AI's discretion.

---

## Version 3
**Layer Added:** Output Structure
**Prompt:** 
"You are an expert technical writer and open-source maintainer. I am publishing this project on GitHub as a portfolio piece. The documentation needs to be extremely clear so recruiters or other developers can clone and run it locally in under 2 minutes. 

Write the README using exactly this structure:
# [Project Name]
> [1-sentence description]

## Prerequisites
- [List tools needed, e.g., Python, Node.js]

## Quick Start
### Backend
[Code blocks for backend setup]
### Frontend
[Code blocks for frontend setup]

Use this info: [insert notes]"

**Output Excerpt:**
> # Task Manager
> > A full-stack task management application built with FastAPI and React.
> 
> ## Prerequisites
> - Python 3.x
> - Node.js and npm
> 
> ## Quick Start
> ### Backend
> ```bash
> pip install -r requirements.txt
> uvicorn main:app --reload
> ```
> ### Frontend
> ```bash
> npm install
> npm start
> ```

**Notes:**
*   **What changed in the prompt:** I provided a strict markdown template for the output.
*   **What improved in the output:** The AI followed the structure flawlessly. It successfully inferred that Node.js and Python were prerequisites based on the `npm` and `pip` commands in my notes.
*   **What still failed:** While the output is great, the AI sometimes outputs conversational filler at the beginning like "Here is the README you requested:" before the actual markdown.

---

## Version 4
**Layer Added:** Step Decomposition
**Prompt:** 
"You are an expert technical writer and open-source maintainer. I am publishing this project on GitHub as a portfolio piece. The documentation needs to be extremely clear so recruiters or other developers can clone and run it locally in under 2 minutes. 

Please follow these steps exactly:
Step 1: Analyze the provided notes to determine the tech stack and required commands.
Step 2: Identify the implicit prerequisites (e.g., if you see pip, Python is required).
Step 3: Format the README using exactly the requested structure. Output ONLY the markdown for the README, with no introductory or concluding conversational text.

Structure:
# [Project Name]
> [1-sentence description]

## Prerequisites
- [List tools needed]

## Quick Start
### Backend
[Code blocks]
### Frontend
[Code blocks]

Notes: [insert notes]"

**Output Excerpt:**
> # Task Manager
> > A fast and responsive task manager powered by React and FastAPI.
> 
> ## Prerequisites
> - Python 3.x
> - Node.js and npm
> 
> ## Quick Start
> ### Backend
> ```bash
> pip install -r requirements.txt
> uvicorn main:app --reload
> ```
> The backend API runs on `http://localhost:8000`.
> 
> ### Frontend
> ```bash
> npm install
> npm start
> ```
> The frontend runs on `http://localhost:3000` and proxies to the backend.

**Notes:**
*   **What changed in the prompt:** I broke the cognitive work into discrete steps (Analyze -> Identify -> Format) and added a strict negative constraint to ban conversational filler.
*   **What improved in the output:** The AI produced zero filler text. The extraction of prerequisites is now explicitly requested as a step, making it less likely to be skipped.
*   **What still failed:** Sometimes the AI formats the bash commands all on one line, or doesn't add comments explaining what the commands do.

---

## Version 5
**Layer Added:** Few-Shot Examples
**Prompt:** 
"You are an expert technical writer and open-source maintainer. I am publishing this project on GitHub as a portfolio piece. The documentation needs to be extremely clear so recruiters or other developers can clone and run it locally in under 2 minutes. 

Please follow these steps exactly:
Step 1: Analyze the provided notes to determine the tech stack and commands.
Step 2: Identify the implicit prerequisites.
Step 3: Format the README. Output ONLY the markdown for the README.

Structure:
# [Project Name]
> [1-sentence description]

## Prerequisites
- [List tools]

## Quick Start
### Backend
[Code blocks]
### Frontend
[Code blocks]

Example of how to format the Quick Start code blocks:
### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
```

Notes: [insert notes]"

**Output Excerpt:**
> # Task Manager
> > A full-stack task management solution built with React and FastAPI.
> 
> ## Prerequisites
> - Python 3.8+
> - Node.js and npm
> 
> ## Quick Start
> ### Backend
> ```bash
> # Install Python dependencies
> pip install -r requirements.txt
> 
> # Start the FastAPI server (runs on port 8000)
> uvicorn main:app --reload
> ```
> ### Frontend
> ```bash
> # Install Node modules
> npm install
> 
> # Start the React development server (runs on port 3000)
> npm start
> ```

**Notes:**
*   **What changed in the prompt:** I added a specific few-shot example showing exactly how I want the code blocks to look, including comments inside the bash block.
*   **What improved in the output:** The AI perfectly mimicked the style of the few-shot example, adding helpful `# comments` above each bash command. This makes the README significantly more professional and easier for beginners to follow. The prompt is now highly robust.

---

## Cross-Model Comparison
**Final Prompt run on Claude 3.5 Sonnet vs. ChatGPT (GPT-4o)**

**Claude 3.5 Sonnet:**
*   **Tone:** Highly professional and strictly adhered to the minimalist structure.
*   **Accuracy:** Flawlessly identified the prerequisites and formatted the code blocks exactly as demonstrated in the few-shot example.
*   **Structure:** Followed the markdown structure perfectly. Zero conversational filler.
*   **Failure Points:** It didn't elaborate on the 1-sentence description much, keeping it very literal to the prompt constraints.

**ChatGPT (GPT-4o):**
*   **Tone:** Professional, but slightly more eager to "sell" the project in the 1-sentence description.
*   **Accuracy:** Excellent. It also added helpful comments to the bash blocks mimicking the few-shot example.
*   **Structure:** Followed the structure well, but occasionally added an extra line break or a concluding sentence at the very end despite the negative constraint.
*   **Failure Points:** Even with Step 3 saying "Output ONLY the markdown", ChatGPT occasionally slips in a "Here is your README:" at the very top. Claude is much better at strictly following negative formatting constraints.

**Verdict:** Both models handled the structured prompt beautifully. Claude is the preferred model for this specific task because it guarantees a clean output that can be piped directly into a `.md` file without manual trimming of conversational filler.

---

## Final Reusable Prompt Template

```text
You are an expert technical writer and open-source maintainer. I am publishing this project on GitHub as a portfolio piece. The documentation needs to be extremely clear so recruiters or other developers can clone and run it locally in under 2 minutes. 

Please follow these steps exactly:
Step 1: Analyze the provided notes to determine the tech stack and commands.
Step 2: Identify the implicit prerequisites (e.g. if pip is used, Python is required).
Step 3: Format the README. Output ONLY the markdown for the README, with no conversational filler before or after the markdown.

Structure:
# [Project Name]
> [1-sentence description]

## Prerequisites
- [List tools]

## Quick Start
### Backend
[Code blocks]
### Frontend
[Code blocks]

Example of how to format the Quick Start code blocks:
### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
```

Now, write the README using these notes:
[INSERT PROJECT NOTES / COMMANDS HERE]
```
