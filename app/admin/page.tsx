import type { Metadata } from "next";
import { AdminDesk } from "@/components/AdminDesk";
import { AdminShell } from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  description: "Write and publish Vice City Feed stories.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminShell
      title="Admin"
      description="Sign in to draft and publish stories. The public site only reads published rows."
    >
      <AdminDesk />
    </AdminShell>
  );
}
