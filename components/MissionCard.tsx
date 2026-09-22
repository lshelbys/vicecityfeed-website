import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { CoverArt } from "@/components/CoverArt";
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
};

export function MissionCard({
  mission,
  article,
  featured = false,
}: MissionCardProps) {
  const href = `/posts/${mission.articleSlug}`;

  return (
    <article className="group h-full transition-transform duration-300 ease-out hover:-translate-y-1">
      <Link href={href} className="block">
        {article ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <CoverArt
              accent={article.coverAccent}
              title={mission.title}
              className="h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span
              className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${DIFFICULTY_TONE[mission.difficulty]}`}
            >
              {mission.difficulty}
            </span>
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              <Clock className="size-3" aria-hidden />
              <span className="sr-only">Estimated timer</span>
              {mission.durationLabel}
            </span>
          </div>
        ) : null}
        <div className="mt-4">
          <h3
            className={`text-balance break-words font-extrabold tracking-tight text-white ${
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
