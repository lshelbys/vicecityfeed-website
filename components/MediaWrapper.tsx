import { CoverArt } from "@/components/CoverArt";
import type { CoverAccent } from "@/lib/types";

type MediaWrapperProps = {
  caption: string;
  accent?: CoverAccent;
};

export function MediaWrapper({
  caption,
  accent = "cyan",
}: MediaWrapperProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-sm border border-line bg-night-card">
      <CoverArt accent={accent} title={caption} className="h-56 md:h-72" />
      <figcaption className="border-t border-line px-4 py-3 font-mono text-xs tracking-[0.04em] text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
