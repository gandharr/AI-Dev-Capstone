# Personal Website & Architecture Guide

**Author:** Gandhar Dhore  
**Theme:** High-Contrast Minimalist Dark Mode (`#0A0A0A` + `#EDEDED` + `#3B82F6`)  
**Deployment Path:** Netlify Drop / GitHub Pages / Vercel  

---

## File Manifest & Architecture Explanation

This site is intentionally built as clean, dependency-free, semantic HTML5 and Vanilla CSS. Every file has a clear architectural purpose:

### 1. `index.html` (Site Structure & Content)
* **Metadata & SEO:** Contains `<meta charset="UTF-8">`, viewport scaling, dynamic page title, and meta descriptions for search engines and social sharing cards.
* **Typography Linking:** Loads the high-legibility Google Font `Inter` (sans-serif) and `JetBrains Mono` (monospace code tags) via preconnected CDNs for sub-100ms first paint.
* **Semantic HTML5 Layout:**
  * `<header class="navbar">`: Monogram logo ("GD."), navigation anchors, and a direct booking CTA.
  * `<section class="hero-section">`: Personal positioning claim, status pill indicator ("Available for AI Engineering"), and prominent action buttons.
  * `<section id="work">`: Responsive grid highlighting capstone artifacts (the AI Interview & Qualification Agent, and the Portfolio Case Study Scout CLI).
  * `<section id="writing">`: List of technical explainers (including the Agents/MCP deep-dive and DNS walkthrough).
  * `<section id="credentials">`: Designated container for the official FlyRank completion badge.
  * `<footer class="footer">`: Copyright and quick reference links.
* **Accessible Buttons:** Direct SVG icons for LinkedIn, GitHub, CV download, and Cal.com booking link.

### 2. `style.css` (Design System & Aesthetics)
* **CSS Custom Properties (`:root`):** Centralized design tokens enforcing the Week 3 Identity Kit:
  * Primary Background: `#0A0A0A` (Near Black)
  * Primary Text: `#EDEDED` (High-contrast Off-White)
  * Subtle UI & Borders: `#27272A` (Zinc)
  * Primary Accent: `#3B82F6` (Calm Technical Blue)
* **Atmospheric Micro-Animations:** Radial glow blurs (`bg-glow`) and an animated pulsing emerald status light (`@keyframes pulse`).
* **Glassmorphism & Card Hover States:** Smooth translateY transformations, box-shadow depth, and backdrop-filter blur effects.
* **Responsive Breakpoints:** Mobile-first fluid scaling with `@media (max-width: 768px)` accommodating smartphones, tablets, and wide monitors.

---

## Deployment Instructions

### Method 1: Netlify Drop (Fastest, 30 Seconds, Free HTTPS)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `personal-site/` folder directly onto the drop zone.
3. Netlify immediately provisions an automated SSL certificate and assigns a live URL.
4. Go to **Site configuration** &rarr; **Change site name**, and change the random subdomain to `gandhardhore.netlify.app`.

### Method 2: GitHub Pages
1. Push this folder to a GitHub repository (or configure GitHub Pages to serve from root/docs).
2. Go to **Settings** &rarr; **Pages** &rarr; select branch and save.
