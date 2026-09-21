import Link from "next/link";
import { Clock, MapPin, Skull, Users } from "lucide-react";
import type { Difficulty, Mission } from "@/lib/types";

const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  Street: "border-cyan/40 text-cyan",
  Heist: "border-magenta/50 text-magenta",
  Legend: "border-paper/40 text-paper",
};

type MissionCardProps = {
  mission: Mission;
};

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <article className="neon-border flex h-full flex-col gap-4 rounded-sm p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-sm border px-2 py-1 text-[11px] uppercase tracking-[0.16em] ${DIFFICULTY_CLASS[mission.difficulty]}`}
        >
          <Skull className="mr-1 inline size-3" aria-hidden />
          {mission.difficulty}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-sm text-cyan">
          <Clock className="size-4" aria-hidden />
          <span className="sr-only">Estimated timer</span>
          {mission.durationLabel}
        </span>
      </div>
      <h3 className="font-display text-3xl leading-[0.95] text-paper">
        <Link href={`/posts/${mission.articleSlug}`} className="hover:text-cyan">
          {mission.title}
        </Link>
      </h3>
      <p className="text-sm text-muted">{mission.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden />
          {mission.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {mission.protagonists.join(" + ")}
        </span>
      </div>
    </article>
  );
}
