"use client";

import { SectionFeed } from "@/components/SectionFeed";
import { getAuthorSlug } from "@/lib/authors";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { FeedArticle } from "@/lib/types";

type LiveAuthorFeedProps = {
  authorSlug: string;
  articles: FeedArticle[];
};

export function LiveAuthorFeed({ authorSlug, articles }: LiveAuthorFeedProps) {
  const live = usePublishedArticles(articles);
  const filtered = live.filter(
    (article) => getAuthorSlug(article.author) === authorSlug,
  );
  return <SectionFeed articles={filtered} />;
}
