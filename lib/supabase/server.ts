import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './env';
import type { SupabaseClient } from '@supabase/supabase-js';

/* Server-side client for Server Components, route handlers and actions.
   Sessions live in cookies, which is what lets a page know who you are before
   any JavaScript runs. */
export async function getSupabaseServer(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const store = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* Server Components cannot set cookies. That is fine: middleware
             refreshes the session on every request, so the only writes lost
             here are ones already performed there. */
        }
      },
    },
  });
}

/* The signed-in user, or null. Uses getUser() rather than getSession():
   getSession reads the cookie without verifying it, so it can be spoofed.
   getUser revalidates against Supabase. Never trust getSession on the server. */
export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
