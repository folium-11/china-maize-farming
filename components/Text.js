import Link from "next/link";
import { parse } from "@/content/text.js";

// Renders a line of my content with Harvard in-text citations that link to the reference list.
export default function Text({ children }) {
  return parse(children).map((s, i) => {
    if (s.text !== undefined) return s.text;
    if (s.em !== undefined) return <em key={i}>{s.em}</em>;
    const links = s.cite.map((c, j) => (
      <span key={c.id}>
        {j > 0 ? ", " : ""}
        <Link href={`/references/#${c.id}`}>{c.label}</Link>
      </span>
    ));
    return (
      <span className="cite" key={i}>
        {s.wrap ? "(" : ""}
        {links}
        {s.wrap ? ")" : ""}
      </span>
    );
  });
}
