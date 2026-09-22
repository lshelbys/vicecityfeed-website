"use client";

import { useSyncExternalStore } from "react";

export const READING_STORAGE_KEY = "vcf-reading-progress";
export const READING_CHANGE_EVENT = "vcf:reading";

type ProgressMap = Record<string, number>;

const EMPTY: ProgressMap = {};
let snapshot: ProgressMap = EMPTY;

export function readReadingProgress(): ProgressMap {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(READING_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return EMPTY;
    }
    const next: ProgressMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && value >= 1 && value <= 100) {
        next[key] = Math.round(value);
      }
    }
    return next;
  } catch {
    return EMPTY;
  }
}

function sameMap(a: ProgressMap, b: ProgressMap) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => a[key] === b[key]);
}

function getSnapshot() {
  const next = readReadingProgress();
  if (sameMap(next, snapshot)) return snapshot;
  snapshot = next;
  return snapshot;
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
  const current = readReadingProgress();
  if (clamped < 1) {
    if (!(slug in current)) return;
    const next = { ...current };
    delete next[slug];
    window.localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(READING_CHANGE_EVENT));
    return;
  }
  if (current[slug] === clamped) return;
  window.localStorage.setItem(
    READING_STORAGE_KEY,
    JSON.stringify({ ...current, [slug]: clamped }),
  );
  window.dispatchEvent(new Event(READING_CHANGE_EVENT));
}

export function useReadingPercent(slug: string): number | null {
  const map = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return map[slug] ?? null;
}
