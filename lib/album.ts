/** Official GTA VI album singles only — no invented remaining tracks. */

export type AlbumTrack = {
  id: string;
  title: string;
  artists: string;
  durationLabel: string;
  durationSec: number;
  youtubeId: string;
  sourceLabel: string;
  officialUrl: string;
};

export const ALBUM = {
  title: "Grand Theft Auto VI: The Album",
  label: "Atlantic Records / Rockstar Games",
  releasedSinglesOn: "September 17, 2026",
  fullAlbumOn: "November 19, 2026",
  trackCountAnnounced: 34,
  singlesOut: 6,
  officialPage: "https://www.rockstargames.com/VI/en-US/music",
  shopPage: "https://www.gtavi-thealbum.com/",
  honesty:
    "Six official singles are out now. The other 28 tracks on the 34-track album have not been released. This page does not invent them.",
} as const;

export const ALBUM_SINGLES: AlbumTrack[] = [
  {
    id: "thats-it",
    title: "That’s It (feat. Future & Metro Boomin)",
    artists: "Yung Lean",
    durationLabel: "2:42",
    durationSec: 162,
    youtubeId: "joMjcNtxuTU",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=joMjcNtxuTU",
  },
  {
    id: "rhyno",
    title: "RHYNO",
    artists: "Travis Scott",
    durationLabel: "3:01",
    durationSec: 181,
    youtubeId: "3Ev1PQEm7ns",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=3Ev1PQEm7ns",
  },
  {
    id: "sexy-magic",
    title: "Sexy Magic",
    artists: "CA7RIEL & Paco Amoroso, PinkPantheress, Fred again.., Etienne de Crécy",
    durationLabel: "3:16",
    durationSec: 196,
    youtubeId: "G59iOfClrVo",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=G59iOfClrVo",
  },
  {
    id: "last-thing-you-need",
    title: "Last Thing You Need",
    artists: "Morgan Wallen",
    durationLabel: "3:17",
    durationSec: 197,
    youtubeId: "9leAwpph-xs",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=9leAwpph-xs",
  },
  {
    id: "macacoa-2000",
    title: "Macacoa 2000",
    artists: "Rauw Alejandro",
    durationLabel: "2:54",
    durationSec: 174,
    youtubeId: "76R2Q9vObqI",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=76R2Q9vObqI",
  },
  {
    id: "bright-lights-big-city",
    title: "Bright Lights, Big City",
    artists: "Keith Richards",
    durationLabel: "3:31",
    durationSec: 211,
    youtubeId: "e2z4tuS4Mbo",
    sourceLabel: "Atlantic Records on YouTube",
    officialUrl: "https://www.youtube.com/watch?v=e2z4tuS4Mbo",
  },
];

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
