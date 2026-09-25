"use client";

export type FormatAction =
  | "heading"
  | "bold"
  | "italic"
  | "link"
  | "quote"
  | "list"
  | "image"
  | "imageUrl"
  | "protip"
  | "pullquote";

const ACTIONS: Array<{ id: FormatAction; label: string }> = [
  { id: "heading", label: "Heading" },
  { id: "bold", label: "Bold" },
  { id: "italic", label: "Italic" },
  { id: "link", label: "Link" },
  { id: "quote", label: "Quote" },
  { id: "pullquote", label: "Pull quote" },
  { id: "protip", label: "Pro tip" },
  { id: "list", label: "List" },
  { id: "image", label: "Image" },
  { id: "imageUrl", label: "Image URL" },
];

const chipClass =
  "inline-flex min-h-11 items-center rounded-full bg-ink px-3 text-xs font-bold text-white hover:bg-teal hover:text-ink disabled:pointer-events-none disabled:opacity-40";

type AdminFormatBarProps = {
  onFormat: (action: FormatAction) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
};

export function AdminFormatBar({
  onFormat,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: AdminFormatBarProps) {
  return (
    <div
      data-admin-format-bar
      className="mb-2 flex flex-wrap gap-2"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        type="button"
        data-format="undo"
        className={chipClass}
        disabled={!canUndo}
        onClick={onUndo}
      >
        Undo
      </button>
      <button
        type="button"
        data-format="redo"
        className={chipClass}
        disabled={!canRedo}
        onClick={onRedo}
      >
        Redo
      </button>
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          data-format={action.id}
          className={chipClass}
          onClick={() => onFormat(action.id)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
