"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";

type SpoilerProps = {
  children: React.ReactNode;
};

export function Spoiler({ children }: SpoilerProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="my-6 border border-magenta/40 bg-magenta/8 p-4">
      <p className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-magenta">
        <EyeOff className="size-4" aria-hidden />
        Spoiler
      </p>
      {open ? (
        <div className="text-sm leading-relaxed text-paper/90">{children}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-muted underline decoration-magenta/50 underline-offset-4 hover:text-paper"
        >
          Reveal spoiler
        </button>
      )}
    </aside>
  );
}
