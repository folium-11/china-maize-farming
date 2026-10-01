// Figure 4: concept map of my sources. Positions are for the wide (desktop) drawing.
// On phones the same information is shown as lists.
export const core = { label: "Maize farming in Heilongjiang", x: 500, y: 350 };

// label on each line from the core bubble to a group of sources: [x, y, anchor, text]
export const spokeLabels = [
  [440, 300, "end", "how much is grown"],
  [560, 300, "start", "what it does to soil"],
  [440, 414, "end", "who farms it"],
  [560, 414, "start", "how it is managed"],
];

export const clusters = [
  { id: "trade", title: "Production and trade (SQ1, SQ3)", x: 16, y: 16, fill: "#eef4fb" },
  { id: "soil", title: "Soil science (SQ2)", x: 584, y: 16, fill: "#f6efe4" },
  { id: "people", title: "People (SQ4)", x: 16, y: 434, fill: "#f3eef8" },
  { id: "manage", title: "Policy and management (SQ3, SQ5)", x: 584, y: 434, fill: "#edf5ea" },
];

export const nodes = [
  { id: "nbs", label: "NBS 2025", cluster: "trade", x: 100, y: 96 },
  { id: "usda", label: "USDA FAS 2025, 2026a, b", cluster: "trade", x: 316, y: 96, w: 214 },
  { id: "hpbs", label: "HPBS 2025, 2026", cluster: "trade", x: 210, y: 216 },
  { id: "jiang", label: "Jiang et al. 2025", cluster: "soil", x: 680, y: 96 },
  { id: "sui", label: "Sui and Dai 2025", cluster: "soil", x: 890, y: 96 },
  { id: "fao", label: "FAO 2022", cluster: "soil", x: 785, y: 216 },
  { id: "caixin", label: "Caixin Global 2025", cluster: "people", x: 100, y: 514 },
  { id: "huo", label: "Huo et al. 2022", cluster: "people", x: 320, y: 514 },
  { id: "yu", label: "Yu et al. 2025", cluster: "people", x: 320, y: 634 },
  { id: "xinhua", label: "Xinhua 2022", cluster: "manage", x: 890, y: 514 },
  { id: "liao", label: "Liao et al. 2026", cluster: "manage", x: 680, y: 634 },
];

// agree: true is a solid line, false is a dashed line. lx, ly, anchor place the label.
export const links = [
  { a: "nbs", b: "usda", agree: true, text: "production figures about 1% apart", lx: 210, ly: 66 },
  { a: "nbs", b: "hpbs", agree: true, text: "output figures agree", lx: 150, ly: 166, anchor: "end" },
  { a: "usda", b: "hpbs", agree: false, text: "forecast 3% cut, real 0.5% rise", lx: 272, ly: 170, anchor: "start" },
  { a: "huo", b: "usda", agree: false, text: "income and profit figures differ", lx: 320, ly: 452 },
  { a: "caixin", b: "hpbs", agree: true, text: "population 30.29 to 30.01 million", lx: 150, ly: 380 },
  { a: "caixin", b: "huo", agree: true, text: "people leave, machines lag", lx: 210, ly: 486 },
  { a: "jiang", b: "sui", agree: true, text: "erosion figures agree", lx: 785, ly: 66 },
  { a: "jiang", b: "liao", agree: true, text: "same authors and funding", lx: 680, ly: 474 },
  { a: "sui", b: "xinhua", agree: false, text: "no till yield drop left out", lx: 890, ly: 300 },
  { a: "fao", b: "liao", agree: true, text: "same threats elsewhere", lx: 736, ly: 404, anchor: "start" },
  { a: "xinhua", b: "yu", agree: false, text: "9.33 Mha target, 54% adoption", lx: 560, ly: 574 },
  { a: "yu", b: "liao", agree: true, text: "trusted neighbours matter", lx: 500, ly: 660 },
];
