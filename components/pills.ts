export function pillClass(active = false, extra = "") {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200",
    active
      ? "bg-white text-black"
      : "bg-raised text-white hover:bg-white hover:text-black",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function outlinePillClass(extra = "") {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:bg-white hover:text-black",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ctaPillClass(variant: "white" | "gold" = "white", extra = "") {
  return [
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold transition-colors duration-200",
    variant === "gold"
      ? "bg-gold text-black hover:bg-gold-hot"
      : "bg-white text-black hover:bg-white/90",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
