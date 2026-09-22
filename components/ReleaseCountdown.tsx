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
    ? `${remaining.days} days ${remaining.hours} hours until GTA 6`
    : "GTA 6 is out";

  return (
    <p
      className="flex shrink-0 items-end gap-2 text-white tabular-nums md:gap-2.5"
      aria-live="polite"
      aria-label={label}
    >
      {live ? (
        <>
          <span className="flex flex-col items-start leading-none">
            <span className="text-base font-semibold tracking-tight md:text-lg">
              {remaining.days}
            </span>
            <span className="mt-1 text-[8px] font-semibold tracking-[0.16em] uppercase md:text-[9px]">
              Days
            </span>
          </span>
          <span className="mb-2.5 text-xs font-light md:mb-3" aria-hidden>
            :
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-base font-semibold tracking-tight md:text-lg">
              {pad(remaining.hours)}
            </span>
            <span className="mt-1 text-[8px] font-semibold tracking-[0.16em] uppercase md:text-[9px]">
              Hrs
            </span>
          </span>
        </>
      ) : (
        <span className="text-sm font-semibold tracking-tight">Out now</span>
      )}
    </p>
  );
}
