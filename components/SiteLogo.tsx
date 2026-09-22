import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteLogo() {
  return (
    <Link
      href="/"
      className="inline-flex min-w-0 max-w-full items-center gap-2 text-paper transition-colors duration-200 hover:text-teal"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gold md:size-8">
        <svg viewBox="0 0 24 24" className="size-3.5 md:size-4" aria-hidden>
          <path
            fill="#000"
            d="M12 2.2 14.7 9h7.3l-5.9 4.3 2.3 7.1L12 16.9 5.6 20.4l2.3-7.1L2 9h7.3z"
          />
        </svg>
      </span>
      <span className="truncate text-[13px] font-black tracking-[0.04em] uppercase sm:text-[15px] sm:tracking-[0.06em] md:text-lg">
        {SITE.name}
      </span>
    </Link>
  );
}
