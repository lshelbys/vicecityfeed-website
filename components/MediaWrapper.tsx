import { CoverArt } from "@/components/CoverArt";
import type { CoverAccent } from "@/lib/types";

type MediaWrapperProps = {
  caption: string;
  accent?: CoverAccent;
};

export function MediaWrapper({
  caption,
  accent = "sunset",
}: MediaWrapperProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl bg-surface">
      <CoverArt accent={accent} title={caption} className="aspect-video h-auto" />
      <figcaption className="px-4 py-3 text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}
