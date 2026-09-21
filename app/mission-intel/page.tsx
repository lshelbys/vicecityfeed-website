import type { Metadata } from "next";
import { MissionCard } from "@/components/MissionCard";
import { PageHeader } from "@/components/PageHeader";
import { getMissions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Mission Intel",
  description:
    "GTA 6 walkthrough cards with difficulty ratings and mission timers for Jason, Lucia, and Leonida jobs.",
};

export default function MissionIntelPage() {
  const missions = getMissions();

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="Walkthroughs"
        title="Mission Intel"
        description="Difficulty, estimated timers, and dual-protag splits. These are editorial notes, not spoiler-free — open the linked briefing before you burn a save."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((mission) => (
          <MissionCard key={mission.slug} mission={mission} />
        ))}
      </div>
    </main>
  );
}
