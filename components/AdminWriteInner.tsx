"use client";

import { useSearchParams } from "next/navigation";
import { AdminEditor } from "@/components/AdminEditor";

export function AdminWriteInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() || undefined;
  return <AdminEditor slug={slug} />;
}
