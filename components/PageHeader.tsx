type PageHeaderProps = {
  kicker: string;
  title: string;
  description: string;
};

export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <header className="reveal mb-10">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
        {kicker}
      </p>
      <h1 className="font-display mt-3 text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-balance break-words text-white md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-snug font-bold text-white md:text-xl">
        {description}
      </p>
    </header>
  );
}
