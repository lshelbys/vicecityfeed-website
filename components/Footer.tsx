import Link from "next/link";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { SocialGlyph } from "@/components/SocialGlyph";
import { outlinePillClass } from "@/components/pills";
import { FOOTER_SITEMAP, SITE, SOCIAL_LINKS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/5 bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm">
          <p className="text-sm font-black tracking-[0.08em] text-paper uppercase">
            {SITE.name}
          </p>
          <p className="mt-3 text-sm text-muted">
            Independent editorial coverage of Leonida. Not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
          <ul className="mt-5 flex gap-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={outlinePillClass("size-10")}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  aria-label={link.label}
                >
                  <SocialGlyph label={link.label} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Sitemap" className="text-sm">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_SITEMAP.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-teal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <NewsletterCTA />
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted md:px-6">
          © {year} {SITE.name} · {SITE.domain} · All original editorial
          copyright {SITE.name}. Grand Theft Auto and Vice City are trademarks
          of their owners.
        </p>
      </div>
    </footer>
  );
}
