import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LOGO_PNG } from "@/lib/logo-paths";
import { SITE } from "@/lib/site";

type SiteLogoProps = {
  src?: string;
};

export function SiteLogo({ src = LOGO_PNG }: SiteLogoProps) {
  return (
    <Link
      href="/album"
      aria-label={SITE.name}
      className="site-logo-link inline-flex shrink-0 items-center"
    >
      <BrandMark src={src} className="site-logo-mark" />
    </Link>
  );
}
