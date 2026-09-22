import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionFeed } from "@/components/SectionFeed";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Vice City Feed reviews of GTA 6 characters, radio, nightlife, and the systems that actually hold up.",
};

export default function ReviewsPage() {
  const articles = getFeedArticles().filter(
    (article) => article.section === "reviews",
  );

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="Reviews"
        description="Character studies, radio, and the night economy — scored like a desk."
      />
      <SectionFeed articles={articles} />
    </main>
  );
}
