import type { CoverAccent } from "@/lib/types";

type Palette = {
  sky: string;
  mid: string;
  ground: string;
  disc: string;
  discCore: string;
  haze: string;
  horizon: string;
  landFar: string;
  landNear: string;
  ridge: string;
  gleam: string;
};

const PALETTE: Record<CoverAccent, Palette> = {
  cyan: {
    sky: "#071c1e",
    mid: "#0f3336",
    ground: "#071014",
    disc: "#3bb8b3",
    discCore: "#d7fffb",
    haze: "rgb(59 184 179 / 0.28)",
    horizon: "rgb(59 184 179 / 0.22)",
    landFar: "#164248",
    landNear: "#0b1c20",
    ridge: "rgb(126 232 226 / 0.28)",
    gleam: "rgb(180 245 240 / 0.2)",
  },
  magenta: {
    sky: "#1a0a14",
    mid: "#3a1630",
    ground: "#10080e",
    disc: "#d9568a",
    discCore: "#ffd6e6",
    haze: "rgb(217 86 138 / 0.28)",
    horizon: "rgb(217 86 138 / 0.2)",
    landFar: "#4a2238",
    landNear: "#180e16",
    ridge: "rgb(244 180 204 / 0.26)",
    gleam: "rgb(255 200 220 / 0.16)",
  },
  sunset: {
    sky: "#1c1008",
    mid: "#3a2214",
    ground: "#100a08",
    disc: "#f08a4a",
    discCore: "#ffe2a8",
    haze: "rgb(240 138 74 / 0.3)",
    horizon: "rgb(252 175 23 / 0.22)",
    landFar: "#4a2c18",
    landNear: "#18100c",
    ridge: "rgb(255 210 122 / 0.26)",
    gleam: "rgb(255 220 160 / 0.18)",
  },
};

const LAND_FAR = [
  "M0 62 C 14 58, 26 48, 40 52 C 56 56, 70 44, 100 50 L 100 100 L 0 100 Z",
  "M0 56 C 22 64, 40 46, 58 52 C 74 58, 86 48, 100 54 L 100 100 L 0 100 Z",
  "M0 50 C 18 44, 34 58, 52 50 C 70 42, 84 54, 100 48 L 100 100 L 0 100 Z",
];

const LAND_NEAR = [
  "M0 78 C 16 72, 28 84, 44 76 C 60 68, 74 82, 90 74 C 96 72, 100 76, 100 76 L 100 100 L 0 100 Z",
  "M0 82 C 18 74, 36 68, 52 76 C 68 84, 82 70, 100 78 L 100 100 L 0 100 Z",
  "M0 74 C 20 82, 34 66, 50 72 C 68 80, 80 68, 100 74 L 100 100 L 0 100 Z",
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
  const discLeft = slot === 0 ? "22%" : slot === 1 ? "50%" : "76%";
  const discTop = lead ? "34%" : "36%";
  const discSize = lead ? "34%" : "28%";
  const hazeSize = lead ? "64%" : "52%";

  return (
    <div
      className={`film-grain relative overflow-hidden bg-ink ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(165deg, ${palette.sky} 0%, ${palette.mid} 48%, ${palette.ground} 100%)`,
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
          filter: "blur(36px)",
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: lead ? "42%" : "46%",
          height: "22%",
          background: `linear-gradient(to top, ${palette.horizon}, transparent)`,
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
          background: `radial-gradient(circle at 38% 34%, ${palette.discCore} 0%, ${palette.disc} 46%, transparent 74%)`,
        }}
      />
      <div
        className="absolute bottom-[16%] h-[18%] w-[22%] rounded-full"
        style={{
          left: discLeft,
          transform: "translateX(-50%)",
          background: palette.gleam,
          filter: "blur(16px)",
        }}
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-[46%] w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={far} fill={palette.landFar} />
        <path d={near} fill={palette.landNear} />
        <path d={near} fill={palette.ridge} opacity="0.45" transform="translate(0 -3)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 36%, transparent 34%, rgb(0 0 0 / 0.38) 100%)",
        }}
      />
      <span className="sr-only">{title}</span>
    </div>
  );
}
