# Agents, Workflows, and the Model Context Protocol (MCP)

"Agent" has become the most abused buzzword in the AI industry, frequently used to describe anything from a simple scripted prompt to a basic scheduled cron job. To actually build effective AI systems, we have to strip away the marketing fluff and understand the hard technical distinction between a workflow and an agent. Furthermore, we must understand how protocols like MCP are fundamentally changing how these systems interact with the outside world.

## Workflow vs. Agent: The Crucial Distinction

According to Anthropic's engineering patterns, the defining difference between a workflow and an agent comes down to **control flow and autonomy**. 

A **workflow** is a system where the path is entirely predetermined by the developer. It follows a rigid, explicitly programmed sequence. If a workflow fails at step two, it stops or throws a predefined error. It uses predictable patterns like prompt chaining (Step A feeds into Step B), routing (if X, go to Y; if Z, go to W), or evaluator-optimizer loops. The LLM is used purely for transformation or generation within those strict boundaries, but it is not in the driver's seat. 

An **agent**, on the other hand, is a system where the LLM itself drives the control flow. The developer gives the agent a goal and a set of tools, but the LLM autonomously decides *which* tools to use, *when* to use them, and *how* to recover from errors. It operates in a continuous loop of reasoning and acting (often called a ReAct loop). If an agent tries to read a file and gets a "file not found" error, it doesn't just crash—it reasons about the error, uses a directory-listing tool to find the correct file path, and tries again without human intervention. 

### Classifying the FL-04 Pipeline

My FL-04 pipeline—the "Draft, Critique, Revise" case study generator—is undeniably a **workflow**. Specifically, it relies on the *evaluator-optimizer* pattern. 

It is not an agent because the control flow is entirely hardcoded by me (the human). I explicitly tell the model to Synthesize, then Draft, then Critique, then Revise. The model does not have the autonomy to decide, "I think this draft needs a second round of critique," nor does it have the ability to fetch its own context. It is a highly effective, predictable pipeline, but it is not agentic.

### Upgrading FL-04 into an Agent

To upgrade my FL-04 workflow into a true agent, I would need to give it autonomy and external tools. 

Instead of manually pasting bullet points into a prompt window, I would give the agent a single instruction: *"Write a technical case study for the Interview Copilot repository."* 

To accomplish this, the agent would need access to tools (like an MCP GitHub connector). It would autonomously:
1. Search my GitHub account to find the repository.
2. Read the `README.md` and scan the `src/` directory to understand the codebase.
3. Draft the case study.
4. Realize it is missing latency metrics, and autonomously use a database-querying tool to check my production logs to find the p95 response times.
5. Self-evaluate the draft, iterate until it meets a defined quality threshold, and finally use a file-writing tool to save the `.mdx` file directly into my portfolio repository.

In this scenario, the LLM is driving the process, reacting to its environment, and using tools to gather missing context. That is an agent.

## The Model Context Protocol (MCP)

For an agent to do any of the above, it needs to interact with the external world. Historically, developers had to write custom API integrations for every single AI app they built. If you wanted your AI to read your Google Drive, query a Postgres database, and search GitHub, you had to write custom glue code for all three, specific to the LLM you were using.

The **Model Context Protocol (MCP)** solves this by acting as the "USB-C port for AI." It is an open, standard protocol that standardizes how AI models connect to external data sources and tools. 

MCP architecture relies on three primary primitives:
1. **Resources:** Read-only data that the server exposes to the client (like a local file, an API response, or a database schema). 
2. **Prompts:** Pre-written templates that the server provides, which the user can easily invoke.
3. **Tools:** Executable functions that the AI can call (e.g., `execute_sql_query`, `write_file`, or `fetch_webpage`). The MCP server handles the actual execution, keeping the client secure.

Because MCP separates the AI client from the data server, I can build an MCP server that securely connects to my local Postgres database once, and then use that exact same server across Claude Desktop, an IDE, or my own custom agent application. It radically lowers the barrier to building agents by standardizing how they touch the real world.