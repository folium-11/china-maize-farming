import Text from "./Text";
import { captions } from "@/content/figures.js";
import { core, clusters, nodes, links, spokeLabels } from "@/content/conceptmap.js";

const CW = 400; // cluster width
const CH = 250; // cluster height
const NW = 186; // node width
const NH = 38; // node height
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

export default function ConceptMap() {
  const c = captions.cmap;
  const corners = [[416, 266], [584, 266], [416, 434], [584, 434]];
  return (
    <figure>
      <svg className="cmap" viewBox="0 0 1000 700" role="img" aria-labelledby="cmap-title">
        <title id="cmap-title">Concept map linking my sources to the core idea, maize farming in Heilongjiang</title>
        {clusters.map((k) => (
          <g key={k.id}>
            <rect x={k.x} y={k.y} width={CW} height={CH} rx="14" fill={k.fill} />
            <text x={k.x + 16} y={k.y < 300 ? k.y + 26 : k.y + CH - 14} className="ctitle">{k.title}</text>
          </g>
        ))}
        {corners.map(([x, y]) => (
          <line key={`${x}${y}`} x1={core.x} y1={core.y} x2={x} y2={y} className="spoke" />
        ))}
        {links.map((l) => (
          <line
            key={l.a + l.b}
            x1={byId[l.a].x} y1={byId[l.a].y} x2={byId[l.b].x} y2={byId[l.b].y}
            className={l.agree ? "link" : "link dis"}
          />
        ))}
        {spokeLabels.map(([x, y, anchor, t]) => (
          <text key={t} x={x} y={y} textAnchor={anchor} className="llab slab">{t}</text>
        ))}
        {links.map((l) => (
          <text key={`t${l.a}${l.b}`} x={l.lx} y={l.ly} textAnchor={l.anchor || "middle"} className="llab">{l.text}</text>
        ))}
        <ellipse cx={core.x} cy={core.y} rx="122" ry="52" className="core" />
        <text x={core.x} y={core.y} textAnchor="middle" className="coretext">
          <tspan x={core.x} dy="-0.2em">Maize farming</tspan>
          <tspan x={core.x} dy="1.2em">in Heilongjiang</tspan>
        </text>
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x - (n.w || NW) / 2} y={n.y - NH / 2} width={n.w || NW} height={NH} rx="8" className="node" />
            <text x={n.x} y={n.y} dy="0.35em" textAnchor="middle" className="ntext">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="cmap-list">
        <p><strong>Core idea:</strong> {core.label}. It links to {spokeLabels.map((s) => s[3]).join(", ")}.</p>
        {clusters.map((k) => (
          <p key={k.id}>
            <strong>{k.title}:</strong> {nodes.filter((n) => n.cluster === k.id).map((n) => n.label).join(", ")}
          </p>
        ))}
        <p><strong>Connections</strong></p>
        <ul>
          {links.map((l) => (
            <li key={l.a + l.b}>
              {byId[l.a].label} and {byId[l.b].label}: {l.text} <span className="tag">{l.agree ? "agree" : "disagree"}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="chart-legend only-wide" aria-hidden="true">
        <span><i className="legend-line" style={{ borderColor: "#5c5348" }} />Sources agree</span>
        <span><i className="legend-line dashed" style={{ borderColor: "#b54023" }} />Sources disagree</span>
      </p>
      <figcaption data-count="">
        <strong>{c.label}</strong> <Text>{c.text}</Text>
      </figcaption>
    </figure>
  );
}
