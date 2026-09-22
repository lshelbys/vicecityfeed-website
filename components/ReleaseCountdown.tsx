"use client";

import { useEffect, useState } from "react";
import { remainingUntilRelease } from "@/lib/release";

export function ReleaseCountdown() {
  const [remaining, setRemaining] = useState(() => remainingUntilRelease());

  useEffect(() => {
    const tick = () => setRemaining(remainingUntilRelease());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const live = remaining.totalMs > 0;
  const label = live
    ? `${remaining.days} days ${remaining.hours} hours until GTA 6`
    : "GTA 6 is out";

  return (
    <p
      className="min-w-0 shrink tabular-nums leading-tight text-paper"
      aria-live="polite"
      aria-label={label}
    >
      <span className="block text-[9px] font-semibold tracking-[0.16em] text-muted uppercase md:text-[10px]">
        GTA 6
      </span>
      <span className="mt-0.5 block text-sm font-semibold tracking-tight md:text-[15px]">
        {live ? (
          <>
            {remaining.days}
            <span className="text-muted">d</span>
            <span className="ml-1 hidden sm:inline">
              {remaining.hours}
              <span className="text-muted">h</span>
            </span>
          </>
        ) : (
          "Out"
        )}
      </span>
    </p>
  );
}
