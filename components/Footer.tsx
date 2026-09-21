import Link from "next/link";
import { Rss } from "lucide-react";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { FOOTER_SITEMAP, SITE, SOCIAL_LINKS } from "@/lib/site";

function SocialGlyph({ label }: { label: string }) {
  if (label === "RSS") return <Rss className="size-4" aria-hidden />;
  if (label === "Discord") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="currentColor"
          d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.01.05-.01.07 0c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07 0c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.03.1c.32.61.68 1.18 1.07 1.73c.01.02.04.03.07.02c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L5.3 22H2.04l8.03-9.17L1.75 2h6.76l4.66 6.17zm-1.16 18h1.8L7.01 3.89H5.08z"
      />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-night-elevated">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-3xl text-paper">Vice City Feed</p>
          <p className="mt-2 text-sm text-muted">{SITE.tagline}</p>
          <p className="mt-4 text-sm text-muted">
            Independent editorial coverage of Leonida. Not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
          <ul className="mt-5 flex gap-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-paper hover:border-cyan hover:text-cyan"
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
        <nav aria-label="Sitemap">
          <h2 className="text-[11px] uppercase tracking-[0.22em] text-cyan">
            Sitemap
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_SITEMAP.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <NewsletterCTA />
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted md:px-6">
          © {year} {SITE.name} · {SITE.domain} · All original editorial
          copyright {SITE.name}. Grand Theft Auto and Vice City are trademarks
          of their owners.
        </p>
      </div>
    </footer>
  );
}
