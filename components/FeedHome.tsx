import { HomeDesk } from "@/components/HomeDesk";
import { getFeedArticles, getHeroArticles } from "@/lib/articles";

export function FeedHome() {
  const [lead] = getHeroArticles();
  const articles = getFeedArticles();

  return (
    <main id="main">
      <HomeDesk lead={lead} articles={articles} />
    </main>
  );
}
