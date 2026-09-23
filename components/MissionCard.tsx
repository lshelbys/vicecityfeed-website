import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { StoryCover } from "@/components/StoryCover";
import type { ArticleMeta, Difficulty, Mission } from "@/lib/types";

const DIFFICULTY_TONE: Record<Difficulty, string> = {
  Street: "bg-raised text-white",
  Heist: "bg-teal text-ink",
  Legend: "bg-sunset text-ink",
};

type MissionCardProps = {
  mission: Mission;
  article?: ArticleMeta;
  featured?: boolean;
  index?: number;
};

export function MissionCard({
  mission,
  article,
  featured = false,
  index = 0,
}: MissionCardProps) {
  const href = `/posts/${mission.articleSlug}`;
  const job = String(index + 1).padStart(2, "0");

  return (
    <article
      data-mission-card
      className="group h-full rounded-2xl bg-surface p-4 transition-transform duration-300 ease-out hover:-translate-y-1 md:p-5"
    >
      <Link href={href} className="block">
        {article ? (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <StoryCover
              article={{ ...article, title: mission.title }}
              className="h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span
              className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${DIFFICULTY_TONE[mission.difficulty]}`}
            >
              {mission.difficulty}
            </span>
            <span
              data-mission-timer
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase"
            >
              <Clock className="size-3" aria-hidden />
              <span className="sr-only">Estimated timer</span>
              {mission.durationLabel}
            </span>
          </div>
        ) : null}
        <div className="mt-4">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            Job {job}
          </p>
          <h3
            className={`font-display text-balance break-words font-extrabold tracking-tight text-white ${
              featured ? "text-xl leading-snug md:text-2xl" : "text-base leading-snug md:text-lg"
            }`}
          >
            {mission.title}
          </h3>
          <p className="mt-2 text-sm text-white">{mission.excerpt}</p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium tracking-wide text-white">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {mission.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              {mission.protagonists.join(" + ")}
            </span>
          </p>
        </div>
      </Link>
    </article>
  );
}
