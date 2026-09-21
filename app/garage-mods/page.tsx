import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHeader } from "@/components/PageHeader";
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
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="Machines"
        title="Garage & Mods"
        description="Liveries, stance, ammo types, and what the PC community should expect once the toolchain lands."
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
