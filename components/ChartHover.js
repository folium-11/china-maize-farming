"use client";
import { useEffect, useState } from "react";

// Crosshair and readout for Figure 3. Works with the mouse, a tap or the Tab key.
export default function ChartHover({ years, production, imports, forecastIndex }) {
  const [i, setI] = useState(null);

  useEffect(() => {
    const root = document.getElementById("prod-imports");
    if (!root) return undefined;
    const show = (e) => {
      const hit = e.target.closest ? e.target.closest("rect.hit") : null;
      if (!hit) return;
      const k = Number(hit.getAttribute("data-i"));
      setI(k);
      for (const svg of root.querySelectorAll("svg.chart")) {
        const x = svg.querySelector(`rect.hit[data-i="${k}"]`)?.getAttribute("data-x");
        for (const l of svg.querySelectorAll("line.xhair")) {
          l.setAttribute("x1", x);
          l.setAttribute("x2", x);
          l.setAttribute("visibility", "visible");
        }
        for (const c of svg.querySelectorAll("circle.pt")) c.classList.toggle("on", c.getAttribute("data-i") === String(k));
      }
    };
    root.addEventListener("pointerover", show);
    root.addEventListener("click", show);
    root.addEventListener("focusin", show);
    return () => {
      root.removeEventListener("pointerover", show);
      root.removeEventListener("click", show);
      root.removeEventListener("focusin", show);
    };
  }, []);

  return (
    <p className="map-panel" aria-live="polite">
      {i === null ? (
        "Hover over, tap or tab through the years to read the values."
      ) : (
        <>
          <strong>{years[i]}</strong>: production {production[i].toFixed(2)} million tonnes, imports {imports[i].toFixed(2)} million
          tonnes{i === forecastIndex ? " (USDA forecast)" : ""} in the trade year from October {years[i]} to September {years[i] + 1}.
        </>
      )}
    </p>
  );
}
