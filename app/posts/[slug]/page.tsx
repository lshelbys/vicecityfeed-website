import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard } from "@/components/ArticleCard";
import { CopyLink } from "@/components/CopyLink";
import { CoverArt } from "@/components/CoverArt";
import { ReadingProgress } from "@/components/ReadingProgress";
import { AdjacentStories } from "@/components/AdjacentStories";
import {
  getAdjacentArticles,
  getAllSlugs,
  getArticle,
  getRelatedArticles,
} from "@/lib/articles";
import { formatDate } from "@/lib/format";
import {
  CATEGORY_SECTION,
  CATEGORY_SHORT,
  CATEGORY_TO_SLUG,
  SITE,
} from "@/lib/site";
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
  const section = CATEGORY_SECTION[article.category];
  const categoryLabel = CATEGORY_SHORT[article.category];
  const categoryHref = `/leonida-wire?cat=${CATEGORY_TO_SLUG[article.category]}`;
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
    <main id="main" className="px-4 py-10 md:px-6 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-[720px]">
        <nav aria-label="Breadcrumb" className="reveal">
          <ol className="flex flex-wrap items-center gap-x-2 text-[11px] font-bold tracking-[0.14em] text-white uppercase md:text-xs">
            <li>
              <Link href="/" className="link-draw">
                Newswire
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={section.href}
                className="link-draw"
              >
                {section.label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={categoryHref}
                className="link-draw"
              >
                {categoryLabel}
              </Link>
            </li>
          </ol>
        </nav>
        <header className="mt-7">
          <h1 className="reveal text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-balance break-words text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <p className="reveal reveal-delay mt-7 text-xl leading-snug font-bold text-balance text-white md:text-2xl">
            {article.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <time
              dateTime={article.publishedAt}
              className="text-sm font-semibold tracking-wide text-white"
            >
              {formatDate(article.publishedAt)}
            </time>
            <ReadingProgress minutes={article.readingTimeMinutes} />
            <CopyLink url={`${SITE.url}/posts/${article.slug}`} />
          </div>
        </header>
        <div className="group relative mt-10 overflow-hidden rounded-2xl">
          <CoverArt
            accent={article.coverAccent}
            title={article.title}
            lead
            className="aspect-video h-auto origin-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="mt-12">
          <ArticleBody markdown={article.content} />
        </div>
      </article>
      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="mx-auto mt-20 max-w-7xl"
        >
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            Newswire
          </p>
          <h2
            id="related-heading"
            className="mt-2 mb-8 text-2xl font-extrabold tracking-tight text-white md:text-3xl"
          >
            More from the wire
          </h2>
          <div className="reveal-stagger grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
      <AdjacentStories previous={adjacent.previous} next={adjacent.next} />
    </main>
  );
}
