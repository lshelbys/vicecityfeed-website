"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Ellipsis, X } from "lucide-react";
import { SocialGlyph } from "@/components/SocialGlyph";
import { outlinePillClass } from "@/components/pills";
import { SOCIAL_LINKS } from "@/lib/site";

export function SocialLauncher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={outlinePillClass("size-10 min-h-10 md:size-11 md:min-h-11")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={open ? "Close social links" : "Open social links"}
      >
        <span className="relative size-4">
          <Ellipsis
            className={`absolute inset-0 size-4 transition duration-300 ease-out ${
              open ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
            aria-hidden
          />
          <X
            className={`absolute inset-0 size-4 transition duration-300 ease-out ${
              open ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            aria-hidden
          />
        </span>
      </button>
      <ul
        id={menuId}
        role="menu"
        className={`absolute right-0 z-20 mt-2 w-40 rounded-xl bg-surface p-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.45)] transition duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1.5 opacity-0"
        }`}
      >
        {SOCIAL_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              role="menuitem"
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm text-paper transition-colors duration-300 ease-out hover:bg-teal hover:text-ink"
              onClick={() => setOpen(false)}
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
    </div>
  );
}
