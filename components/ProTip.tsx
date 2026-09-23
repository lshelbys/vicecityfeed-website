import { Lightbulb } from "lucide-react";

type ProTipProps = {
  children: React.ReactNode;
};

export function ProTip({ children }: ProTipProps) {
  return (
    <aside data-protip className="my-6 rounded-2xl border-l-[3px] border-teal bg-surface p-4">
      <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
        <Lightbulb className="size-4" aria-hidden />
        Pro Tip
      </p>
      <div className="text-sm leading-relaxed text-white">{children}</div>
    </aside>
  );
}
