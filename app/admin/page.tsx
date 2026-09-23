import type { Metadata } from "next";
import { AdminDesk } from "@/components/AdminDesk";
import { AdminShell } from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Desk",
  description: "Draft and publish Vice City Feed stories.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminShell
      title="Desk"
      description="Drafts stay private. Published stories hit the Newswire."
    >
      <AdminDesk />
    </AdminShell>
  );
}
