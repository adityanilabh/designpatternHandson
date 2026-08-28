'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured, supabaseSetupHint } from '@/lib/supabase/env';

type Mode = 'signin' | 'signup';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get('next') || '/';
  /* same-origin only — see the note in app/auth/callback/route.ts */
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(params.get('error') || '');
  const [ok, setOk] = useState('');

  const supabase = getSupabaseBrowser();

  if (!isSupabaseConfigured) {
    return (
      <>
        <div className="pane-head">
          <div className="eyebrow">Account</div>
          <h1>Sign-in is not configured</h1>
        </div>
        <div className="warnbox">
          <b>{supabaseSetupHint()}</b>
          <p style={{ marginTop: 8 }}>
            Copy <code>.env.example</code> to <code>.env.local</code>, fill in the two Supabase
            values, and restart the dev server. See <code>TODO.md</code>.
          </p>
        </div>
        <p className="pane-p">
          Nothing else is affected — <Link className="lnk" href="/">the whole sheet</Link> works
          without an account, and your progress is saved in this browser.
        </p>
      </>
    );
  }

  async function oauth(provider: 'google' | 'github') {
    setBusy(true); setMsg('');
    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setMsg(error.message); setBusy(false); }
    /* on success the browser navigates away, so no need to unset busy */
  }

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(''); setOk('');

    if (mode === 'signup') {
      const { error } = await supabase!.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (error) setMsg(error.message);
      else setOk('Check your email to confirm the address, then sign in.');
    } else {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else { router.push(next); router.refresh(); return; }
    }
    setBusy(false);
  }

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">Account</div>
        <h1>{mode === 'signin' ? 'Sign in' : 'Create an account'}</h1>
        <p className="pane-sub">
          An account syncs your progress across devices and lets you join arenas. The sheet itself
          is public — you do not need one to read it.
        </p>
      </div>

      {msg && <div className="warnbox" role="alert">{msg}</div>}
      {ok && <div className="learn" role="status">{ok}</div>}

      <div className="btnrow" style={{ marginTop: 4 }}>
        <button className="btn" disabled={busy} onClick={() => oauth('google')}>
          Continue with Google
        </button>
        <button className="btn" disabled={busy} onClick={() => oauth('github')}>
          Continue with GitHub
        </button>
      </div>

      <p className="dim" style={{ margin: '18px 0 10px', fontSize: 12.5 }}>or with an email address</p>

      <form onSubmit={withPassword} style={{ maxWidth: 420 }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password" type="password" required minLength={8}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="btnrow">
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          <button
            className="btn ghost" type="button" disabled={busy}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(''); setOk(''); }}
          >
            {mode === 'signin' ? 'Create an account instead' : 'I already have an account'}
          </button>
        </div>
      </form>

      <div className="exit" style={{ marginTop: 26 }}>
        <b>Your existing progress is safe.</b> It stays in this browser. Signing in does not
        overwrite it — once cloud sync lands you will be asked before anything is uploaded.
      </div>
    </>
  );
}
