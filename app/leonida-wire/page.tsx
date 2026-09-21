import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WireFeed } from "@/components/WireFeed";
import { getArticleMeta } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Leonida Wire",
  description:
    "The Vice City Feed news desk: GTA 6 leaks, map lore, vehicles, guns, and guides from Leonida.",
};

export default function LeonidaWirePage() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="News desk"
        title="Leonida Wire"
        description="Filter the feed. Leaks stay labeled. Lore stays sourced. If it cannot survive the editorial guidelines, it does not ship."
      />
      <WireFeed articles={getArticleMeta()} syncWithUrl />
    </main>
  );
}
