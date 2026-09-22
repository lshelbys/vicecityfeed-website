import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { pillClass } from "@/components/pills";
import type { Difficulty, Mission } from "@/lib/types";

const DIFFICULTY_ACTIVE: Record<Difficulty, boolean> = {
  Street: false,
  Heist: true,
  Legend: true,
};

type MissionCardProps = {
  mission: Mission;
};

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-surface p-5 transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-raised">
      <div className="flex items-center justify-between gap-3">
        <span className={pillClass(DIFFICULTY_ACTIVE[mission.difficulty], "text-xs")}>
          {mission.difficulty}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Clock className="size-4" aria-hidden />
          <span className="sr-only">Estimated timer</span>
          {mission.durationLabel}
        </span>
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight text-paper">
        <Link href={`/posts/${mission.articleSlug}`} className="text-white">
          {mission.title}
        </Link>
      </h3>
      <p className="text-sm text-muted">{mission.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-3 text-xs text-muted">
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
