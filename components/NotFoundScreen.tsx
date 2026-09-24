import Link from "next/link";
import { ctaPillClass } from "@/components/pills";

export function NotFoundScreen() {
  return (
    <main
      id="main"
      data-not-found
      className="mx-auto flex min-h-[62vh] max-w-[720px] flex-col justify-center px-4 py-20 md:px-6"
    >
      <p className="text-[11px] font-bold tracking-[0.16em] text-white uppercase">
        404
      </p>
      <h1 className="font-display mt-5 text-[2.2rem] leading-[1.05] font-extrabold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
        This page is not here
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-white">
        Nothing lives at this URL.
      </p>
      <Link href="/" className={`${ctaPillClass("white")} mt-8`}>
        Back home
      </Link>
    </main>
  );
}
