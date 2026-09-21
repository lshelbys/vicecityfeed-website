import Link from "next/link";
import { Radio } from "lucide-react";
import type { BreakingItem } from "@/lib/types";

type BreakingTickerProps = {
  items: BreakingItem[];
};

export function BreakingTicker({ items }: BreakingTickerProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items, ...items, ...items];

  return (
    <section
      aria-label="Leonida Breaking Updates"
      className="border-y border-line bg-night-elevated"
    >
      <div className="mx-auto flex max-w-7xl items-stretch">
        <p className="flex shrink-0 items-center gap-2 bg-magenta px-4 py-2.5 font-display text-lg tracking-[0.12em] text-paper">
          <Radio className="size-4" aria-hidden />
          Leonida Breaking Updates
        </p>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex w-max items-center gap-8 py-2.5 pr-8">
            {loop.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.16em] text-paper/85 hover:text-cyan whitespace-nowrap"
              >
                <span className="mr-3 text-cyan">/</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
