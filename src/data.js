// All page content lives here. Edit this file to update the site.

export const profile = {
  name: "Syed Zain Pasha",
  shortName: "Zain Pasha",
  initials: "ZP",
  location: "Karachi, Pakistan",
  email: "syedzain1999@gmail.com",
  cv: "/Syed_Zain_Pasha_CV.pdf", // put the PDF in /public
  linkedin: "https://www.linkedin.com/in/izainpasha/",
  github: "https://github.com/izainpasha",
};

export const nav = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
];

export const proof = [
  { value: 300, suffix: "+", label: "Shopify & eCommerce projects delivered" },
  { value: 5, suffix: "+", label: "Years building commerce" },
  { value: 13, suffix: "+", label: "Developers & PMs led" },
  { text: "25–30%", label: "Lift in on-time delivery" },
  { value: 25, suffix: "%", label: "Of clients come back" },
];

export const services = [
  {
    icon: "theme",
    title: "Custom Shopify themes",
    body: "Online Store 2.0 themes coded from scratch. Sections, blocks and metafields let your team edit every page without a developer.",
  },
  {
    icon: "app",
    title: "Shopify apps",
    body: "Embedded apps with Remix, Polaris and App Bridge. They connect to the Admin and Storefront APIs, webhooks and third-party services.",
  },
  {
    icon: "web",
    title: "WordPress & Webflow sites",
    body: "Marketing sites and rebuilds in WordPress (Elementor, Divi, custom themes) and Webflow, built so your team can edit them without breaking the layout.",
  },
  {
    icon: "code",
    title: "React & custom PHP",
    body: "React and Vite front ends, Node and custom PHP back ends, and REST or GraphQL integrations for anything a page builder can't do.",
  },
  {
    icon: "design",
    title: "Design to build",
    body: "Figma and Adobe XD files built into pixel-perfect, responsive, mobile-first stores and sites, tested across browsers and devices.",
  },
  {
    icon: "speed",
    title: "Speed & conversion",
    body: "Core Web Vitals and Lighthouse work, plus conversion-rate fixes on product pages, collections and the cart.",
  },
  {
    icon: "team",
    title: "Delivery you can plan around",
    body: "I've run production for two dev and SEO teams. You get sprint plans, code review, QA and release management, so your launch date holds.",
    wide: true,
  },
];

