import Link from "next/link";
import { CoverArt } from "@/components/CoverArt";
import { SaveControl } from "@/components/SaveControl";
import { formatDate, formatReadTime } from "@/lib/format";
import { CATEGORY_SHORT } from "@/lib/site";
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
  const category = CATEGORY_SHORT[article.category];

  return (
    <article className="group transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="relative">
        <Link href={href} className="block">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <CoverArt
              accent={article.coverAccent}
              title={article.title}
              className="h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-300 ease-out group-hover:bg-teal group-hover:text-ink">
              {category}
            </span>
          </div>
        </Link>
        <SaveControl slug={article.slug} />
      </div>
      <Link href={href} className="mt-4 block">
        <h3
          className={`text-balance break-words font-extrabold tracking-tight text-white ${
            featured ? "text-xl leading-snug md:text-2xl" : "text-base leading-snug md:text-lg"
          }`}
        >
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
          {readingTimeMinutes ? (
            <>
              {" · "}
              {formatReadTime(readingTimeMinutes)}
            </>
          ) : null}
        </p>
      </Link>
    </article>
  );
}
