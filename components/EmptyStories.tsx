import Link from "next/link";
import { outlinePillClass, pillClass } from "@/components/pills";
import { ALBUM } from "@/lib/album";
import { SITE } from "@/lib/site";

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

export function EmptyWireDesk() {
  const locked = ALBUM.trackCountAnnounced - ALBUM.singlesOut;

  return (
    <div className="reveal mx-auto max-w-2xl rounded-2xl bg-surface px-5 py-10 md:px-10 md:py-14">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
          Newswire
        </p>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
          <span className="wire-pulse" aria-hidden />
          Waiting on the wire
        </span>
      </div>
      <h1
        id="hero-heading"
        className="font-display mt-4 text-[2.1rem] leading-[1.05] font-extrabold tracking-tight text-white md:text-5xl"
      >
        Vice City Feed
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-snug font-bold text-white md:text-xl">
        {SITE.tagline}
      </p>
      <EmptyStories className="mt-8" />
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white">
        The desk is open. Copy lands here the moment we file.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/album" className={pillClass(true)}>
          The Album
        </Link>
        <Link href="/leonida-wire" className={outlinePillClass()}>
          Leonida Wire
        </Link>
      </div>
      <Link
        href="/album"
        className="mt-8 block rounded-2xl bg-raised px-5 py-5 transition-colors duration-200 hover:bg-[#262626]"
      >
        <p className="text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
          Now on the desk
        </p>
        <p className="font-display mt-2 text-2xl leading-tight font-extrabold tracking-tight text-white">
          {ALBUM.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white">
          {ALBUM.singlesOut} official singles out. {locked} tracks still locked
          until {ALBUM.fullAlbumOn}.
        </p>
      </Link>
    </div>
  );
}
