import type { Metadata } from "next";
import { AlbumPlayer } from "@/components/AlbumPlayer";
import { PageHeader } from "@/components/PageHeader";
import { ALBUM } from "@/lib/album";

export const metadata: Metadata = {
  title: "The Album",
  description:
    "Play the six official singles from Grand Theft Auto VI: The Album, in-page via Atlantic Records’ YouTube. The full 34-track album arrives November 19, 2026.",
};

export default function AlbumPage() {
  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        kicker="Official singles"
        title="The Album"
        description={`${ALBUM.singlesOut} singles out now from ${ALBUM.title}. Played in-page via Atlantic Records’ official YouTube player. ${ALBUM.trackCountAnnounced - ALBUM.singlesOut} tracks are still unreleased.`}
      />
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white">
        Full album {ALBUM.fullAlbumOn}. We only list what Atlantic and Rockstar
        have published. No ripped files, no lyrics, no unofficial reuploads.
      </p>
      <AlbumPlayer />
    </main>
  );
}
