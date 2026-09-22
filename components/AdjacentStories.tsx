import Link from "next/link";
import { CoverArt } from "@/components/CoverArt";
import { SaveControl } from "@/components/SaveControl";
import { formatDate } from "@/lib/format";
import type { ArticleMeta } from "@/lib/types";

type AdjacentStoriesProps = {
  previous?: ArticleMeta;
  next?: ArticleMeta;
};

function AdjacentCard({
  label,
  article,
  align = "start",
}: {
  label: "Previous" | "Next";
  article: ArticleMeta;
  align?: "start" | "end";
}) {
  return (
    <article
      className={`group ${align === "end" ? "sm:justify-self-end sm:text-right" : ""}`}
    >
      <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
        {label}
      </p>
      <div className="relative mt-3">
        <Link href={`/posts/${article.slug}`} className="block">
          <div className="aspect-video overflow-hidden rounded-2xl">
            <CoverArt
              accent={article.coverAccent}
              title={article.title}
              className="h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </Link>
        <SaveControl slug={article.slug} />
      </div>
      <Link href={`/posts/${article.slug}`} className="block">
        <h3 className="mt-4 text-balance break-words text-lg font-extrabold tracking-tight text-white md:text-xl">
          {article.title}
        </h3>
        {article.excerpt.trim() &&
        article.excerpt.trim().toLowerCase() !== article.title.toLowerCase() ? (
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-white">
            {article.excerpt}
          </p>
        ) : null}
        <p className="mt-2 text-xs font-medium tracking-wide text-white">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {" · "}
          {article.author.name}
        </p>
      </Link>
    </article>
  );
}

export function AdjacentStories({ previous, next }: AdjacentStoriesProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Previous and next stories"
      className="mx-auto mt-20 max-w-7xl"
    >
      <div className="grid items-start gap-10 sm:grid-cols-2">
        {previous ? (
          <AdjacentCard label="Previous" article={previous} />
        ) : (
          <div className="hidden sm:block" />
        )}
        {next ? (
          <AdjacentCard label="Next" article={next} align="end" />
        ) : null}
      </div>
    </nav>
  );
}