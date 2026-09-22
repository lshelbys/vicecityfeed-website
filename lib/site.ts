import type { Category, CategorySlug, NavItem, SocialLink } from "./types";

export const SITE = {
  name: "Vice City Feed",
  shortName: "VCF",
  domain: "vicecityfeed.com",
  url: "https://vicecityfeed.com",
  tagline: "Leonida intel. Vice City nights. No filler.",
  description:
    "Vice City Feed is an independent editorial desk covering Grand Theft Auto VI — Leonida leaks, map lore, mission intel, vehicles, mods, and reviews.",
  locale: "en_US",
  twitter: "@vicecityfeed",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Newswire" },
  { href: "/the-map", label: "GTA VI" },
  { href: "/leonida-wire", label: "Leonida Wire" },
  { href: "/mission-intel", label: "Guides" },
  { href: "/garage-mods", label: "Vehicles" },
  { href: "/reviews", label: "Media" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://discord.gg/vicecityfeed",
    label: "Discord",
    external: true,
  },
  {
    href: "https://x.com/vicecityfeed",
    label: "X/Twitter",
    external: true,
  },
  { href: "/rss.xml", label: "RSS" },
];

export const FOOTER_SITEMAP: NavItem[] = [
  { href: "/", label: "Homepage" },
  { href: "/leonida-wire", label: "Leonida Wire" },
  { href: "/mission-intel", label: "Mission Intel" },
  { href: "/the-map", label: "The Map" },
  { href: "/garage-mods", label: "Garage & Mods" },
  { href: "/reviews", label: "Reviews" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/rss.xml", label: "RSS Feed" },
];

export const CATEGORY_FILTERS: Array<{ slug: CategorySlug; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "leaks-news", label: "Leaks" },
  { slug: "map-lore", label: "Maps" },
  { slug: "guides", label: "Guides" },
  { slug: "vehicles-guns", label: "Vehicles" },
  { slug: "hardware", label: "Hardware" },
];

export const CATEGORY_SHORT: Record<Category, string> = {
  "Leaks & News": "Leaks",
  "Map & Lore": "Maps",
  "Vehicles & Guns": "Vehicles",
  Guides: "Guides",
};

export const CATEGORY_SECTION: Record<Category, { href: string; label: string }> =
  {
    "Leaks & News": { href: "/leonida-wire", label: "Leonida Wire" },
    "Map & Lore": { href: "/the-map", label: "The Map" },
    "Vehicles & Guns": { href: "/garage-mods", label: "Garage & Mods" },
    Guides: { href: "/mission-intel", label: "Mission Intel" },
  };

export const CATEGORY_TO_SLUG: Record<Category, Exclude<CategorySlug, "all" | "hardware">> =
  {
    "Leaks & News": "leaks-news",
    "Map & Lore": "map-lore",
    "Vehicles & Guns": "vehicles-guns",
    Guides: "guides",
  };

export function newswireFilterHref(category: Category) {
  return `/?cat=${CATEGORY_TO_SLUG[category]}#newswire`;
}

export const SLUG_TO_CATEGORY: Record<
  Exclude<CategorySlug, "all" | "hardware">,
  Category
> = {
  "leaks-news": "Leaks & News",
  "map-lore": "Map & Lore",
  "vehicles-guns": "Vehicles & Guns",
  guides: "Guides",
};

export const HARDWARE_TAGS = ["hardware"] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/posts/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function articleCta(tags: string[], slug: string): string {
  if (tags.includes("trailer") || slug.includes("trailer")) {
    return "Watch Trailer";
  }
  return "Read Article";
}
