// Turns the text in my content files into pieces for the page.
//   [[jiang]]          -> (Jiang et al. 2025)
//   [[hlj24,hlj25]]    -> (Heilongjiang Provincial Bureau of Statistics 2025, 2026)
//   [[jiang:n]]        -> Jiang et al. (2025)
//   *words*            -> italics
// The same function is used by scripts/count-words.mjs, so the word count matches what is on the page.
import { byId } from "./bibliography.js";

const split = (cite) => {
  const i = cite.lastIndexOf(" ");
  return [cite.slice(0, i), cite.slice(i + 1)];
};

export function parse(str) {
  const out = [];
  const re = /\[\[([^\]]+)\]\]|\*([^*]+)\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ text: str.slice(last, m.index) });
    if (m[2] !== undefined) {
      out.push({ em: m[2] });
    } else {
      const [ids, mode] = m[1].split(":");
      const list = ids.split(",").map((s) => s.trim());
      for (const id of list) if (!byId[id]) throw new Error(`Unknown source "${id}" in: ${str}`);
      if (mode === "n") {
        const [author, year] = split(byId[list[0]].cite);
        out.push({ cite: [{ id: list[0], label: `${author} (${year})` }], wrap: false });
      } else {
        const parts = [];
        let prev = null;
        for (const id of list) {
          const [author, year] = split(byId[id].cite);
          parts.push({ id, label: author === prev ? year : `${author} ${year}` });
          prev = author;
        }
        out.push({ cite: parts, wrap: true });
      }
    }
    last = re.lastIndex;
  }
  if (last < str.length) out.push({ text: str.slice(last) });
  return out;
}

export function plain(str) {
  return parse(str)
    .map((s) => s.text ?? s.em ?? (s.wrap ? `(${s.cite.map((c) => c.label).join(", ")})` : s.cite[0].label))
    .join("");
}

// A word is anything between spaces that has a letter or a number in it.
export const countWords = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
