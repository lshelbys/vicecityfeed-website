/** Official GTA 6 calendar date. */
export const GTA6_RELEASE_MS = Date.parse("2026-11-19T00:00:00-05:00");

export type ReleaseRemaining = {
  days: number;
  hours: number;
  totalMs: number;
};

export function remainingUntilRelease(now = Date.now()): ReleaseRemaining {
  const totalMs = Math.max(0, GTA6_RELEASE_MS - now);
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  return { days, hours, totalMs };
}
