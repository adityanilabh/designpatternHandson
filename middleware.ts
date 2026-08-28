import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '@/lib/supabase/env';

/* Refreshes the auth session on every request and writes the rotated cookies
   back. Without this, tokens expire mid-visit and the user is silently signed
   out. Server Components cannot set cookies, so this is the only place the
   refresh can be persisted.

   Nothing here gates access: the sheet is public and the tracker works
   logged-out. This only keeps a session alive if one exists. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  /* Must be getUser(), not getSession() — getUser revalidates the token, which
     is what actually triggers the refresh. */
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /* everything except static assets and image files */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
