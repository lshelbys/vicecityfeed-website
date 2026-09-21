"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { filterArticlesByCategory } from "@/lib/filters";
import type { ArticleMeta, CategorySlug } from "@/lib/types";

type WireFeedProps = {
  articles: ArticleMeta[];
  initialCategory?: CategorySlug;
};

export function WireFeed({
  articles,
  initialCategory = "all",
}: WireFeedProps) {
  const [category, setCategory] = useState<CategorySlug>(initialCategory);

  const filtered = useMemo(
    () => filterArticlesByCategory(articles, category),
    [articles, category],
  );

  return (
    <div className="space-y-6">
      <CategoryFilter active={category} onSelect={setCategory} />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No intel in this lane — yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
