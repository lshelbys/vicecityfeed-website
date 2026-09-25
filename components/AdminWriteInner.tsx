"use client";

import { useSearchParams } from "next/navigation";
import { AdminEditor } from "@/components/AdminEditor";
import { AdminShell } from "@/components/AdminShell";

export function AdminWriteInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() || undefined;
  const unlocked = searchParams.get("preview") === "layout";

  return (
    <AdminShell
      title="Write"
      description="Headline, excerpt, body, page, and cover. Publish when it is ready."
      wide
      unlocked={unlocked}
    >
      <AdminEditor slug={slug} preview={unlocked} />
    </AdminShell>
  );
}
