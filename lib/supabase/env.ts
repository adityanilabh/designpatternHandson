/* Supabase is OPTIONAL.

   The access model is "public sheet, login only for cloud progress and
   arenas", so every page must render, and the tracker must stay fully usable
   on localStorage, when no Supabase project is configured at all. That keeps
   `npm run dev` working for anyone who clones this without credentials, and
   means a missing or wrong key degrades to the logged-out experience instead
   of taking the site down.

   Every call site checks `isSupabaseConfigured` before touching a client. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 20;

/* Shown in the UI so a half-finished setup is diagnosable rather than silent. */
export function supabaseSetupHint(): string | null {
  if (isSupabaseConfigured) return null;
  if (!SUPABASE_URL) return 'NEXT_PUBLIC_SUPABASE_URL is not set in .env.local';
  if (!SUPABASE_ANON_KEY) return 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local';
  return 'Supabase environment variables look malformed';
}
