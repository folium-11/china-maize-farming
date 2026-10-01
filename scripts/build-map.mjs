// Builds generated/map.json for the choropleth (Figure 1).
//  1. reads data/corn_by_province.csv (one NBS based figure for every province, in 10,000 tonnes, with the year it is for) and checks it
//  2. projects the full 1:10m Natural Earth boundaries (Albers equal area conic, parallels 25 and 47, centred on 105 E)
//  3. paints every province with the colour its exact output has on one continuous scale (scripts/scale.mjs), pale maize
//     yellow to black-soil brown, linear in output and even in colour difference, so there are no classes
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { geoConicEqualArea, geoPath } from "d3-geo";
import { rgbToLab, hexToRgb, deltaE, inkFor } from "./colour.mjs";
import { makeScale } from "./scale.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// ---------- 1. data ----------
function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); cell = ""; if (row.length > 1 || row[0] !== "") rows.push(row); row = []; }
    else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}
const geometry = JSON.parse(read("data/china_provinces.json"));
const national = JSON.parse(read("data/national.json"));
const table = parseCsv(process.env.CORN_CSV ? fs.readFileSync(process.env.CORN_CSV, "utf8") : read("data/corn_by_province.csv"));
const provinces = geometry.filter((g) => g.kind === "province");
const territories = geometry.filter((g) => g.kind === "territory");

// Every province has a figure. It is for 2025, or for 2024 where the province has not published a 2025 figure yet.
const YEAR = national.year, PREV = national.previous.year;
const totalFor = { [YEAR]: national.maize_10kt, [PREV]: national.previous.maize_10kt };
const SOURCE_TYPES = ["nbs", "release", "ceic", "none"]; // NBS data site, province release, CEIC copy of the NBS series, none recorded

const problems = [];
if (table.length !== 31) problems.push(`corn_by_province.csv has ${table.length} rows, expected 31`);
const byCode = new Map(table.map((r) => [r.code, r]));
for (const p of provinces) if (!byCode.has(p.code)) problems.push(`missing row for ${p.code} ${p.en}`);
for (const r of table) {
  const zero = r.corn_10kt !== "" && Number(r.corn_10kt) === 0;
  if (r.corn_10kt === "" || !(Number.isFinite(Number(r.corn_10kt)) && Number(r.corn_10kt) >= 0)) problems.push(`${r.code}: "${r.corn_10kt}" is not a number (every province needs a figure)`);
  if (r.year === "" ? !zero : ![YEAR, PREV].includes(Number(r.year))) problems.push(`${r.code}: year "${r.year}" must be ${PREV} or ${YEAR} (only a figure of 0 may leave it blank)`);
  if (!SOURCE_TYPES.includes(r.source_type)) problems.push(`${r.code}: source_type "${r.source_type}" must be ${SOURCE_TYPES.join(", ")}`);
}
if (problems.length) { console.error("Map data problems:\n - " + problems.join("\n - ")); process.exit(1); }

const value = (code) => Number(byCode.get(code).corn_10kt);
const yearOf = (code) => (byCode.get(code).year === "" ? null : Number(byCode.get(code).year));
const sum = provinces.reduce((s, p) => s + value(p.code), 0);
const nCurrent = provinces.filter((p) => yearOf(p.code) === YEAR).length;
const nPrevious = provinces.filter((p) => yearOf(p.code) === PREV).length;
const nNone = provinces.length - nCurrent - nPrevious;
const sumGap = (sum - national.maize_10kt) / national.maize_10kt;
if (Math.abs(sumGap) > 0.01) {
  console.error(`The 31 figures add up to ${sum.toFixed(1)}, more than 1% away from the national ${national.maize_10kt}. Check the table.`);
  process.exit(1);
}

