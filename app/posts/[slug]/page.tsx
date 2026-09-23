import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import {
  getAdjacentArticles,
  getAllSlugs,
  getArticle,
  getFeedArticlesByAuthor,
  getRelatedArticles,
} from "@/lib/articles";
import { getAuthorSlug } from "@/lib/authors";
import { SITE } from "@/lib/site";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found" };

  const url = `${SITE.url}/posts/${article.slug}`;
  const image = {
    url: `/posts/${article.slug}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: article.title,
  };
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author.name],
      section: article.category,
      tags: article.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image.url],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const adjacent = getAdjacentArticles(article.slug);
  const moreFromWriter = getFeedArticlesByAuthor(
    getAuthorSlug(article.author),
  ).filter((item) => item.slug !== article.slug);

  return (
    <ArticleView
      article={article}
      related={related}
      adjacent={adjacent}
      moreFromWriter={moreFromWriter}
    />
  );
}
