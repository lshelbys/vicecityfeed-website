"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { filterArticlesByCategory } from "@/lib/filters";
import type { ArticleMeta, CategorySlug } from "@/lib/types";

const VALID: CategorySlug[] = [
  "all",
  "leaks-news",
  "map-lore",
  "vehicles-guns",
  "guides",
];

type WireFeedProps = {
  articles: ArticleMeta[];
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

export function WireFeed(props: WireFeedProps) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted">Loading the wire…</p>
      }
    >
      <WireFeedInner {...props} />
    </Suspense>
  );
}
