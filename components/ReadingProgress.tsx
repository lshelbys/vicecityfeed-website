"use client";

import { useEffect, useState } from "react";
import { writeReadingPercent } from "@/lib/reading";

type ReadingProgressProps = {
  minutes: number;
  slug: string;
};

export function ReadingProgress({ minutes, slug }: ReadingProgressProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const article = document.querySelector("#main article");
    if (!(article instanceof HTMLElement)) return;

    function onScroll() {
      const node = article as HTMLElement;
      const total = node.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - node.offsetTop;
      if (total <= 0) {
        setPercent(100);
        writeReadingPercent(slug, 100);
        return;
      }
      const next = Math.round(Math.min(100, Math.max(0, (scrolled / total) * 100)));
      setPercent(next);
      if (next >= 1) writeReadingPercent(slug, next);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug]);

  const remaining = Math.max(0, Math.ceil((minutes * (100 - percent)) / 100));
  const label =
    percent < 8
      ? `${minutes} min read`
      : remaining === 0
        ? "Done"
        : `${remaining} min left`;

  return (
    <p className="text-xs font-semibold tracking-wide text-white tabular-nums" aria-live="polite">
      {label}
      <span className="ml-2">{percent}%</span>
    </p>
  );
}
