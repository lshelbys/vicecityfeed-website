/** Official GTA 6 calendar date. */
export const GTA6_RELEASE_MS = Date.parse("2026-11-19T00:00:00-05:00");

export type ReleaseRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function remainingUntilRelease(now = Date.now()): ReleaseRemaining {
  const totalMs = Math.max(0, GTA6_RELEASE_MS - now);
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1_000);
  return { days, hours, minutes, seconds, totalMs };
}
