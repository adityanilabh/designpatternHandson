'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './env';
import type { SupabaseClient } from '@supabase/supabase-js';

/* One browser client per tab. Created lazily so that importing this module in
   a page that never signs in costs nothing, and so a missing key returns null
   instead of throwing during render. */
let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
