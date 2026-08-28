import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

/* Where Google and GitHub send the browser back after sign-in. Exchanges the
   one-time code for a session cookie, then returns the user to wherever they
   started. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  /* Only same-origin paths — an open redirect here would let a crafted link
     bounce a freshly authenticated user to an attacker's page. */
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await getSupabaseServer();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  /* Behind a proxy the origin is the internal host, so prefer the forwarded
     one when Vercel provides it. */
  const forwardedHost = request.headers.get('x-forwarded-host');
  const base = process.env.NODE_ENV === 'development' || !forwardedHost
    ? origin
    : `https://${forwardedHost}`;

  return NextResponse.redirect(`${base}${safeNext}`);
}
