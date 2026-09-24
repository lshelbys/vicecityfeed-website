import type { Metadata } from "next";
import { AlbumListening } from "@/components/AlbumListening";
import { ALBUM } from "@/lib/album";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  description: `${ALBUM.singlesOut} official singles from ${ALBUM.title}, in-page via Atlantic Records’ YouTube. ${SITE.description}`,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlbumListening />
    </>
  );
}
