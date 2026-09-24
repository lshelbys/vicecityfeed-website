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
