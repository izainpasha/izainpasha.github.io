import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/index.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import App from "./App.jsx";
import "./style.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships pre-rendered HTML (scripts/prerender.mjs); hydrate it.
// In dev the root is empty, so render from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