// Featured case studies, written from each project's notes in Dev Work.
// `image` lives in /public/work. Without one, the card shows a branded text tile.
export const work = [
  {
    name: "Chazoku",
    meta: "Subscriptions · Matcha · 2026",
    title: "Chazoku — matcha subscriptions with a first-order gift",
    brief: "Launch monthly and 90-day matcha subscriptions with an intro gift that only first-time subscribers get.",
    built: "Twelve Recharge selling plans across six products, a Node app-proxy bridge that checks gift eligibility, and a Shopify Flow that tags customers after their first subscription order.",
    result: "Subscription and gift add to the cart as one bundle. All plans show in checkout and in the Recharge customer portal.",
    tags: ["Recharge", "App Proxy", "Shopify Flow", "Liquid", "Node.js"],
    link: { href: "https://chazoku.com", label: "Visit chazoku.com", external: true },
    image: "/work/chazoku.webp",
  },
  {
    name: "Bee Pre Order",
    meta: "Public Shopify app · Bee Creative · 2026",
    title: "Bee Pre Order — app, website and demo store",
    brief: "Let merchants sell before stock arrives, take a deposit or full payment, and alert customers when items are back.",
    built: "The embedded app (React Router template, Polaris, a theme app embed for the storefront) and its marketing website, docs and live demo store. Built against Shopify's App Store and Built for Shopify requirements.",
    result: "App Store listing, review instructions and public docs are ready, with every listed feature working in the demo store.",
    tags: ["React Router", "Polaris", "App embed", "Admin API", "Prisma"],
    link: { href: "https://bpo.beecreative.pk", label: "See the app site", external: true },
    image: "/work/beepreorder.webp",
  },
  {
    name: "Used Conex",
    meta: "Migration · Shipping containers · 2026",
    title: "Used Conex — WordPress to Shopify, built from Figma",
    brief: "Move a container sales and rental business off WordPress without losing its pages or search rankings.",
    built: "Every page rebuilt from Figma on Dawn. 58 city pages run on one metafield-driven template. GSAP and Lenis add motion, type is fluid, and there's a URL redirect plan for the cutover.",
    result: "All 58 city pages are live, plus the reviews and blog templates. Service and grade pages are verified on the draft theme.",
    tags: ["Figma", "Metafields", "GSAP", "Migration", "SEO"],
    link: { href: "https://usedconex.com", label: "Visit usedconex.com", external: true },
    image: "/work/usedconex.webp",
  },
  {
    name: "Klone Scents",
    meta: "Product page · Fragrance · 2026",
    title: "Klone Scents — build-your-own bundle",
    brief: "Let shoppers mix any of eight scents into 1, 3 or 5-bottle offers, with gifts that unlock by tier.",
    built: "A custom bundle picker block with offer cards, a gift panel, a live subtotal and an accessible scent dialog. It syncs with Kaching so discounts and gifts stay native.",
    result: "Every tier was verified against real Shopify cart totals ($39.99 / $79.99 / $119.99), on mobile and by keyboard.",
    tags: ["Liquid", "JavaScript", "Kaching", "Markets", "A11y"],
    link: { href: "https://klonescents.com", label: "Visit klonescents.com", external: true },
    image: "/work/klone.webp",
  },
  {
    name: "Rooflights & Skylights UK",
    meta: "Catalogue · Home improvement · 2026",
    title: "Rooflights & Skylights UK — new Juliet Balconies range",
    brief: "Add a full Juliet Balconies category that matches the store's existing framed rooflight products.",
    built: "Category, product templates and FAQ content built from the client's product matrix. Fixed the Boost filter frame buttons and refreshed the blog imagery.",
    result: "The new range uses the same templates as the rest of the catalogue, and filters now match Boost's tag format.",
    tags: ["Liquid", "Boost filters", "Metafields", "Content"],
    link: { href: "https://www.rooflightsandskylightsuk.co.uk", label: "Visit the store", external: true },
    image: "/work/rooflights.webp",
  },
  {
    name: "Crunchy Girl Granola",
    meta: "Theme + private app · Food · 2026",
    title: "Crunchy Girl Granola — custom theme and admin tooling",
    brief: "Turn a Lovable prototype into a real store, and give the team a safe way to manage products and Seal subscriptions.",
    built: "An Online Store 2.0 theme restyled to match the prototype with custom homepage sections. Plus a private admin app that uses Admin GraphQL and the Seal Subscriptions API.",
    result: "Cart, checkout, search and variants work out of the box. Write commands in the admin app need explicit confirmation.",
    tags: ["Dawn", "Liquid", "Admin GraphQL", "Seal", "Node.js"],
    image: "/work/crunchy.webp",
    link: { href: "https://www.crunchygirlgranola.com", label: "Visit crunchygirlgranola.com", external: true },
  },
];

