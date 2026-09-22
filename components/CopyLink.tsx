"use client";

import { useState } from "react";

type CopyLinkProps = {
  url: string;
};

export function CopyLink({ url }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const value = typeof window !== "undefined" ? window.location.href : url;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      className="text-sm font-semibold tracking-wide text-white"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