// ---------- 2. projection ----------
const W = 1000, PAD = 8;
const toFeature = (g) => ({ type: "Feature", properties: { code: g.code }, geometry: { type: "MultiPolygon", coordinates: g.polygons } });
const all = { type: "FeatureCollection", features: geometry.map(toFeature) };
const projection = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]).fitWidth(W - 2 * PAD, all);
const t = projection.translate(); projection.translate([t[0] + PAD, t[1] + PAD]);
const gp = geoPath(projection).digits(1);
const [[, y0], [, y1]] = geoPath(projection).bounds(all);
const H = Math.ceil(y1 + PAD);
// Shorter path text with exactly the same shape at 0.1 px: consecutive duplicate points
// (created by rounding) are removed and the points are written as relative moves.
const fmt = (tenths) => (tenths / 10).toString().replace(/^(-?)0\./, "$1.");
function compact(d) {
  let out = "";
  for (const ring of d.split("M").filter(Boolean)) {
    const pts = ring.replace(/Z$/, "").split("L").map((s) => s.split(",").map((v) => Math.round(parseFloat(v) * 10)));
    const clean = [];
    for (const p of pts) { const q = clean[clean.length - 1]; if (!q || q[0] !== p[0] || q[1] !== p[1]) clean.push(p); }
    if (clean.length > 1) { const a = clean[0], b = clean[clean.length - 1]; if (a[0] === b[0] && a[1] === b[1]) clean.pop(); }
    if (clean.length < 3) continue;
    let body = "";
    for (let i = 1; i < clean.length; i++) {
      for (const t of [fmt(clean[i][0] - clean[i - 1][0]), fmt(clean[i][1] - clean[i - 1][1])]) body += (body && !t.startsWith("-") ? " " : "") + t;
    }
    out += `M${fmt(clean[0][0])} ${fmt(clean[0][1])}l${body}z`;
  }
  return out;
}
const pathOf = (g) => compact(gp(toFeature(g)));
// Label anchor: the point inside the largest polygon that is furthest from its edges
// (so a name never sits in a neighbouring province), plus that distance, which says how much room there is.
const areaOf = (g) => geoPath(projection).area(g);
function insideRings([x, y], rings) {
  let c = false;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function edgeDistance([x, y], rings) {
  let best = Infinity;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [ax, ay] = r[j], [bx, by] = r[i];
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0;
    const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
    if (d < best) best = d;
  }
  return best;
}
function anchor(g) {
  let best = null, bestA = -1;
  for (const pg of g.polygons) {
    const f = { type: "Feature", geometry: { type: "Polygon", coordinates: pg } };
    const a = areaOf(f); if (a > bestA) { bestA = a; best = pg; }
  }
  const rings = best.map((ring) => ring.map((p) => projection(p)));
  const xs = rings[0].map((p) => p[0]), ys = rings[0].map((p) => p[1]);
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0b = Math.min(...ys), y1b = Math.max(...ys);
  let pick = null, pickD = -1;
  let step = Math.max(x1 - x0, y1b - y0b) / 28;
  for (let round = 0; round < 3; round++) {
    for (let x = x0; x <= x1; x += step) for (let y = y0b; y <= y1b; y += step) {
      if (!insideRings([x, y], rings)) continue;
      const d = edgeDistance([x, y], rings);
      if (d > pickD) { pickD = d; pick = [x, y]; }
    }
    // search again, more finely, around the best point so far
    x0 = pick[0] - step; x1 = pick[0] + step; y0b = pick[1] - step; y1b = pick[1] + step; step /= 5;
  }
  return [Math.round(pick[0] * 10) / 10, Math.round(pick[1] * 10) / 10, bestA, Math.round(pickD * 10) / 10];
}

// ---------- 3. colour scale ----------
// Output goes straight onto the scale. The darkest end is the biggest output, so Heilongjiang is the darkest province.
const vmax = Math.max(...provinces.map((p) => value(p.code)));
const scale = makeScale(vmax);
const NA_GREY = "#d4d4d4";

// ---------- 4. checks ----------
const lab = (v) => rgbToLab(scale.rgb(v));
// lightness falls all the way along the scale
let lightnessFalls = true;
for (let i = 1; i <= 2000; i++) if (lab((i / 2000) * vmax)[0] >= lab(((i - 1) / 2000) * vmax)[0]) lightnessFalls = false;
// every equal step in output changes the colour by the same amount
const STEPS = 1000;
const stepDelta = Array.from({ length: STEPS }, (_, i) => deltaE(lab((i / STEPS) * vmax), lab(((i + 1) / STEPS) * vmax)));
const stepMean = stepDelta.reduce((a, b) => a + b) / STEPS;
const stepSpread = (Math.max(...stepDelta) - Math.min(...stepDelta)) / stepMean;
// every different output has its own colour, and no colour on the scale is close to the grey used for no data
const fills = new Map(provinces.map((p) => [p.code, scale.css(value(p.code))]));
const clashes = [];
let nearPairs = 0, pairs = 0;
for (const a of provinces) for (const b of provinces) {
  if (a.code >= b.code) continue;
  pairs++;
  if (Math.abs(value(a.code) - value(b.code)) * scale.perUnit < 1) nearPairs++;
  if (value(a.code) !== value(b.code) && fills.get(a.code) === fills.get(b.code)) clashes.push(`${a.en} and ${b.en}`);
}
const greyLab = rgbToLab(hexToRgb(NA_GREY));
const minGrey = Math.min(...Array.from({ length: 101 }, (_, i) => deltaE(lab((i / 100) * vmax), greyLab)));
// label text must be readable on its province
const inks = new Map(provinces.map((p) => [p.code, inkFor(scale.rgb(value(p.code)))]));
const minContrast = Math.min(...[...inks.values()].map((k) => k.contrast));
if (!lightnessFalls) problems.push("the scale must get darker all the way along");
if (stepSpread > 0.01) problems.push(`the colour does not change evenly with output (steps differ by ${(stepSpread * 100).toFixed(1)}%)`);
if (clashes.length) problems.push(`different outputs share one colour: ${clashes.join(", ")}`);
if (minGrey < 8) problems.push(`the scale gets too close to the grey for no data (dE2000 ${minGrey.toFixed(1)})`);
if (minContrast < 4.5) problems.push(`a label is hard to read (contrast ${minContrast.toFixed(2)}, needs 4.5)`);
if (problems.length) { console.error("Map colour problems:\n - " + problems.join("\n - ")); process.exit(1); }
const perMt = scale.perUnit * 100; // colour difference for each million tonnes
console.log(`map: 31 provinces with figures (${nCurrent} for ${YEAR}, ${nPrevious} for ${PREV}, ${nNone} with none recorded), continuous scale from 0 to ${(vmax / 100).toFixed(1)} Mt, colour changes ${perMt.toFixed(2)} dE2000 per Mt (equal steps within ${(stepSpread * 100).toFixed(2)}% of each other), every different output has its own colour code, smallest gap to grey ${minGrey.toFixed(1)}, label contrast at least ${minContrast.toFixed(2)}`);
console.log(`map: the 31 figures add up to ${(sum / 100).toFixed(2)} Mt (${(sumGap * 100).toFixed(2)}% against the NBS total)`);
console.log(`note: one just-noticeable colour step (dE2000 1) is about ${(1 / perMt).toFixed(2)} Mt, so ${nearPairs} of ${pairs} pairs of provinces have colour codes that differ by less than the eye can see`);

