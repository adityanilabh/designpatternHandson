'use client';

import { useSync } from './SyncProvider';

/* A small, honest indicator. It exists because "is my work saved?" is the
   question a tracker must never leave ambiguous — especially one holding 154
   days of it. */
export default function SyncStatus() {
  const { phase, error, pending, lastSync, syncNow } = useSync();

  if (phase === 'off') return null;

  const label =
    phase === 'syncing' ? 'Saving…'
    : phase === 'offline' ? `Offline${pending ? ` · ${pending} queued` : ''}`
    : phase === 'error' ? 'Not saved'
    : pending ? `${pending} queued`
    : 'Saved';

  const cls =
    phase === 'error' ? 'sync-bad'
    : phase === 'offline' ? 'sync-warn'
    : phase === 'syncing' ? 'sync-busy'
    : pending ? 'sync-warn' : 'sync-ok';

  const title =
    phase === 'error' ? `Sync failed: ${error}. Your work is still saved in this browser. Click to retry.`
    : phase === 'offline' ? 'No connection. Changes are saved here and will sync when you are back online.'
    : lastSync ? `Last synced ${new Date(lastSync).toLocaleTimeString()}`
    : 'Synced to your account';

  return (
    <button
      className={`syncdot ${cls}`}
      title={title}
      onClick={() => syncNow()}
      aria-live="polite"
    >
      <i />
      <span>{label}</span>
    </button>
  );
}
