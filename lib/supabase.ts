import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when both public env vars are present. When false the app runs in
 * "demo mode" and persists user data to localStorage instead of a database.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * A shared browser client, or null when Supabase isn't configured.
 * Callers must null-check (or gate on isSupabaseConfigured).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
