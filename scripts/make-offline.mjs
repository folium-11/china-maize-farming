// Makes offline/, a copy of the built site that opens straight from a folder (double-click
// offline/index.html), with no web server. It removes the JavaScript and turns every link into a
// relative link. Everything still shows, including all four figures and their data tables. Only the
// hover readouts under Figures 1 and 3 need JavaScript, so they are left out of this copy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const OFF = path.join(ROOT, "offline");
if (!fs.existsSync(OUT)) { console.error("Run npm run build first."); process.exit(1); }
fs.rmSync(OFF, { recursive: true, force: true });

const keep = (rel) => rel.endsWith(".html") || rel.endsWith(".css") || /\.(svg|ico|png)$/.test(rel);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

for (const file of walk(OUT)) {
  const rel = path.relative(OUT, file).split(path.sep).join("/");
  if (!keep(rel) || rel.startsWith("404") || rel.startsWith("_not-found")) continue;
  const dest = path.join(OFF, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!rel.endsWith(".html")) { fs.copyFileSync(file, dest); continue; }

  const up = "../".repeat(rel.split("/").length - 1) || "./";
  const local = (url) => {
    const [pathPart, hash] = url.split("#");
    let p = pathPart.split("?")[0].replace(/^\//, "");
    if (p === "" || p.endsWith("/")) p += "index.html";
    return up + p + (hash ? `#${hash}` : "");
  };
  let html = fs.readFileSync(file, "utf8")
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]*rel="(?:preload|modulepreload)"[^>]*>/g, "")
    .replace(/<p class="map-panel"[\s\S]*?<\/p>/g, "")
    .replace(/(href|src)="(\/[^"]*)"/g, (_, attr, url) => `${attr}="${local(url)}"`);
  fs.writeFileSync(dest, html);
}
console.log("offline copy written to offline/ (open offline/index.html)");
