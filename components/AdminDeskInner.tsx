"use client";

import { useSearchParams } from "next/navigation";
import { AdminDesk } from "@/components/AdminDesk";
import { AdminShell } from "@/components/AdminShell";

export function AdminDeskInner() {
  const searchParams = useSearchParams();
  const unlocked = searchParams.get("preview") === "layout";

  return (
    <AdminShell
      title="Desk"
      description="Drafts stay private. Published stories hit the Newswire."
      wide
      unlocked={unlocked}
    >
      <AdminDesk preview={unlocked} />
    </AdminShell>
  );
}
