'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured, supabaseSetupHint } from '@/lib/supabase/env';

type Mode = 'signin' | 'signup';

/* Supabase's raw auth errors are accurate and useless — "Email not confirmed"
   does not tell you that the confirmation mail was probably never delivered,
   or what to do about it. Each of these is a real failure a person will hit. */
function explain(raw: string): { text: string; canResend?: boolean } {
  const m = raw.toLowerCase();

  if (m.includes('email not confirmed')) {
    return {
      canResend: true,
      text:
        'Your account exists, but the email address has not been confirmed yet — and the ' +
        'confirmation mail may never have arrived. Supabase\'s built-in mailer is limited to a ' +
        'few messages an hour and is often dropped by Gmail. Check spam, resend below, or ' +
        'confirm the account directly in the Supabase dashboard under Authentication → Users.',
    };
  }
  if (m.includes('invalid login credentials')) {
    return {
      text:
        'That email and password combination does not match an account. If you have not ' +
        'registered yet, use “Create an account instead”.',
    };
  }
  if (m.includes('already registered') || m.includes('already been registered')) {
    return { text: 'An account with that email already exists — sign in instead.' };
  }
  if (m.includes('rate limit') || m.includes('you can only request this after')) {
    return {
      text:
        'Supabase is rate-limiting email for this project — its built-in mailer allows only a ' +
        'few messages an hour. Wait a minute, or configure custom SMTP (see TODO.md).',
    };
  }
  if (m.includes('password should be')) {
    return { text: raw + ' Use at least 8 characters here.' };
  }
  if (m.includes('provider is not enabled')) {
    return {
      text:
        'That sign-in provider is not enabled on the Supabase project yet. Enable it under ' +
        'Authentication → Providers, or use an email address instead.',
    };
  }
  return { text: raw };
}

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
  const [err, setErr] = useState<{ text: string; canResend?: boolean } | null>(
    params.get('error') ? explain(params.get('error')!) : null
  );
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
          The sheet requires an account, so nothing is reachable until this is set. Fixing the two
          environment variables and restarting is the whole job.
        </p>
      </>
    );
  }

  async function oauth(provider: 'google' | 'github') {
    setBusy(true); setErr(null); setOk('');
    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setErr(explain(error.message)); setBusy(false); }
    /* on success the browser navigates away, so busy is never unset */
  }

  async function resendConfirmation() {
    setBusy(true); setOk('');
    const { error } = await supabase!.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setErr(explain(error.message));
    else { setErr(null); setOk(`Confirmation email sent to ${email}. Check spam — it often lands there.`); }
    setBusy(false);
  }

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setOk('');

    if (mode === 'signup') {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (error) {
        setErr(explain(error.message));
      } else if (data.session) {
        /* the project has confirmation turned off — straight in */
        router.push(next); router.refresh(); return;
      } else {
        setOk(
          `Account created. Confirm ${email} using the link we sent, then sign in. ` +
          'If it does not arrive, check spam or confirm the account in the Supabase dashboard.'
        );
        setMode('signin');
      }
    } else {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) setErr(explain(error.message));
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
          {mode === 'signin'
            ? 'The sheet is private. Sign in to read it, track your progress across devices, and join arenas.'
            : 'One account gets you the whole sheet, progress that follows you across devices, and arenas.'}
        </p>
      </div>

      {err && (
        <div className="warnbox" role="alert">
          {err.text}
          {err.canResend && (
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button className="btn sm" type="button" disabled={busy || !email} onClick={resendConfirmation}>
                {busy ? 'Sending…' : 'Resend confirmation email'}
              </button>
            </div>
          )}
        </div>
      )}
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
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErr(null); setOk(''); }}
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
