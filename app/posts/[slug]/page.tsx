import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard } from "@/components/ArticleCard";
import { CoverArt } from "@/components/CoverArt";
import {
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

  const related = getRelatedArticles(article);
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
              <Link href="/" className="underline-offset-4 hover:underline">
                Newswire
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={section.href}
                className="underline-offset-4 hover:underline"
              >
                {section.label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={categoryHref}
                className="underline-offset-4 hover:underline"
              >
                {categoryLabel}
              </Link>
            </li>
          </ol>
        </nav>
        <header className="reveal mt-6">
          <h1 className="text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-balance break-words text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <p className="mt-6 text-xl leading-snug font-bold text-balance text-white md:text-2xl">
            {article.excerpt}
          </p>
          <time
            dateTime={article.publishedAt}
            className="mt-6 block text-sm font-semibold text-white"
          >
            {formatDate(article.publishedAt)}
          </time>
        </header>
        <div className="group relative mt-8 overflow-hidden rounded-2xl">
          <CoverArt
            accent={article.coverAccent}
            title={article.title}
            className="aspect-video h-auto origin-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="mt-10">
          <ArticleBody markdown={article.content} />
        </div>
      </article>
      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="mx-auto mt-16 max-w-7xl"
        >
          <h2
            id="related-heading"
            className="mb-6 text-2xl font-extrabold tracking-tight text-white"
          >
            Related
          </h2>
          <div className="reveal-stagger grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
