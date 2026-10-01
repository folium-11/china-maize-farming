import "./globals.css";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import wordcount from "@/generated/wordcount.json";
import { title, author, course, submitted } from "@/content/site.js";

export const metadata = {
  title: { default: title, template: `%s | Corn on the black soil` },
  description:
    "A Year 10 Geography Student Interest Project on how sustainable corn farming is on the black soils of Heilongjiang Province, China.",
  authors: [{ name: author }],
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#2a1c10" };

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-head">
          <div className="inner">
            <Link className="brand" href="/">
              <img src="/brand.svg" alt="" width="32" height="32" />
              <span>
                Corn on the black soil
                <small>{course}</small>
              </span>
            </Link>
            <SiteNav />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer>
          <div className="inner">
            <p>
              {author}, {course}, Final Project. Submitted {submitted}.
            </p>
            <p>
              <strong>Word count: {wordcount.total.toLocaleString("en-AU")}</strong>. Counted: headings, paragraphs, lists and
              captions, including in-text citations. Not counted: the menu, contents list, tables, labels inside figures, this
              footer and the reference list.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
