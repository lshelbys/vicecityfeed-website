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
  { href: "/leonida-wire", label: "Leonida Wire" },
  { href: "/mission-intel", label: "Mission Intel" },
  { href: "/the-map", label: "The Map" },
  { href: "/garage-mods", label: "Garage & Mods" },
  { href: "/reviews", label: "Reviews" },
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
  ...NAV_ITEMS,
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/rss.xml", label: "RSS Feed" },
];

export const CATEGORY_FILTERS: Array<{ slug: CategorySlug; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "leaks-news", label: "Leaks & News" },
  { slug: "map-lore", label: "Map & Lore" },
  { slug: "vehicles-guns", label: "Vehicles & Guns" },
  { slug: "guides", label: "Guides" },
];

export const CATEGORY_TO_SLUG: Record<Category, Exclude<CategorySlug, "all">> =
  {
    "Leaks & News": "leaks-news",
    "Map & Lore": "map-lore",
    "Vehicles & Guns": "vehicles-guns",
    Guides: "guides",
  };

export const SLUG_TO_CATEGORY: Record<
  Exclude<CategorySlug, "all">,
  Category
> = {
  "leaks-news": "Leaks & News",
  "map-lore": "Map & Lore",
  "vehicles-guns": "Vehicles & Guns",
  guides: "Guides",
};
