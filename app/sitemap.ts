import type { MetadataRoute } from "next";
import { getArticleMeta } from "@/lib/articles";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/leonida-wire",
    "/mission-intel",
    "/the-map",
    "/garage-mods",
    "/reviews",
    "/editorial-guidelines",
  ];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = getArticleMeta().map((article) => ({
    url: `${SITE.url}/posts/${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...posts];
}
