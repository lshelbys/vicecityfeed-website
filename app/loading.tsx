export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6" aria-busy="true">
      <div className="h-8 w-48 rounded-full bg-raised" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-64 rounded-2xl bg-surface md:col-span-2" />
        <div className="h-64 rounded-2xl bg-surface" />
      </div>
      <span className="sr-only">Loading Vice City Feed</span>
    </div>
  );
}
