"use client";

import type { MouseEvent } from "react";
import { Bookmark } from "lucide-react";
import { useSavedStories } from "@/lib/saved";

type SaveControlProps = {
  slug: string;
  variant?: "card" | "inline";
};

export function SaveControl({ slug, variant = "card" }: SaveControlProps) {
  const { has, toggle } = useSavedStories();
  const saved = has(slug);

  function onToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggle(slug);
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={saved}
        data-save-slug={slug}
        data-saved={saved ? "true" : "false"}
        className="rounded-sm text-sm font-semibold tracking-wide text-white focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
      >
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save story"}
      data-save-slug={slug}
      data-saved={saved ? "true" : "false"}
      className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition-colors duration-300 ease-out hover:bg-teal hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
    >
      <Bookmark
        className="size-4"
        fill={saved ? "currentColor" : "none"}
        aria-hidden
      />
    </button>
  );
}
