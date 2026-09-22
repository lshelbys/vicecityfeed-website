export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return formatDate(iso);
  const diff = Math.max(0, now - then);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    const minutes = Math.max(1, Math.round(diff / minute));
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  if (diff < day) {
    const hours = Math.max(1, Math.round(diff / hour));
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  const days = Math.round(diff / day);
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 8) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  return formatDate(iso);
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
