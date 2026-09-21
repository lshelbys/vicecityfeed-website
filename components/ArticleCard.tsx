import Link from "next/link";
import { CoverArt } from "@/components/CoverArt";
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
    <article className="group">
      <Link href={href} className="block">
        <div
          className={`relative overflow-hidden rounded-2xl ${
            featured ? "aspect-4/3" : "aspect-video"
          }`}
        >
          <CoverArt
            accent={article.coverAccent}
            title={article.title}
            className="h-full w-full origin-center transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
            {category}
          </span>
        </div>
        <div className="mt-3">
          <h3
            className={`font-extrabold tracking-tight text-paper ${
              featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            }`}
          >
            {article.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {readingTimeMinutes ? (
              <>
                {" · "}
                {formatReadTime(readingTimeMinutes)}
              </>
            ) : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
