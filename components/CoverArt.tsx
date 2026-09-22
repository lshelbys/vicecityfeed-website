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

const SHAPES = [
  "sun",
  "twin",
  "crescent",
  "ring",
  "shard",
  "wave",
  "keys",
  "column",
] as const;

const LAND = [
  "M0 78 C 16 72, 28 84, 44 76 C 60 68, 74 82, 90 74 C 96 72, 100 76, 100 76 L 100 100 L 0 100 Z",
  "M0 82 C 18 74, 36 68, 52 76 C 68 84, 82 70, 100 78 L 100 100 L 0 100 Z",
  "M0 74 C 20 82, 34 66, 50 72 C 68 80, 80 68, 100 74 L 100 100 L 0 100 Z",
];

const WAVES = [
  "M0 70 C 12 58, 24 82, 38 68 C 52 54, 64 78, 78 64 C 90 54, 100 72, 100 72 L 100 100 L 0 100 Z",
  "M0 64 C 18 80, 30 52, 48 66 C 64 78, 76 50, 100 62 L 100 100 L 0 100 Z",
];

const KEYS = [
  "M8 78 C 14 70, 22 70, 26 78 C 22 86, 14 86, 8 78 Z",
  "M42 70 C 50 60, 62 60, 68 72 C 62 84, 50 84, 42 70 Z",
  "M78 76 C 84 68, 94 68, 98 78 C 94 86, 84 86, 78 76 Z",
];

type CoverArtProps = {
  accent: CoverAccent;
  title: string;
  className?: string;
  lead?: boolean;
};

function hashTitle(title: string): number {
  let hash = 2166136261;
  for (let i = 0; i < title.length; i += 1) {
    hash ^= title.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function discGradient(palette: Palette) {
  return `radial-gradient(circle at 38% 34%, ${palette.discCore} 0%, ${palette.disc} 46%, transparent 74%)`;
}

export function CoverArt({
  accent,
  title,
  className = "",
  lead = false,
}: CoverArtProps) {
  const palette = PALETTE[accent];
  const seed = hashTitle(title);
  const shape = SHAPES[seed % SHAPES.length];
  const slot = Math.floor(seed / 8) % 3;
  const left = slot === 0 ? "22%" : slot === 1 ? "50%" : "76%";
  const top = lead ? "34%" : "36%";
  const size = lead ? 34 : 28;
  const land = LAND[seed % LAND.length];
  const wave = WAVES[seed % WAVES.length];
  const angle = (seed % 24) - 12;

  return (
    <div
      className={`film-grain relative overflow-hidden bg-ink ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${145 + (seed % 30)}deg, ${palette.sky} 0%, ${palette.mid} 48%, ${palette.ground} 100%)`,
        }}
      />
      <div
        className="cover-haze absolute rounded-full"
        style={{
          left,
          top,
          width: lead ? "62%" : "50%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          background: palette.haze,
          filter: "blur(36px)",
        }}
      />

      {shape === "sun" ? (
        <>
          <div
            className="absolute inset-x-0"
            style={{
              top: "46%",
              height: "22%",
              background: `linear-gradient(to top, ${palette.horizon}, transparent)`,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left,
              top,
              width: `${size}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background: discGradient(palette),
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-[44%] w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d={land} fill={palette.landNear} />
          </svg>
        </>
      ) : null}

      {shape === "twin" ? (
        <>
          <div
            className="absolute rounded-full"
            style={{
              left,
              top,
              width: `${size + 6}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background: discGradient(palette),
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: slot === 2 ? "28%" : "72%",
              top: "58%",
              width: `${size * 0.55}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle at 40% 36%, ${palette.discCore} 0%, ${palette.disc} 50%, transparent 72%)`,
              opacity: 0.85,
            }}
          />
        </>
      ) : null}

      {shape === "crescent" ? (
        <div
          className="absolute"
          style={{
            left,
            top,
            width: `${size + 8}%`,
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: discGradient(palette) }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "78%",
              height: "78%",
              left: "38%",
              top: "8%",
              background: palette.mid,
            }}
          />
        </div>
      ) : null}

      {shape === "ring" ? (
        <div
          className="absolute rounded-full"
          style={{
            left,
            top,
            width: `${size + 16}%`,
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, transparent 52%, ${palette.disc} 54%, ${palette.discCore} 68%, transparent 70%)`,
          }}
        />
      ) : null}

      {shape === "shard" ? (
        <div
          className="absolute"
          style={{
            left,
            top,
            width: lead ? "42%" : "34%",
            height: lead ? "58%" : "48%",
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            borderRadius: "28% 12% 32% 16%",
            background: `linear-gradient(160deg, ${palette.discCore} 0%, ${palette.disc} 48%, transparent 100%)`,
          }}
        />
      ) : null}

      {shape === "wave" ? (
        <>
          <div
            className="absolute rounded-full"
            style={{
              left,
              top: "24%",
              width: "16%",
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background: discGradient(palette),
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-[58%] w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d={wave} fill={palette.landFar} />
            <path d={land} fill={palette.landNear} />
            <path d={land} fill={palette.ridge} opacity="0.4" transform="translate(0 -4)" />
          </svg>
        </>
      ) : null}

      {shape === "keys" ? (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-[42%]"
            style={{
              background: `linear-gradient(to top, ${palette.ground}, ${palette.horizon})`,
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-[55%] w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {KEYS.map((d, index) => (
              <path
                key={`${title}-key-${index}`}
                d={d}
                fill={index === 1 ? palette.landFar : palette.landNear}
              />
            ))}
          </svg>
          <div
            className="absolute rounded-full"
            style={{
              left: "18%",
              top: "30%",
              width: "12%",
              aspectRatio: "1",
              background: discGradient(palette),
            }}
          />
        </>
      ) : null}

      {shape === "column" ? (
        <>
          <div
            className="absolute rounded-full"
            style={{
              left,
              top: "8%",
              width: lead ? "28%" : "22%",
              height: "92%",
              transform: "translateX(-50%)",
              background: `linear-gradient(180deg, ${palette.discCore} 0%, ${palette.disc} 36%, transparent 100%)`,
              opacity: 0.55,
              filter: "blur(8px)",
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-[36%] w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d={land} fill={palette.landNear} />
          </svg>
        </>
      ) : null}

      <div
        className="absolute bottom-[14%] h-[16%] w-[22%] rounded-full"
        style={{
          left,
          transform: "translateX(-50%)",
          background: palette.gleam,
          filter: "blur(16px)",
        }}
      />
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
