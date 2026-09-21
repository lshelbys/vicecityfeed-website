import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WireFeed } from "@/components/WireFeed";
import { getArticleMeta } from "@/lib/articles";
import type { CategorySlug } from "@/lib/types";

const VALID: CategorySlug[] = [
  "all",
  "leaks-news",
  "map-lore",
  "vehicles-guns",
  "guides",
];

export const metadata: Metadata = {
  title: "Leonida Wire",
  description:
    "The Vice City Feed news desk: GTA 6 leaks, map lore, vehicles, guns, and guides from Leonida.",
};

export default async function LeonidaWirePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string | string[] }>;
}) {
  const params = await searchParams;
  const cat = typeof params.cat === "string" ? params.cat : "all";
  const initialCategory = VALID.includes(cat as CategorySlug)
    ? (cat as CategorySlug)
    : "all";

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        kicker="News desk"
        title="Leonida Wire"
        description="Filter the feed. Leaks stay labeled. Lore stays sourced. If it cannot survive the editorial guidelines, it does not ship."
      />
      <WireFeed articles={getArticleMeta()} initialCategory={initialCategory} />
    </main>
  );
}
