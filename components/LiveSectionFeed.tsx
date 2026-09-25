"use client";

import { SectionFeed } from "@/components/SectionFeed";
import { articleOnPage, type PublishPageId } from "@/lib/publish-pages";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { FeedArticle, SectionSlug } from "@/lib/types";

type LiveSectionFeedProps = {
  articles: FeedArticle[];
  section?: SectionSlug;
  page?: PublishPageId;
};

export function LiveSectionFeed({ articles, section, page }: LiveSectionFeedProps) {
  const live = usePublishedArticles(articles);
  const filtered = page
    ? live.filter((article) => articleOnPage(article, page))
    : section
      ? live.filter((article) => article.section === section)
      : live;
  return <SectionFeed articles={filtered} />;
}
