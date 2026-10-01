"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages } from "@/content/site.js";

export default function SiteNav() {
  const path = usePathname() || "/";
  const here = path.endsWith("/") ? path : `${path}/`;
  return (
    <nav aria-label="Pages">
      <ul className="nav">
        {pages.map((p) => (
          <li key={p.href}>
            <Link href={p.href} aria-current={p.href === here ? "page" : undefined}>
              {p.nav}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
