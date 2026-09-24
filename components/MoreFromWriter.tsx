import { ArticleCard } from "@/components/ArticleCard";
import type { FeedArticle } from "@/lib/types";

type MoreFromWriterProps = {
  name: string;
  articles: FeedArticle[];
};

export function MoreFromWriter({ name, articles }: MoreFromWriterProps) {
  const stories = articles.slice(0, 2);
  if (stories.length === 0) return null;

  return (
    <section
      aria-labelledby="writer-heading"
      data-more-from={name}
      className="mx-auto mt-20 max-w-7xl"
    >
      <h2
        id="writer-heading"
        className="font-display mb-8 text-2xl font-extrabold tracking-tight text-white md:text-3xl"
      >
        More from {name}
      </h2>
      <div className="grid items-start gap-8 sm:grid-cols-2">
        {stories.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            readingTimeMinutes={article.readingTimeMinutes}
          />
        ))}
      </div>
    </section>
  );
}
