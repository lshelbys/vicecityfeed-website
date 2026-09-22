"use client";

import { useEffect, useState } from "react";
import { remainingUntilRelease } from "@/lib/release";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function TickValue({ value }: { value: string }) {
  return (
    <span className="inline-flex overflow-hidden">
      <span key={value} className="tick-digit">
        {value}
      </span>
    </span>
  );
}

export function ReleaseCountdown() {
  const [remaining, setRemaining] = useState(() => remainingUntilRelease());

  useEffect(() => {
    const tick = () => setRemaining(remainingUntilRelease());
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, []);

  const live = remaining.totalMs > 0;
  const label = live
    ? `Time until GTA 6 release on 19 November 2026. ${remaining.days} days ${remaining.hours} hours ${remaining.minutes} minutes remaining.`
    : "GTA 6 is out";

  return (
    <p
      className="min-w-0 leading-none text-white"
      aria-live="polite"
      aria-label={label}
      data-countdown={live ? `${remaining.days}d-${pad(remaining.hours)}h-${pad(remaining.minutes)}m` : "out"}
    >
      <span className="block text-[9px] font-semibold tracking-[0.12em] uppercase md:text-[10px] md:tracking-[0.16em]">
        GTA 6
      </span>
      <span className="mt-0.5 block text-[12px] font-semibold tracking-tight tabular-nums md:text-sm">
        {live ? (
          <>
            <TickValue value={String(remaining.days)} />
            d{" "}
            <TickValue value={pad(remaining.hours)} />
            h
            <span className="hidden md:inline">
              {" "}
              <TickValue value={pad(remaining.minutes)} />
              m
            </span>
          </>
        ) : (
          "Out now"
        )}
      </span>
      <span className="mt-0.5 block whitespace-nowrap text-[9px] font-medium tracking-[0.04em] uppercase md:text-[10px] md:tracking-[0.1em]">
        {live ? (
          <>
            until Nov 19
            <span className="hidden sm:inline">, 2026</span>
          </>
        ) : (
          "in stores"
        )}
      </span>
    </p>
  );
}
