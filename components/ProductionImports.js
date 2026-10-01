import Text from "./Text";
import ChartHover from "./ChartHover";
import { captions } from "@/content/figures.js";
import { years, production, imports, forecastIndex } from "@/content/series.js";

// Figure 3. Two panels with one axis each (never two y-axes on one plot): both series on the same
// scale, then imports on their own. A wide and a narrow version, so it can be read on a phone.
const BLUE = "#2a78d6";
const ORANGE = "#eb6834";

function Chart({ v }) {
  const n = years.length;
  const x = (i) => v.left + (i * (v.right - v.left)) / (n - 1);
  const step = (v.right - v.left) / (n - 1);
  const panels = [
    { key: "a", title: v.titleA, top: v.a[0], bottom: v.a[1], max: 350, ticks: [0, 100, 200, 300], series: ["p", "i"] },
    { key: "b", title: v.titleB, top: v.b[0], bottom: v.b[1], max: 35, ticks: [0, 10, 20, 30], series: ["i"] },
  ];
  const fs = v.fs;
  const line = (vals, y, from, to) => vals.slice(from, to + 1).map((d, k) => `${k ? "L" : "M"}${x(from + k).toFixed(1)},${y(d).toFixed(1)}`).join("");
  return (
    <svg className={`chart ${v.cls}`} viewBox={`0 0 ${v.W} ${v.H}`} role="img" aria-label={v.alt}>
      {panels.map((p) => {
        const y = (d) => p.bottom - (d / p.max) * (p.bottom - p.top);
        return (
          <g key={p.key}>
            <text x={v.left - 44} y={p.top - 18} fontSize={fs} className="lab">{p.title}</text>
            {p.ticks.map((t) => (
              <g key={t}>
                <line x1={v.left} x2={v.right} y1={y(t)} y2={y(t)} className={t === 0 ? "axis" : "grid"} />
                <text x={v.left - 8} y={y(t)} dy="0.35em" textAnchor="end" fontSize={fs * 0.9} className="tick">{t}</text>
              </g>
            ))}
            {years.map((yr, i) => (i % v.every === 0 ? (
              <text key={yr} x={x(i)} y={p.bottom + fs * 1.4} textAnchor="middle" fontSize={fs * 0.9} className="tick">{yr}</text>
            ) : null))}
            <line className="xhair" x1="0" x2="0" y1={p.top} y2={p.bottom} visibility="hidden" />
            {p.series.includes("p") ? (
              <g>
                <path d={line(production, y, 0, n - 1)} stroke={BLUE} strokeWidth="2.5" fill="none" />
                {production.map((d, i) => <circle key={i} data-i={i} cx={x(i)} cy={y(d)} r="4.5" fill={BLUE} className="pt" />)}
                <text x={v.labelAt === "end" ? x(n - 1) + 12 : x(0)} y={v.labelAt === "end" ? y(production[n - 1]) + 5 : y(production[0]) - 16} fontSize={fs} className="lab">
                  Production{v.labelAt === "end" ? ` ${production[n - 1].toFixed(1)}` : ""}
                </text>
              </g>
            ) : null}
            <g>
              <path d={line(imports, y, 0, forecastIndex - 1)} stroke={ORANGE} strokeWidth="2.5" fill="none" />
              <path d={line(imports, y, forecastIndex - 1, forecastIndex)} stroke={ORANGE} strokeWidth="2.5" strokeDasharray="6 5" fill="none" />
              {imports.map((d, i) => (
                <circle key={i} data-i={i} cx={x(i)} cy={y(d)} r="4.5" className="pt" fill={i === forecastIndex ? "#ffffff" : ORANGE} stroke={i === forecastIndex ? ORANGE : "#ffffff"} />
              ))}
              {p.key === "a" ? (
                <text x={v.labelAt === "end" ? x(n - 1) + 12 : x(0)} y={v.labelAt === "end" ? y(imports[n - 1]) + 5 : y(imports[0]) - 12} fontSize={fs} className="lab">
                  Imports{v.labelAt === "end" ? ` ${imports[n - 1].toFixed(1)}` : ""}
                </text>
              ) : (
                <>
                  <text x={x(5)} y={y(imports[5]) - 14} textAnchor="middle" fontSize={fs * 0.9}>29.5 in 2020</text>
                  <text x={x(9) - 16} y={y(imports[9]) - 8} textAnchor="end" fontSize={fs * 0.9}>1.8 in 2024</text>
                  <text x={x(10) + (v.labelAt === "end" ? 12 : 4)} y={y(imports[10]) - (v.labelAt === "end" ? 14 : 34)} textAnchor={v.labelAt === "end" ? "start" : "end"} fontSize={fs * 0.9}>5.0 forecast</text>
                </>
              )}
            </g>
          </g>
        );
      })}
      {years.map((yr, i) => (
        <rect key={yr} className="hit" data-i={i} data-x={x(i).toFixed(1)} x={x(i) - step / 2} y={v.a[0]} width={step} height={v.b[1] - v.a[0]} fill="transparent" tabIndex={v.cls === "only-wide" ? 0 : -1} aria-label={`${yr}`} />
      ))}
    </svg>
  );
}

const alt =
  "Line graph. China’s corn production rose from 265 million tonnes in 2015 to 301 million tonnes in 2025. Imports were under 8 million tonnes until 2019, jumped to 29.5 million tonnes in the 2020 trade year, stayed near 20 million tonnes until 2023, then fell to 1.8 million tonnes in 2024, with 5 million tonnes forecast for 2025.";

const wide = {
  cls: "only-wide", W: 1000, H: 620, left: 70, right: 820, fs: 16, every: 1, labelAt: "end", alt,
  titleA: "Production and imports on the same scale (million tonnes)", titleB: "Imports only (million tonnes)",
  a: [56, 300], b: [398, 570],
};
const narrow = {
  cls: "only-narrow", W: 480, H: 700, left: 56, right: 452, fs: 19, every: 2, labelAt: "start", alt,
  titleA: "Same scale (million tonnes)", titleB: "Imports only (million tonnes)",
  a: [62, 322], b: [450, 640],
};

export default function ProductionImports() {
  const c = captions.chart;
  return (
    <figure id="prod-imports">
      <p className="chart-legend" aria-hidden="true">
        <span><i className="legend-line" style={{ borderColor: BLUE }} />Production</span>
        <span><i className="legend-line" style={{ borderColor: ORANGE }} />Imports</span>
        <span><i className="legend-line dashed" style={{ borderColor: ORANGE }} />Forecast</span>
      </p>
      <Chart v={wide} />
      <Chart v={narrow} />
      <ChartHover years={years} production={production} imports={imports} forecastIndex={forecastIndex} />
      <figcaption data-count="">
        <strong>{c.label}</strong> <Text>{c.text}</Text>
      </figcaption>
      <details>
        <summary>Show the figures as a table</summary>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Year</th><th className="num">Production, million tonnes</th><th className="num">Imports, million tonnes (trade year from October)</th></tr>
            </thead>
            <tbody>
              {years.map((yr, i) => (
                <tr key={yr}>
                  <td>{yr}</td>
                  <td className="num">{production[i].toFixed(2)}</td>
                  <td className="num">{imports[i].toFixed(2)}{i === forecastIndex ? " (forecast)" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
