// The colour scale for Figure 1: corn output (in 10,000 tonnes) to colour.
//  * continuous: there are no classes, so any difference in output, however small, gives a different colour
//  * linear: output goes straight onto the ramp, so 20 million tonnes sits half way between 0 and 40
//  * even: the ramp is laid out by colour distance (CIEDE2000), so every extra tonne of corn changes the colour
//    by the same visible amount. Blending two colours in RGB would not do that, it looks faster in some places.
// scripts/build-map.mjs paints the map with it and scripts/check-site.mjs checks the finished page against it.
import { deltaE, labToRgb255, lchToLab, rgbToLab } from "./colour.mjs";

// Pale maize yellow to black-soil brown, as [lightness, chroma, hue]. Lightness falls at every anchor, so darker always means more.
export const ANCHORS = [
  [96, 12, 97],
  [91, 30, 95],
  [84, 52, 91],
  [75, 68, 84],
  [65, 76, 72],
  [54, 68, 58],
  [43, 55, 48],
  [32, 42, 44],
  [21, 28, 42],
];
const SAMPLES = 4096;

/** A smooth curve through equally spaced values that never overshoots them (a monotone cubic). */
function smooth(ys) {
  const n = ys.length - 1;
  const d = ys.slice(1).map((y, k) => y - ys[k]);
  const slope = ys.map((_, k) => {
    if (k > 0 && k < n) return d[k - 1] * d[k] > 0 ? (2 * d[k - 1] * d[k]) / (d[k - 1] + d[k]) : 0;
    const [a, b] = k === 0 ? [d[0], d[1]] : [d[n - 1], d[n - 2]];
    const end = (3 * a - b) / 2;
    if (Math.sign(end) !== Math.sign(a)) return 0;
    return Math.sign(a) !== Math.sign(b) && Math.abs(end) > 3 * Math.abs(a) ? 3 * a : end;
  });
  return (u) => {
    const k = Math.min(n - 1, Math.floor(u)), s = u - k, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[k] + (s3 - 2 * s2 + s) * slope[k] + (-2 * s3 + 3 * s2) * ys[k + 1] + (s3 - s2) * slope[k + 1];
  };
}

const css = (rgb) => `rgb(${rgb.map((x) => x.toFixed(4)).join(", ")})`;

/** The scale for outputs from 0 up to domainMax (in 10,000 tonnes). */
export function makeScale(domainMax) {
  const curves = [0, 1, 2].map((c) => smooth(ANCHORS.map((a) => a[c])));
  // many points along the smooth path, as the colours that are really painted (pulled inside the sRGB gamut)
  const painted = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const [L, C, h] = curves.map((f) => f((i / SAMPLES) * (ANCHORS.length - 1)));
    return labToRgb255(lchToLab([L, C, h]));
  });
  // how far along the path each point is, measured in colour difference rather than in steps of the curve
  const along = [0];
  for (let i = 1; i <= SAMPLES; i++) along.push(along[i - 1] + deltaE(rgbToLab(painted[i - 1]), rgbToLab(painted[i])));
  const length = along[SAMPLES];

  const share = (v) => Math.min(1, Math.max(0, v / domainMax));
  const rgb = (v) => {
    const d = share(v) * length;
    let lo = 0, hi = SAMPLES;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (along[mid] <= d) lo = mid; else hi = mid; }
    const f = (d - along[lo]) / (along[lo + 1] - along[lo]);
    return painted[lo].map((x, k) => x + f * (painted[lo + 1][k] - x));
  };

  /** Colours for a CSS gradient. Stops are added until the browser's straight blend between them is within `tolerance` of the true colour. */
  function stops(tolerance = 0.2) {
    for (let n = 8; ; n *= 2) {
      const t = Array.from({ length: n + 1 }, (_, i) => i / n);
      const cols = t.map((x) => rgb(x * domainMax));
      let worst = 0;
      for (let i = 0; i < n; i++) {
        const blend = cols[i].map((c, k) => (c + cols[i + 1][k]) / 2);
        worst = Math.max(worst, deltaE(rgbToLab(rgb(((t[i] + t[i + 1]) / 2) * domainMax)), rgbToLab(blend)));
      }
      if (worst < tolerance || n >= 1024) return t.map((x, i) => ({ t: x, fill: css(cols[i]) }));
    }
  }

  return {
    domainMax,
    /** total colour distance from the palest to the darkest end (CIEDE2000) */
    length,
    /** colour distance for each 10,000 tonnes */
    perUnit: length / domainMax,
    /** where an output sits on the scale, from 0 to 1 */
    share,
    rgb,
    /** the colour as CSS, with four decimals so that tiny differences in output are still different colours */
    css: (v) => css(rgb(v)),
    stops,
  };
}
