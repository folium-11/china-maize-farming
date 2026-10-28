// Photographs and graphs from the internet, shown on the pages with their credit and licence.
// Their captions are not counted in the word count (they describe the picture, not my research).
const commons = "https://commons.wikimedia.org/wiki/";
const licences = {
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "Public domain": null,
};

const photo = (p) => ({ kind: "Photo", ...p, licenceUrl: licences[p.licence], source: commons + p.file, sourceName: "Wikimedia Commons" });
const owid = (p) => ({ kind: "Graph", ...p, author: "Our World in Data", licence: "CC BY 4.0", licenceUrl: licences["CC BY 4.0"], sourceName: "Our World in Data" });

export const photos = {
  bayan: photo({
    src: "/photos/bayan-county-farmland.jpg", width: 1600, height: 1066, wide: true,
    alt: "Aerial view of a county town surrounded by flat, green farmland divided into large rectangular fields",
    caption: "Flat farmland around the county town of Bayan, near Harbin in Heilongjiang, seen from a plane in August 2016.",
    author: "Ting Chen", licence: "CC BY-SA 2.0", file: "File:%E5%B7%B4%E5%BD%A6%E5%8E%BF_(29523552006).jpg",
  }),
  chernozem: photo({
    src: "/photos/chernozem-profile.jpg", width: 426, height: 1600, tall: true,
    alt: "A tall soil sample with a thick, nearly black upper layer that slowly turns lighter brown further down",
    caption: "A preserved profile of a chernozem, one of the world’s black soils. The dark upper layer is the topsoil rich in organic matter.",
    author: "Rockwurm (ISRIC World Soil Information)", licence: "CC BY-SA 3.0", file: "File:Chernozem.JPG",
  }),
  rill: photo({
    src: "/photos/rill-erosion-iowa.jpg", width: 1400, height: 999,
    alt: "A sloping field of young corn plants cut by many small channels and one deeper gully where rain has washed the soil away",
    caption: "Rill and gully erosion after heavy rain in a young corn field in Iowa, United States, another of the world’s black soil regions.",
    author: "Lynn Betts, USDA Natural Resources Conservation Service", licence: "Public domain", file: "File:NRCSIA99145_-_Iowa_(2991)(NRCS_Photo_Gallery).jpg",
  }),
  cornsoy: photo({
    src: "/photos/corn-and-soybean-jilin.jpg", width: 1600, height: 1066,
    alt: "Tall corn plants on either side of a field of low, leafy soybean plants, with hills in the distance",
    caption: "Corn growing beside soybeans near Jiaohe in Jilin province, north-east China, August 2013.",
    author: "wanghongliu", licence: "CC BY-SA 3.0", file: "File:%E7%8E%89%E7%B1%B3%E5%92%8C%E5%A4%A7%E8%B1%86_corn_%5E_soybean_-_panoramio.jpg",
  }),
  crib: photo({
    src: "/photos/corn-crib-liaoning.jpg", width: 1400, height: 1050,
    alt: "Harvested yellow corn cobs stacked behind wire mesh in a metal storage crib",
    caption: "Harvested corn cobs drying in a family’s storage crib in Gaizhou, Liaoning, in the north-east corn belt, October 2019.",
    author: "Jason M. C. Han", licence: "CC BY-SA 4.0", file: "File:Corns_Harvesting_Storage.jpg",
  }),
  village: photo({
    src: "/photos/jiansheng-village.jpg", width: 1600, height: 1066,
    alt: "Aerial view of a small village of houses and gardens in a neat grid, surrounded on all sides by large green fields",
    caption: "Jiansheng, a small farming village on the Sanjiang Plain in eastern Heilongjiang, seen from a plane in August 2016.",
    author: "Ting Chen", licence: "CC BY-SA 2.0", file: "File:%E5%BB%BA%E8%83%9C%E6%9D%91_August_2016_in_China.jpg",
  }),
  straw: photo({
    src: "/photos/corn-in-straw-residue.jpg", width: 1400, height: 1050,
    alt: "Rows of green corn plants growing through a ground cover of dry straw left from the previous crop",
    caption: "Corn growing through straw left on the surface from the last crop, the same idea as the Lishu Model. Photographed in South Dakota, United States.",
    author: "USDA Natural Resources Conservation Service, South Dakota", licence: "Public domain", file: "File:Corn_in_Residue_with_Healthy_Soil_(9314025147).jpg",
  }),
  yields: owid({
    src: "/graphs/corn-yields-owid.png", width: 1700, height: 1200, graph: true,
    alt: "Line graph of corn yields in tonnes per hectare from 1866 to 2025. The United States rises to about 11.7 tonnes, while China, Ukraine and the world average rise more slowly to between about 5.8 and 6.6 tonnes.",
    caption: "Corn yields in China, Ukraine, the United States and the world, in tonnes per hectare. China’s yield has climbed steadily since 1961 but is still only a little over half of the United States’ yield. Data from USDA NASS (2026) and FAO (2025).",
    source: "https://ourworldindata.org/grapher/maize-yields?tab=chart&country=CHN~USA~UKR~OWID_WRL",
  }),
  urban: owid({
    src: "/graphs/china-urban-share-owid.png", width: 1700, height: 1200, graph: true,
    alt: "Line graph of the share of China’s population living in urban areas from 1950 to 2025. It stays below 20 percent until about 1980, then rises steadily to about 66 percent in 2025.",
    caption: "Share of China’s population living in towns and cities, 1950 to 2025. It passed half in about 2011 and is now about two thirds. Data from the UN Population Division (2025).",
    source: "https://ourworldindata.org/grapher/share-of-population-urban?tab=chart&country=CHN",
  }),
  pyramid: photo({
    kind: "Graph", src: "/graphs/heilongjiang-age-pyramid-2019.png", width: 480, height: 422, graph: true, narrow: true,
    alt: "Population pyramid of Heilongjiang in 2019 by five-year age group, males in blue on the left and females in red on the right. The widest bars are ages 40 to 54, and the bars for children and young adults are much narrower.",
    caption: "Heilongjiang’s population by age and sex in 2019, in units of 10,000 people (blue male, red female). The widest bars are people aged 40 to 54, with far fewer children and young adults below them.",
    author: "Rickky1409", licence: "CC BY-SA 4.0", file: "File:China_Heilongjiang_pop_SbA5y_pyramid2019.png",
  }),
};
