"use client";

import { useEffect, useState } from "react";
import { remainingUntilRelease } from "@/lib/release";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

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
    ? `GTA 6 releases 19 November 2026. ${remaining.days} days ${remaining.hours} hours remaining.`
    : "GTA 6 is out";

  return (
    <p
      className="min-w-0 text-white"
      aria-live="polite"
      aria-label={label}
    >
      <span className="block text-[9px] font-semibold tracking-[0.16em] uppercase md:text-[10px]">
        GTA 6
      </span>
      <span className="mt-0.5 block text-[13px] font-semibold tracking-tight tabular-nums md:text-sm">
        {live ? (
          <>
            {remaining.days}d {pad(remaining.hours)}h
          </>
        ) : (
          "Out now"
        )}
      </span>
    </p>
  );
}
