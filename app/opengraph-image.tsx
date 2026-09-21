import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";
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
          background: "#0B0B0B",
          color: "#FFFFFF",
          padding: 64,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: "#FCAF17",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            borderRadius: 8,
          }}
        >
          VI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 0.95,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            VICE CITY FEED
          </div>
          <div style={{ fontSize: 28, color: "#8E8E93" }}>{SITE.tagline}</div>
        </div>
        <div style={{ fontSize: 22, color: "#FCAF17", fontWeight: 700 }}>
          Newswire
        </div>
      </div>
    ),
    size,
  );
}
