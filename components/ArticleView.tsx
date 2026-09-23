import Link from "next/link";
import { AdjacentStories } from "@/components/AdjacentStories";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard } from "@/components/ArticleCard";
import { CopyLink } from "@/components/CopyLink";
import { MoreFromWriter } from "@/components/MoreFromWriter";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SaveControl } from "@/components/SaveControl";
import { ShareLink } from "@/components/ShareLink";
import { StoryCover } from "@/components/StoryCover";
import { authorHref } from "@/lib/authors";
import { formatDate } from "@/lib/format";
import {
  CATEGORY_SECTION,
  CATEGORY_SHORT,
  coverKind,
  newswireFilterHref,
  SITE,
} from "@/lib/site";
import type { Article, ArticleMeta, FeedArticle } from "@/lib/types";

type ArticleViewProps = {
  article: Article;
  related?: ArticleMeta[];
  adjacent?: { previous?: ArticleMeta; next?: ArticleMeta };
  moreFromWriter?: FeedArticle[];
};

export function ArticleView({
  article,
  related = [],
  adjacent = {},
  moreFromWriter = [],
}: ArticleViewProps) {
  const section = CATEGORY_SECTION[article.category];
  const categoryLabel = CATEGORY_SHORT[article.category];
  const categoryHref = newswireFilterHref(article.category);
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
    <main id="main" className="px-4 py-10 md:px-6 md:py-14" data-article-slug={article.slug}>
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
              <Link href={section.href} className="link-draw">
                {section.label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={categoryHref} className="link-draw">
                {categoryLabel}
              </Link>
            </li>
          </ol>
        </nav>
        <header className="mt-7">
          <h1 className="reveal font-display text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-balance break-words text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <p className="reveal reveal-delay mt-7 text-xl leading-snug font-bold text-balance text-white md:text-2xl">
            {article.excerpt}
          </p>
          <div className="mt-8">
            <time
              dateTime={article.publishedAt}
              className="text-sm font-semibold tracking-wide text-white"
            >
              {formatDate(article.publishedAt)}
            </time>
            <p className="mt-1 text-sm font-semibold text-white">
              <Link
                href={authorHref(article.author)}
                data-author-slug={article.author.handle}
                className="link-draw"
              >
                {article.author.name}
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href={categoryHref}
                className="rounded-full bg-raised px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase"
              >
                {categoryLabel}
              </Link>
              <ReadingProgress
                slug={article.slug}
                minutes={article.readingTimeMinutes}
              />
              <CopyLink url={`${SITE.url}/posts/${article.slug}`} />
              <ShareLink
                title={article.title}
                url={`${SITE.url}/posts/${article.slug}`}
              />
              <SaveControl slug={article.slug} variant="inline" />
            </div>
          </div>
        </header>
        <div className="group relative mt-10 overflow-hidden rounded-2xl">
          <StoryCover
            article={article}
            lead
            className="aspect-video h-auto origin-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="mt-12">
          <ArticleBody
            markdown={article.content}
            figure={{
              accent: article.coverAccent,
              scene: article.coverScene,
              title: article.title,
              caption: article.excerpt,
              kind: coverKind(article.category),
            }}
          />
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
            className="font-display mt-2 mb-8 text-2xl font-extrabold tracking-tight text-white md:text-3xl"
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
      <MoreFromWriter name={article.author.name} articles={moreFromWriter} />
      <AdjacentStories previous={adjacent.previous} next={adjacent.next} />
    </main>
  );
}
