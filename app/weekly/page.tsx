'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { currentWeek } from '@/lib/weeks';

/* Which week is "current" depends on saved progress, so it can only be known
   on the client. Redirect once the store has rehydrated. */
export default function WeeklyIndex() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();

  useEffect(() => {
    if (hydrated) router.replace(`/weekly/${currentWeek(state)}`);
  }, [hydrated, state, router]);

  return <p className="dim" style={{ padding: 20 }}>Finding your current week…</p>;
}
