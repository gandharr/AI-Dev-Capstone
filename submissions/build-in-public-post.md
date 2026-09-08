# Build-in-Public Capstone Story: From Prompting to Production AI Architecture

> **Author:** Gandhar Dhore — AI & Full-Stack Engineer  
> **Target Platforms:** LinkedIn & X (Twitter)  
> **Live App:** [https://ai-dev-capstone.vercel.app/](https://ai-dev-capstone.vercel.app/)  
> **Portfolio:** [https://gandhar-dhore.netlify.app/](https://gandhar-dhore.netlify.app/)  
> **GitHub Repository:** [https://github.com/gandharr/AI-Dev-Capstone](https://github.com/gandharr/AI-Dev-Capstone)  

---

## 📱 LinkedIn Post Draft (Ready to Publish)

10 weeks ago, I thought building an AI application was simple: write a clever prompt, hook up an LLM API key to a chat box, and call it a day.

I was wrong. 

Unconstrained text chatbots are fragile. They hallucinate numbers, dump walls of unstructured markdown that no sales rep can use, time out on cold starts, and leave production API keys exposed to credit-draining abuse.

Today, I’m officially launching my capstone project for the **FlyRank Advanced AI Engineering Track**: the **AI Lead Qualification Agent & Autonomous Interview Copilot**.

Instead of returning plain text, the agent leverages **Generative UI** (built with Next.js 16, React 19, and the Vercel AI SDK). When evaluating a prospect, the AI autonomously executes typed backend tools (`scoreLead`, `analyzeMarketTrends`) that stream interactive, color-coded qualification scorecards and responsive time-series market charts directly into the conversation stream.

Here are the two biggest engineering takeaways from shipping this to production:

### 1. The Decision: Hand-Rolled Inline SVG Over Heavy Chart Bundles
When designing market trend visualizations, the obvious choice was importing Recharts or Chart.js. But doing so would have added 150KB–300KB of client-side JavaScript, dragging down mobile load times. 

Instead, we hand-rolled accessible inline SVG bar charts with zero runtime dependencies. The result? Instant zero-delay rendering, zero hydration mismatches, full screen-reader accessibility (`role="img"`), and a verified **92+ mobile Lighthouse performance score**.

### 2. The Limitation: Ephemeral In-Memory Rate Limiting
To prevent public visitors from exhausting our Google Gemini API credits, we engineered a sliding-window rate limiter (12 requests/minute) and a 1,500-character input cap on `/api/chat`. 

However, in serverless environments like Vercel, in-memory state is isolated per container instance and resets on cold starts. While it successfully blocks single-IP spam, scaling this to distributed global traffic requires backing the limiter with an Upstash or Redis KV store. Being honest about system boundaries is what separates a student toy from production engineering.

A huge thank you to the FlyRank team and mentors for pushing us past prompting tricks and into real software craftsmanship.

👉 **Try the live Capstone app:** https://ai-dev-capstone.vercel.app/chat  
👉 **Check out my portfolio (featuring a custom WebGL fragment shader hero):** https://gandhar-dhore.netlify.app/  
👉 **Full open-source repo & 18/18 test suite:** https://github.com/gandharr/AI-Dev-Capstone  

What’s your take on Generative UI vs. traditional chat interfaces? Let’s connect in the comments!

#AIEngineering #NextJS #GenerativeUI #WebDevelopment #TypeScript #SoftwareEngineering #Vercel #OpenSource

---

## 🐦 X / Twitter Thread Draft (Ready to Publish)

**Tweet 1/4:**  
10 weeks ago, I thought "AI engineering" was just clever prompt writing.

Today, I'm launching my AI Engineering Capstone: an Autonomous Lead Qualification Agent that turns LLM reasoning into dynamic Generative UI. 

Here’s what I built and the hardest lessons learned 🧵👇  
https://ai-dev-capstone.vercel.app/chat

**Tweet 2/4:**  
Instead of dumping walls of markdown, the agent autonomously executes typed server-side tools (`scoreLead`, `analyzeMarketTrends`).

It streams interactive qualification scorecards and hand-rolled SVG time-series charts directly into the chat. Zero text bloat; 100% structured data.

**Tweet 3/4:**  
One key architectural decision:
We avoided bloated charting libraries (Recharts/D3) that add 200KB+ of JS. We built custom inline SVG charts with zero dependencies. Result: instant 0ms hydration and 92+ mobile Lighthouse score.

**Tweet 4/4:**  
One honest limitation:
Our 12 req/min sliding rate limiter is in-memory. On serverless cold starts across Vercel edge regions, memory state is isolated. Next step on the roadmap: Upstash/Redis distributed sync.

Live App: https://ai-dev-capstone.vercel.app/  
Portfolio: https://gandhar-dhore.netlify.app/  
GitHub: https://github.com/gandharr/AI-Dev-Capstone
