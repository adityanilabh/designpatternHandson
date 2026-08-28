'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, displayName } from '@/lib/useUser';
import { getSupabaseBrowser } from '@/lib/supabase/client';

/* Sign-in / sign-out in the header.

   Renders nothing at all when Supabase is not configured, so a clone without
   credentials shows a clean local-only tracker rather than a dead button. */
export default function AuthButton() {
  const { user, loading, configured } = useUser();
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!configured) return null;
  if (loading) return <span className="dim" style={{ fontSize: 12 }}>…</span>;

  if (!user) {
    return (
      <Link
        className="btn"
        href={`/login?next=${encodeURIComponent(pathname)}`}
        title="Sign in to sync progress across devices"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="authbox">
      <span className="authname" title={user.email ?? undefined}>{displayName(user)}</span>
      <button
        className="btn ghost sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await getSupabaseBrowser()?.auth.signOut();
          /* Progress stays in localStorage after sign-out — signing out must
             not look like losing your work. */
          router.refresh();
          setBusy(false);
        }}
      >
        {busy ? '…' : 'Sign out'}
      </button>
    </div>
  );
}
