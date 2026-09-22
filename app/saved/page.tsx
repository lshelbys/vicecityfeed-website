import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SavedFeed } from "@/components/SavedFeed";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Saved",
  description: "Stories you saved on Vice City Feed.",
};

export default function SavedPage() {
  const articles = getFeedArticles();

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="Saved"
        description="Stories you kept on this device."
      />
      <SavedFeed articles={articles} />
    </main>
  );
}
