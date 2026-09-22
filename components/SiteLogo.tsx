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
      href="/"
      aria-label={SITE.name}
      className="inline-flex min-w-0 max-w-full items-center"
    >
      <BrandMark src={src} />
    </Link>
  );
}
