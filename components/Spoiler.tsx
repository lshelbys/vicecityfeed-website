"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { pillClass } from "@/components/pills";

type SpoilerProps = {
  children: React.ReactNode;
};

export function Spoiler({ children }: SpoilerProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="my-6 rounded-2xl border-l-[3px] border-magenta bg-surface p-4">
      <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-magenta uppercase">
        <EyeOff className="size-4" aria-hidden />
        Spoiler
      </p>
      {open ? (
        <div className="text-sm leading-relaxed text-paper/90">{children}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={pillClass(false, "mt-1")}
        >
          Reveal spoiler
        </button>
      )}
    </aside>
  );
}
