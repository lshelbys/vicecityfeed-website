"use client";

import { Suspense, useMemo, useRef, useState } from "react";
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

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const [phase, setPhase] = useState<"in" | "out">("in");
  const fadeRef = useRef<number>(0);

  function selectCategory(next: CategorySlug) {
    if (next === category) return;
    if (prefersReducedMotion()) {
      setCategory(next);
      return;
    }
    setPhase("out");
    window.clearTimeout(fadeRef.current);
    fadeRef.current = window.setTimeout(() => {
      setCategory(next);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("in"));
      });
    }, 200);
  }

  return (
    <div className="min-w-0 space-y-8">
      <CategoryFilter active={category} onSelect={selectCategory} />
      {filtered.length === 0 ? (
        <p className="text-sm text-white">No stories in this lane yet.</p>
      ) : (
        <div
          className="feed-fade grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-phase={phase}
        >
          {filtered.map((article, index) => (
            <div
              key={article.slug}
              className={index === 0 ? "sm:col-span-2" : undefined}
            >
              <ArticleCard
                article={article}
                featured={index === 0}
                readingTimeMinutes={article.readingTimeMinutes}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WireFeed(props: WireFeedProps) {
  return (
    <Suspense fallback={<p className="text-sm text-white">Loading Newswire…</p>}>
      <WireFeedInner {...props} />
    </Suspense>
  );
}
