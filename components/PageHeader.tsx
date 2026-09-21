type PageHeaderProps = {
  kicker: string;
  title: string;
  description: string;
};

export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        {kicker}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-paper md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
        {description}
      </p>
    </header>
  );
}
