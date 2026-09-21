import { BreakingTicker } from "@/components/BreakingTicker";
import { HeroGrid } from "@/components/HeroGrid";
import { MissionCard } from "@/components/MissionCard";
import { WireFeed } from "@/components/WireFeed";
import { getArticleMeta, getBreakingItems, getHeroArticles } from "@/lib/articles";
import { getMissions } from "@/lib/missions";
import { SITE } from "@/lib/site";
import Link from "next/link";

export default function HomePage() {
  const [lead, second, third] = getHeroArticles();
  const articles = getArticleMeta();
  const missions = getMissions();
  const breaking = getBreakingItems();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/leonida-wire?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreakingTicker items={breaking} />
      <HeroGrid lead={lead} secondary={[second, third]} />

      <section
        id="leonida-wire"
        aria-labelledby="wire-heading"
        className="mx-auto max-w-7xl px-4 py-12 md:px-6"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan">
              Desk copy
            </p>
            <h2 id="wire-heading" className="font-display text-4xl text-paper">
              Leonida Wire
            </h2>
          </div>
          <Link
            href="/leonida-wire"
            className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-cyan"
          >
            Open the full wire →
          </Link>
        </div>
        <WireFeed articles={articles} />
      </section>

      <section
        aria-labelledby="intel-heading"
        className="mx-auto max-w-7xl px-4 py-6 md:px-6"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
              Walkthroughs
            </p>
            <h2 id="intel-heading" className="font-display text-4xl text-paper">
              Mission Intel
            </h2>
          </div>
          <Link
            href="/mission-intel"
            className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-cyan"
          >
            All jobs →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.slug} mission={mission} />
          ))}
        </div>
      </section>
    </main>
  );
}
