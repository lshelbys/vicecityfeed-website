import { ArticleCard } from "@/components/ArticleCard";
import { EmptyStories } from "@/components/EmptyStories";
import type { FeedArticle } from "@/lib/types";

type SectionFeedProps = {
  articles: FeedArticle[];
};

export function SectionFeed({ articles }: SectionFeedProps) {
  const [lead, ...rest] = articles;

  if (!lead) {
    return <EmptyStories />;
  }

  return (
    <div className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      <div className="sm:col-span-2">
        <ArticleCard
          article={lead}
          featured
          readingTimeMinutes={lead.readingTimeMinutes}
        />
      </div>
      {rest.map((article) => (
        <ArticleCard
          key={article.slug}
          article={article}
          readingTimeMinutes={article.readingTimeMinutes}
        />
      ))}
    </div>
  );
}
