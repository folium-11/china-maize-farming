import home from "./home.js";
import where from "./where.js";
import soil from "./soil.js";
import policy from "./policy.js";
import people from "./people.js";
import management from "./management.js";
import evidence from "./evidence.js";
import { pages, mainQuestion, subQuestions } from "./site.js";
import { captions } from "./figures.js";

export const blocksFor = {
  "/": home,
  "/where/": where,
  "/soil/": soil,
  "/policy/": policy,
  "/people/": people,
  "/management/": management,
  "/evidence/": evidence,
};

export const questionText = (q) => (q === "main" ? mainQuestion : subQuestions[q]);

// Every piece of text that counts towards the word count, page by page, in reading order.
// mapCaptionData is the last sentence of the map caption, which changes when the NBS table is complete.
export function countedText(href, mapCaptionData) {
  const page = pages.find((p) => p.href === href);
  const out = [page.title];
  for (const b of blocksFor[href] ?? []) {
    if (b.p) out.push(b.p);
    if (b.h2) out.push(b.h2);
    if (b.ul) out.push(...b.ul);
    if (b.question !== undefined) out.push(questionText(b.question));
    if (b.fig) {
      const c = captions[b.fig];
      out.push(`${c.label} ${c.text}${b.fig === "map" ? " " + mapCaptionData : ""}`);
    }
  }
  return out;
}
