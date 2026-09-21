import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHeader } from "@/components/PageHeader";
import { getArticlesBySection } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Vice City Feed reviews of GTA 6 characters, radio, nightlife, and the systems that actually hold up.",
};

export default function ReviewsPage() {
  const articles = getArticlesBySection("reviews");

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="Verdicts"
        title="Reviews"
        description="Character studies, radio, and the night economy — scored like a desk, not a hype cycle."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  );
}
