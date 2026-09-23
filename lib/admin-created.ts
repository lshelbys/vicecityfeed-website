const KEY = "vcf-admin-created";

export type CreatedStory = {
  id: string;
  slug: string;
  title: string;
  at: number;
};

function read(): CreatedStory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CreatedStory =>
        Boolean(item && typeof item.id === "string" && typeof item.slug === "string"),
    );
  } catch {
    return [];
  }
}

function write(items: CreatedStory[]) {
  window.sessionStorage.setItem(KEY, JSON.stringify(items.slice(0, 20)));
}

export function rememberCreatedStory(story: CreatedStory) {
  write([story, ...read().filter((item) => item.id !== story.id)]);
}

export function listCreatedStories(): CreatedStory[] {
  return read();
}

export function forgetCreatedStory(id: string) {
  write(read().filter((item) => item.id !== id));
}

export function wasCreatedThisSession(id: string) {
  return read().some((item) => item.id === id);
}
