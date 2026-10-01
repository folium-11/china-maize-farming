// Counts the words in the project (headings, paragraphs, lists and captions, with in-text citations).
// Not counted: the menu, the contents list, the reference list, tables, labels inside figures and the footer.
// Writes generated/wordcount.json, which the footer shows. scripts/check-site.mjs checks it against the built pages.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blocksFor, countedText } from "../content/index.js";
import { plain, countWords } from "../content/text.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "generated/map.json"), "utf8"));

const perPage = {};
let total = 0;
for (const href of Object.keys(blocksFor)) {
  const n = countedText(href, map.meta.captionData).reduce((s, t) => s + countWords(plain(t)), 0);
  perPage[href] = n;
  total += n;
}
fs.mkdirSync(path.join(ROOT, "generated"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "generated/wordcount.json"), JSON.stringify({ total, perPage }, null, 2));
console.log("word count", total, perPage);
