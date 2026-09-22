import { LOGO_PNG, LOGO_SVG } from "@/lib/logo-paths";

type BrandMarkSize = "header" | "footer";

type BrandMarkProps = {
  src?: string;
  size?: BrandMarkSize;
  className?: string;
};

const sizeClass: Record<BrandMarkSize, string> = {
  header:
    "h-[66px] w-auto shrink-0 object-contain object-left md:h-[84px]",
  footer:
    "h-[84px] w-auto shrink-0 object-contain object-left md:h-[96px]",
};

export function BrandMark({
  src = LOGO_PNG,
  size = "header",
  className = sizeClass[size],
}: BrandMarkProps) {
  if (src === LOGO_SVG) {
    return (
      <picture>
        <source srcSet={LOGO_SVG} type="image/svg+xml" />
        <img src={LOGO_PNG} alt="" className={className} />
      </picture>
    );
  }

  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={src} alt="" className={className} />;
}
