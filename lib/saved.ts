"use client";

import { useSyncExternalStore } from "react";

export const SAVED_STORAGE_KEY = "vcf-saved-slugs";
export const SAVED_CHANGE_EVENT = "vcf:saved";

const EMPTY: string[] = [];
let snapshot: string[] = EMPTY;

export function readSavedSlugs(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
  } catch {
    return EMPTY;
  }
}

function sameSlugs(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function getSavedSnapshot() {
  const next = readSavedSlugs();
  if (sameSlugs(next, snapshot)) return snapshot;
  snapshot = next;
  return snapshot;
}

function subscribeSaved(callback: () => void) {
  window.addEventListener(SAVED_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SAVED_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function writeSavedSlugs(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event(SAVED_CHANGE_EVENT));
}

export function toggleSavedSlug(slug: string): string[] {
  const current = readSavedSlugs();
  const next = current.includes(slug)
    ? current.filter((value) => value !== slug)
    : [slug, ...current];
  writeSavedSlugs(next);
  return next;
}

export function useHasHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useSavedStories() {
  const slugs = useSyncExternalStore(
    subscribeSaved,
    getSavedSnapshot,
    () => EMPTY,
  );

  return {
    slugs,
    count: slugs.length,
    has: (slug: string) => slugs.includes(slug),
    toggle: (slug: string) => toggleSavedSlug(slug),
  };
}
