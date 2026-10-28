"use client";
import * as React from "react";
import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "./plasmic-init";
import ComparisonTable from "./components/ComparisonTable";
import ConceptMap from "./components/ConceptMap";

// Code components: my own figures, usable in Plasmic Studio. Both draw their data from content/,
// so they have no props apart from className, which Plasmic passes to style the root element.
PLASMIC.registerComponent(ComparisonTable, {
  name: "ComparisonTable",
  displayName: "Table 1: comparison of sources",
  importPath: "./components/ComparisonTable",
  isDefaultExport: true,
  props: {},
});

PLASMIC.registerComponent(ConceptMap, {
  name: "ConceptMap",
  displayName: "Figure 4: concept map",
  importPath: "./components/ConceptMap",
  isDefaultExport: true,
  props: {},
});

export function ClientPlasmicRootProvider(
  props: Omit<React.ComponentProps<typeof PlasmicRootProvider>, "loader">
) {
  return <PlasmicRootProvider loader={PLASMIC} {...props} />;
}
