// Checks the built site in out/ against the task rules. Run automatically after `npm run build`.
//  - the word count on the pages matches the footer (generated/wordcount.json)
//  - no em dashes, en dashes or semicolons in any visible text, alt text or labels
//  - the map has 31 provinces, each painted exactly the colour its output has on the continuous scale (bigger output, darker colour), and the legend and table match
//  - the favicon is there and linked, every page has one h1, internal links work
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rgbToLab } from "./colour.mjs";
import { makeScale } from "./scale.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const problems = [];
const warn = [];

const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d))).replace(/&amp;/g, "&");
const stripTags = (s) => decode(s.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " "));
const countWords = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "_next" ? [] : htmlFiles(p);
    return e.name.endsWith(".html") ? [p] : [];
  });
}

if (!fs.existsSync(OUT)) { console.error("No out/ folder. Run npm run build first."); process.exit(1); }
const expected = JSON.parse(fs.readFileSync(path.join(ROOT, "generated/wordcount.json"), "utf8"));
let total = 0;
const perPage = {};
const banned = /\b(delve|tapestry|pivotal|crucial|landscape|navigat\w*|robust|multifaceted|nuanced|underscore\w*|testament|furthermore|moreover|in conclusion|not only)\b/i;

for (const file of htmlFiles(OUT)) {
  const rel = path.relative(OUT, file);
  const html = fs.readFileSync(file, "utf8");
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const head = (body.match(/<head>([\s\S]*?)<\/head>/) || ["", ""])[1];
  const visible = stripTags(body.replace(/<head>[\s\S]*?<\/head>/, "")) + " " + stripTags((head.match(/<title>[\s\S]*?<\/title>/) || [""])[0]);
  const attrs = [...body.matchAll(/(?:aria-label|alt|title)="([^"]*)"/g)].map((m) => decode(m[1])).join(" ");
  const meta = [...head.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => decode(m[1])).join(" ");
  const all = `${visible} ${attrs} ${meta}`;
  for (const [ch, name] of [["—", "em dash"], ["–", "en dash"], [";", "semicolon"]]) {
    if (all.includes(ch)) {
      const at = all.indexOf(ch);
      problems.push(`${rel}: ${name} in "${all.slice(Math.max(0, at - 40), at + 20).replace(/\s+/g, " ")}"`);
    }
  }
  const b = all.match(banned);
  if (b && !rel.startsWith("404") && !rel.startsWith("_not-found")) warn.push(`${rel}: check wording "${b[0]}"`);

  if (rel.startsWith("404") || rel.startsWith("_not-found")) continue;
  const h1s = (body.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${rel}: ${h1s} h1 headings`);
  if (!/<link rel="icon" href="\/favicon\.ico/.test(head) && !/<link rel="icon"[^>]*favicon\.ico/.test(head)) problems.push(`${rel}: favicon.ico not linked`);
  if (!/<link rel="icon"[^>]*icon\.svg/.test(head)) problems.push(`${rel}: icon.svg not linked`);

  let words = 0;
  for (const m of body.matchAll(/<(p|h1|h2|li|figcaption)\b[^>]*\bdata-count=""[^>]*>([\s\S]*?)<\/\1>/g)) words += countWords(stripTags(m[2]));
  perPage[rel] = words;
  total += words;

  for (const m of body.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = m[1];
    const candidates = [path.join(OUT, target), path.join(OUT, target, "index.html"), path.join(OUT, `${target}.html`)];
    if (!candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile())) problems.push(`${rel}: broken link ${target}`);
  }

  if (rel === path.join("where", "index.html")) {
    const mapData = JSON.parse(fs.readFileSync(path.join(ROOT, "generated/map.json"), "utf8"));
    const { stops, ticks, domainMax } = mapData.legend;
    const scale = makeScale(domainMax);
    const rgbOf = (css) => css.match(/[\d.]+/g).map(Number);
    const drawn = [...body.matchAll(/<use\b[^>]*class="prov"[^>]*>/g)].map((m) => m[0]);
    if (drawn.length !== 31) problems.push(`map: ${drawn.length} provinces drawn, expected 31`);
    // every province has a figure and is painted exactly the colour that figure has on the scale
    const shades = [];
    for (const tag of drawn) {
      const code = (tag.match(/data-code="([A-Z]+)"/) || [])[1];
      const fill = (tag.match(/fill="(rgb\([^"]*\))"/) || [])[1];
      const p = mapData.provinces.find((q) => q.code === code);
      if (!p || typeof p.value !== "number") { problems.push(`map: ${code} has no figure`); continue; }
      if (fill !== scale.css(p.value)) problems.push(`map: ${code} is painted ${fill} but an output of ${p.value} is ${scale.css(p.value)} on the scale`);
      shades.push({ code, value: p.value, fill, L: rgbToLab(rgbOf(fill))[0] });
    }
    // a bigger output is never a lighter colour (going down the ranking the colours only get lighter)
    shades.sort((a, b) => b.value - a.value);
    for (let i = 1; i < shades.length; i++) {
      if (shades[i].L < shades[i - 1].L - 1e-3) { problems.push(`map: ${shades[i].code} (${shades[i].value}) is darker than ${shades[i - 1].code} (${shades[i - 1].value}) although its output is smaller`); break; }
    }
    // different outputs never share a colour code, so no difference in output is lost
    const distinctOutputs = new Set(shades.map((x) => x.value)).size;
    const distinctColours = new Set(shades.map((x) => x.fill)).size;
    if (distinctColours !== distinctOutputs) problems.push(`map: ${distinctOutputs} different outputs but ${distinctColours} different colours`);
    // the bar under the map is the same scale, with a number for each tick
    const gradient = `linear-gradient(to right, ${stops.map((x) => `${x.fill} ${(x.t * 100).toFixed(3)}%`).join(", ")})`;
    if (!body.includes(`<span class="scale-bar" style="background:${gradient}"`)) problems.push("map: the colour bar does not match the scale");
    const tickLabels = [...body.matchAll(/<span style="left:[\d.]+%">([^<]*)<\/span>/g)].map((m) => m[1]);
    if (tickLabels.join(" ") !== ticks.map((x) => x.label).join(" ")) problems.push(`map: scale numbers ${tickLabels.join(" ")} do not match ${ticks.map((x) => x.label).join(" ")}`);
    // the table lists all 31 provinces (plus the header and the national total), each with its map colour
    const details = (body.match(/<details>[\s\S]*?<\/details>/) || [""])[0];
    const tableRows = (details.match(/<tr[\s>]/g) || []).length;
    if (tableRows !== 33) problems.push(`map: table has ${tableRows} rows, expected 33`);
    const swatches = [...details.matchAll(/<i class="sw" style="background:(rgb\([^)]*\))"/g)].map((m) => m[1]);
    const ranked = [...mapData.provinces].sort((a, b) => a.rank - b.rank).map((q) => q.fill);
    if (swatches.join() !== ranked.join()) problems.push("map: the colours in the table do not match the map");
    console.log(`map: ${drawn.length} provinces, ${distinctColours} different colours for ${distinctOutputs} different outputs`);
  }
}

// the shares quoted on page 1 must match the map data, and Heilongjiang must be the biggest producer
{
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, "generated/map.json"), "utf8"));
  const v = Object.fromEntries(m.provinces.map((p) => [p.code, p.value]));
  const where = fs.readFileSync(path.join(OUT, "where", "index.html"), "utf8");
  const hl = ((v.HL / m.meta.nationalTotal) * 100).toFixed(1);
  if (!where.includes(`${hl} per cent`)) problems.push(`page 1 should give Heilongjiang's share as ${hl} per cent`);
  if (["HL", "JL", "LN", "NM"].every((c) => v[c] !== null)) {
    const belt = (((v.HL + v.JL + v.LN + v.NM) / m.meta.nationalTotal) * 100).toFixed(1);
    if (!where.includes(`${belt} per cent`)) problems.push(`page 1 should give the corn belt share as ${belt} per cent`);
  }
  const top = m.provinces.filter((p) => p.value !== null).sort((a, b) => b.value - a.value)[0];
  if (top.code !== "HL") problems.push(`${top.en} grew more corn than Heilongjiang, so the home page claim is wrong`);
}

if (total !== expected.total) problems.push(`word count on the pages is ${total}, footer says ${expected.total}`);
for (const f of ["favicon.ico", "icon.svg", "apple-icon.png"]) if (!fs.existsSync(path.join(OUT, f))) problems.push(`missing ${f}`);

console.log("words per page", perPage);
console.log(`word count ${total} (footer ${expected.total})`);
for (const w of warn) console.log("note:", w);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n - ${problems.join("\n - ")}`);
  process.exit(1);
}
console.log("All checks passed.");
