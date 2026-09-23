/**
 * Public Supabase project config (anon role only).
 * Safe to ship in the GitHub Pages bundle — RLS blocks writes for anonymous clients.
 * Override at build time with NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Never put a service-role key here.
 */
export const PUBLIC_SUPABASE_URL = "https://vyzqpepbdbzwxawcrjuc.supabase.co";

export const PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5enFwZXBiZGJ6d3hhd2NyanVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNTU5NTIsImV4cCI6MjEwNTczMTk1Mn0.WSeLv42asfLCjoZPBk85gIzqOKqWF6xLpHaiYtdKEks";
