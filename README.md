# Corn farming on the black soils of Heilongjiang Province, China

Year 10 Geography, Student Interest Project, Final Project (Albert Jiang). A website of about 2,000 words built with Next.js and React.

## Viewing the site

* **Quickest:** open `offline/index.html` in any browser. This copy works straight from the folder. It has every page, figure and data table, but the hover readouts under Figures 1 and 3 are switched off because they need JavaScript.
* **Full version:** the `out/` folder is the finished static website. Upload it to any static host (for example Netlify Drop or Vercel), or run it locally:

```
npm install
npm run build
npx serve out
```

Then open the address it prints. `npm run dev` also works while editing.

## Pages

| Page | Content |
| --- | --- |
| `/` | Title, main research question, short answer |
| `/where/` | Sub-question 1 and Figure 1, choropleth map of corn output by province |
| `/soil/` | Sub-question 2 and Figure 2, black soil cross-section |
| `/policy/` | Sub-question 3 and Figure 3, production against imports, 2015 to 2025 |
| `/people/` | Sub-question 4 |
| `/management/` | Sub-question 5 and the conclusion |
| `/evidence/` | Comparison table, concept map and limits of the evidence |
| `/references/` | Harvard reference list |

## The map (Figure 1)

* Boundaries are the Natural Earth 1:10 million admin 1 polygons (public domain), used at full detail with no simplifying, so each province follows its real border. `scripts/prep_geometry.py` made `data/china_provinces.json` (and `data/adjacency.json`, which the map no longer uses) from the Natural Earth GeoJSON file (`ne_10m_admin_1_states_provinces`). To remake them, save that file as `data/ne_admin1.geojson` and run `python3 scripts/prep_geometry.py`.
* Every province has a figure and its colour comes straight from that figure on one continuous scale. There are no classes. Output goes onto the scale in a straight line, from 0 (pale maize yellow) to the biggest output (Heilongjiang, black-soil brown), so any difference in output gives a different colour and a darker province always grew more corn.
* The colour changes by the same amount for every extra million tonnes. `scripts/scale.mjs` lays the ramp out by colour distance (CIEDE2000), not by RGB numbers, because blending two colours in RGB looks faster in some places. The build checks that equal steps in output change the colour by amounts within 1 per cent of each other. The look of the ramp is set by its `ANCHORS` (lightness, chroma and hue), which `scale.mjs` joins with a smooth curve.
* Colours are written with four decimals (for example `rgb(83.8393, 36.6595, 23.8033)`), so two provinces whose outputs are a hair apart still get different colour codes, and the build checks that every different output has its own code. A screen can only show 256 levels each of red, green and blue, so it rounds the numbers when it paints. One just-noticeable colour step is about 0.53 million tonnes (the build prints this), so provinces closer than that, such as Jiangsu and Ningxia, have different codes that look the same. The 17 smallest provinces are all under 4 million tonnes, which is about 8 per cent of Heilongjiang or less, so they sit in the palest part of the scale and look alike next to each other. That is what a straight scale does with output this uneven, and the table under the map has every figure.
* The bar under the map is the same scale. When you hover over a province a marker moves to its output on the bar.
* Each province shows its name and its output in million tonnes. An asterisk marks a province still on its 2024 figure (see below). Provinces too small for a label (at the moment Beijing, Tianjin, Shanghai, Jiangsu, Chongqing, Ningxia and Hainan) are listed in the box at the bottom left of the map, and hovering over a row highlights that province.
* Hong Kong, Macao and Taiwan are grey because National Bureau of Statistics grain figures do not cover them.

### The data

`data/corn_by_province.csv` has one row for each of the 31 provinces: corn output in 10,000 tonnes (the unit NBS uses), the year the figure is for, a `source_type` (`nbs` for the NBS data site, `release` for a province's own release, `ceic` for CEIC's copy of the NBS series, or `none`) and a `source_note` that says where it came from.

* **18 provinces use 2025 figures.** Fifteen come from the province's own 2025 statistical bulletin or statistics bureau release (`release`), and Shanxi, Gansu and Qinghai are 2025 NBS figures read from CEIC (`ceic`).
* **12 provinces use 2024 figures** from the NBS series on CEIC (`ceic`). Their 2025 bulletins do not state corn output, and the NBS data site (`data.stats.gov.cn`) would not open from the computer used to build this, so the 2025 provincial table could not be read. The CEIC series for all 31 provinces adds up to the NBS national total for 2024 (29,491.7), which suggests it copies the NBS table faithfully.
* **Hainan is 0** because NBS lists no corn output for it (its CEIC series stops at 0 in 2017).
* Together the 31 figures add up to 301.13 million tonnes, within 0.03 per cent of the NBS national total for 2025 (301.24). Each share in the table is a share of the national total for the same year.

To replace a 2024 figure when the NBS provincial table is available:

1. On data.stats.gov.cn choose Annual, then By Province, then Output of Corn (10,000 tons), year 2025.
2. Put each value in the `corn_10kt` column, set `year` to 2025, set `source_type` to `nbs` and update `source_note`.
3. Run `npm run build`.

The map, its caption (which stops mentioning asterisks and 2024 once every province is on 2025), its data table and the footer word count update themselves. The build stops if the 31 values add up to more than 1 per cent away from the national total of 30,123.5 (NBS 2025), which catches typing mistakes.

## Checks

`npm run build` runs `scripts/check-site.mjs` on the finished pages. It confirms that the word count shown in the footer matches the pages, that there are no em dashes, en dashes or semicolons anywhere in the visible text or labels, that the map has 31 provinces each painted exactly the colour its output has on the scale (it works the colour out again from the output), that a bigger output is never a lighter colour, that different outputs never share a colour code, that the colour bar and the table match the map, that the favicon is linked on every page and that every internal link works.

**Word count rule:** headings, paragraphs, lists and captions are counted, including in-text citations. The menu, contents list, tables, labels inside figures, the footer and the reference list are not counted.

## Folders

* `app/` pages, layout, styles and the favicon. `icon.svg` is the drawing (a corn cob growing out of black soil), `favicon.ico` holds 16, 32 and 48 pixel copies of it and `apple-icon.png` is a square 180 pixel copy for iPhones, which round the corners themselves. `public/brand.svg` (the logo in the page header) is the same drawing as `icon.svg`.
* `components/` the figures and page parts
* `content/` all of the writing, the reference list, the figure data and the comparison table
* `data/` map boundaries, province adjacency (made with the boundaries, no longer used by the map) and the corn table
* `scripts/` map builder, colour scale, word counter, site checks and the offline copy
* `generated/` files made by the scripts during the build
