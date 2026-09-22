"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchArticleMeta } from "@/lib/filters";
import { CATEGORY_SHORT } from "@/lib/site";
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
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-16 sm:py-24">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close search"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-line bg-surface p-4"
      >
        <h2 id={titleId} className="sr-only">
          Search Vice City Feed
        </h2>
        <label htmlFor="site-search" className="sr-only">
          Search ViceCityFeed
        </label>
        <div className="flex items-center gap-2 rounded-full border border-white/15 px-4 focus-within:border-teal">
          <Search className="size-4 text-teal" aria-hidden />
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
            <li className="px-2 py-6 text-sm text-muted">No matching stories.</li>
          ) : null}
          {results.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/posts/${article.slug}`}
                onClick={close}
                className="block rounded-xl px-3 py-3 hover:bg-raised"
              >
                <p className="text-[11px] font-semibold tracking-wide text-teal uppercase">
                  {CATEGORY_SHORT[article.category]}
                </p>
                <p className="font-extrabold tracking-tight text-paper">
                  {article.title}
                </p>
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
