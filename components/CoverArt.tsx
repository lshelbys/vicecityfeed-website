import type { CoverAccent } from "@/lib/types";

type Palette = {
  sky: string;
  mid: string;
  ground: string;
  disc: string;
  discCore: string;
  haze: string;
  landFar: string;
  landNear: string;
  water: string;
  gleam: string;
};

const PALETTE: Record<CoverAccent, Palette> = {
  cyan: {
    sky: "#061618",
    mid: "#0d2c2e",
    ground: "#050809",
    disc: "rgb(59 184 179 / 0.42)",
    discCore: "#9ef0eb",
    haze: "rgb(59 184 179 / 0.2)",
    landFar: "#0c1c1e",
    landNear: "#081012",
    water: "rgb(59 184 179 / 0.14)",
    gleam: "rgb(255 255 255 / 0.16)",
  },
  magenta: {
    sky: "#140810",
    mid: "#2a1220",
    ground: "#080508",
    disc: "rgb(217 86 138 / 0.4)",
    discCore: "#f4b4cc",
    haze: "rgb(217 86 138 / 0.2)",
    landFar: "#1c1018",
    landNear: "#0e0a0e",
    water: "rgb(217 86 138 / 0.12)",
    gleam: "rgb(255 255 255 / 0.14)",
  },
  sunset: {
    sky: "#1a0e08",
    mid: "#2e1810",
    ground: "#080605",
    disc: "rgb(240 138 74 / 0.45)",
    discCore: "#ffd27a",
    haze: "rgb(240 138 74 / 0.22)",
    landFar: "#1a120e",
    landNear: "#0c0908",
    water: "rgb(240 138 74 / 0.12)",
    gleam: "rgb(255 255 255 / 0.16)",
  },
};

const LAND_FAR = [
  "M0 70 C 16 66, 28 58, 44 60 C 62 62, 74 54, 100 58 L 100 100 L 0 100 Z",
  "M0 74 C 22 68, 38 62, 56 66 C 72 70, 86 60, 100 64 L 100 100 L 0 100 Z",
  "M0 62 C 18 70, 36 54, 54 58 C 70 62, 84 52, 100 56 L 100 100 L 0 100 Z",
];

const LAND_NEAR = [
  "M0 78 C 14 74, 26 82, 40 76 C 56 70, 70 80, 86 74 C 94 72, 100 78, 100 78 L 100 100 L 0 100 Z",
  "M0 84 C 20 78, 34 70, 50 76 C 66 82, 80 72, 100 80 L 100 100 L 0 100 Z",
  "M0 72 C 18 80, 32 68, 48 74 C 64 80, 78 70, 100 76 L 100 100 L 0 100 Z",
];

type CoverArtProps = {
  accent: CoverAccent;
  title: string;
  className?: string;
  lead?: boolean;
};

function hashTitle(title: string): number {
  return title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function CoverArt({
  accent,
  title,
  className = "",
  lead = false,
}: CoverArtProps) {
  const palette = PALETTE[accent];
  const seed = hashTitle(title);
  const far = LAND_FAR[seed % LAND_FAR.length];
  const near = LAND_NEAR[(seed + 1) % LAND_NEAR.length];
  const slot = seed % 3;
  const discLeft = slot === 0 ? "20%" : slot === 1 ? "52%" : "78%";
  const discTop = lead ? "30%" : "34%";
  const discSize = lead ? "46%" : "36%";
  const hazeSize = lead ? "72%" : "58%";

  return (
    <div
      className={`film-grain relative overflow-hidden bg-ink ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(168deg, ${palette.sky} 0%, ${palette.mid} 44%, ${palette.ground} 100%)`,
        }}
      />
      <div
        className="cover-haze absolute rounded-full"
        style={{
          left: discLeft,
          top: discTop,
          width: hazeSize,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          background: palette.haze,
          filter: "blur(28px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: discLeft,
          top: discTop,
          width: discSize,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle at 38% 34%, ${palette.discCore} 0%, ${palette.disc} 38%, transparent 72%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background: `linear-gradient(to top, ${palette.ground}, ${palette.water} 55%, transparent)`,
        }}
      />
      <div
        className="absolute bottom-[20%] h-[20%] w-[30%] rounded-full"
        style={{
          left: discLeft,
          transform: "translateX(-50%)",
          background: palette.gleam,
          filter: "blur(18px)",
        }}
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-[50%] w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={far} fill={palette.landFar} />
        <path d={near} fill={palette.landNear} />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, transparent 28%, rgb(0 0 0 / 0.42) 100%)",
        }}
      />
      <span className="sr-only">{title}</span>
    </div>
  );
}
