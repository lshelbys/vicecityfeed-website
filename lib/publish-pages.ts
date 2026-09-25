import type { Category, SectionSlug } from "./types";

export const PUBLISH_PAGE_IDS = ["feed", "gta-vi", "vehicles", "media"] as const;
export type PublishPageId = (typeof PUBLISH_PAGE_IDS)[number];

export type PublishPage = {
  id: PublishPageId;
  label: string;
  href: string;
  category: Category;
  section: SectionSlug;
};

export const PUBLISH_PAGES: PublishPage[] = [
  {
    id: "feed",
    label: "Feed",
    href: "/",
    category: "Leaks & News",
    section: "wire",
  },
  {
    id: "gta-vi",
    label: "GTA VI",
    href: "/the-map",
    category: "Map & Lore",
    section: "map",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    href: "/garage-mods",
    category: "Vehicles & Guns",
    section: "garage",
  },
  {
    id: "media",
    label: "Media",
    href: "/reviews",
    category: "Media",
    section: "reviews",
  },
];

export function publishPageById(id: string): PublishPage {
  return PUBLISH_PAGES.find((page) => page.id === id) ?? PUBLISH_PAGES[0];
}

export function publishPageOf(category: string, section: string): PublishPageId {
  if (section === "reviews" || category === "Media") return "media";
  if (section === "map" || category === "Map & Lore") return "gta-vi";
  if (section === "garage" || category === "Vehicles & Guns") return "vehicles";
  return "feed";
}

export function publishPageLabel(category: string, section: string): string {
  const id = publishPageOf(category, section);
  return PUBLISH_PAGES.find((page) => page.id === id)?.label ?? "Feed";
}
