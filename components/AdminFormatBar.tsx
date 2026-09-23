"use client";

type FormatAction = "heading" | "bold" | "italic" | "link" | "quote" | "list";

const ACTIONS: Array<{ id: FormatAction; label: string }> = [
  { id: "heading", label: "Heading" },
  { id: "bold", label: "Bold" },
  { id: "italic", label: "Italic" },
  { id: "link", label: "Link" },
  { id: "quote", label: "Quote" },
  { id: "list", label: "List" },
];

type AdminFormatBarProps = {
  onFormat: (action: FormatAction) => void;
};

export function AdminFormatBar({ onFormat }: AdminFormatBarProps) {
  return (
    <div
      data-admin-format-bar
      className="mb-2 flex flex-wrap gap-2"
      role="toolbar"
      aria-label="Formatting"
    >
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          data-format={action.id}
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-3 text-xs font-bold text-white hover:bg-teal hover:text-ink"
          onClick={() => onFormat(action.id)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
