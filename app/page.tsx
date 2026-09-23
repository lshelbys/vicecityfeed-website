import type { Metadata } from "next";
import { HomeDesk } from "@/components/HomeDesk";
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
      <HomeDesk lead={lead} articles={articles} />
    </main>
  );
}
