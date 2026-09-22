export function pillClass(active = false, extra = "") {
  return [
    "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-[background-color,color] duration-200 ease-out",
    active
      ? "bg-teal text-ink"
      : "bg-raised text-white hover:bg-teal hover:text-ink",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function outlinePillClass(extra = "") {
  return [
    "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-[background-color,color,border-color] duration-200 ease-out hover:border-teal hover:bg-teal hover:text-ink",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ctaPillClass(variant: "white" | "gold" = "white", extra = "") {
  return [
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-[background-color,color] duration-200 ease-out",
    variant === "gold"
      ? "bg-gold text-ink hover:bg-sunset"
      : "bg-white text-ink hover:bg-teal",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
