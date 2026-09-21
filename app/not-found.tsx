import Link from "next/link";
import { ctaPillClass } from "@/components/pills";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 md:px-6"
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        404
      </p>
      <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-paper">
        Page not found
      </h1>
      <p className="mt-3 text-muted">No story at this URL. Newswire is still live.</p>
      <Link href="/" className={`${ctaPillClass("white")} mt-6`}>
        Back to Newswire
      </Link>
    </main>
  );
}