// Every project in Dev Work. `type` drives the filter tabs on the page.
export const projects = [
  // Shopify stores & themes
  { name: "Used Conex", type: "Shopify", what: "WordPress → Shopify migration, Figma build, 58 city pages", stack: "Dawn · Metafields · GSAP", url: "https://usedconex.com", image: "/work/usedconex.webp" },
  { name: "Chazoku", type: "Shopify", what: "Recharge subscriptions, app-proxy bridge, Shopify Flow", stack: "Broadcast · Recharge", url: "https://chazoku.com", image: "/work/chazoku.webp" },
  { name: "Klone Scents", type: "Shopify", what: "Custom bundle picker synced with Kaching", stack: "Shrine PRO · JavaScript", url: "https://klonescents.com", image: "/work/klone.webp" },
  { name: "DrinkLAF", type: "Shopify", what: "SEAL Subscribe & Save, customer-service tooling audit", stack: "SEAL · Klaviyo", url: "https://drinklaf.com", image: "/work/drinklaf.webp" },
  { name: "Rooflights & Skylights UK", type: "Shopify", what: "Juliet Balconies category, Boost filter fixes", stack: "Boost · Liquid", url: "https://www.rooflightsandskylightsuk.co.uk", image: "/work/rooflights.webp" },
  { name: "Puppo Labs", type: "Shopify", what: "Custom theme from Figma for an Australian dog-supplement brand", stack: "Skeleton theme · OS 2.0", image: "/work/puppo.webp" },
  { name: "Crunchy Girl Granola", type: "Shopify", what: "Custom theme from a Lovable design + private admin app", stack: "Dawn · Seal · Admin API", url: "https://www.crunchygirlgranola.com", image: "/work/crunchy.webp" },
  { name: "Vitality Cycles", type: "Shopify", what: "Suite of custom homepage, PDP and landing sections", stack: "Dawn · Custom sections", url: "https://vitalitycycles.com", image: "/work/vitality.webp" },
  { name: "Deen Health", type: "Shopify", what: "Halal supplement store build and customisation", stack: "Local theme", url: "https://www.deenhealth.co", image: "/work/deen.webp" },
  { name: "Aitan Safa Label", type: "Shopify", what: "Fashion store on Dawn with seasonal collections", stack: "Dawn", url: "https://aitansafalabel.com", image: "/work/aitan.webp" },
  { name: "The Scooter Place", type: "Shopify", what: "Store design, Admin API launch audit and an admin tools app", stack: "Prestige · Admin API", url: "https://thescooter.place", image: "/work/scooter.webp" },
  { name: "Henley Spirit", type: "Shopify", what: "Jewellery store customisation", stack: "Essentials theme", url: "https://henleyspirit.com", image: "/work/henley.webp" },
  { name: "Alohi", type: "Shopify", what: "Theme build with Playwright browser checks", stack: "Horizon", url: "https://drinkalohi.com", image: "/work/alohi.webp" },
  { name: "Cooper's Gang", type: "Shopify", what: "Dog grooming and boutique store customisation", stack: "Honey theme", url: "https://coopersgang.co.uk", image: "/work/coopers.webp" },
  { name: "Chroma Skin Tech", type: "Shopify", what: "Skincare-device store customisation", stack: "Purity theme", url: "https://chromaskintech.com", image: "/work/chroma.webp" },
  { name: "Salthouse the Label", type: "Shopify", what: "Theme customisation", stack: "Dawn" },
  { name: "Insta Shower", type: "Shopify", what: "Teen hygiene brand store customisation", stack: "Dawn", url: "https://www.instashower.com", image: "/work/instashower.webp" },
  { name: "ST Threadz", type: "Shopify", what: "Fashion store custom sections", stack: "Liquid", url: "https://stthreadz.com", image: "/work/stthreadz.webp" },
  { name: "Bee Upload Kit — demo site", type: "Shopify", what: "Custom demo theme and marketing site for Bee Creative's file-upload app: hero, pricing, docs, live demo grid and two print-shop demo stores", stack: "Custom Liquid theme · OS 2.0 · HTML", image: "/work/uploadkit.webp" },
  // Shopify apps
  { name: "Bee Pre Order", type: "Apps", what: "Public app plus its website and demo store: pre-orders, deposits, back-in-stock alerts", stack: "React Router · Polaris", url: "https://bpo.beecreative.pk", image: "/work/beepreorder.webp" },
  { name: "Bee Bundle Box", type: "Apps", what: "Public app plus its website and demo theme: build-your-own bundle boxes", stack: "React Router · Extensions · Liquid" },
  { name: "Parcel Intelligence", type: "Apps", what: "Extension-only Shopify app for a store migration", stack: "Preact · App Bridge", url: "https://parcelintelligence.com.au", image: "/work/pts.webp" },
  { name: "Northfield", type: "Apps", what: "Bulk store-data migration with GraphQL bulk operations", stack: "Admin GraphQL" },
  // Web & WordPress
  { name: "Infuse Digitals", type: "Web", what: "Agency site rebuilt from a WordPress backup", stack: "React · Vite · GSAP · Lenis", url: "https://infusedigitals.com", image: "/work/infuse.webp" },
  { name: "Adjuvia Therapeutics", type: "Web", what: "Homepage built from Figma", stack: "WordPress", url: "https://adjuvia.com", image: "/work/adjuvia.webp" },
  { name: "Paradise Jets", type: "Web", what: "Responsive audit and fixes across Elementor pages", stack: "WordPress · Elementor", url: "https://paradisejets.com", image: "/work/paradise.webp" },
  { name: "Easystyle Landscaping", type: "Web", what: "Patio & paving page rebuild, image SEO", stack: "WordPress · Divi", url: "https://www.easystylelandscaping.ie", image: "/work/easystyle.webp" },
  { name: "SAK Professional", type: "Web", what: "Accounting services and homepage rebuild", stack: "WordPress · Elementor", url: "https://sakprofessional.ca", image: "/work/sak.webp" },
  { name: "The Artes Group", type: "Web", what: "WordPress site work via a custom REST connector", stack: "WordPress · PHP", url: "https://theartesgroup.com", image: "/work/artes.webp" },
  { name: "ExitRight", type: "Web", what: "Founder landing page", stack: "HTML", image: "/work/exitright.webp" },
  { name: "Jordan RSVP", type: "Web", what: "Form → Zapier → Klaviyo access-code email flow", stack: "Zapier · Klaviyo", image: "/work/jordan.webp" },
];

