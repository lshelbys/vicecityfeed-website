import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHeader } from "@/components/PageHeader";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "The Map",
  description:
    "Leonida map lore: Vice City districts, the Keys, Grassrivers, and how GTA 6's state actually plays.",
};

export default function TheMapPage() {
  const articles = getFeedArticles().filter((article) => article.section === "map");

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="Leonida"
        title="The Map"
        description="Acreage, density, nightlife districts, and the quiet parts of the state the trailers skip."
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            readingTimeMinutes={article.readingTimeMinutes}
          />
        ))}
      </div>
    </main>
  );
}
