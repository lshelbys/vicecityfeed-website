export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6" aria-busy="true">
      <div className="h-8 w-48 bg-paper/10" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-64 bg-paper/5 md:col-span-2" />
        <div className="h-64 bg-paper/5" />
      </div>
      <span className="sr-only">Loading Vice City Feed</span>
    </div>
  );
}
