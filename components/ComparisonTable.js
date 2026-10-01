import Link from "next/link";
import Text from "./Text";
import { captions } from "@/content/figures.js";
import { columns, rows } from "@/content/table.js";
import { byId } from "@/content/bibliography.js";

export default function ComparisonTable() {
  const c = captions.table;
  return (
    <figure className="table-fig">
      <figcaption data-count="" className="cap-top">
        <strong>{c.label}</strong> <Text>{c.text}</Text>
      </figcaption>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Table 1, scrolls sideways">
        <table className="cmp">
          <thead>
            <tr>
              <th scope="col">Sub-question</th>
              {columns.map((id, i) => (
                <th scope="col" key={id}>
                  <span className="tag">{i + 1}</span> <Link href={`/references/#${id}`}>{byId[id].cite}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.label} className={ri === 0 ? "first" : undefined}>
                <th scope="row">{r.label}</th>
                {r.cells.map((cell, i) => (
                  <td key={columns[i]} className={cell ? undefined : "none"}>{cell || "Not covered"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Sources 1 to 7 are from my research log and 8 to 11 were added later. Mt means million tonnes and Mha million hectares. Scroll sideways to see every source.</p>
    </figure>
  );
}