// ---------- 5. output ----------
const ranked = [...provinces].sort((a, b) => value(b.code) - value(a.code));
const mt = (v) => v / 100;
// short value for the map labels, in million tonnes
const labelOf = (v) => (v === 0 ? "0" : mt(v) < 0.005 ? "<0.01" : mt(v) < 1 ? mt(v).toFixed(2) : mt(v).toFixed(1));
// round numbers along the scale bar (1, 2, 5, 10, 20 or 50 million tonnes apart), then the biggest output at the end
const tickStep = [100, 200, 500, 1000, 2000, 5000].find((s) => vmax / s <= 6) ?? 10000;
const tickValues = [];
for (let v = 0; v < vmax * 0.92; v += tickStep) tickValues.push(v);
tickValues.push(vmax);
const hasType = (t) => provinces.some((p) => byCode.get(p.code).source_type === t);
const sourceList = [hasType("nbs") && "[[nbsprov:n]]", hasType("release") && "provincial statistical releases", hasType("ceic") && "[[ceic:n]]"].filter(Boolean);
const sources = sourceList.length > 1 ? `${sourceList.slice(0, -1).join(", ")} and ${sourceList[sourceList.length - 1]}` : sourceList[0];
const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
const out = {
  viewBox: [W, H],
  meta: {
    year: YEAR, nationalTotal: national.maize_10kt, previousYear: PREV, previousTotal: national.previous.maize_10kt,
    previousCount: nPrevious, shownSum: Math.round(sum * 100) / 100, shownGap: sumGap,
    // last sentences of the Figure 1 caption (counted in the word count)
    captionData: `${nPrevious > 0 ? `An asterisk marks the ${nPrevious} provinces still on their ${PREV} figure. ` : ""}Data: ${sources}.`,
  },
  provinces: provinces.map((p) => {
    const v = value(p.code), y = yearOf(p.code), [cx, cy, a, room] = anchor(p), r = byCode.get(p.code), { ink } = inks.get(p.code);
    return {
      code: p.code, en: p.en, zh: p.zh, d: pathOf(p), cx, cy, room, area: Math.round(a),
      value: v, year: y, share: y === null ? 0 : v / totalFor[y], rank: ranked.findIndex((q) => q.code === p.code) + 1,
      t: scale.share(v), fill: fills.get(p.code), ink, halo: ink === "#ffffff" ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.55)",
      label: labelOf(v), type: r.source_type, note: r.source_note,
    };
  }),
  territories: territories.map((g) => ({ code: g.code, en: g.en, zh: g.zh, d: pathOf(g), fill: NA_GREY })),
  legend: {
    naFill: NA_GREY, domainMax: vmax,
    ticks: tickValues.map((v) => ({ v, t: scale.share(v), label: v === vmax ? mt(v).toFixed(1) : String(mt(v)) })),
    stops: scale.stops(),
  },
  colourCheck: {
    length: round(scale.length, 1), deltaEPerMt: round(perMt, 3), mtPerDeltaE: round(1 / perMt, 3), stepSpread: round(stepSpread, 4),
    minVsGrey: round(minGrey, 1), minContrast: round(minContrast, 2), lightnessFalls,
  },
};
fs.mkdirSync(path.join(ROOT, "generated"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "generated/map.json"), JSON.stringify(out));
console.log("wrote generated/map.json", (fs.statSync(path.join(ROOT, "generated/map.json")).size / 1024).toFixed(0) + " KB", `viewBox ${W}x${H}`);
