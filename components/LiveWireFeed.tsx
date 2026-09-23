"use client";

import { WireFeed } from "@/components/WireFeed";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { CategorySlug, FeedArticle } from "@/lib/types";

type LiveWireFeedProps = {
  articles: FeedArticle[];
  initialCategory?: CategorySlug;
  syncWithUrl?: boolean;
  heading?: string;
  headingId?: string;
  shareLeadCover?: boolean;
};

export function LiveWireFeed({ articles, ...props }: LiveWireFeedProps) {
  const live = usePublishedArticles(articles);
  return <WireFeed {...props} articles={live} />;
}
