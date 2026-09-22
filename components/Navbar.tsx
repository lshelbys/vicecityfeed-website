"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ReleaseCountdown } from "@/components/ReleaseCountdown";
import { SearchModal } from "@/components/SearchModal";
import { SiteLogo } from "@/components/SiteLogo";
import { SocialLauncher } from "@/components/SocialLauncher";
import { outlinePillClass, pillClass } from "@/components/pills";
import { isNavActive, NAV_ITEMS } from "@/lib/site";
import type { ArticleMeta } from "@/lib/types";

type NavbarProps = {
  articles: ArticleMeta[];
  logoSrc?: string;
};

export function Navbar({ articles, logoSrc }: NavbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="mx-auto grid max-w-7xl min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2 md:gap-3 md:px-6 md:py-2.5">
        <div className="min-w-0 justify-self-start">
          <ReleaseCountdown />
        </div>
        <SiteLogo src={logoSrc} />
        <div className="flex shrink-0 items-center justify-end gap-1.5 justify-self-end md:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={outlinePillClass("size-11")}
            aria-haspopup="dialog"
            aria-label="Search"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <SocialLauncher />
        </div>
      </div>
      <nav aria-label="Secondary">
        <div className="pill-scroll no-scrollbar mx-auto min-w-0 max-w-7xl overflow-x-auto">
          <div className="flex w-max gap-2 px-4 py-2.5 md:px-6 md:py-3">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={pillClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        articles={articles}
      />
    </header>
  );
}
