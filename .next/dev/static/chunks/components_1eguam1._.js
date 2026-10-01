(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ChartHover.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChartHover
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ChartHover({ years, production, imports, forecastIndex }) {
    _s();
    const [i, setI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartHover.useEffect": ()=>{
            const root = document.getElementById("prod-imports");
            if (!root) return undefined;
            const show = {
                "ChartHover.useEffect.show": (e)=>{
                    const hit = e.target.closest ? e.target.closest("rect.hit") : null;
                    if (!hit) return;
                    const k = Number(hit.getAttribute("data-i"));
                    setI(k);
                    for (const svg of root.querySelectorAll("svg.chart")){
                        const x = svg.querySelector(`rect.hit[data-i="${k}"]`)?.getAttribute("data-x");
                        for (const l of svg.querySelectorAll("line.xhair")){
                            l.setAttribute("x1", x);
                            l.setAttribute("x2", x);
                            l.setAttribute("visibility", "visible");
                        }
                        for (const c of svg.querySelectorAll("circle.pt"))c.classList.toggle("on", c.getAttribute("data-i") === String(k));
                    }
                }
            }["ChartHover.useEffect.show"];
            root.addEventListener("pointerover", show);
            root.addEventListener("click", show);
            root.addEventListener("focusin", show);
            return ({
                "ChartHover.useEffect": ()=>{
                    root.removeEventListener("pointerover", show);
                    root.removeEventListener("click", show);
                    root.removeEventListener("focusin", show);
                }
            })["ChartHover.useEffect"];
        }
    }["ChartHover.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "map-panel",
        "aria-live": "polite",
        children: i === null ? "Hover over, tap or tab through the years to read the values." : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: years[i]
                }, void 0, false, {
                    fileName: "[project]/components/ChartHover.js",
                    lineNumber: 42,
                    columnNumber: 11
                }, this),
                ": production ",
                production[i].toFixed(2),
                " million tonnes, imports ",
                imports[i].toFixed(2),
                " million tonnes",
                i === forecastIndex ? " (USDA forecast)" : "",
                " in the trade year from October ",
                years[i],
                " to September ",
                years[i] + 1,
                "."
            ]
        }, void 0, true, {
            fileName: "[project]/components/ChartHover.js",
            lineNumber: 41,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ChartHover.js",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(ChartHover, "o/9QlKpEBTWL8Hbw2KPx/iumGTw=");
_c = ChartHover;
var _c;
__turbopack_context__.k.register(_c, "ChartHover");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MapInteractions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapInteractions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mapFormat.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const TERRITORIES = {
    HK: "Hong Kong 香港",
    MO: "Macao 澳门",
    TW: "Taiwan 台湾"
};
function MapInteractions({ provinces, totals, year }) {
    _s();
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const byCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MapInteractions.useMemo[byCode]": ()=>Object.fromEntries(provinces.map({
                "MapInteractions.useMemo[byCode]": (p)=>[
                        p.code,
                        p
                    ]
            }["MapInteractions.useMemo[byCode]"]))
    }["MapInteractions.useMemo[byCode]"], [
        provinces
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapInteractions.useEffect": ()=>{
            const root = document.getElementById("china-map");
            const hl = document.getElementById("map-hl");
            const marker = document.getElementById("scale-marker");
            if (!root || !hl) return undefined;
            const pick = {
                "MapInteractions.useEffect.pick": (e)=>{
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
                }
            }["MapInteractions.useEffect.pick"];
            root.addEventListener("pointerover", pick);
            root.addEventListener("click", pick);
            root.addEventListener("focusin", pick);
            return ({
                "MapInteractions.useEffect": ()=>{
                    root.removeEventListener("pointerover", pick);
                    root.removeEventListener("click", pick);
                    root.removeEventListener("focusin", pick);
                }
            })["MapInteractions.useEffect"];
        }
    }["MapInteractions.useEffect"], [
        byCode
    ]);
    let body = "Hover over, tap or tab to a province to see its figures.";
    if (code && TERRITORIES[code]) {
        body = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: TERRITORIES[code]
                }, void 0, false, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 47,
                    columnNumber: 14
                }, this),
                ": not included in NBS grain statistics."
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 47,
            columnNumber: 12
        }, this);
    } else if (code && byCode[code]) {
        const p = byCode[code];
        body = p.year === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "sw",
                    style: {
                        background: p.fill
                    }
                }, void 0, false, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: [
                        p.en,
                        " ",
                        p.zh
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 51,
                    columnNumber: 60
                }, this),
                ": no corn output is recorded in NBS statistics."
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 51,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "sw",
                    style: {
                        background: p.fill
                    }
                }, void 0, false, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: [
                        p.en,
                        " ",
                        p.zh
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                ": ",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["say"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mt2"])(p.value)),
                " million tonnes of corn in ",
                p.year,
                ", ",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["say"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pct"])(p.share)),
                " per cent of China’s ",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mapFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mt2"])(totals[p.year]),
                " million tonnes that year. Rank ",
                p.rank,
                " of ",
                provinces.length,
                ".",
                p.year !== year ? ` The ${year} figure is not out yet.` : ""
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "map-panel",
        "aria-live": "polite",
        children: body
    }, void 0, false, {
        fileName: "[project]/components/MapInteractions.js",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(MapInteractions, "44cY7cGDXw1XImI9gVBkMwpJrF8=");
_c = MapInteractions;
var _c;
__turbopack_context__.k.register(_c, "MapInteractions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/mapFormat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Number formats shared by the map, its info panel and its table.
// Values are in 10,000 tonnes (the unit NBS uses) and shares are fractions of the national total.
/** Million tonnes with two decimals. Tiny values are shown as "<0.01". */ __turbopack_context__.s([
    "mt2",
    ()=>mt2,
    "pct",
    ()=>pct,
    "say",
    ()=>say
]);
const mt2 = (v)=>v === 0 ? "0" : v < 0.5 ? "<0.01" : (v / 100).toFixed(2);
const pct = (share)=>{
    const x = share * 100;
    return x === 0 ? "0" : x < 0.005 ? "<0.01" : x < 1 ? x.toFixed(2) : x.toFixed(1);
};
const say = (text)=>text.replace("<", "under ");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_1eguam1._.js.map