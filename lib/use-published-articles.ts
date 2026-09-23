"use client";

import { useEffect, useState } from "react";
import { fetchPublishedArticles } from "./remote-articles";
import { isSupabaseConfigured } from "./supabase";
import type { ArticleMeta } from "./types";

export function usePublishedArticles<T extends ArticleMeta>(fallback: T[]): T[] {
  const configured = isSupabaseConfigured();
  const [remote, setRemote] = useState<T[] | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    fetchPublishedArticles()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setRemote(rows as unknown as T[]);
      })
      .catch(() => {
        /* keep sample fallback when the table is missing or empty */
      });
    return () => {
      cancelled = true;
    };
  }, [configured]);

  return remote ?? fallback;
}
