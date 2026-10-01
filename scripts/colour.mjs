// Colour helpers for the choropleth: CIELAB, CIEDE2000, LCH to sRGB without rounding, readable label colour.
const WHITE = [0.95047, 1.0, 1.08883];
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToLab([r, g, b]) {
  const R = toLin(r / 255), G = toLin(g / 255), B = toLin(b / 255);
  const X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B;
  const Z = 0.0193339 * R + 0.119192 * G + 0.9503041 * B;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(X / WHITE[0]), fy = f(Y / WHITE[1]), fz = f(Z / WHITE[2]);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labToLinear([L, a, b]) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
  const X = inv(fx) * WHITE[0], Y = inv(fy) * WHITE[1], Z = inv(fz) * WHITE[2];
  return [
    3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z,
    -0.969266 * X + 1.8760108 * Y + 0.041556 * Z,
    0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z,
  ];
}

const inGamut = (lin) => lin.every((v) => v >= -0.0005 && v <= 1.0005);

/** Largest chroma that still fits inside sRGB at this lightness and hue. */
export function maxChroma(L, h) {
  let lo = 0, hi = 140;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const a = mid * Math.cos((h * Math.PI) / 180), b = mid * Math.sin((h * Math.PI) / 180);
    if (inGamut(labToLinear([L, a, b]))) lo = mid; else hi = mid;
  }
  return lo;
}

const RAD = Math.PI / 180;
/** CIELAB from lightness, chroma and hue (in degrees). */
export const lchToLab = ([L, C, h]) => [L, C * Math.cos(h * RAD), C * Math.sin(h * RAD)];
/** Lightness, chroma and hue (in degrees) from CIELAB. */
export const labToLch = ([L, a, b]) => [L, Math.hypot(a, b), (Math.atan2(b, a) / RAD + 360) % 360];

/**
 * CIELAB to sRGB with floating point channels from 0 to 255. Nothing is rounded, so two colours that differ
 * by a tiny amount stay different. A colour outside the sRGB gamut is pulled in by lowering its chroma,
 * which keeps its lightness and hue.
 */
export function labToRgb255(lab) {
  const [L, C, h] = labToLch(lab);
  const [, a, b] = lchToLab([L, Math.min(C, maxChroma(L, h)), h]);
  return labToLinear([L, a, b]).map((v) => fromLin(Math.min(1, Math.max(0, v))) * 255);
}

export const hexToRgb = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));

/** CIEDE2000 colour difference. */
export function deltaE(l1, l2) {
  const [L1, a1, b1] = l1, [L2, a2, b2] = l2, rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (b, a) => { const x = Math.atan2(b, a) / rad; return x < 0 ? x + 360 : x; };
  const h1p = C1p === 0 ? 0 : h(b1, a1p), h2p = C2p === 0 ? 0 : h(b2, a2p);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * rad) / 2);
  const Lpm = (L1 + L2) / 2, Cpm = (C1p + C2p) / 2;
  let hpm = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) <= 180) hpm /= 2; else hpm = (hpm + (hpm < 360 ? 360 : -360)) / 2;
  }
  const T = 1 - 0.17 * Math.cos((hpm - 30) * rad) + 0.24 * Math.cos(2 * hpm * rad)
    + 0.32 * Math.cos((3 * hpm + 6) * rad) - 0.2 * Math.cos((4 * hpm - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hpm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cpm ** 7 / (Cpm ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lpm - 50) ** 2) / Math.sqrt(20 + (Lpm - 50) ** 2);
  const Sc = 1 + 0.045 * Cpm, Sh = 1 + 0.015 * Cpm * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh));
}

/** Black or white label text for a fill given as [r, g, b], each from 0 to 255, and the contrast ratio it gets against that fill. */
export function inkFor(rgb) {
  const [r, g, b] = rgb.map((v) => toLin(v / 255));
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const black = (y + 0.05) / 0.05, white = 1.05 / (y + 0.05);
  return black > white ? { ink: "#000000", contrast: black } : { ink: "#ffffff", contrast: white };
}
