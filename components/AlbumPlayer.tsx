"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import {
  ALBUM,
  ALBUM_SINGLES,
  formatClock,
  youtubeThumb,
  type AlbumTrack,
} from "@/lib/album";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: string | HTMLElement,
        opts: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYoutubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export function AlbumPlayer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(ALBUM_SINGLES[0].durationSec);

  const track = ALBUM_SINGLES[index];

  const selectTrack = useCallback((next: number, autoplay = true) => {
    const bounded = (next + ALBUM_SINGLES.length) % ALBUM_SINGLES.length;
    indexRef.current = bounded;
    setIndex(bounded);
    setElapsed(0);
    setDuration(ALBUM_SINGLES[bounded].durationSec);
    const player = playerRef.current;
    if (!player) return;
    player.loadVideoById(ALBUM_SINGLES[bounded].youtubeId);
    if (!autoplay) player.pauseVideo();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    loadYoutubeApi()
      .then(() => {
        if (cancelled || !hostRef.current || !window.YT) return;
        playerRef.current = new window.YT.Player(hostRef.current, {
          videoId: ALBUM_SINGLES[0].youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 0,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              setReady(true);
              const live = playerRef.current?.getDuration();
              if (live && live > 0) setDuration(live);
            },
            onStateChange: (event: { data: number }) => {
              const state = window.YT?.PlayerState;
              if (!state) return;
              if (event.data === state.PLAYING) {
                setPlaying(true);
                const live = playerRef.current?.getDuration();
                if (live && live > 0) setDuration(live);
              } else if (event.data === state.PAUSED) {
                setPlaying(false);
              } else if (event.data === state.ENDED) {
                selectTrack(indexRef.current + 1, true);
              }
            },
            onError: () => setFailed(true),
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const time = player.getCurrentTime();
        if (Number.isFinite(time)) setElapsed(time);
      } catch {
        /* player not ready */
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [selectTrack]);

  function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  }

  function seek(ratio: number) {
    const player = playerRef.current;
    if (!player || duration <= 0) return;
    const next = Math.min(duration, Math.max(0, ratio * duration));
    player.seekTo(next, true);
    setElapsed(next);
  }

  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  return (
    <div className="album-desk">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <NowPlaying
          track={track}
          playing={playing}
          ready={ready}
          failed={failed}
          elapsed={elapsed}
          duration={duration}
          progress={progress}
          hostRef={hostRef}
          onToggle={togglePlay}
          onPrev={() => selectTrack(index - 1)}
          onNext={() => selectTrack(index + 1)}
          onSeek={seek}
        />
        <TrackList
          current={track}
          playing={playing}
          onPick={(i) => selectTrack(i, true)}
        />
      </div>
    </div>
  );
}

function NowPlaying({
  track,
  playing,
  ready,
  failed,
  elapsed,
  duration,
  progress,
  hostRef,
  onToggle,
  onPrev,
  onNext,
  onSeek,
}: {
  track: AlbumTrack;
  playing: boolean;
  ready: boolean;
  failed: boolean;
  elapsed: number;
  duration: number;
  progress: number;
  hostRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (ratio: number) => void;
}) {
  return (
    <section className="rounded-2xl bg-surface p-4 md:p-5">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-raised">
        <img
          src={youtubeThumb(track.youtubeId)}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div
          ref={hostRef}
          id="vcf-yt-player"
          className="absolute inset-0 size-full"
        />
      </div>
      <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
        Now playing
      </p>
      <h2 className="font-display mt-2 text-2xl leading-tight font-extrabold tracking-tight text-white md:text-3xl">
        {track.title}
      </h2>
      <p className="mt-2 text-sm font-medium text-white">{track.artists}</p>
      <p className="mt-1 text-xs text-white/80">{track.sourceLabel}</p>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-raised"
          aria-label="Previous single"
        >
          <SkipBack className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onToggle}
          disabled={!ready && !failed}
          data-album-play
          className="inline-flex size-14 items-center justify-center rounded-full bg-teal text-ink hover:bg-white disabled:opacity-50"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="size-6" fill="currentColor" aria-hidden />
          ) : (
            <Play className="size-6 translate-x-0.5" fill="currentColor" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-raised"
          aria-label="Next single"
        >
          <SkipForward className="size-5" aria-hidden />
        </button>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Seek in current single</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(event) => onSeek(Number(event.target.value) / 1000)}
          data-album-progress
          className="album-seek w-full"
        />
      </label>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-white">
        <span>{formatClock(elapsed)}</span>
        <span>{formatClock(duration)}</span>
      </div>

      {failed ? (
        <p className="mt-4 text-sm text-white">
          The official player could not start here. Use Atlantic’s upload:{" "}
          <a href={track.officialUrl} className="text-teal underline">
            {track.title}
          </a>
          .
        </p>
      ) : null}
    </section>
  );
}

function TrackList({
  current,
  playing,
  onPick,
}: {
  current: AlbumTrack;
  playing: boolean;
  onPick: (index: number) => void;
}) {
  return (
    <section className="rounded-2xl bg-surface p-2 md:p-3">
      <ol className="flex flex-col">
        {ALBUM_SINGLES.map((song, i) => {
          const active = song.id === current.id;
          return (
            <li key={song.id}>
              <button
                type="button"
                onClick={() => onPick(i)}
                data-album-track={song.id}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 ${
                  active ? "bg-raised" : "hover:bg-raised/70"
                }`}
              >
                <span className="w-6 text-center text-sm tabular-nums text-white">
                  {active && playing ? (
                    <span className="text-teal" aria-hidden>
                      ▶
                    </span>
                  ) : (
                    i + 1
                  )}
                </span>
                <img
                  src={youtubeThumb(song.youtubeId)}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-white">
                    {song.title}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-white/80">
                    {song.artists}
                  </span>
                </span>
                <span className="shrink-0 text-sm tabular-nums text-white">
                  {song.durationLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="px-3 py-4 text-sm leading-relaxed text-white">
        {ALBUM.honesty}{" "}
        <a href={ALBUM.officialPage} className="text-teal underline">
          Rockstar’s music page
        </a>
        .
      </p>
    </section>
  );
}
