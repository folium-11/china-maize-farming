import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import "@/plasmic-init-client"; // this import runs the code component registrations

// Plasmic Studio loads this page in an iframe. Set the project's host URL to <site>/plasmic-host/.
export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
