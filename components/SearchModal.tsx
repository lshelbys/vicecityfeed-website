"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchArticleMeta } from "@/lib/filters";
import type { ArticleMeta } from "@/lib/types";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  articles: ArticleMeta[];
};

export function SearchModal({ open, onClose, articles }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const results = searchArticleMeta(articles, query);

  function close() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-24">
      <button
        type="button"
        className="absolute inset-0 bg-night/80 backdrop-blur-sm"
        aria-label="Close search"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-xl rounded-sm border border-cyan/30 bg-night-card p-4 shadow-[0_0_40px_rgb(0_240_255_/_0.12)]"
      >
        <h2 id={titleId} className="sr-only">
          Search Vice City Feed
        </h2>
        <label htmlFor="site-search" className="sr-only">
          Search ViceCityFeed
        </label>
        <div className="flex items-center gap-2 border-b border-line px-2">
          <Search className="size-4 text-cyan" aria-hidden />
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ViceCityFeed..."
            className="h-12 w-full bg-transparent text-sm text-paper outline-none placeholder:text-muted"
          />
        </div>
        <ul className="mt-3 max-h-80 overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <li className="px-2 py-6 text-sm text-muted">No matching intel.</li>
          ) : null}
          {results.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/posts/${article.slug}`}
                onClick={close}
                className="block rounded-sm px-2 py-3 hover:bg-cyan/10"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-magenta">
                  {article.category}
                </p>
                <p className="font-display text-xl text-paper">{article.title}</p>
                <p className="line-clamp-1 text-sm text-muted">
                  {article.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
