export type Caret = { start: number; end: number };

export function wrapSelection(
  value: string,
  caret: Caret,
  before: string,
  after: string,
  placeholder = "text",
): { value: string; caret: Caret } {
  const selected = value.slice(caret.start, caret.end) || placeholder;
  const next = `${value.slice(0, caret.start)}${before}${selected}${after}${value.slice(caret.end)}`;
  const start = caret.start + before.length;
  return { value: next, caret: { start, end: start + selected.length } };
}

export function prefixSelectedLines(
  value: string,
  caret: Caret,
  prefix: string,
): { value: string; caret: Caret } {
  const from = value.lastIndexOf("\n", Math.max(0, caret.start - 1)) + 1;
  const toNew = value.indexOf("\n", caret.end);
  const to = toNew < 0 ? value.length : toNew;
  const block = value.slice(from, to);
  const nextBlock = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line || "…"}`))
    .join("\n");
  return {
    value: `${value.slice(0, from)}${nextBlock}${value.slice(to)}`,
    caret: { start: from, end: from + nextBlock.length },
  };
}

export function insertBlock(
  value: string,
  caret: Caret,
  block: string,
): { value: string; caret: Caret } {
  const before = value.slice(0, caret.start);
  const after = value.slice(caret.end);
  const lead = !before
    ? ""
    : before.endsWith("\n\n")
      ? ""
      : before.endsWith("\n")
        ? "\n"
        : "\n\n";
  const tail = !after ? "\n" : after.startsWith("\n") ? "" : "\n\n";
  const inserted = `${lead}${block}${tail}`;
  const start = before.length + lead.length;
  return {
    value: `${before}${inserted}${after}`,
    caret: { start, end: start + block.length },
  };
}

export function wrapFence(
  value: string,
  caret: Caret,
  kind: string,
  placeholder = "Pro tip",
): { value: string; caret: Caret } {
  const selected = value.slice(caret.start, caret.end).trim() || placeholder;
  return insertBlock(value, caret, `:::${kind}\n${selected}\n:::`);
}
