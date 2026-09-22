import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionFeed } from "@/components/SectionFeed";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Garage & Mods",
  description:
    "GTA 6 vehicle customization, weapons benches, marina garages, and the PC mod scene after launch.",
};

export default function GarageModsPage() {
  const articles = getFeedArticles().filter(
    (article) => article.section === "garage",
  );

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="Garage & Mods"
        description="Liveries, ammo, marina garages, and the PC toolchain."
      />
      <SectionFeed articles={articles} />
    </main>
  );
}
