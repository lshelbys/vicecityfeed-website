import type { CoverAccent, CoverScene } from "@/lib/types";

type Palette = {
  sky: string;
  mid: string;
  ground: string;
  disc: string;
  discCore: string;
  haze: string;
  landFar: string;
  landNear: string;
  ink: string;
};

const PALETTE: Record<CoverAccent, Palette> = {
  cyan: {
    sky: "#071c1e",
    mid: "#0f3336",
    ground: "#071014",
    disc: "#3bb8b3",
    discCore: "#d7fffb",
    haze: "rgb(59 184 179 / 0.22)",
    landFar: "#164248",
    landNear: "#0b1c20",
    ink: "#041012",
  },
  magenta: {
    sky: "#1a0a14",
    mid: "#3a1630",
    ground: "#10080e",
    disc: "#d9568a",
    discCore: "#ffd6e6",
    haze: "rgb(217 86 138 / 0.2)",
    landFar: "#4a2238",
    landNear: "#180e16",
    ink: "#12060d",
  },
  sunset: {
    sky: "#1c1008",
    mid: "#3a2214",
    ground: "#100a08",
    disc: "#f08a4a",
    discCore: "#ffe2a8",
    haze: "rgb(240 138 74 / 0.24)",
    landFar: "#4a2c18",
    landNear: "#18100c",
    ink: "#100806",
  },
};

type CoverArtProps = {
  accent: CoverAccent;
  title: string;
  scene?: CoverScene;
  className?: string;
  lead?: boolean;
  kind?: string;
};

function gradientId(accent: CoverAccent, scene: CoverScene, title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return `sky-${accent}-${scene}-${hash.toString(36)}`;
}

