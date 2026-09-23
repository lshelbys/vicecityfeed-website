"use client";

import { SectionFeed } from "@/components/SectionFeed";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { FeedArticle, SectionSlug } from "@/lib/types";

type LiveSectionFeedProps = {
  articles: FeedArticle[];
  section?: SectionSlug;
};

export function LiveSectionFeed({ articles, section }: LiveSectionFeedProps) {
  const live = usePublishedArticles(articles);
  const filtered = section
    ? live.filter((article) => article.section === section)
    : live;
  return <SectionFeed articles={filtered} />;
}
