import { SLUG_TO_CATEGORY } from "./site";
import type { ArticleMeta, Category, CategorySlug } from "./types";

export function filterArticlesByCategory(
  articles: ArticleMeta[],
  slug: CategorySlug,
): ArticleMeta[] {
  if (slug === "all") return articles;
  const category: Category = SLUG_TO_CATEGORY[slug];
  return articles.filter((article) => article.category === category);
}

export function searchArticleMeta(
  articles: ArticleMeta[],
  query: string,
): ArticleMeta[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.excerpt,
      article.category,
      article.author.name,
      ...article.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
