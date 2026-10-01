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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const TERRITORIES = {
    HK: "Hong Kong 香港",
    MO: "Macao 澳门",
    TW: "Taiwan 台湾"
};
function MapInteractions({ provinces, total, status, filled }) {
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
            if (!root || !hl) return undefined;
            const pick = {
                "MapInteractions.useEffect.pick": (e)=>{
                    const el = e.target.closest ? e.target.closest("[data-code]") : null;
                    if (!el) return;
                    const c = el.getAttribute("data-code");
                    setCode(c);
                    hl.setAttribute("href", `#p-${c}`);
                    hl.setAttribute("visibility", "visible");
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
    }["MapInteractions.useEffect"], []);
    let body = "Hover over, tap or tab to a province to see its figures.";
    if (code && TERRITORIES[code]) {
        body = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: TERRITORIES[code]
                }, void 0, false, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 40,
                    columnNumber: 14
                }, this),
                ": not included in NBS grain statistics."
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 40,
            columnNumber: 12
        }, this);
    } else if (code && byCode[code]) {
        const p = byCode[code];
        body = p.value === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "sw",
                    style: {
                        background: p.fill
                    }
                }, void 0, false, {
                    fileName: "[project]/components/MapInteractions.js",
                    lineNumber: 44,
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
                    lineNumber: 44,
                    columnNumber: 60
                }, this),
                ": figure not added yet."
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 44,
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
                    lineNumber: 47,
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
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                ": ",
                (p.value / 100).toFixed(2),
                " million tonnes of corn in 2025,",
                " ",
                (p.share * 100).toFixed(1),
                " per cent of China’s ",
                (total / 100).toFixed(2),
                " million tonnes. Rank ",
                p.rank,
                " of",
                " ",
                status === "complete" ? 31 : `the ${filled} provinces with figures`,
                "."
            ]
        }, void 0, true, {
            fileName: "[project]/components/MapInteractions.js",
            lineNumber: 46,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "map-panel",
        "aria-live": "polite",
        children: body
    }, void 0, false, {
        fileName: "[project]/components/MapInteractions.js",
        lineNumber: 55,
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
]);

//# sourceMappingURL=components_01i9z5g._.js.map