import type { CoverAccent } from "@/lib/types";

type Palette = {
  from: string;
  via: string;
  to: string;
  haze: string;
  structure: string;
  window: string;
};

const PALETTE: Record<CoverAccent, Palette> = {
  cyan: {
    from: "#10201f",
    via: "#1a3334",
    to: "#0b0b0b",
    haze: "rgb(59 184 179 / 0.18)",
    structure: "rgb(255 255 255 / 0.13)",
    window: "rgb(59 184 179 / 0.7)",
  },
  magenta: {
    from: "#1c1016",
    via: "#2a1822",
    to: "#0b0b0b",
    haze: "rgb(217 86 138 / 0.16)",
    structure: "rgb(255 255 255 / 0.12)",
    window: "rgb(217 86 138 / 0.65)",
  },
  sunset: {
    from: "#1c140c",
    via: "#2a1c12",
    to: "#0b0b0b",
    haze: "rgb(240 138 74 / 0.2)",
    structure: "rgb(255 255 255 / 0.1)",
    window: "rgb(252 175 23 / 0.75)",
  },
};

const BLOCKS = [38, 62, 44, 78, 52, 90, 36, 70, 48, 84, 40, 66];

type CoverArtProps = {
  accent: CoverAccent;
  title: string;
  className?: string;
};

function hashTitle(title: string): number {
  return title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function CoverArt({ accent, title, className = "" }: CoverArtProps) {
  const palette = PALETTE[accent];
  const offset = hashTitle(title) % BLOCKS.length;

  return (
    <div
      className={`film-grain relative overflow-hidden bg-ink ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.via} 42%, ${palette.to} 100%)`,
        }}
      />
      <div
        className="absolute -top-16 left-1/3 h-48 w-64 rounded-full"
        style={{ background: palette.haze }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black to-transparent" />
      <div className="absolute inset-x-6 bottom-0 flex h-[62%] items-end justify-between gap-[3px]">
        {BLOCKS.map((height, index) => {
          const shifted = BLOCKS[(index + offset) % BLOCKS.length];
          const lit = (index + offset) % 5 === 0;
          return (
            <span
              key={`${title}-${index}`}
              className="relative"
              style={{
                height: `${shifted}%`,
                width: "100%",
                background: palette.structure,
              }}
            >
              {lit ? (
                <span
                  className="absolute top-1/3 left-1/4 h-1.5 w-1.5"
                  style={{ background: palette.window }}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
