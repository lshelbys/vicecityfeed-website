import type { CoverAccent } from "@/lib/types";

const ACCENT: Record<CoverAccent, string> = {
  cyan: "from-cyan/40 via-transparent to-magenta/25",
  magenta: "from-magenta/45 via-transparent to-cyan/20",
  sunset: "from-magenta/35 via-cyan/15 to-magenta/35",
};

const SKYLINE = [42, 70, 38, 88, 55, 96, 48, 74, 36, 62, 82, 44];

type CoverArtProps = {
  accent: CoverAccent;
  title: string;
  className?: string;
};

export function CoverArt({ accent, title, className = "" }: CoverArtProps) {
  return (
    <div
      className={`cover-grid relative overflow-hidden bg-night-elevated ${className}`}
      aria-hidden="true"
    >
      <div className={`absolute inset-0 bg-linear-to-br ${ACCENT[accent]}`} />
      <div className="absolute -right-8 top-0 h-44 w-44 rounded-full bg-cyan/25 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-magenta/30 blur-3xl" />
      <div className="absolute inset-x-4 bottom-0 flex h-[70%] items-end justify-between gap-1">
        {SKYLINE.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={
              index % 4 === 2
                ? "bg-cyan/55"
                : index % 5 === 0
                  ? "bg-magenta/50"
                  : "bg-paper/20"
            }
            style={{ height: `${height}%`, width: "100%" }}
          />
        ))}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
