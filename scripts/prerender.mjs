// Injects the server-rendered app into dist/index.html so content paints before JS loads.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const file = resolve("dist/index.html");
const html = readFileSync(file, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("root placeholder not found in dist/index.html");
let out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

// Inline the (small) stylesheet so first paint doesn't wait on a second request.
out = out.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve("dist" + href), "utf8");
  return `<style>${css}</style>`;
});
writeFileSync(file, out);
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("prerendered dist/index.html");
