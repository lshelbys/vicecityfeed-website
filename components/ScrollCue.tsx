"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const UNTIL = "[data-scroll-cue-until]";
const MIN_OVERFLOW = 240;

function hideAfterY(): number {
  const until = document.querySelector<HTMLElement>(UNTIL);
  if (until) {
    return window.scrollY + until.getBoundingClientRect().bottom - 72;
  }
  return window.innerHeight * 0.7;
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
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
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
