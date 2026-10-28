import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLASMIC } from "@/plasmic-init";
import { ClientPlasmicRootProvider } from "@/plasmic-init-client";

// Plasmic pages, at any route the site does not already define.
// The site is a static export (output: "export" in next.config.mjs), so every Plasmic page is
// built at `npm run build` time: no revalidate, no query string, and any other path is a 404.
// Rebuild and redeploy to publish changes made in Plasmic Studio.

type Params = { catchall: string[] };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

// A static export must build at least one route here, so with no Plasmic pages yet this one
// placeholder is built instead. It shows the 404 page.
const PLACEHOLDER = "plasmic-no-pages";

export async function generateStaticParams() {
  const pages = await PLASMIC.fetchPages();
  const params = pages
    .filter((p) => p.path !== "/") // "/" can't match a non-optional catch-all
    .map((p) => ({ catchall: p.path.slice(1).split("/") }));
  return params.length > 0 ? params : [{ catchall: [PLACEHOLDER] }];
}

async function load(params: Promise<Params>) {
  const { catchall } = await params;
  if (catchall.join("/") === PLACEHOLDER) return null;
  const data = await PLASMIC.maybeFetchComponentData(`/${catchall.join("/")}`);
  return data && data.entryCompMetas.length > 0 ? data : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const meta = data.entryCompMetas[0];
  return PLASMIC.unstable__generateMetadata(data, {
    params: meta.params ?? {},
    query: {},
  });
}

export default async function PlasmicPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const meta = data.entryCompMetas[0];
  return (
    <ClientPlasmicRootProvider prefetchedData={data} pageRoute={meta.path} pageParams={meta.params} pageQuery={{}}>
      <PlasmicComponent component={meta.displayName} />
    </ClientPlasmicRootProvider>
  );
}
