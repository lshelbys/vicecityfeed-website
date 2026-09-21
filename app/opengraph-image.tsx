import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121216",
          color: "#F4F4F6",
          padding: 64,
        }}
      >
        <div
          style={{
            height: 6,
            background: "linear-gradient(90deg,#FF007F,#00F0FF,#FF007F)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 28, color: "#00F0FF", letterSpacing: 8 }}>
            VICECITYFEED.COM
          </div>
          <div style={{ fontSize: 84, lineHeight: 0.9, fontWeight: 700 }}>
            VICE CITY FEED
          </div>
          <div style={{ fontSize: 32, color: "#9a9aa8" }}>{SITE.tagline}</div>
        </div>
        <div style={{ fontSize: 24, color: "#FF007F" }}>Leonida intel. No filler.</div>
      </div>
    ),
    size,
  );
}
