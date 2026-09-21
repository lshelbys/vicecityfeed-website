import type { CoverAccent } from "@/lib/types";

const ACCENT: Record<CoverAccent, string> = {
  cyan: "from-cyan/30 via-transparent to-magenta/20",
  magenta: "from-magenta/35 via-transparent to-cyan/15",
  sunset: "from-magenta/25 via-cyan/10 to-magenta/30",
};

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
      <div
        className={`absolute inset-0 bg-linear-to-br ${ACCENT[accent]}`}
      />
      <div className="absolute -right-8 -bottom-10 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
      <div className="absolute -left-10 top-4 h-32 w-32 rounded-full bg-magenta/25 blur-3xl" />
      <div className="absolute inset-x-8 bottom-6 flex items-end justify-between gap-2">
        <span className="h-16 w-6 bg-paper/10" />
        <span className="h-24 w-8 bg-paper/15" />
        <span className="h-12 w-5 bg-cyan/30" />
        <span className="h-28 w-10 bg-paper/20" />
        <span className="h-20 w-6 bg-magenta/40" />
        <span className="h-14 w-7 bg-paper/10" />
        <span className="h-20 w-4 bg-cyan/25" />
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
