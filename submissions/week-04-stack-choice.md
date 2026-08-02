# Week 04: Three Roads (Stack Choice Rationale)

**The Stack I Chose: Next.js + Tailwind CSS + MDX**

To match industry standards for top-tier full-stack/AI hiring, my portfolio needs to do two conflicting things well: host long-form technical reading (my case studies) and display highly interactive, live embedded demos of my AI projects. 

Because of my skill level (Next.js/React/FastAPI), I chose **Next.js with MDX**. MDX allows me to write my case studies in clean Markdown, but drop interactive React components (like a live AI chat window or an image gallery) directly into the text. I’ll be hosting it entirely for free on **Vercel**. 

**Does it need a backend?** 
Not yet. The AI projects I'm linking to have their own backends, but the portfolio itself is completely static. 

**The Alternatives I Considered (and why I rejected them):**
1. **React (Vite) SPA:** This was the simplest option, but writing and maintaining four detailed, long-form case studies inside raw JSX or JSON files is a nightmare for formatting and scaling. 
2. **Next.js + Headless CMS (Sanity):** This was the most powerful option, but totally unnecessary. Setting up data schemas and API routes for just four case studies is a massive waste of time. I want to spend my next two weeks actually building the UI and refining my demos, not wrestling with a CMS I don't need to maintain. Next.js + MDX gives me the exact flexibility I need without the overhead.
