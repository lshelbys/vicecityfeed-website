import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "./supabase-public";

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export const supabaseUrl =
  trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || PUBLIC_SUPABASE_URL;

export const supabaseAnonKey =
  trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}
