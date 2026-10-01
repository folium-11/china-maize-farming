import Link from "next/link";
import Blocks from "./Blocks";
import { pages } from "@/content/site.js";
import { blocksFor } from "@/content/index.js";

export default function PageShell({ href, children }) {
  const i = pages.findIndex((p) => p.href === href);
  const page = pages[i];
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const blocks = blocksFor[href];
  return (
    <>
      <div className="prose">
        <h1 data-count={blocks ? "" : undefined}>{page.title}</h1>
        {blocks ? <Blocks blocks={blocks} /> : null}
        {children}
      </div>
      <nav className="pager" aria-label="Previous and next page">
        {prev ? <Link href={prev.href} rel="prev">← {prev.title}</Link> : <span />}
        {next ? <Link href={next.href} rel="next">{next.title} →</Link> : <span />}
      </nav>
    </>
  );
}
