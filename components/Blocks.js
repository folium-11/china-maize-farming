import Link from "next/link";
import Text from "./Text";
import ChinaMap from "./ChinaMap";
import SoilProfile from "./SoilProfile";
import ProductionImports from "./ProductionImports";
import ComparisonTable from "./ComparisonTable";
import ConceptMap from "./ConceptMap";
import { questionText } from "@/content/index.js";
import { pages } from "@/content/site.js";

const figures = { map: ChinaMap, soil: SoilProfile, chart: ProductionImports, table: ComparisonTable, cmap: ConceptMap };

// data-count marks the text that is included in the word count (checked by scripts/check-site.mjs)
export default function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.p) return <p key={i} data-count=""><Text>{b.p}</Text></p>;
    if (b.h2) return <h2 key={i} data-count="">{b.h2}</h2>;
    if (b.ul)
      return (
        <ul key={i} className="points">
          {b.ul.map((t, j) => <li key={j} data-count=""><Text>{t}</Text></li>)}
        </ul>
      );
    if (b.question !== undefined)
      return (
        <p key={i} className="question" data-count="">
          <Text>{questionText(b.question)}</Text>
        </p>
      );
    if (b.fig) {
      const Figure = figures[b.fig];
      return <Figure key={i} />;
    }
    if (b.toc)
      return (
        <ul key={i} className="toc">
          {pages.slice(1).map((p) => (
            <li key={p.href}>
              <Link href={p.href}>{p.title}</Link>
            </li>
          ))}
        </ul>
      );
    return null;
  });
}
