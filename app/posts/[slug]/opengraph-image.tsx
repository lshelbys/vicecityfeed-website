import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";
import { getAllSlugs, getArticleMeta } from "@/lib/articles";
import { LOGO_FILE_PNG } from "@/lib/logo";
import { SITE } from "@/lib/site";
import type { CoverAccent } from "@/lib/types";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT: Record<CoverAccent, string> = {
  cyan: "#3BB8B3",
  magenta: "#D9568A",
  sunset: "#F08A4A",
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleMeta().find((item) => item.slug === slug);
  const logoSrc = `data:image/png;base64,${readFileSync(LOGO_FILE_PNG).toString("base64")}`;
  const title = article?.title ?? SITE.name;
  const accent = article ? ACCENT[article.coverAccent] : "#3BB8B3";

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={logoSrc}
            width={196}
            height={115}
            alt=""
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: accent,
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Newswire
          </div>
          <div
            style={{
              fontSize: 58,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{SITE.name}</div>
      </div>
    ),
    size,
  );
}