"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyStories } from "@/components/EmptyStories";
import { ctaPillClass, outlinePillClass } from "@/components/pills";
import { describeAdminError } from "@/lib/admin-errors";
import { formatRelativeTime } from "@/lib/format";
import {
  deleteArticle,
  fetchAdminArticles,
  setPublished,
  type ArticleRow,
} from "@/lib/remote-articles";
import { getSupabase } from "@/lib/supabase";

function StoryList({
  heading,
  rows,
  pendingId,
  confirmId,
  onUnpublish,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  heading: string;
  rows: ArticleRow[];
  pendingId: string | null;
  confirmId: string | null;
  onUnpublish?: (row: ArticleRow) => void;
  onAskDelete: (row: ArticleRow) => void;
  onConfirmDelete: (row: ArticleRow) => void;
  onCancelDelete: () => void;
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
        <EmptyStories />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-2xl bg-surface p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-display text-lg font-extrabold tracking-tight text-white">
                    {row.title || "Untitled"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-white">
                    {row.category} · {formatRelativeTime(row.updated_at)}
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
                    <>
                      <Link
                        href={`/posts/${row.slug}/`}
                        className={outlinePillClass("px-4")}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className={outlinePillClass("px-4")}
                        disabled={pendingId === row.id}
                        onClick={() => onUnpublish?.(row)}
                      >
                        {pendingId === row.id ? "Working…" : "Unpublish"}
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className={outlinePillClass("px-4")}
                    onClick={() => onAskDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {confirmId === row.id ? (
                <div className="mt-4 rounded-xl bg-raised px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    Delete “{row.title || row.slug}”? This cannot be undone.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={ctaPillClass("white")}
                      disabled={pendingId === row.id}
                      onClick={() => onConfirmDelete(row)}
                    >
                      {pendingId === row.id ? "Deleting…" : "Delete"}
                    </button>
                    <button
                      type="button"
                      className={outlinePillClass("px-4")}
                      onClick={onCancelDelete}
                    >
                      Keep
                    </button>
                  </div>
                </div>
              ) : null}
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
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

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
        setError(describeAdminError(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const drafts = useMemo(() => rows.filter((row) => !row.published), [rows]);
  const published = useMemo(() => rows.filter((row) => row.published), [rows]);

  async function onUnpublish(row: ArticleRow) {
    setPendingId(row.id);
    setError(null);
    try {
      await setPublished(row.id, false);
      setRows((current) =>
        current.map((item) =>
          item.id === row.id ? { ...item, published: false } : item,
        ),
      );
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setPendingId(null);
    }
  }

  async function onConfirmDelete(row: ArticleRow) {
    setPendingId(row.id);
    setError(null);
    try {
      await deleteArticle(row.id);
      setRows((current) => current.filter((item) => item.id !== row.id));
      setConfirmId(null);
    } catch (err) {
      setError(describeAdminError(err));
    } finally {
      setPendingId(null);
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
      {loading ? (
        <p className="text-sm text-white" data-admin-desk-loading>
          Loading desk…
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold text-magenta" role="alert">
          {error}
        </p>
      ) : null}
      {!loading ? (
        <>
          <StoryList
            heading="Drafts"
            rows={drafts}
            pendingId={pendingId}
            confirmId={confirmId}
            onAskDelete={(row) => setConfirmId(row.id)}
            onConfirmDelete={onConfirmDelete}
            onCancelDelete={() => setConfirmId(null)}
          />
          <StoryList
            heading="Published"
            rows={published}
            pendingId={pendingId}
            confirmId={confirmId}
            onUnpublish={onUnpublish}
            onAskDelete={(row) => setConfirmId(row.id)}
            onConfirmDelete={onConfirmDelete}
            onCancelDelete={() => setConfirmId(null)}
          />
        </>
      ) : null}
    </div>
  );
}
