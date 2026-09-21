import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteLogo() {
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2.5 text-paper transition-colors duration-200 hover:text-teal"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-gold">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="#000"
            d="M12 2.2 14.7 9h7.3l-5.9 4.3 2.3 7.1L12 16.9 5.6 20.4l2.3-7.1L2 9h7.3z"
          />
        </svg>
      </span>
      <span className="truncate text-[15px] font-black tracking-[0.06em] uppercase md:text-lg">
        {SITE.name}
      </span>
    </Link>
  );
}
