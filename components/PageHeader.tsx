type PageHeaderProps = {
  kicker: string;
  title: string;
  description: string;
};

export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8 border-b border-line pb-6">
      <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
        {kicker}
      </p>
      <h1 className="font-display mt-1 text-5xl text-paper md:text-6xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
        {description}
      </p>
    </header>
  );
}
