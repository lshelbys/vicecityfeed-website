"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ctaPillClass, outlinePillClass } from "@/components/pills";
import {
  deleteArticle,
  fetchAdminArticles,
  type ArticleRow,
} from "@/lib/remote-articles";
import { formatRelativeTime } from "@/lib/format";
import { getSupabase } from "@/lib/supabase";

function StoryList({
  heading,
  rows,
  onDelete,
}: {
  heading: string;
  rows: ArticleRow[];
  onDelete: (row: ArticleRow) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
          {heading}
        </h2>
        <p className="text-sm text-white">
          {rows.length} {rows.length === 1 ? "story" : "stories"}
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-white">Nothing in this pile yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-display text-lg font-extrabold tracking-tight text-white">
                  {row.title || "Untitled"}
                </p>
                <p className="mt-1 text-xs font-medium text-white">
                  {row.category} · {row.section} · {formatRelativeTime(row.updated_at)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/write/?slug=${encodeURIComponent(row.slug)}`}
                  className={outlinePillClass("px-4")}
                >
                  Edit
                </Link>
                {row.published ? (
                  <Link
                    href={`/posts/${row.slug}/`}
                    className={outlinePillClass("px-4")}
                  >
                    View
                  </Link>
                ) : null}
                <button
                  type="button"
                  className={outlinePillClass("px-4")}
                  onClick={() => onDelete(row)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AdminDesk() {
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAdminArticles()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Could not load stories. Run supabase/schema.sql in the SQL editor.",
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const drafts = useMemo(() => rows.filter((row) => !row.published), [rows]);
  const published = useMemo(() => rows.filter((row) => row.published), [rows]);

  async function onDelete(row: ArticleRow) {
    if (!window.confirm(`Delete “${row.title || row.slug}”?`)) return;
    try {
      await deleteArticle(row.id);
      setRows((current) => current.filter((item) => item.id !== row.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function onSignOut() {
    await getSupabase()?.auth.signOut();
  }

  return (
    <div data-admin-desk className="space-y-10">
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/write/" className={ctaPillClass("white")}>
          New story
        </Link>
        <button type="button" className={outlinePillClass("px-5")} onClick={() => void onSignOut()}>
          Sign out
        </button>
      </div>
      {loading ? <p className="text-sm text-white">Loading desk…</p> : null}
      {error ? (
        <p className="text-sm font-semibold text-magenta" role="alert">
          {error}
        </p>
      ) : null}
      {!loading ? (
        <>
          <StoryList heading="Drafts" rows={drafts} onDelete={onDelete} />
          <StoryList heading="Published" rows={published} onDelete={onDelete} />
        </>
      ) : null}
    </div>
  );
}
