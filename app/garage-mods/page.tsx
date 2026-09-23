import type { Metadata } from "next";
import { GarageSpecs } from "@/components/GarageSpecs";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Garage & Mods",
  description:
    "GTA 6 vehicle customization, weapons benches, marina garages, and the PC mod scene after launch.",
};

export default function GarageModsPage() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Spec list"
        title="Garage & Mods"
        description="Vehicle, class, and the one number that matters on the bench."
      />
      <GarageSpecs />
    </main>
  );
}
