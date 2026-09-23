"use client";

import { ContinueReading } from "@/components/ContinueReading";
import { EmptyStories } from "@/components/EmptyStories";
import { Hero } from "@/components/Hero";
import { WireFeed } from "@/components/WireFeed";
import { usePublishedArticles } from "@/lib/use-published-articles";
import type { ArticleMeta, FeedArticle } from "@/lib/types";

type HomeDeskProps = {
  lead?: ArticleMeta;
  articles: FeedArticle[];
};

export function HomeDesk({ lead, articles }: HomeDeskProps) {
  const live = usePublishedArticles(articles);
  const liveLead =
    live.find((article) => article.heroRank === 1) ??
    live.find((article) => article.featured) ??
    live[0] ??
    lead;

  if (!liveLead) {
    return (
      <section
        id="newswire"
        aria-labelledby="hero-heading"
        className="mx-auto max-w-7xl px-4 py-16 md:px-6"
      >
        <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
          Newswire
        </p>
        <h1
          id="hero-heading"
          className="font-display mt-3 text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-white md:text-5xl"
        >
          Vice City Feed
        </h1>
        <EmptyStories className="mt-6" />
      </section>
    );
  }

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
