import { AlbumPlayer } from "@/components/AlbumPlayer";
import { PageHeader } from "@/components/PageHeader";
import { ALBUM } from "@/lib/album";

export function AlbumListening() {
  return (
    <main id="main" className="album-page mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-6 md:pt-10">
      <PageHeader
        kicker="Official singles"
        title="The Album"
        description={`${ALBUM.singlesOut} Atlantic singles, in-page. ${ALBUM.trackCountAnnounced - ALBUM.singlesOut} tracks stay locked until ${ALBUM.fullAlbumOn}.`}
      />
      <AlbumPlayer />
    </main>
  );
}
