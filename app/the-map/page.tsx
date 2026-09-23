import type { Metadata } from "next";
import { MapIndex } from "@/components/MapIndex";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "The Map",
  description:
    "Leonida map lore: Vice City districts, the Keys, Grassrivers, and how GTA 6's state actually plays.",
};

export default function TheMapPage() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Location index"
        title="The Map"
        description="Named places, the region they sit in, and the story that opens the door."
      />
      <MapIndex />
    </main>
  );
}
