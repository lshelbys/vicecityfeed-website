import Link from "next/link";
import { CoverArt } from "@/components/CoverArt";
import { formatDate } from "@/lib/format";
import type { ArticleMeta } from "@/lib/types";

type HeroGridProps = {
  lead: ArticleMeta;
  secondary: [ArticleMeta, ArticleMeta];
};

export function HeroGrid({ lead, secondary }: HeroGridProps) {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-magenta">
            Tonight in Leonida
          </p>
          <h1 id="hero-heading" className="font-display text-4xl text-paper md:text-5xl">
            The Feed
          </h1>
        </div>
        <p className="hidden max-w-sm text-right text-sm text-muted md:block">
          Independent coverage of GTA VI — map, missions, garage, leaks. No
          affiliate sludge.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <article className="neon-border group relative overflow-hidden rounded-sm lg:col-span-2 lg:row-span-2">
          <Link href={`/posts/${lead.slug}`} className="block h-full">
            <CoverArt
              accent={lead.coverAccent}
              title={lead.title}
              className="h-64 sm:h-80 lg:h-full lg:min-h-[28rem]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-night via-night/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-cyan">
                <span>{lead.category}</span>
                <time dateTime={lead.publishedAt}>
                  {formatDate(lead.publishedAt)}
                </time>
              </div>
              <h2 className="font-display max-w-3xl text-4xl leading-[0.92] text-paper md:text-6xl group-hover:text-cyan">
                {lead.title}
              </h2>
              <p className="max-w-2xl text-sm text-paper/80 md:text-base">
                {lead.excerpt}
              </p>
            </div>
          </Link>
        </article>

        {secondary.map((article) => (
          <div key={article.slug} className="lg:min-h-0">
            <StackedHeroCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StackedHeroCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="neon-border group flex h-full overflow-hidden rounded-sm">
      <Link href={`/posts/${article.slug}`} className="flex h-full w-full flex-col">
        <CoverArt
          accent={article.coverAccent}
          title={article.title}
          className="h-32 lg:h-36"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-magenta">
            {article.category}
          </p>
          <h2 className="font-display text-2xl leading-[0.95] text-paper group-hover:text-cyan">
            {article.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}

