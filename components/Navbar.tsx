"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search } from "lucide-react";
import { SearchModal } from "@/components/SearchModal";
import { SiteLogo } from "@/components/SiteLogo";
import { SocialGlyph } from "@/components/SocialGlyph";
import { outlinePillClass, pillClass } from "@/components/pills";
import { isNavActive, NAV_ITEMS, SOCIAL_LINKS } from "@/lib/site";
import type { ArticleMeta } from "@/lib/types";

type NavbarProps = {
  articles: ArticleMeta[];
  logoSrc?: string;
};

export function Navbar({ articles, logoSrc }: NavbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setLauncherOpen(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setLauncherOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="mx-auto flex max-w-7xl min-w-0 items-center gap-2 px-4 py-2 md:gap-3 md:px-6 md:py-2.5">
        <div className="flex min-w-0 flex-1 items-center">
          <SiteLogo src={logoSrc} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={outlinePillClass("size-11")}
            aria-haspopup="dialog"
            aria-label="Search"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLauncherOpen((value) => !value)}
              className={outlinePillClass("size-11")}
              aria-expanded={launcherOpen}
              aria-haspopup="menu"
              aria-label="Social launcher"
            >
              <LayoutGrid className="size-4" aria-hidden />
            </button>
            {launcherOpen ? (
              <ul
                role="menu"
                className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-line bg-surface p-2 shadow-xl"
              >
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      role="menuitem"
                      className="flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm text-paper hover:bg-teal hover:text-ink"
                      onClick={() => setLauncherOpen(false)}
                      {...(link.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      <SocialGlyph label={link.label} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
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
