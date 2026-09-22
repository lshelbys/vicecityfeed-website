"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORY_FILTERS } from "@/lib/site";
import type { CategorySlug } from "@/lib/types";

type CategoryFilterProps = {
  active: CategorySlug;
  onSelect?: (slug: CategorySlug) => void;
  basePath?: string;
};

export function CategoryFilter({
  active,
  onSelect,
  basePath,
}: CategoryFilterProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, ready: false });

  useLayoutEffect(() => {
    function measure() {
      const row = rowRef.current;
      if (!row) return;
      const current = row.querySelector<HTMLElement>("[data-filter-active='true']");
      if (!current) return;
      setIndicator({
        x: current.offsetLeft,
        w: current.offsetWidth,
        ready: true,
      });
    }

    measure();
    const frame = requestAnimationFrame(measure);
    const fonts = document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      fonts?.catch(() => {});
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Filter Newswire by category"
        className="pill-scroll no-scrollbar -mx-4 overflow-x-auto md:mx-0"
      >
        <div ref={rowRef} className="relative flex w-max gap-2 px-4 md:px-0">
          <span
            aria-hidden
            className="nav-pill-indicator pointer-events-none absolute top-1/2 left-0 z-0 h-11 rounded-full bg-teal"
            style={{
              width: indicator.w,
              transform: `translate3d(${indicator.x}px, -50%, 0)`,
              opacity: indicator.ready ? 1 : 0,
            }}
          />
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = filter.slug === active;
            const className = `relative z-10 inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white ${
              isActive ? "text-ink" : "text-white hover:bg-white/8"
            }`;

            if (onSelect) {
              return (
                <button
                  key={filter.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-filter-active={isActive ? "true" : "false"}
                  className={className}
                  onClick={() => onSelect(filter.slug)}
                >
                  {filter.label}
                </button>
              );
            }

            const href =
              filter.slug === "all"
                ? basePath ?? "/leonida-wire"
                : `${basePath ?? "/leonida-wire"}?cat=${filter.slug}`;

            return (
              <Link
                key={filter.slug}
                href={href}
                role="tab"
                aria-selected={isActive}
                data-filter-active={isActive ? "true" : "false"}
                className={className}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
