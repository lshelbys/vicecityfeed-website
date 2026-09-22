import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionFeed } from "@/components/SectionFeed";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "The Map",
  description:
    "Leonida map lore: Vice City districts, the Keys, Grassrivers, and how GTA 6's state actually plays.",
};

export default function TheMapPage() {
  const articles = getFeedArticles().filter((article) => article.section === "map");

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="The Map"
        description="Acreage, density, and the quiet parts of Leonida the trailers skip."
      />
      <SectionFeed articles={articles} />
    </main>
  );
}
