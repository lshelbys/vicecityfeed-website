"use client";

import { useSyncExternalStore } from "react";

export const READING_STORAGE_KEY = "vcf-reading-progress";
export const READING_CHANGE_EVENT = "vcf:reading";

type ProgressEntry = {
  percent: number;
  updatedAt: number;
};

type ProgressMap = Record<string, ProgressEntry>;
type PercentMap = Record<string, number>;

const EMPTY_PERCENT: PercentMap = {};
let percentSnapshot: PercentMap = EMPTY_PERCENT;
let latestSnapshot: { slug: string; percent: number } | null = null;

function normalizeEntry(value: unknown): ProgressEntry | null {
  if (typeof value === "number" && value >= 1 && value <= 100) {
    return { percent: Math.round(value), updatedAt: 0 };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as { percent?: unknown; updatedAt?: unknown };
  if (typeof record.percent !== "number" || record.percent < 1 || record.percent > 100) {
    return null;
  }
  return {
    percent: Math.round(record.percent),
    updatedAt:
      typeof record.updatedAt === "number" && record.updatedAt > 0
        ? record.updatedAt
        : 0,
  };
}

export function readReadingEntries(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(READING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const next: ProgressMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      const entry = normalizeEntry(value);
      if (entry) next[key] = entry;
    }
    return next;
  } catch {
    return {};
  }
}

export function readReadingProgress(): PercentMap {
  const entries = readReadingEntries();
  const next: PercentMap = {};
  for (const [slug, entry] of Object.entries(entries)) {
    next[slug] = entry.percent;
  }
  return next;
}

function samePercentMap(a: PercentMap, b: PercentMap) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => a[key] === b[key]);
}

function getPercentSnapshot() {
  const next = readReadingProgress();
  if (samePercentMap(next, percentSnapshot)) return percentSnapshot;
  percentSnapshot = next;
  return percentSnapshot;
}

export function getLatestInProgress(): { slug: string; percent: number } | null {
  const entries = readReadingEntries();
  let best: { slug: string; percent: number; updatedAt: number } | null = null;
  for (const [slug, entry] of Object.entries(entries)) {
    if (entry.percent < 1 || entry.percent >= 100) continue;
    if (
      !best ||
      entry.updatedAt > best.updatedAt ||
      (entry.updatedAt === best.updatedAt && entry.percent >= best.percent)
    ) {
      best = { slug, percent: entry.percent, updatedAt: entry.updatedAt };
    }
  }
  return best ? { slug: best.slug, percent: best.percent } : null;
}

function getLatestSnapshot() {
  const next = getLatestInProgress();
  if (
    latestSnapshot &&
    next &&
    latestSnapshot.slug === next.slug &&
    latestSnapshot.percent === next.percent
  ) {
    return latestSnapshot;
  }
  if (!latestSnapshot && !next) return null;
  latestSnapshot = next;
  return latestSnapshot;
}

function subscribe(callback: () => void) {
  window.addEventListener(READING_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(READING_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function writeReadingPercent(slug: string, percent: number) {
  if (typeof window === "undefined") return;
  const clamped = Math.round(Math.min(100, Math.max(0, percent)));
  const current = readReadingEntries();
  if (clamped < 1) {
    if (!(slug in current)) return;
    const next = { ...current };
    delete next[slug];
    window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(READING_CHANGE_EVENT));
    return;
  }
  const previous = current[slug];
  if (previous?.percent === clamped) {
    current[slug] = { percent: clamped, updatedAt: Date.now() };
    window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(current));
    return;
  }
  window.localStorage.setItem(
    READING_STORAGE_KEY,
    JSON.stringify({
      ...current,
      [slug]: { percent: clamped, updatedAt: Date.now() },
    }),
  );
  window.dispatchEvent(new Event(READING_CHANGE_EVENT));
}

export function useReadingPercent(slug: string): number | null {
  const map = useSyncExternalStore(subscribe, getPercentSnapshot, () => EMPTY_PERCENT);
  return map[slug] ?? null;
}

export function useLatestInProgress() {
  return useSyncExternalStore(subscribe, getLatestSnapshot, () => null);
}
