type EmptyStoriesProps = {
  className?: string;
};

export function EmptyStories({ className = "" }: EmptyStoriesProps) {
  return (
    <p
      data-empty-stories
      className={`text-lg font-bold text-white ${className}`.trim()}
    >
      No stories yet
    </p>
  );
}

export function EmptyFeed() {
  return (
    <div className="reveal max-w-xl">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
        Editorial
      </p>
      <h1
        id="hero-heading"
        className="font-display mt-3 text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
      >
        Feed
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-snug font-bold text-white md:text-xl">
        Published stories land here.
      </p>
    </div>
  );
}
