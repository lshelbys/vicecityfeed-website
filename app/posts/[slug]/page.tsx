import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, User } from "lucide-react";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard } from "@/components/ArticleCard";
import { CoverArt } from "@/components/CoverArt";
import { TableOfContents } from "@/components/TableOfContents";
import {
  getAllSlugs,
  getArticle,
  getRelatedArticles,
} from "@/lib/articles";
import { extractHeadings } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { CATEGORY_TO_SLUG, SITE } from "@/lib/site";
import Link from "next/link";

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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const related = getRelatedArticles(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    articleSection: article.category,
    wordCount: article.wordCount,
    mainEntityOfPage: `${SITE.url}/posts/${article.slug}`,
    description: article.excerpt,
  };

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan">
            <Link href={`/leonida-wire?cat=${CATEGORY_TO_SLUG[article.category]}`}>
              {article.category}
            </Link>
          </p>
          <h1 className="font-display mt-3 text-4xl leading-[0.92] text-paper md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base text-muted md:text-lg">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" aria-hidden />
              <span>
                {article.author.name}
                <span className="text-paper/40"> · {article.author.role}</span>
              </span>
            </span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {article.readingTimeMinutes} min read
            </span>
          </div>
        </header>
        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-sm border border-line">
          <CoverArt
            accent={article.coverAccent}
            title={article.title}
            className="h-56 md:h-80"
          />
        </div>
        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <ArticleBody markdown={article.content} />
          <TableOfContents headings={headings} />
        </div>
      </article>
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2
            id="related-heading"
            className="font-display mb-6 text-3xl text-paper"
          >
            Related intel
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
