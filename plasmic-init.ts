import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";

export const PLASMIC = initPlasmicLoader({
  projects: [{ id: "jHiAyyADqm87gFLknkgfPc", token: "id1F2C2jUhw4JhiSwjDMdjpAIuyqSronUxWD6ZABtsFPrtsNwzntIDRS37CDd1hs5FhFLO4QJW8NXtp9g" }],
  preview: true, // set to false in production so only published changes render
});
