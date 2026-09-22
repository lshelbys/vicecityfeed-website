"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";
import { outlinePillClass } from "@/components/pills";
import { useSavedStories } from "@/lib/saved";

export function SavedNav() {
  const pathname = usePathname();
  const { count } = useSavedStories();
  const active = pathname === "/saved" || pathname.startsWith("/saved/");
  const label =
    count > 0
      ? `Saved, ${count} ${count === 1 ? "story" : "stories"}`
      : "Saved stories";

  return (
    <Link
      href="/saved/"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      data-saved-nav
      data-saved-count={count}
      className={outlinePillClass(
        count > 0
          ? "h-10 min-h-10 gap-1.5 px-3 md:h-11 md:min-h-11"
          : "size-10 min-h-10 md:size-11 md:min-h-11",
      )}
    >
      <Bookmark
        className="size-4"
        fill={count > 0 ? "currentColor" : "none"}
        aria-hidden
      />
      {count > 0 ? (
        <span className="text-sm font-medium tabular-nums">{count}</span>
      ) : null}
    </Link>
  );
}
