"use client";
import { useEffect, useMemo, useState } from "react";
import { mt2, pct, say } from "./mapFormat";

const TERRITORIES = {
  HK: "Hong Kong 香港",
  MO: "Macao 澳门",
  TW: "Taiwan 台湾",
};

// Hover, tap or tab to a province (or to its row in the key for the small ones) to see its figures.
// The map itself is drawn on the server, so this only listens for events, writes the info panel
// and moves the marker on the colour scale to where that province's output sits.
export default function MapInteractions({ provinces, totals, year }) {
  const [code, setCode] = useState(null);
  const byCode = useMemo(() => Object.fromEntries(provinces.map((p) => [p.code, p])), [provinces]);

  useEffect(() => {
    const root = document.getElementById("china-map");
    const hl = document.getElementById("map-hl");
    const marker = document.getElementById("scale-marker");
    if (!root || !hl) return undefined;
    const pick = (e) => {
      const el = e.target.closest ? e.target.closest("[data-code]") : null;
      if (!el) return;
      const c = el.getAttribute("data-code");
      setCode(c);
      hl.setAttribute("href", `#p-${c}`);
      hl.setAttribute("visibility", "visible");
      if (marker) {
        marker.hidden = !byCode[c]; // Hong Kong, Macao and Taiwan are not on the scale
        if (byCode[c]) marker.style.left = `${byCode[c].t * 100}%`;
      }
    };
    root.addEventListener("pointerover", pick);
    root.addEventListener("click", pick);
    root.addEventListener("focusin", pick);
    return () => {
      root.removeEventListener("pointerover", pick);
      root.removeEventListener("click", pick);
      root.removeEventListener("focusin", pick);
    };
  }, [byCode]);

  let body = "Hover over, tap or tab to a province to see its figures.";
  if (code && TERRITORIES[code]) {
    body = <><strong>{TERRITORIES[code]}</strong>: not included in NBS grain statistics.</>;
  } else if (code && byCode[code]) {
    const p = byCode[code];
    body = p.year === null ? (
      <><i className="sw" style={{ background: p.fill }} /><strong>{p.en} {p.zh}</strong>: no corn output is recorded in NBS statistics.</>
    ) : (
      <>
        <i className="sw" style={{ background: p.fill }} />
        <strong>{p.en} {p.zh}</strong>: {say(mt2(p.value))} million tonnes of corn in {p.year}, {say(pct(p.share))} per cent of
        China’s {mt2(totals[p.year])} million tonnes that year. Rank {p.rank} of {provinces.length}.
        {p.year !== year ? ` The ${year} figure is not out yet.` : ""}
      </>
    );
  }
  return (
    <p className="map-panel" aria-live="polite">
      {body}
    </p>
  );
}
