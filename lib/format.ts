export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(iso));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function formatDateIso(iso: string): string {
  return iso.slice(0, 10);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingTimeFromMarkdown(markdown: string): {
  wordCount: number;
  readingTimeMinutes: number;
} {
  const stripped = markdown
    .replace(/:::[\s\S]*?:::/g, " ")
    .replace(/[#>*_`~\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = stripped ? stripped.split(" ").length : 0;
  return {
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 220)),
  };
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
