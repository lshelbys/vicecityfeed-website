"use client";

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type FadeScrollProps = {
  children: ReactNode;
  className?: string;
  role?: string;
  "aria-label"?: string;
};

function measureEnd(node: HTMLElement) {
  return node.scrollWidth - node.scrollLeft - node.clientWidth > 2;
}

export function FadeScroll({
  children,
  className = "",
  role,
  "aria-label": ariaLabel,
}: FadeScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fadeEnd, setFadeEnd] = useState(false);

  const update = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    setFadeEnd(measureEnd(node));
  }, []);

  useOverflowListeners(ref, update);

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      data-fade-end={fadeEnd ? "true" : "false"}
      className={`pill-scroll no-scrollbar overflow-x-auto ${className}`.trim()}
    >
      {children}
    </div>
  );
}

function useOverflowListeners(
  ref: RefObject<HTMLDivElement | null>,
  update: () => void,
) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    update();
    const frame = requestAnimationFrame(update);
    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [ref, update]);
}
