import { Lightbulb } from "lucide-react";

type ProTipProps = {
  children: React.ReactNode;
};

export function ProTip({ children }: ProTipProps) {
  return (
    <aside className="my-6 border border-cyan/30 bg-cyan/8 p-4">
      <p className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cyan">
        <Lightbulb className="size-4" aria-hidden />
        Pro Tip
      </p>
      <div className="text-sm leading-relaxed text-paper/90">{children}</div>
    </aside>
  );
}
