import { CoverArt } from "@/components/CoverArt";
import { CoverTransition } from "@/components/CoverTransition";
import { coverKind } from "@/lib/site";
import type { ArticleMeta } from "@/lib/types";

type StoryCoverProps = {
  article: Pick<
    ArticleMeta,
    "slug" | "title" | "coverAccent" | "coverScene" | "category"
  >;
  className?: string;
  lead?: boolean;
  share?: boolean;
  kind?: string | false;
};

export function StoryCover({
  article,
  className,
  lead = false,
  share = true,
  kind,
}: StoryCoverProps) {
  const word = kind === false ? undefined : (kind ?? coverKind(article.category));
  return (
    <CoverTransition name={`cover-${article.slug}`} enabled={share}>
      <CoverArt
        accent={article.coverAccent}
        scene={article.coverScene}
        title={article.title}
        kind={word}
        lead={lead}
        className={className}
      />
    </CoverTransition>
  );
}
