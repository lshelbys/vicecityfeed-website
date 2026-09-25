export const FIGURE_ALIGNS = ["left", "center", "right", "full"] as const;
export type FigureAlign = (typeof FIGURE_ALIGNS)[number];

export const FIGURE_SIZES = ["s", "m", "l", "full"] as const;
export type FigureSize = (typeof FIGURE_SIZES)[number];

export type StoryFigure = {
  src: string;
  alt: string;
  caption: string;
  align: FigureAlign;
  size: FigureSize;
  start: number;
  end: number;
};

export type StoryFigureData = Omit<StoryFigure, "start" | "end">;

const FENCE_RE = /:::figure\b([^\n]*)\n([\s\S]*?):::/g;
const IMG_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

function attr(meta: string, key: string): string {
  const match = meta.match(new RegExp(`${key}="([^"]*)"`));
  return match?.[1] ?? "";
}

function asAlign(value: string): FigureAlign {
  return FIGURE_ALIGNS.includes(value as FigureAlign)
    ? (value as FigureAlign)
    : "center";
}

function asSize(value: string): FigureSize {
  return FIGURE_SIZES.includes(value as FigureSize)
    ? (value as FigureSize)
    : "l";
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "'").replace(/\s+/g, " ").trim();
}

export function parseFigureMeta(meta: string): Omit<StoryFigureData, "src"> {
  return {
    alt: attr(meta, "alt"),
    caption: attr(meta, "caption"),
    align: asAlign(attr(meta, "align")),
    size: asSize(attr(meta, "size")),
  };
}

export function serializeFigure(figure: StoryFigureData): string {
  const caption = figure.caption.trim();
  const captionAttr = caption ? ` caption="${escapeAttr(caption)}"` : "";
  return `:::figure align="${figure.align}" size="${figure.size}" alt="${escapeAttr(figure.alt)}"${captionAttr}\n${figure.src.trim()}\n:::`;
}

export function isImageUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      url.protocol === "https:" ||
      url.protocol === "http:" ||
      url.protocol === "blob:" ||
      url.protocol === "data:"
    );
  } catch {
    return false;
  }
}

export function listFigures(content: string): StoryFigure[] {
  const found: StoryFigure[] = [];

  for (const match of content.matchAll(FENCE_RE)) {
    const start = match.index ?? 0;
    const src = (match[2] ?? "").trim().split(/\s+/)[0] ?? "";
    if (!src) continue;
    found.push({
      ...parseFigureMeta(match[1] ?? ""),
      src,
      start,
      end: start + match[0].length,
    });
  }

  for (const match of content.matchAll(IMG_RE)) {
    const start = match.index ?? 0;
    if (found.some((figure) => start >= figure.start && start < figure.end)) {
      continue;
    }
    found.push({
      src: match[2],
      alt: match[1] ?? "",
      caption: match[3] ?? "",
      align: "center",
      size: "l",
      start,
      end: start + match[0].length,
    });
  }

  return found.sort((a, b) => a.start - b.start);
}

export function figureAtCaret(content: string, caret: number): StoryFigure | null {
  const figures = listFigures(content);
  return (
    figures.find((figure) => caret >= figure.start && caret <= figure.end) ??
    [...figures].reverse().find((figure) => figure.end <= caret) ??
    figures[0] ??
    null
  );
}

export function replaceFigure(
  content: string,
  target: StoryFigure,
  next: StoryFigureData,
): string {
  return `${content.slice(0, target.start)}${serializeFigure(next)}${content.slice(target.end)}`;
}

type BodyBlock = { text: string; start: number; end: number };

const BLOCK_FENCE_RE =
  /(:::figure\b[^\n]*\n[\s\S]*?:::|:::protip\n[\s\S]*?:::|:::spoiler\n[\s\S]*?:::|:::media\b[^\n]*\n[\s\S]*?:::)/g;

function pushMarkdownChunks(
  chunk: string,
  offset: number,
  blocks: BodyBlock[],
) {
  let cursor = 0;
  for (const part of chunk.split(/(\n{2,})/)) {
    if (/^\n+$/.test(part)) {
      cursor += part.length;
      continue;
    }
    if (part.trim()) {
      blocks.push({
        text: part,
        start: offset + cursor,
        end: offset + cursor + part.length,
      });
    }
    cursor += part.length;
  }
}

export function splitBodyBlocks(content: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let last = 0;
  for (const match of content.matchAll(BLOCK_FENCE_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      pushMarkdownChunks(content.slice(last, index), last, blocks);
    }
    blocks.push({
      text: match[0],
      start: index,
      end: index + match[0].length,
    });
    last = index + match[0].length;
  }
  if (last < content.length) {
    pushMarkdownChunks(content.slice(last), last, blocks);
  }
  return blocks;
}

export function moveFigure(
  content: string,
  target: StoryFigure,
  direction: -1 | 1,
): string {
  const blocks = splitBodyBlocks(content);
  const index = blocks.findIndex(
    (block) => target.start >= block.start && target.end <= block.end,
  );
  const next = index + direction;
  if (index < 0 || next < 0 || next >= blocks.length) return content;
  const swapped = [...blocks];
  const current = swapped[index];
  swapped[index] = swapped[next];
  swapped[next] = current;
  const joined = swapped
    .map((block) => block.text.trim())
    .filter(Boolean)
    .join("\n\n");
  return content.endsWith("\n") ? `${joined}\n` : joined;
}