function Scene({ scene, p }: { scene: CoverScene; p: Palette }) {
  switch (scene) {
    case "coast":
      return (
        <>
          <circle cx="1180" cy="280" r="150" fill={p.disc} opacity="0.95" />
          <circle cx="1180" cy="280" r="70" fill={p.discCore} opacity="0.55" />
          <path d="M0 520 C 220 480, 420 560, 640 500 C 860 440, 1100 540, 1600 470 L 1600 900 L 0 900 Z" fill={p.landFar} />
          <path d="M0 620 C 280 580, 520 680, 820 610 C 1120 540, 1360 660, 1600 600 L 1600 900 L 0 900 Z" fill={p.landNear} />
          <path d="M0 730 C 360 700, 720 780, 1100 720 C 1400 680, 1600 760, 1600 760 L 1600 900 L 0 900 Z" fill={p.ink} />
        </>
      );
    case "city":
      return (
        <>
          <rect x="80" y="360" width="140" height="540" fill={p.landNear} />
          <rect x="240" y="220" width="180" height="680" fill={p.ink} />
          <rect x="450" y="300" width="160" height="600" fill={p.landFar} />
          <rect x="640" y="160" width="210" height="740" fill={p.ink} />
          <rect x="880" y="280" width="150" height="620" fill={p.landNear} />
          <rect x="1060" y="200" width="190" height="700" fill={p.ink} />
          <rect x="1280" y="340" width="170" height="560" fill={p.landFar} />
          <rect x="1470" y="390" width="110" height="510" fill={p.landNear} />
          {[280, 470, 700, 920, 1140, 1360].map((x, i) => (
            <g key={`win-${x}`}>
              <rect x={x} y={260 + (i % 3) * 40} width="14" height="18" fill={p.discCore} opacity="0.35" />
              <rect x={x + 28} y={320 + (i % 2) * 50} width="14" height="18" fill={p.disc} opacity="0.28" />
              <rect x={x + 8} y={420} width="14" height="18" fill={p.discCore} opacity="0.22" />
            </g>
          ))}
          <path d="M0 780 L 1600 780 L 1600 900 L 0 900 Z" fill={p.ground} />
        </>
      );
    case "car":
      return (
        <>
          <path d="M0 620 L 1600 560 L 1600 900 L 0 900 Z" fill={p.landNear} />
          <path d="M0 700 L 1600 700 L 1600 900 L 0 900 Z" fill={p.ink} />
          <rect x="120" y="686" width="1360" height="8" fill={p.disc} opacity="0.25" />
          <path
            d="M360 620 C 420 520, 520 500, 640 500 L 980 500 C 1100 500, 1180 540, 1240 620 L 1320 620 C 1360 620, 1380 650, 1360 680 L 300 680 C 270 650, 300 620, 360 620 Z"
            fill={p.landFar}
          />
          <path d="M620 508 L 980 508 L 1040 600 L 580 600 Z" fill={p.mid} />
          <circle cx="520" cy="680" r="58" fill={p.ink} />
          <circle cx="520" cy="680" r="28" fill={p.disc} opacity="0.35" />
          <circle cx="1120" cy="680" r="58" fill={p.ink} />
          <circle cx="1120" cy="680" r="28" fill={p.disc} opacity="0.35" />
          <circle cx="1280" cy="240" r="90" fill={p.disc} opacity="0.7" />
        </>
      );
    case "map":
      return (
        <>
          <path
            d="M220 180 C 380 140, 520 220, 640 200 C 820 170, 960 260, 1100 230 C 1240 200, 1380 280, 1480 250 L 1500 620 C 1320 680, 1120 600, 960 640 C 800 680, 620 600, 460 650 C 320 690, 180 620, 140 540 Z"
            fill={p.landFar}
          />
          <path
            d="M300 260 C 460 230, 600 300, 760 270 C 920 240, 1080 320, 1240 290 L 1280 560 C 1100 600, 920 540, 760 580 C 600 620, 420 550, 280 580 Z"
            fill={p.landNear}
          />
          <path d="M360 340 C 620 300, 900 380, 1180 330" fill="none" stroke={p.disc} strokeWidth="8" opacity="0.55" />
          <path d="M480 430 C 720 400, 980 470, 1220 410" fill="none" stroke={p.discCore} strokeWidth="4" opacity="0.35" />
          <circle cx="1260" cy="200" r="18" fill={p.disc} />
          <circle cx="1260" cy="200" r="44" fill="none" stroke={p.disc} strokeWidth="3" opacity="0.5" />
        </>
      );
    case "gun":
      return (
        <>
          <rect x="80" y="560" width="1440" height="220" fill={p.landNear} />
          <rect x="80" y="560" width="1440" height="18" fill={p.ink} />
          <rect x="180" y="360" width="980" height="70" rx="12" fill={p.landFar} />
          <rect x="980" y="300" width="220" height="90" rx="10" fill={p.mid} />
          <path d="M980 430 L 1080 560 L 980 560 Z" fill={p.landFar} />
          <rect x="200" y="430" width="160" height="130" rx="8" fill={p.ink} />
          <rect x="1280" y="620" width="90" height="50" rx="6" fill={p.disc} opacity="0.45" />
          <rect x="1390" y="620" width="90" height="50" rx="6" fill={p.discCore} opacity="0.28" />
          <rect x="1280" y="690" width="90" height="50" rx="6" fill={p.disc} opacity="0.28" />
        </>
      );
    case "interior":
      return (
        <>
          <rect x="0" y="0" width="800" height="900" fill={p.mid} />
          <rect x="800" y="0" width="800" height="900" fill={p.landNear} />
          <rect x="180" y="140" width="420" height="520" fill={p.sky} />
          <rect x="1000" y="140" width="420" height="520" fill={p.ink} />
          <rect x="240" y="680" width="160" height="12" fill={p.disc} opacity="0.35" />
          <rect x="1060" y="680" width="160" height="12" fill={p.disc} opacity="0.35" />
          <ellipse cx="400" cy="720" rx="70" ry="160" fill={p.ink} opacity="0.7" />
          <ellipse cx="1210" cy="720" rx="70" ry="160" fill={p.ground} opacity="0.8" />
          <rect x="788" y="0" width="24" height="900" fill={p.ink} />
        </>
      );
    case "swamp":
      return (
        <>
          <circle cx="240" cy="220" r="110" fill={p.disc} opacity="0.75" />
          <path d="M0 500 C 300 460, 600 560, 900 500 C 1200 440, 1450 540, 1600 500 L 1600 900 L 0 900 Z" fill={p.landFar} />
          <path d="M0 640 C 400 600, 800 720, 1200 640 C 1450 590, 1600 680, 1600 680 L 1600 900 L 0 900 Z" fill={p.landNear} />
          <rect x="220" y="280" width="28" height="420" fill={p.ink} />
          <rect x="520" y="240" width="34" height="500" fill={p.ink} />
          <rect x="860" y="300" width="26" height="400" fill={p.ink} />
          <rect x="1180" y="260" width="32" height="460" fill={p.ink} />
          <ellipse cx="236" cy="280" rx="90" ry="28" fill={p.landFar} />
          <ellipse cx="536" cy="250" rx="110" ry="32" fill={p.landFar} />
          <ellipse cx="872" cy="310" rx="80" ry="24" fill={p.landFar} />
        </>
      );
    case "port":
      return (
        <>
          <path d="M0 560 L 1600 520 L 1600 900 L 0 900 Z" fill={p.landFar} />
          <path d="M0 700 L 1600 700 L 1600 900 L 0 900 Z" fill={p.ink} />
          <rect x="180" y="180" width="36" height="520" fill={p.landNear} />
          <rect x="80" y="180" width="420" height="28" fill={p.mid} />
          <rect x="430" y="180" width="24" height="220" fill={p.landNear} />
          <rect x="620" y="420" width="160" height="140" fill={p.disc} opacity="0.35" />
          <rect x="800" y="380" width="160" height="180" fill={p.landNear} />
          <rect x="980" y="440" width="160" height="120" fill={p.mid} />
          <rect x="1160" y="400" width="160" height="160" fill={p.landFar} />
        </>
      );
    case "marina":
      return (
        <>
          <path d="M0 420 C 400 380, 800 480, 1200 400 C 1400 360, 1600 420, 1600 420 L 1600 900 L 0 900 Z" fill={p.landFar} />
          <path d="M0 620 L 1600 580 L 1600 900 L 0 900 Z" fill={p.ink} />
          <rect x="0" y="600" width="1600" height="18" fill={p.landNear} />
          <path d="M220 560 L 420 500 L 700 500 L 820 560 Z" fill={p.mid} />
          <path d="M900 570 L 1080 510 L 1320 510 L 1440 570 Z" fill={p.landNear} />
          <rect x="360" y="430" width="14" height="90" fill={p.disc} opacity="0.4" />
          <rect x="1120" y="430" width="14" height="90" fill={p.disc} opacity="0.4" />
        </>
      );
    case "street":
      return (
        <>
          <path d="M0 500 L 1600 440 L 1600 900 L 0 900 Z" fill={p.landNear} />
          <path d="M0 640 L 1600 640 L 1600 900 L 0 900 Z" fill={p.ink} />
          <rect x="200" y="628" width="80" height="12" fill={p.disc} opacity="0.3" />
          <rect x="400" y="628" width="80" height="12" fill={p.disc} opacity="0.3" />
          <rect x="600" y="628" width="80" height="12" fill={p.disc} opacity="0.3" />
          <path d="M980 560 L 1080 470 L 1380 470 L 1500 560 L 1480 620 L 1000 620 Z" fill={p.landFar} />
          <rect x="1120" y="490" width="160" height="70" fill={p.mid} />
          <circle cx="1100" cy="620" r="42" fill={p.ink} />
          <circle cx="1380" cy="620" r="42" fill={p.ink} />
          {[240, 480, 720, 960].map((x) => (
            <line key={x} x1={x} y1="80" x2={x - 40} y2="500" stroke={p.discCore} strokeWidth="2" opacity="0.12" />
          ))}
        </>
      );
    case "club":
      return (
        <>
          <rect x="0" y="0" width="1600" height="900" fill={p.ink} />
          <rect x="200" y="160" width="1200" height="420" fill={p.mid} />
          <rect x="280" y="220" width="1040" height="280" fill={p.sky} />
          <rect x="480" y="300" width="640" height="160" fill={p.landFar} />
          <rect x="160" y="620" width="80" height="160" fill={p.landNear} />
          <rect x="1360" y="620" width="80" height="160" fill={p.landNear} />
          <circle cx="800" cy="380" r="36" fill={p.disc} opacity="0.35" />
          <path d="M0 780 L 1600 780 L 1600 900 L 0 900 Z" fill={p.ground} />
        </>
      );
    case "workshop":
      return (
        <>
          <rect x="0" y="0" width="1600" height="900" fill={p.mid} />
          <rect x="80" y="80" width="520" height="420" fill={p.ink} />
          <rect x="120" y="120" width="80" height="40" fill={p.disc} opacity="0.3" />
          <rect x="220" y="120" width="80" height="40" fill={p.disc} opacity="0.2" />
          <rect x="320" y="120" width="80" height="40" fill={p.disc} opacity="0.3" />
          <rect x="720" y="360" width="720" height="40" fill={p.landFar} />
          <rect x="780" y="400" width="40" height="260" fill={p.landNear} />
          <rect x="1340" y="400" width="40" height="260" fill={p.landNear} />
          <rect x="0" y="660" width="1600" height="240" fill={p.ground} />
        </>
      );
    case "portrait":
      return (
        <>
          <rect x="0" y="0" width="1600" height="900" fill={p.ink} />
          <rect x="260" y="80" width="700" height="620" fill={p.mid} />
          <rect x="320" y="130" width="580" height="500" fill={p.sky} />
          <ellipse cx="610" cy="720" rx="120" ry="220" fill={p.landNear} />
          <circle cx="610" cy="430" r="86" fill={p.landFar} />
          <rect x="1080" y="0" width="520" height="900" fill={p.ground} />
        </>
      );
    case "desk":
      return (
        <>
          <rect x="0" y="0" width="1600" height="900" fill={p.mid} />
          <rect x="180" y="120" width="720" height="420" fill={p.ink} />
          <rect x="220" y="160" width="640" height="340" fill={p.sky} />
          <rect x="980" y="180" width="260" height="320" fill={p.landFar} />
          <rect x="1280" y="220" width="200" height="260" fill={p.landNear} />
          <rect x="0" y="620" width="1600" height="280" fill={p.ground} />
          <rect x="200" y="660" width="360" height="12" fill={p.disc} opacity="0.3" />
          <rect x="200" y="700" width="280" height="12" fill={p.discCore} opacity="0.18" />
        </>
      );
    default:
      return (
        <>
          <circle cx="800" cy="320" r="160" fill={p.disc} />
          <path d="M0 600 C 400 520, 800 680, 1600 560 L 1600 900 L 0 900 Z" fill={p.landNear} />
        </>
      );
  }
}

