import PageShell from "@/components/PageShell";
import { refs, abbreviations } from "@/content/bibliography.js";

export const metadata = { title: "References" };

// *italics* and <links> inside a Harvard entry
function Entry({ text }) {
  return text
    .split(/(\*[^*]+\*|<https?:\/\/[^>]+>)/g)
    .filter(Boolean)
    .map((s, i) => {
      if (s.startsWith("*")) return <em key={i}>{s.slice(1, -1)}</em>;
      if (s.startsWith("<http")) {
        const url = s.slice(1, -1);
        return (
          <span key={i}>
            &lt;<a href={url}>{url}</a>&gt;
          </span>
        );
      }
      return s;
    });
}

export default function References() {
  return (
    <PageShell href="/references/">
      <p>Harvard style, in alphabetical order. The seven sources from my research log are unchanged.</p>
      <p className="abbr">Abbreviations used in my citations:</p>
      <ul className="abbr-list">
        {abbreviations.map(([a, full]) => (
          <li key={a}>
            <strong>{a}</strong>: {full}
          </li>
        ))}
      </ul>
      <ul className="refs">
        {refs.map((r) => (
          <li key={r.id} id={r.id}>
            <Entry text={r.ref} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
