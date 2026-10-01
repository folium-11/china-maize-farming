import map from "@/generated/map.json";
import MapInteractions from "./MapInteractions";
import Text from "./Text";
import { captions } from "@/content/figures.js";
import { mt2, pct, say } from "./mapFormat";

const SOURCE = { nbs: "NBS data site", release: "Provincial release", ceic: "NBS via CEIC", none: "None recorded" };
const ROOM = 20; // provinces with less room than this (in map units) are listed in the key instead of being labelled
const KEY = { x: 14, w: 196, row: 19, pad: 10, head: 20 };

// Figure 1. Every province is drawn from the full 1:10m Natural Earth boundary (no simplifying).
// The paths are defined once and reused: a dark copy underneath draws the national border,
// then each province is filled with the colour that its exact output has on the scale below the map
// (scripts/scale.mjs), and a hairline on top keeps neighbouring pale provinces apart.
export default function ChinaMap() {
  const [W, H] = map.viewBox;
  const { meta, legend } = map;
  const all = [...map.provinces, ...map.territories];
  const ranked = [...map.provinces].sort((a, b) => a.rank - b.rank);
  const labelled = map.provinces.filter((p) => p.room >= ROOM);
  const small = map.provinces.filter((p) => p.room < ROOM).sort((a, b) => b.value - a.value);
  const slim = map.provinces.map(({ code, en, zh, value, year, share, rank, fill, t }) => ({ code, en, zh, value, year, share, rank, fill, t }));
  const star = (p) => (p.year !== null && p.year !== meta.year ? "*" : "");
  const c = captions.map;
  const keyH = KEY.pad + KEY.head + small.length * KEY.row + KEY.pad;
  const keyY = H - 14 - keyH;
  const gap = (Math.abs(meta.shownGap) * 100).toFixed(2);
  const gradient = `linear-gradient(to right, ${legend.stops.map((s) => `${s.fill} ${(s.t * 100).toFixed(3)}%`).join(", ")})`;
  return (
    <figure className="map-fig">
      <div className="map-wrap" id="china-map">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-labelledby="map-title">
          <title id="map-title">Map of China’s 31 provinces, shaded by corn output</title>
          <defs>
            {all.map((p) => <path key={p.code} id={`p-${p.code}`} d={p.d} />)}
          </defs>
          <g className="under" aria-hidden="true">
            {all.map((p) => <use key={p.code} href={`#p-${p.code}`} />)}
          </g>
          <g aria-hidden="true">
            {map.territories.map((t) => (
              <use key={t.code} href={`#p-${t.code}`} className="terr" fill={t.fill} stroke={t.fill} data-code={t.code} />
            ))}
          </g>
          <g>
            {map.provinces.map((p) => (
              <use
                key={p.code}
                href={`#p-${p.code}`}
                className="prov"
                fill={p.fill}
                data-code={p.code}
                tabIndex={0}
                role="img"
                aria-label={`${p.en}, ${p.year === null ? "no corn output recorded" : `${say(mt2(p.value))} million tonnes in ${p.year}`}`}
              />
            ))}
          </g>
          <g className="hair" aria-hidden="true">
            {map.provinces.map((p) => <use key={p.code} href={`#p-${p.code}`} />)}
          </g>
          <use id="map-hl" className="hl" href="#p-HL" visibility="hidden" aria-hidden="true" />
          <g className="labels" aria-hidden="true">
            {labelled.map((p) => (
              <text key={p.code} x={p.cx} y={p.cy} fill={p.ink} stroke={p.halo} className={`plabel${p.code === "HL" ? " keep" : ""}`}>
                <tspan x={p.cx} dy="-0.2em">{p.en}</tspan>
                <tspan x={p.cx} dy="1.15em" className="pval">{p.label}{star(p)}{p.rank === 1 ? " Mt" : ""}</tspan>
              </text>
            ))}
          </g>
          <g className="key" aria-hidden="true">
            <rect className="key-box" x={KEY.x} y={keyY} width={KEY.w} height={keyH} rx="6" />
            <text className="key-title" x={KEY.x + KEY.pad} y={keyY + KEY.pad + 11}>Too small to label</text>
            {small.map((p, i) => {
              const y = keyY + KEY.pad + KEY.head + i * KEY.row;
              return (
                <g key={p.code} className="key-row" data-code={p.code}>
                  <rect x={KEY.x + KEY.pad} y={y} width="14" height="14" fill={p.fill} className="key-sw" />
                  <text x={KEY.x + KEY.pad + 22} y={y + 11.5}>{p.en}</text>
                  <text x={KEY.x + KEY.w - KEY.pad} y={y + 11.5} className="key-val">{p.label}{star(p)}</text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <MapInteractions provinces={slim} totals={{ [meta.year]: meta.nationalTotal, [meta.previousYear]: meta.previousTotal }} year={meta.year} />
      <div className="legend" aria-hidden="true">
        <span className="legend-main">
          <span className="legend-title">Corn output, million tonnes</span>
          <span className="scale">
            <span className="scale-bar" style={{ background: gradient }}>
              <i id="scale-marker" className="scale-marker" hidden />
            </span>
            <span className="scale-ticks">
              {legend.ticks.map((k) => <span key={k.label} style={{ left: `${(k.t * 100).toFixed(3)}%` }}>{k.label}</span>)}
            </span>
          </span>
        </span>
        <span><i className="sw" style={{ background: legend.naFill }} /> not in NBS statistics</span>
        {meta.previousCount > 0 ? <span>* {meta.previousYear} figure (the {meta.year} figure is not out yet)</span> : null}
      </div>
      <figcaption data-count="">
        <strong>{c.label}</strong> <Text>{`${c.text} ${meta.captionData}`}</Text>
      </figcaption>
      <details>
        <summary>Show the figures as a table</summary>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="num">Rank</th>
                <th>Province</th>
                <th className="num">Corn, million tonnes</th>
                <th className="num">Year</th>
                <th className="num">Share of China that year, %</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((p) => (
                <tr key={p.code}>
                  <td className="num">{p.rank}</td>
                  <td><i className="sw" style={{ background: p.fill }} />{p.en} {p.zh}</td>
                  <td className="num">{mt2(p.value)}</td>
                  <td className="num">{p.year ?? "n/a"}</td>
                  <td className="num">{p.year === null ? "n/a" : pct(p.share)}</td>
                  <td>{SOURCE[p.type]}</td>
                </tr>
              ))}
              <tr>
                <th colSpan={2}>China, NBS total for {meta.year}</th>
                <td className="num">{mt2(meta.nationalTotal)}</td>
                <td className="num">{meta.year}</td>
                <td className="num">100.0</td>
                <td>NBS</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="note">
          Each share is a share of China’s total for the same year ({mt2(meta.nationalTotal)} million tonnes in {meta.year},{" "}
          {mt2(meta.previousTotal)} in {meta.previousYear}). The 31 figures add up to {mt2(meta.shownSum)} million tonnes,{" "}
          {gap} per cent {meta.shownGap < 0 ? "below" : "above"} the {meta.year} total.
        </p>
      </details>
    </figure>
  );
}
