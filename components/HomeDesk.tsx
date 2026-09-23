"use client";

import { ContinueReading } from "@/components/ContinueReading";
import { Hero } from "@/components/Hero";
import { WireFeed } from "@/components/WireFeed";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { ArticleMeta, FeedArticle } from "@/lib/types";

type HomeDeskProps = {
  lead: ArticleMeta;
  articles: FeedArticle[];
};

export function HomeDesk({ lead, articles }: HomeDeskProps) {
  const live = usePublishedArticles(articles);
  const liveLead =
    live.find((article) => article.heroRank === 1) ??
    live.find((article) => article.featured) ??
    live[0] ??
    lead;

  return (
    <>
      <ContinueReading articles={live} />
      <Hero article={liveLead} />
      <section
        id="newswire"
        aria-labelledby="wire-heading"
        className="mx-auto max-w-7xl px-4 py-12 md:px-6"
      >
        <WireFeed
          articles={live}
          heading="Newswire"
          headingId="wire-heading"
          syncWithUrl
          shareLeadCover={false}
        />
      </section>
    </>
  );
}
