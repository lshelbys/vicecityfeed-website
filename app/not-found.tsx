import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 md:px-6"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
        404
      </p>
      <h1 className="font-display mt-2 text-5xl text-paper">
        This alley is empty
      </h1>
      <p className="mt-3 text-muted">
        No story at this URL. The Wire is still live.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-sm bg-cyan px-4 py-2 font-display text-lg tracking-[0.12em] text-night"
      >
        Back to the Feed
      </Link>
    </main>
  );
}
