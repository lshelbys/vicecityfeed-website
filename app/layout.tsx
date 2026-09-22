import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

export const dynamic = "force-static";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getArticleMeta } from "@/lib/articles";
import { getLogoSrc, hasLogoSvg, LOGO_PNG, LOGO_SVG } from "@/lib/logo";
import { SITE } from "@/lib/site";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "GTA 6",
    "Grand Theft Auto VI",
    "Vice City",
    "Leonida",
    "Jason and Lucia",
    "GTA 6 map",
    "GTA 6 leaks",
    "Vice City Feed",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
    types: {
      "application/rss+xml": `${SITE.url}/rss.xml`,
    },
  },
  icons: {
    icon: [
      ...(hasLogoSvg()
        ? [{ url: LOGO_SVG, type: "image/svg+xml" as const }]
        : []),
      { url: LOGO_PNG, type: "image/png" },
    ],
    shortcut: LOGO_PNG,
    apple: [{ url: LOGO_PNG, sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const articles = getArticleMeta();

  return (
    <html lang="en" className={`${body.variable} h-full antialiased`}>
      <body className={`${body.className} min-h-full flex flex-col bg-ink text-paper`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-teal focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Navbar articles={articles} logoSrc={getLogoSrc()} />
        <div className="flex-1 min-w-0">{children}</div>
        <Footer logoSrc={getLogoSrc()} />
      </body>
    </html>
  );
}
