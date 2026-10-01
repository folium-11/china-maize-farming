import Text from "./Text";
import { captions } from "@/content/figures.js";

// Figure 2. Drawn by hand in SVG. Two panels: a conventionally ploughed field and a field with
// straw cover and no till. A wide version sits side by side, a narrow version is stacked for phones.
const PW = 480; // panel width
const top = (x) => 150 + (x - 20) * 0.082; // ground surface on a gentle slope (exaggerated)
const band = (a, b, x0 = 20, x1 = 460) => `${x0},${a(x0)} ${x1},${a(x1)} ${x1},${b(x1)} ${x0},${b(x0)}`;
const plough = (x) => top(x) + 26;
const black = (x) => top(x) + 64;
const trans = (x) => black(x) + 40;

const keys = {
  conv: [
    ["1", "Summer storms run off the slope and cut rills and gullies"],
    ["2", "Spring wind blows the bare, dry soil away"],
    ["3", "Machines compact the soil under the plough layer"],
    ["4", "Ploughing lets air in, so organic carbon breaks down (top 5 cm: 44.7 to 23.9 g/kg)"],
  ],
  managed: [
    ["A", "Straw cover: a third of the surface cuts erosion by about 80%, two thirds by about 95%"],
    ["B", "More rain soaks in, so less runs off"],
    ["C", "Seeds are drilled through the straw, with no ploughing"],
    ["D", "In Jilin, no till with all the straw left on lowered maize yields"],
  ],
};

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) { lines.push(line); line = w; } else line = (line + " " + w).trim();
  }
  lines.push(line);
  return lines;
}

const Marker = ({ x, y, t, fs }) => (
  <g className="marker">
    <circle cx={x} cy={y} r={fs * 0.72} />
    <text x={x} y={y} dy="0.35em" textAnchor="middle" fontSize={fs * 0.85}>{t}</text>
  </g>
);

// where each key line goes, and how tall the panel ends up
function keyLayout(kind, fs) {
  const perLine = Math.floor(420 / (fs * 0.54));
  let ky = 426 + fs;
  const rows = keys[kind].map(([m, t]) => {
    const row = { m, y: ky, lines: wrap(t, perLine) };
    ky += row.lines.length * fs * 1.25 + fs * 0.45;
    return row;
  });
  return { rows, height: Math.ceil(ky) };
}