export function CoverArt({
  accent,
  title,
  scene = "coast",
  className = "",
  lead = false,
  kind,
}: CoverArtProps) {
  const palette = PALETTE[accent];
  const skyId = gradientId(accent, scene, title);

  return (
    <div
      className={`film-grain @container relative overflow-hidden bg-ink ${className}`}
      aria-hidden="true"
      data-cover-scene={scene}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor={palette.sky} />
            <stop offset="52%" stopColor={palette.mid} />
            <stop offset="100%" stopColor={palette.ground} />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill={`url(#${skyId})`} />
        <ellipse cx="800" cy="360" rx="520" ry="220" fill={palette.haze} />
        <Scene scene={scene} p={palette} />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 36%, transparent 34%, rgb(0 0 0 / 0.38) 100%)",
        }}
      />
      {kind ? (
        <span
          data-cover-kind={kind}
          className={`pointer-events-none absolute bottom-[6%] left-[-1%] z-[1] select-none px-3 font-display font-extrabold uppercase leading-none tracking-[-0.07em] text-white/18 ${
            lead
              ? "text-[clamp(3.6rem,28cqi,8.5rem)]"
              : "text-[clamp(2.4rem,32cqi,5.2rem)]"
          }`}
        >
          {kind}
        </span>
      ) : null}
      <span className="sr-only">{title}</span>
    </div>
  );
}
