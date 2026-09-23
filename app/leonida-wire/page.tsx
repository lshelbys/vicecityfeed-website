import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { LiveWireFeed } from "@/components/LiveWireFeed";
import { getFeedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Leonida Wire",
  description:
    "The Vice City Feed news desk: GTA 6 leaks, map lore, vehicles, guns, and guides from Leonida.",
};

export default function LeonidaWirePage() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Newswire"
        title="Leonida Wire"
        description="Leaks, lore, and garage notes from the Leonida desk."
      />
      <LiveWireFeed articles={getFeedArticles()} syncWithUrl />
    </main>
  );
}
