"use client";

import { useEffect, useState } from "react";
import { remainingUntilRelease, type ReleaseRemaining } from "@/lib/release";

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
  const [remaining, setRemaining] = useState<ReleaseRemaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(remainingUntilRelease());
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, []);

  const live = remaining ? remaining.totalMs > 0 : true;
  const label = remaining
    ? live
      ? `Time until GTA 6 release on 19 November 2026. ${remaining.days} days ${remaining.hours} hours ${remaining.minutes} minutes remaining.`
      : "GTA 6 is out"
    : "Time until GTA 6 release on 19 November 2026.";

  return (
    <div
      className="min-w-0 leading-none text-white"
      aria-live="polite"
      aria-label={label}
      data-countdown={
        remaining
          ? live
            ? `${remaining.days}d-${pad(remaining.hours)}h-${pad(remaining.minutes)}m`
            : "out"
          : "pending"
      }
      data-remaining-ms={remaining ? String(remaining.totalMs) : ""}
      suppressHydrationWarning
    >
      <div className="text-[9px] font-semibold tracking-[0.12em] uppercase md:text-[10px] md:tracking-[0.16em]">
        GTA 6
      </div>
      <div className="mt-0.5 text-[12px] font-semibold tracking-tight tabular-nums md:text-sm">
        {remaining ? (
          live ? (
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
          )
        ) : (
          <span className="invisible" aria-hidden="true">
            00d 00h
          </span>
        )}
      </div>
      <div className="mt-0.5 whitespace-nowrap text-[9px] font-medium tracking-[0.04em] uppercase md:text-[10px] md:tracking-[0.1em]">
        {remaining && !live ? (
          "in stores"
        ) : (
          <>
            until Nov 19
            <span className="hidden sm:inline">, 2026</span>
          </>
        )}
      </div>
    </div>
  );
}
