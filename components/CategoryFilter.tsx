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
  return (
    <div
      role="tablist"
      aria-label="Filter Leonida Wire by category"
      className="flex flex-wrap gap-2"
    >
      {CATEGORY_FILTERS.map((filter) => {
        const isActive = filter.slug === active;
        const className = `rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition ${
          isActive
            ? "border-cyan bg-cyan/10 text-cyan"
            : "border-line text-muted hover:border-magenta hover:text-paper"
        }`;

        if (onSelect) {
          return (
            <button
              key={filter.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
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
            className={className}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
