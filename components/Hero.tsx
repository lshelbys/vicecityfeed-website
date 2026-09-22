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
          <div className="relative aspect-16/10 overflow-hidden md:min-h-[28rem] lg:min-h-[34rem]">
            <div className="hero-settle absolute inset-0">
              <CoverArt
                accent={article.coverAccent}
                title={article.title}
                className="h-full w-full origin-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-teal/20 via-transparent to-magenta/16" />
            <div className="pointer-events-none absolute inset-0 hidden bg-linear-to-t from-black via-black/45 to-transparent md:block" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-3 bg-ink px-4 py-5 md:absolute md:inset-x-0 md:bottom-0 md:gap-4 md:bg-transparent md:p-8 lg:p-10">
            <span className="reveal rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
              {CATEGORY_SHORT[article.category]}
            </span>
            <h1
              id="hero-heading"
              className="reveal reveal-delay max-w-3xl text-[1.65rem] leading-snug font-extrabold tracking-tight text-balance break-words text-paper sm:text-3xl md:text-5xl md:leading-tight lg:text-6xl"
            >
              {article.title}
            </h1>
            <span className={`${ctaPillClass("white")} reveal reveal-delay`}>
              {cta}
            </span>
          </div>
        </Link>
      </article>
    </section>
  );
}
