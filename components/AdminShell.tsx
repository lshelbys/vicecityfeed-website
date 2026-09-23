"use client";

import type { ReactNode } from "react";
import { AdminSignIn } from "@/components/AdminSignIn";
import { PageHeader } from "@/components/PageHeader";
import { useAdminSession } from "@/lib/use-admin-session";

type AdminShellProps = {
  title: string;
  description: string;
  wide?: boolean;
  unlocked?: boolean;
  children: ReactNode;
};

export function AdminShell({
  title,
  description,
  wide = false,
  unlocked = false,
  children,
}: AdminShellProps) {
  const { configured, session, loading } = useAdminSession();

  return (
    <main
      id="main"
      data-admin
      data-admin-configured={configured ? "true" : "false"}
      className={`mx-auto px-4 py-12 md:px-6 ${wide ? "max-w-6xl" : "max-w-3xl"}`}
    >
      <PageHeader kicker="Desk" title={title} description={description} />
      {!configured && !unlocked ? (
        <p className="max-w-md text-lg font-bold text-white">
          Supabase is not configured. Set{" "}
          <code className="text-teal">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-teal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, rebuild
          the static export, then sign in.
        </p>
      ) : loading && !unlocked ? (
        <p className="text-sm text-white">Checking desk…</p>
      ) : session || unlocked ? (
        children
      ) : (
        <AdminSignIn />
      )}
    </main>
  );
}
