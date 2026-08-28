import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '@/lib/supabase/env';

/* Auth gate + session refresh.

   The sheet is private: nothing is readable without an account. Every request
   for a page is checked here, BEFORE any content is served, which is what
   makes the gate real — the pages are still statically prerendered for speed,
   but middleware runs ahead of them, so prerendered HTML is never handed to an
   anonymous request.

   This also refreshes the session and writes the rotated cookies back. Server
   Components cannot set cookies, so this is the only place that can persist. */

/* Reachable without an account, for the obvious reason that you cannot sign in
   from behind a sign-in wall. */
const PUBLIC_PREFIXES = ['/login', '/auth'];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  let response = NextResponse.next({ request });

  /* With no Supabase project there is no way to authenticate anyone, so the
     gate cannot be satisfied. Send everything to /login, which explains what
     is missing rather than showing a blank wall. */
  if (!isSupabaseConfigured) {
    if (isPublic(pathname)) return response;
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

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

  /* getUser(), never getSession(): getSession trusts the cookie without
     verifying it, so it can be forged. This value decides whether the sheet is
     served, so it has to be revalidated. */
  const { data: { user } } = await supabase.auth.getUser();

  if (isPublic(pathname)) {
    /* Already signed in and sitting on /login — send them into the app. */
    if (user && pathname === '/login') {
      const url = request.nextUrl.clone();
      const next = request.nextUrl.searchParams.get('next');
      url.pathname = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    /* so the reader lands where they were headed, not the dashboard */
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /* everything except Next's own assets and image files */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
