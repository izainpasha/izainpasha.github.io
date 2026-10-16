# Syed Zain Pasha — Portfolio

Personal portfolio of Syed Zain Pasha, full-stack developer specialising in custom Shopify themes and apps, with WordPress, Webflow, React and PHP work alongside.

**Live:** https://izainpasha.github.io

## Stack

- React 19 + Vite, pre-rendered to static HTML at build time and hydrated in the browser
- [Motion](https://motion.dev) for the hero and counters; scroll reveals use one shared IntersectionObserver and CSS
- Self-hosted variable fonts (Bricolage Grotesque, Inter, JetBrains Mono)
- Deployed to GitHub Pages by GitHub Actions on every push to `main`

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build + pre-render into dist/
npm run preview  # serve the production build
```

All page content (projects, services, experience, tech) lives in [`src/data.js`](src/data.js).

## Quality

Lighthouse (desktop): 100 performance · 100 accessibility · 100 best practices · 100 SEO.
Responsive from 320px to 1920px, light and dark mode, keyboard accessible, respects reduced motion.
