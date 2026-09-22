import { LOGO_PNG, LOGO_SVG } from "@/lib/logo-paths";

type BrandMarkProps = {
  src?: string;
  className?: string;
};

const markClass =
  "h-7 w-auto max-w-[9.5rem] object-contain object-left sm:max-w-[12rem] md:h-8 md:max-w-[14rem]";

export function BrandMark({ src = LOGO_PNG, className = markClass }: BrandMarkProps) {
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
