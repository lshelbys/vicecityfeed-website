import { slugify } from "./format";
import type { CoverAccent } from "./types";

export type ContentBlock =
  | { type: "markdown"; text: string }
  | { type: "protip"; text: string }
  | { type: "spoiler"; text: string }
  | { type: "media"; caption: string; accent: CoverAccent };

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const FENCE =
  /:::(\w+)([^\n]*)\n?([\s\S]*?):::/g;

function parseAccent(raw: string): CoverAccent {
  if (raw.includes("magenta")) return "magenta";
  if (raw.includes("sunset")) return "sunset";
  return "cyan";
}

function parseCaption(raw: string): string {
  const match = raw.match(/caption="([^"]*)"/);
  return match?.[1] ?? "Vice City Feed media";
}

export function splitContent(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let lastIndex = 0;

  for (const match of markdown.matchAll(FENCE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      const text = markdown.slice(lastIndex, index).trim();
      if (text) blocks.push({ type: "markdown", text });
    }

    const kind = match[1];
    const meta = match[2] ?? "";
    const body = (match[3] ?? "").trim();

    if (kind === "protip") {
      blocks.push({ type: "protip", text: body });
    } else if (kind === "spoiler") {
      blocks.push({ type: "spoiler", text: body });
    } else if (kind === "media") {
      blocks.push({
        type: "media",
        caption: parseCaption(meta),
        accent: parseAccent(meta),
      });
    } else {
      blocks.push({ type: "markdown", text: match[0] });
    }

    lastIndex = index + match[0].length;
  }

  const tail = markdown.slice(lastIndex).trim();
  if (tail) blocks.push({ type: "markdown", text: tail });
  return blocks;
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const used = new Set<string>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    let id = slugify(text);
    if (used.has(id)) {
      id = `${id}-${used.size}`;
    }
    used.add(id);
    headings.push({ id, text, level });
  }

  return headings;
}
