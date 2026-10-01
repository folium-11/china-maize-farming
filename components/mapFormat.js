// Number formats shared by the map, its info panel and its table.
// Values are in 10,000 tonnes (the unit NBS uses) and shares are fractions of the national total.

/** Million tonnes with two decimals. Tiny values are shown as "<0.01". */
export const mt2 = (v) => (v === 0 ? "0" : v < 0.5 ? "<0.01" : (v / 100).toFixed(2));

/** Per cent of China's corn, with more decimals for the small provinces. */
export const pct = (share) => {
  const x = share * 100;
  return x === 0 ? "0" : x < 0.005 ? "<0.01" : x < 1 ? x.toFixed(2) : x.toFixed(1);
};

/** The same figure for a sentence ("under 0.01" reads better than "<0.01"). */
export const say = (text) => text.replace("<", "under ");
