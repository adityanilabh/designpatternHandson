'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from './supabase/client';
import { isSupabaseConfigured } from './supabase/env';

export interface UserState {
  user: User | null;
  loading: boolean;
  configured: boolean;
}

/* The signed-in user, live. `loading` starts true so the header can avoid
   flashing "Sign in" at someone who is already signed in. */
export function useUser(): UserState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) { setLoading(false); return; }

    let alive = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  return { user, loading, configured: isSupabaseConfigured };
}

/* Display name, in the order a person would expect to be called. */
export function displayName(user: User | null): string {
  if (!user) return '';
  const m = user.user_metadata || {};
  return m.full_name || m.name || m.user_name || user.email?.split('@')[0] || 'you';
}