export const process = [
  { title: "Scope", body: "Requirements, technical scoping and a timeline you can hold me to." },
  { title: "Build", body: "Theme or app built in sprints, with code review before anything merges." },
  { title: "QA", body: "Cross-browser and device testing against the original design." },
  { title: "Launch", body: "Planned release with a rollback path, so your store never goes dark." },
  { title: "Support", body: "Post-launch fixes and improvements as your store grows." },
];

export const experience = [
  {
    company: "Beecreative.pk",
    dates: "Mar 2021 – Present",
    summary: "300+ Shopify and eCommerce projects across many industries, from custom themes to custom apps.",
    roles: [
      {
        title: "Production Manager",
        dates: "Feb 2025 – Present",
        body: "Lead 2 development and SEO teams (13+ developers and PMs) from scoping to post-launch. I'm the technical bridge between clients, sales and engineering.",
        current: true,
      },
      {
        title: "Team Lead",
        dates: "Mar 2024 – Feb 2025",
        body: "Set technical standards and reviewed all code before release. Coached developers on Liquid, JavaScript and Shopify best practices.",
      },
      {
        title: "Senior CMS Developer",
        dates: "Jun 2022 – Mar 2024",
        body: "Built custom themes from scratch and custom apps on the Admin and Storefront APIs. Owned complex client requirements end to end.",
      },
      {
        title: "Junior CMS Developer",
        dates: "Mar 2021 – Jun 2022",
        body: "Built and customised storefronts with Liquid, sections and metafield-driven content. Handled client change requests and bug fixes.",
      },
    ],
  },
  {
    company: "WeBytez Technologies",
    dates: "Oct 2019 – Dec 2020",
    roles: [
      {
        title: "Project Manager (Service Delivery)",
        body: "Ran client communication, requirements and delivery for web and digital products, coordinating designers and developers.",
      },
    ],
  },
];

export const education = "BS Computer Science, Sir Syed University of Engineering & Technology (2018–2022)";

// Tech tiles: `mark` is the short label on the tile, `bg`/`fg` are the brand colours.
export const tech = [
  { name: "JavaScript", mark: "JS", bg: "#F7DF1E", fg: "#1A1A1A" },
  { name: "TypeScript", mark: "TS", bg: "#3178C6", fg: "#FFFFFF" },
  { name: "HTML5", mark: "5", bg: "#E34F26", fg: "#FFFFFF" },
  { name: "CSS / SCSS", mark: "Sass", bg: "#C6538C", fg: "#FFFFFF" },
  { name: "React", mark: "Re", bg: "#61DAFB", fg: "#0B2530" },
  { name: "Node.js", mark: "N", bg: "#417E38", fg: "#FFFFFF" },
  { name: "Shopify", mark: "S", bg: "#5E8E3E", fg: "#FFFFFF" },
  { name: "Liquid", mark: "{%}", bg: "#95BF47", fg: "#14210A" },
  { name: "Polaris", mark: "P", bg: "#008060", fg: "#FFFFFF" },
  { name: "Remix / React Router", mark: "RR", bg: "#121212", fg: "#FFFFFF" },
  { name: "GraphQL", mark: "GQL", bg: "#E10098", fg: "#FFFFFF" },
  { name: "PHP", mark: "php", bg: "#777BB4", fg: "#FFFFFF" },
  { name: "WordPress", mark: "W", bg: "#21759B", fg: "#FFFFFF" },
  { name: "Elementor", mark: "E", bg: "#92003B", fg: "#FFFFFF" },
  { name: "Webflow", mark: "Wf", bg: "#146EF5", fg: "#FFFFFF" },
  { name: "Express.js", mark: "ex", bg: "#3A3A3A", fg: "#FFFFFF" },
  { name: "MySQL", mark: "SQL", bg: "#00758F", fg: "#FFFFFF" },
  { name: "PostgreSQL", mark: "PG", bg: "#336791", fg: "#FFFFFF" },
  { name: "Prisma", mark: "▲", bg: "#2D3748", fg: "#FFFFFF" },
  { name: "GSAP", mark: "GS", bg: "#0AE448", fg: "#0E1A10" },
  { name: "Vite", mark: "V", bg: "#646CFF", fg: "#FFFFFF" },
  { name: "Git / GitHub", mark: "GH", bg: "#F05032", fg: "#FFFFFF" },
  { name: "Figma", mark: "F", bg: "#F24E1E", fg: "#FFFFFF" },
  { name: "Adobe XD", mark: "Xd", bg: "#470137", fg: "#FF61F6" },
];

export const delivery = ["Agile / Scrum", "Sprint planning", "Code review", "QA & releases", "Jira", "ClickUp", "Asana", "Monday", "Trello"];
