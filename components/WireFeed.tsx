"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { filterArticlesByCategory } from "@/lib/filters";
import type { CategorySlug, FeedArticle } from "@/lib/types";

const VALID: CategorySlug[] = [
  "all",
  "leaks-news",
  "map-lore",
  "vehicles-guns",
  "guides",
  "hardware",
];

type WireFeedProps = {
  articles: FeedArticle[];
  initialCategory?: CategorySlug;
  syncWithUrl?: boolean;
};

function categoryFromParam(value: string | null): CategorySlug | null {
  if (value && VALID.includes(value as CategorySlug)) {
    return value as CategorySlug;
  }
  return null;
}

function WireFeedInner({
  articles,
  initialCategory = "all",
  syncWithUrl = false,
}: WireFeedProps) {
  const searchParams = useSearchParams();
  const fromUrl = syncWithUrl ? categoryFromParam(searchParams.get("cat")) : null;
  const [category, setCategory] = useState<CategorySlug>(
    fromUrl ?? initialCategory,
  );

  const filtered = useMemo(
    () => filterArticlesByCategory(articles, category),
    [articles, category],
  );

  return (
    <div className="min-w-0 space-y-8">
      <CategoryFilter active={category} onSelect={setCategory} />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No stories in this lane yet.</p>
      ) : (
        <div className="reveal-stagger grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              readingTimeMinutes={article.readingTimeMinutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WireFeed(props: WireFeedProps) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading Newswire…</p>}>
      <WireFeedInner {...props} />
    </Suspense>
  );
}
