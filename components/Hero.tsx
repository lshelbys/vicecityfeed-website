import Link from "next/link";
import { CoverArt } from "@/components/CoverArt";
import { ctaPillClass } from "@/components/pills";
import { articleCta, CATEGORY_SHORT } from "@/lib/site";
import type { ArticleMeta } from "@/lib/types";

type HeroProps = {
  article: ArticleMeta;
};

export function Hero({ article }: HeroProps) {
  const href = `/posts/${article.slug}`;
  const cta = articleCta(article.tags, article.slug);

  return (
    <section aria-labelledby="hero-heading" className="px-4 pt-4 md:px-6">
      <article className="group relative mx-auto max-w-7xl overflow-hidden rounded-2xl">
        <Link href={href} className="block">
          <div className="relative aspect-16/10 min-h-[22rem] overflow-hidden md:min-h-[28rem] lg:min-h-[34rem]">
            <div className="hero-settle absolute inset-0">
              <CoverArt
                accent={article.coverAccent}
                title={article.title}
                className="h-full w-full origin-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-teal/20 via-transparent to-magenta/16" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />
            <div className="vice-line absolute inset-x-0 top-0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 md:p-10">
              <span className="reveal rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                {CATEGORY_SHORT[article.category]}
              </span>
              <h1
                id="hero-heading"
                className="reveal reveal-delay max-w-3xl text-3xl font-extrabold tracking-tight text-paper md:text-5xl lg:text-6xl"
              >
                {article.title}
              </h1>
              <span className={`${ctaPillClass("white")} reveal reveal-delay`}>
                {cta}
              </span>
            </div>
          </div>
        </Link>
      </article>
    </section>
  );
}
