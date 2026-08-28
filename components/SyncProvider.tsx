'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useStore, hasLocalProgress } from '@/lib/store';
import { useUser } from '@/lib/useUser';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { syncOnce, uploadLocal, getLastSync } from '@/lib/sync/engine';

export type SyncPhase = 'off' | 'idle' | 'syncing' | 'offline' | 'error';

interface SyncCtx {
  phase: SyncPhase;
  error: string | null;
  pending: number;
  lastSync: string | null;
  /* the first-run question: this browser has progress and the account does not */
  offerUpload: boolean;
  acceptUpload: () => Promise<void>;
  declineUpload: () => void;
  syncNow: () => Promise<void>;
}

const Ctx = createContext<SyncCtx>({
  phase: 'off', error: null, pending: 0, lastSync: null,
  offerUpload: false, acceptUpload: async () => {}, declineUpload: () => {}, syncNow: async () => {},
});

export const useSync = () => useContext(Ctx);

const DEBOUNCE_MS = 900;

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const hydrated = useStore((s) => s.hydrated);
  const dirty = useStore((s) => s.dirty);
  const pendingWipe = useStore((s) => s.pendingWipe);

  const [phase, setPhase] = useState<SyncPhase>('off');
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLast] = useState<string | null>(null);
  const [offerUpload, setOffer] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);
  const didInitial = useRef<string | null>(null);

  const pending = Object.keys(dirty).length;

  const run = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb || !user) return;
    if (running.current) return;                 /* never overlap two passes */
    if (typeof navigator !== 'undefined' && !navigator.onLine) { setPhase('offline'); return; }

    running.current = true;
    setPhase('syncing');
    const res = await syncOnce(sb, { id: user.id, meta: user.user_metadata });
    running.current = false;

    if (res.error) { setError(res.error); setPhase('error'); return; }
    setError(null);
    setLast(getLastSync(user.id));
    setPhase('idle');
  }, [user]);

  /* First pass after sign-in: pull the account, and decide whether to offer
     uploading what is already in this browser. */
  useEffect(() => {
    if (!hydrated || !user) { setPhase('off'); return; }
    if (didInitial.current === user.id) return;
    didInitial.current = user.id;

    (async () => {
      const sb = getSupabaseBrowser();
      if (!sb) return;
      const firstTime = !getLastSync(user.id);
      const localHas = hasLocalProgress();

      if (firstTime && localHas) {
        /* Pull first so we can tell an empty account from a populated one, and
           ask rather than merge silently. */
        setPhase('syncing');
        const res = await syncOnce(sb, { id: user.id, meta: user.user_metadata });
        if (res.error) { setError(res.error); setPhase('error'); return; }
        setLast(getLastSync(user.id));
        setPhase('idle');
        setOffer(true);
        return;
      }
      await run();
    })();
  }, [hydrated, user, run]);

  /* Debounced push on every change. Mirrors the legacy tracker's 700ms
     file-write debounce: typing in a note should not be one request per key. */
  useEffect(() => {
    if (!user || !hydrated) return;
    if (!pending && !pendingWipe) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(run, DEBOUNCE_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [pending, pendingWipe, user, hydrated, run]);

  /* Flush when the network comes back, and when the tab is hidden — closing a
     laptop lid should not lose the last few ticks. */
  useEffect(() => {
    if (!user) return;
    const onOnline = () => { setPhase('idle'); run(); };
    const onOffline = () => setPhase('offline');
    const onHide = () => { if (document.visibilityState === 'hidden') run(); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onHide);
    if (typeof navigator !== 'undefined' && !navigator.onLine) setPhase('offline');
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [user, run]);

  const acceptUpload = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb || !user) return;
    setOffer(false);
    setPhase('syncing');
    try {
      await uploadLocal(sb, { id: user.id, meta: user.user_metadata });
      setLast(getLastSync(user.id));
      setPhase('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase('error');
    }
  }, [user]);

  const declineUpload = useCallback(() => setOffer(false), []);

  return (
    <Ctx.Provider
      value={{ phase, error, pending, lastSync, offerUpload, acceptUpload, declineUpload, syncNow: run }}
    >
      {children}
    </Ctx.Provider>
  );
}
