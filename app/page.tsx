import type { Metadata } from "next";
import { ContinueReading } from "@/components/ContinueReading";
import { Hero } from "@/components/Hero";
import { WireFeed } from "@/components/WireFeed";
import { getFeedArticles, getHeroArticles } from "@/lib/articles";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  const [lead] = getHeroArticles();
  const articles = getFeedArticles();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/leonida-wire?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContinueReading articles={articles} />
      <Hero article={lead} />

      <section
        id="newswire"
        aria-labelledby="wire-heading"
        className="mx-auto max-w-7xl px-4 py-12 md:px-6"
      >
        <WireFeed
          articles={articles}
          heading="Newswire"
          headingId="wire-heading"
          syncWithUrl
          shareLeadCover={false}
        />
      </section>
    </main>
  );
}
