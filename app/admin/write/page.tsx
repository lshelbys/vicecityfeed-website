import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/AdminShell";
import { AdminWriteInner } from "@/components/AdminWriteInner";

export const metadata: Metadata = {
  title: "Write",
  description: "Create or edit a Vice City Feed story.",
  robots: { index: false, follow: false },
};

export default function AdminWritePage() {
  return (
    <AdminShell
      title="Write"
      description="Title, excerpt, markdown, desk, and cover — then publish."
    >
      <Suspense fallback={<p className="text-sm text-white">Loading editor…</p>}>
        <AdminWriteInner />
      </Suspense>
    </AdminShell>
  );
}
