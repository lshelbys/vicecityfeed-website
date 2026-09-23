import type { Metadata } from "next";
import { MissionCard } from "@/components/MissionCard";
import { PageHeader } from "@/components/PageHeader";
import { getArticleMeta } from "@/lib/articles";
import { getMissions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Mission Intel",
  description:
    "GTA 6 walkthrough cards with difficulty ratings and mission timers for Jason, Lucia, and Leonida jobs.",
};

export default function MissionIntelPage() {
  const missions = getMissions();
  const articles = new Map(getArticleMeta().map((item) => [item.slug, item]));
  const [lead, ...rest] = missions;

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="Mission Intel"
        description="Difficulty, timers, and dual-protag splits for the jobs that matter."
      />
      {lead ? (
        <div className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2">
            <MissionCard
              mission={lead}
              article={articles.get(lead.articleSlug)}
              featured
              index={0}
            />
          </div>
          {rest.map((mission, index) => (
            <MissionCard
              key={mission.slug}
              mission={mission}
              article={articles.get(mission.articleSlug)}
              index={index + 1}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white">No stories in this lane yet.</p>
      )}
    </main>
  );
}
