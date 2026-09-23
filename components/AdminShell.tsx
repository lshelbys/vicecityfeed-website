"use client";

import type { ReactNode } from "react";
import { AdminSignIn } from "@/components/AdminSignIn";
import { PageHeader } from "@/components/PageHeader";
import { useAdminSession } from "@/lib/use-admin-session";

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  const { configured, session, loading } = useAdminSession();

  return (
    <main
      id="main"
      data-admin
      data-admin-configured={configured ? "true" : "false"}
      className="mx-auto max-w-3xl px-4 py-12 md:px-6"
    >
      <PageHeader kicker="Desk" title={title} description={description} />
      {!configured ? (
        <p className="max-w-md text-lg font-bold text-white">
          Supabase is not configured. Set{" "}
          <code className="text-teal">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-teal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, rebuild
          the static export, then sign in.
        </p>
      ) : loading ? (
        <p className="text-sm text-white">Checking desk…</p>
      ) : session ? (
        children
      ) : (
        <AdminSignIn />
      )}
    </main>
  );
}
