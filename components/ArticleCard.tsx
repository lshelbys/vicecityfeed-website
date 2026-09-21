import Link from "next/link";
import { Clock, User } from "lucide-react";
import { CoverArt } from "@/components/CoverArt";
import { formatDate } from "@/lib/format";
import { CATEGORY_TO_SLUG } from "@/lib/site";
import type { ArticleMeta } from "@/lib/types";

type ArticleCardProps = {
  article: ArticleMeta;
  featured?: boolean;
  readingTimeMinutes?: number;
};

export function ArticleCard({
  article,
  featured = false,
  readingTimeMinutes,
}: ArticleCardProps) {
  const href = `/posts/${article.slug}`;
  const categoryHref = `/leonida-wire?cat=${CATEGORY_TO_SLUG[article.category]}`;

  return (
    <article className="neon-border group flex h-full flex-col overflow-hidden rounded-sm">
      <Link href={href} className="block">
        <CoverArt
          accent={article.coverAccent}
          title={article.title}
          className={featured ? "h-56 md:h-72" : "h-40"}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
          <Link
            href={categoryHref}
            className="text-cyan hover:text-magenta"
          >
            {article.category}
          </Link>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h3
          className={`font-display leading-[0.95] text-paper group-hover:text-cyan ${
            featured ? "text-3xl md:text-5xl" : "text-2xl"
          }`}
        >
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5" aria-hidden />
            {article.author.name}
          </span>
          {readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              {readingTimeMinutes} min read
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