function Panel({ kind, x, y, fs, p }) {
  const conv = kind === "conv";
  const keyRows = keyLayout(kind, fs).rows.map((r) => (
    <g key={r.m}>
      <Marker x={30} y={r.y - fs * 0.35} t={r.m} fs={fs} />
      <text x={50} y={r.y} fontSize={fs}>
        {r.lines.map((l, i) => <tspan key={i} x={50} dy={i ? "1.25em" : 0}>{l}</tspan>)}
      </text>
    </g>
  ));
  return (
    <g transform={`translate(${x},${y})`}>
      <text className="ttl" x={20} y={26} fontSize={fs * 1.1}>{conv ? "Conventional ploughing" : "Straw cover and no till"}</text>
      {/* soil layers */}
      <polygon points={`20,${black(20)} 460,${black(460)} 460,400 20,400`} fill="#d8b36a" />
      <polygon points={band(black, trans)} fill="#7a5634" />
      <polygon points={band(top, black)} fill="#2b1d12" />
      {conv ? <polygon points={band(top, plough)} fill="#44301f" /> : null}
      {conv ? <polygon points={band(plough, (x) => plough(x) + 7)} fill={`url(#${p}pan)`} /> : null}
      {conv
        ? [60, 120, 180, 240, 300, 360, 420].map((px) => (
            <path key={px} d={`M${px},${top(px) + 9} l22,2 M${px + 8},${top(px) + 17} l22,2`} stroke="#6d5238" strokeWidth="2" />
          ))
        : null}
      {conv ? (
        <>
          {/* the old surface */}
          <path d={`M20,${top(20) - 50} L460,${top(460) - 50}`} stroke="#6b6256" strokeWidth="2" strokeDasharray="7 6" fill="none" />
          <text x={24} y={top(24) - 57} fontSize={fs * 0.85} fill="#5c5348" transform={`rotate(4.7 24 ${top(24) - 57})`}>1950s surface: black topsoil 60 to 80 cm</text>
          <text x={28} y={black(28) - 9} fontSize={fs * 0.85} fill="#fff" transform={`rotate(4.7 28 ${black(28) - 9})`}>Now 20 to 40 cm thick</text>
          {/* gully */}
          <polygon points={`372,${top(372) - 1} 392,${top(392) + 34} 412,${top(412) - 1}`} fill="#fff" stroke="#2b1d12" strokeWidth="1.5" />
          {/* rain and runoff */}
          {[330, 352, 374, 396, 418].map((rx) => <path key={rx} d={`M${rx},48 l-9,34`} stroke="#2a78d6" strokeWidth="2.2" strokeLinecap="round" />)}
          <path d={`M300,${top(300) - 7} L362,${top(362) - 7}`} stroke="#2a78d6" strokeWidth="3" markerEnd={`url(#${p}arrow-blue)`} fill="none" />
          {/* wind */}
          <path d={`M214,${top(214) - 26} L318,${top(318) - 26}`} stroke="#6b6256" strokeWidth="3" markerEnd={`url(#${p}arrow-grey)`} fill="none" />
          {[236, 258, 280, 302].map((dx, i) => <circle key={dx} cx={dx} cy={top(dx) - 14 + (i % 2) * 5} r="2.6" fill="#7a5634" />)}
          {/* air in, carbon out */}
          <path d={`M160,${top(160) + 14} C152,${top(160) - 8} 170,${top(160) - 22} 162,${top(160) - 40}`} stroke="#6b6256" strokeWidth="2.5" markerEnd={`url(#${p}arrow-grey)`} fill="none" />
          <text x={172} y={top(160) - 30} fontSize={fs * 0.85} fill="#5c5348">CO₂</text>
          {/* tractor */}
          <g transform={`translate(52,${top(52) - 38}) rotate(4.7)`}>
            <rect x="0" y="12" width="46" height="14" rx="3" fill="#b54023" />
            <rect x="24" y="0" width="18" height="14" rx="2" fill="#b54023" />
            <circle cx="36" cy="28" r="10" fill="#1f1b16" />
            <circle cx="8" cy="31" r="6" fill="#1f1b16" />
          </g>
          {[70, 96].map((ax) => <path key={ax} d={`M${ax},${top(ax) + 4} L${ax},${plough(ax) + 2}`} stroke="#fff" strokeWidth="2" markerEnd={`url(#${p}arrow-white)`} />)}
          <Marker x={404} y={top(404) - 34} t="1" fs={fs} />
          <Marker x={262} y={top(262) - 44} t="2" fs={fs} />
          <Marker x={124} y={plough(124) - 2} t="3" fs={fs} />
          <Marker x={132} y={top(132) - 24} t="4" fs={fs} />
        </>
      ) : (
        <>
          {/* straw */}
          <polygon points={band((x) => top(x) - 9, top)} fill="#e2bf55" />
          {Array.from({ length: 30 }, (_, i) => 26 + i * 14.5).map((sx) => (
            <path key={sx} d={`M${sx},${top(sx) - 2} l10,-6`} stroke="#a37a16" strokeWidth="1.6" />
          ))}
          {/* rain soaking in */}
          {[60, 82, 104, 126, 148].map((rx) => <path key={rx} d={`M${rx},48 l-9,34`} stroke="#2a78d6" strokeWidth="2.2" strokeLinecap="round" />)}
          {[80, 128].map((ax) => <path key={ax} d={`M${ax},${top(ax) + 2} L${ax},${top(ax) + 44}`} stroke="#8fc0ff" strokeWidth="3" markerEnd={`url(#${p}arrow-lightblue)`} />)}
          {/* corn plants and roots */}
          {[250, 310, 370, 430].map((cx) => (
            <g key={cx}>
              <path d={`M${cx},${top(cx) - 8} L${cx},${top(cx) - 74}`} stroke="#3f7d20" strokeWidth="3" />
              <path d={`M${cx},${top(cx) - 30} q-16,-6 -22,-20 M${cx},${top(cx) - 46} q16,-6 22,-20 M${cx},${top(cx) - 60} q-12,-6 -16,-16`} stroke="#3f7d20" strokeWidth="2.5" fill="none" />
              <path d={`M${cx},${top(cx)} l-8,30 M${cx},${top(cx)} l0,40 M${cx},${top(cx)} l9,28`} stroke="#c9b08a" strokeWidth="1.4" fill="none" />
            </g>
          ))}
          <Marker x={196} y={top(196) - 26} t="A" fs={fs} />
          <Marker x={166} y={top(166) + 34} t="B" fs={fs} />
          <Marker x={282} y={top(282) - 86} t="C" fs={fs} />
          <Marker x={452} y={top(452) - 96} t="D" fs={fs} />
        </>
      )}
      {/* layer names */}
      <text x={452} y={black(452) - 8} textAnchor="end" fontSize={fs * 0.85} fill="#fff" transform={`rotate(4.7 452 ${black(452) - 8})`}>Black topsoil</text>
      <text x={452} y={trans(452) - 13} textAnchor="end" fontSize={fs * 0.85} fill="#fff" transform={`rotate(4.7 452 ${trans(452) - 13})`}>Transition layer</text>
      <text x={452} y={388} textAnchor="end" fontSize={fs * 0.85} fill="#3a2a10">Yellow subsoil</text>
      {keyRows}
    </g>
  );
}

const Defs = ({ p }) => (
  <defs>
    <pattern id={`${p}pan`} width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#16100a" />
      <circle cx="3" cy="3" r="1.1" fill="#8a7358" />
    </pattern>
    {[["blue", "#2a78d6"], ["grey", "#6b6256"], ["white", "#ffffff"], ["lightblue", "#8fc0ff"]].map(([n, c]) => (
      <marker key={n} id={`${p}arrow-${n}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={c} />
      </marker>
    ))}
  </defs>
);

export default function SoilProfile() {
  const c = captions.soil;
  const alt =
    "Two soil cross-sections on a gentle slope. On the left, a ploughed field has a thin black topsoil, a compacted layer, rills and gullies, wind erosion and carbon loss. On the right, straw cover and no till protect the surface and let rain soak in.";
  const wideH = Math.max(keyLayout("conv", 15).height, keyLayout("managed", 15).height) + 6;
  const narrowTop = keyLayout("conv", 19).height + 16;
  const narrowH = narrowTop + keyLayout("managed", 19).height + 6;
  return (
    <figure>
      <svg className="diagram only-wide" viewBox={`0 0 1000 ${wideH}`} role="img" aria-label={alt}>
        <Defs p="w-" />
        <Panel kind="conv" x={10} y={0} fs={15} p="w-" />
        <Panel kind="managed" x={510} y={0} fs={15} p="w-" />
      </svg>
      <svg className="diagram only-narrow" viewBox={`0 0 480 ${narrowH}`} role="img" aria-label={alt}>
        <Defs p="n-" />
        <Panel kind="conv" x={0} y={0} fs={19} p="n-" />
        <Panel kind="managed" x={0} y={narrowTop} fs={19} p="n-" />
      </svg>
      <figcaption data-count="">
        <strong>{c.label}</strong> <Text>{c.text}</Text>
      </figcaption>
    </figure>
  );
}
