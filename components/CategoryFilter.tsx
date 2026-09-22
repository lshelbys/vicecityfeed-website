import Link from "next/link";
import { pillClass } from "@/components/pills";
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
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Filter Newswire by category"
        className="pill-scroll no-scrollbar -mx-4 overflow-x-auto md:mx-0"
      >
        <div className="flex w-max gap-2 px-4 md:px-0">
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = filter.slug === active;

            if (onSelect) {
              return (
                <button
                  key={filter.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={pillClass(isActive)}
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
                className={pillClass(isActive)}
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
