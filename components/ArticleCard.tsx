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
    <article className="group transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <Link href={href} className="block">
        <div
          className={`relative overflow-hidden rounded-2xl ${
            featured ? "aspect-4/3" : "aspect-video"
          }`}
        >
          <CoverArt
            accent={article.coverAccent}
            title={article.title}
            className="h-full w-full origin-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase transition-colors duration-200 group-hover:bg-teal group-hover:text-ink">
            {category}
          </span>
        </div>
        <div className="mt-3">
          <h3
            className={`text-balance break-words font-extrabold tracking-tight text-paper transition-colors duration-200 group-hover:text-teal ${
              featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            }`}
          >
            {article.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted transition-colors duration-200 group-hover:text-muted-2">
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
