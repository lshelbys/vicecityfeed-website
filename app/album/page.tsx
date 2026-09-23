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
    <main id="main" className="mx-auto max-w-7xl px-4 pt-8 pb-16 md:px-6 md:pt-10">
      <PageHeader
        kicker="Official singles"
        title="The Album"
        description={`${ALBUM.singlesOut} Atlantic singles, in-page. ${ALBUM.trackCountAnnounced - ALBUM.singlesOut} tracks stay locked until ${ALBUM.fullAlbumOn}.`}
      />
      <AlbumPlayer />
    </main>
  );
}
