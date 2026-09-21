"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const UNTIL = "[data-scroll-cue-until]";
const MIN_OVERFLOW = 240;

function hideAfterY(): number {
  const until = document.querySelector<HTMLElement>(UNTIL);
  const marked = until
    ? window.scrollY + until.getBoundingClientRect().bottom
    : 0;
  return Math.max(marked, window.innerHeight * 0.5);
}

function shouldShow(): boolean {
  const doc = document.documentElement;
  const longEnough = doc.scrollHeight > window.innerHeight + MIN_OVERFLOW;
  if (!longEnough) return false;
  return window.scrollY < hideAfterY();
}

export function ScrollCue() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    setVisible(shouldShow());
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(update);
    });
    const retry = window.setTimeout(update, 80);
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, update]);

  function onActivate() {
    const until = document.querySelector<HTMLElement>(UNTIL);
    const top = until
      ? window.scrollY + until.getBoundingClientRect().bottom
      : window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="Scroll down"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`scroll-cue fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex xl:left-6 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <span className="scroll-cue-mouse" aria-hidden>
        <span className="scroll-cue-wheel" />
      </span>
      <span className="text-[10px] font-semibold tracking-[0.22em] text-white uppercase">
        Scroll
      </span>
    </button>
  );
}
