import fs from "node:fs";
import path from "node:path";
import articlesJson from "@/content/articles.json";
import type {
  Article,
  ArticleMeta,
  BreakingItem,
  CategorySlug,
  SectionSlug,
} from "./types";
import { readingTimeFromMarkdown } from "./format";
import { filterArticlesByCategory, searchArticleMeta } from "./filters";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const articlesMeta = articlesJson as ArticleMeta[];

export function getArticleMeta(): ArticleMeta[] {
  return [...articlesMeta].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticleContent(slug: string): string {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  return fs.readFileSync(file, "utf8");
}

export function getArticle(slug: string): Article | undefined {
  const meta = articlesMeta.find((article) => article.slug === slug);
  if (!meta) return undefined;
  const content = getArticleContent(slug);
  const { wordCount, readingTimeMinutes } = readingTimeFromMarkdown(content);
  return { ...meta, content, wordCount, readingTimeMinutes };
}

export function getArticles(): Article[] {
  return getArticleMeta().map((meta) => {
    const content = getArticleContent(meta.slug);
    const { wordCount, readingTimeMinutes } = readingTimeFromMarkdown(content);
    return { ...meta, content, wordCount, readingTimeMinutes };
  });
}

export function getHeroArticles(): [ArticleMeta, ArticleMeta, ArticleMeta] {
  const ranked = getArticleMeta()
    .filter((article) => article.heroRank)
    .sort((a, b) => (a.heroRank ?? 99) - (b.heroRank ?? 99));

  if (ranked.length < 3) {
    throw new Error("Hero grid requires three ranked articles.");
  }

  return [ranked[0], ranked[1], ranked[2]];
}

export function getArticlesByCategory(
  slug: CategorySlug,
  source: ArticleMeta[] = getArticleMeta(),
): ArticleMeta[] {
  return filterArticlesByCategory(source, slug);
}

export function getArticlesBySection(section: SectionSlug): ArticleMeta[] {
  return getArticleMeta().filter((article) => article.section === section);
}

export function getRelatedArticles(article: ArticleMeta): ArticleMeta[] {
  const bySlug = new Map(getArticleMeta().map((item) => [item.slug, item]));
  return article.relatedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is ArticleMeta => Boolean(item));
}

export function searchArticles(query: string): ArticleMeta[] {
  return searchArticleMeta(getArticleMeta(), query);
}

export function getBreakingItems(): BreakingItem[] {
  return getArticleMeta()
    .filter((article) => article.breaking)
    .map((article) => ({
      id: article.slug,
      label: article.title,
      href: `/posts/${article.slug}`,
    }));
}

export function getAllSlugs(): string[] {
  return articlesMeta.map((article) => article.slug);
}
