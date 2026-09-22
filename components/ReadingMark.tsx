"use client";

import { useReadingPercent } from "@/lib/reading";

type ReadingMarkProps = {
  slug: string;
};

export function ReadingMark({ slug }: ReadingMarkProps) {
  const percent = useReadingPercent(slug);
  if (percent == null || percent < 1) return null;
  const label = percent >= 100 ? "Read" : `${percent}% read`;

  return (
    <>
      {" · "}
      <span data-reading-progress={percent} className="text-white">
        {label}
      </span>
    </>
  );
}
