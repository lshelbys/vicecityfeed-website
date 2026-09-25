export const CATEGORIES = [
  "Leaks & News",
  "Map & Lore",
  "Vehicles & Guns",
  "Guides",
  "Media",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS = [
  "all",
  "leaks-news",
  "map-lore",
  "vehicles-guns",
  "guides",
  "media",
  "hardware",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const SECTION_SLUGS = [
  "wire",
  "intel",
  "map",
  "garage",
  "reviews",
] as const;

export type SectionSlug = (typeof SECTION_SLUGS)[number];

export type CoverAccent = "cyan" | "magenta" | "sunset";

export const COVER_SCENES = [
  "coast",
  "city",
  "car",
  "map",
  "gun",
  "interior",
  "swamp",
  "port",
  "marina",
  "street",
  "club",
  "workshop",
  "portrait",
  "desk",
] as const;

export type CoverScene = (typeof COVER_SCENES)[number];

export type Author = {
  name: string;
  role: string;
  handle: string;
};

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  category: Category;
  tags: string[];
  section: SectionSlug;
  featured: boolean;
  heroRank?: 1 | 2 | 3;
  coverAccent: CoverAccent;
  coverScene: CoverScene;
  coverImageUrl?: string;
  relatedSlugs: string[];
  breaking?: boolean;
};

export type Article = ArticleMeta & {
  content: string;
  readingTimeMinutes: number;
  wordCount: number;
};

export type FeedArticle = ArticleMeta & {
  readingTimeMinutes: number;
};

export type Difficulty = "Street" | "Heist" | "Legend";

export type Mission = {
  slug: string;
  title: string;
  excerpt: string;
  difficulty: Difficulty;
  durationLabel: string;
  durationMinutes: number;
  protagonists: Array<"Jason" | "Lucia">;
  location: string;
  articleSlug: string;
};

export type BreakingItem = {
  id: string;
  label: string;
  href: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  external?: boolean;
};
