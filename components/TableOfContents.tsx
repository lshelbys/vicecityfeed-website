"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const heading of headings) {
      const node = document.getElementById(heading.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden xl:block"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
        On this page
      </p>
      <ol className="mt-3 space-y-2 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-1 text-sm transition ${
                heading.level === 3 ? "pl-6" : "pl-4"
              } ${
                active === heading.id
                  ? "border-cyan text-cyan"
                  : "border-transparent text-muted hover:text-paper"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
