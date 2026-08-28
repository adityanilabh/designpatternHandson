'use client';

/* Delta sync between the local store and Supabase.

   Local-first is preserved deliberately: the store is always the thing the UI
   reads, every edit lands in localStorage immediately, and the network is a
   background concern. Losing connectivity degrades to exactly the old
   offline-only tracker rather than to a broken page.

   THE MERGE RULE. Rather than per-item timestamps on the client — which would
   mean trusting a clock that can be wrong or dishonest — merging is decided by
   the dirty set:

     dirty locally  -> local wins, because it is about to be pushed anyway
     not dirty      -> the server's version wins

   That is correct for the case this actually serves: one person on two or
   three devices. It is not a CRDT and does not pretend to be. Two devices
   editing the SAME item while both offline will resolve to whichever syncs
   last, and that is an acceptable trade for not carrying merge machinery. */

import type { SupabaseClient } from '@supabase/supabase-js';
import { useStore, D, snapshot } from '../store';
import {
  problemToRow, reviewsToRows, rowsToState, isTemplateKey,
  type ProgressRow, type ReviewRow, type DrillRow, type NoteRow, type UnlockRow,
} from './mapping';

/* Supabase rejects very large payloads and slow requests; chunking keeps a
   first full upload of ~900 items well inside both. */
const CHUNK = 200;

function chunk<T>(xs: T[], n = CHUNK): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n));
  return out;
}

export const lastSyncKey = (userId: string) => `targetladder.lastsync.${userId}`;

export function getLastSync(userId: string): string | null {
  try { return localStorage.getItem(lastSyncKey(userId)); } catch { return null; }
}
function setLastSync(userId: string, iso: string) {
  try { localStorage.setItem(lastSyncKey(userId), iso); } catch { /* private mode */ }
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  error?: string;
}

/* ------------------------------------------------------------------ pull -- */

export async function pull(sb: SupabaseClient, userId: string, since: string | null): Promise<number> {
  const state = useStore.getState();

  /* Only rows the server changed after our last sync. On a first sync `since`
     is null and this is the whole account, which is the one time that is the
     right thing to fetch. */
  const q = <T>(table: string) => {
    let b = sb.from(table).select('*').eq('user_id', userId);
    if (since) b = b.gt('updated_at', since);
    return b as unknown as Promise<{ data: T[] | null; error: unknown }>;
  };

  const [prog, drills, notes, unlocks, profile] = await Promise.all([
    q<ProgressRow>('progress_items'),
    q<DrillRow>('drill_states'),
    q<NoteRow>('notes'),
    sb.from('week_unlocks').select('*').eq('user_id', userId),
    sb.from('profiles').select('start_date').eq('id', userId).maybeSingle(),
  ]);

  const progress = prog.data || [];

  /* reviews have no updated_at of their own — they belong to their item, so
     they are fetched for the items that changed */
  let reviews: ReviewRow[] = [];
  if (progress.length) {
    const keys = progress.map((p) => p.item_key);
    const got = await Promise.all(
      chunk(keys).map((ks) =>
        sb.from('reviews').select('*').eq('user_id', userId).in('item_key', ks))
    );
    reviews = got.flatMap((g) => (g.data as ReviewRow[]) || []);
  }

  const patch = rowsToState(
    progress,
    reviews,
    (drills.data as DrillRow[]) || [],
    (notes.data as NoteRow[]) || [],
    (unlocks.data as UnlockRow[]) || [],
    (profile.data as { start_date?: string } | null)?.start_date
  );

  /* Drop anything we hold a pending local edit for — that edit is newer by
     definition and is queued to be pushed. */
  const dirty = state.dirty;
  patch.problems = Object.fromEntries(
    Object.entries(patch.problems || {}).filter(([k]) => !dirty[D.problem(k)]));
  patch.patterns = Object.fromEntries(
    Object.entries(patch.patterns || {}).filter(([k]) => !dirty[D.drill(k)]));
  patch.templates = Object.fromEntries(
    Object.entries(patch.templates || {}).filter(([k]) => !dirty[D.drill(k)]));
  patch.notes = Object.fromEntries(
    Object.entries(patch.notes || {}).filter(([k]) => !dirty[D.note(k)]));
  if (dirty[D.profile]) delete patch.startDate;

  const n =
    Object.keys(patch.problems).length + Object.keys(patch.patterns).length +
    Object.keys(patch.templates).length + Object.keys(patch.notes).length +
    Object.keys(patch.unlocked || {}).length;

  if (n) useStore.getState().applyRemote(patch);
  return n;
}

/* ------------------------------------------------------------------ push -- */

export async function push(sb: SupabaseClient, userId: string): Promise<number> {
  const s = useStore.getState();
  const dirtyKeys = Object.keys(s.dirty);
  if (!dirtyKeys.length) return 0;

  const problemKeys = dirtyKeys.filter((k) => k.startsWith('p:')).map((k) => k.slice(2));
  const drillKeys = dirtyKeys.filter((k) => k.startsWith('d:')).map((k) => k.slice(2));
  const noteKeys = dirtyKeys.filter((k) => k.startsWith('n:')).map((k) => k.slice(2));
  const unlockKeys = dirtyKeys.filter((k) => k.startsWith('u:')).map((k) => k.slice(2));
  const profileDirty = dirtyKeys.includes(D.profile);

  /* an item cleared locally must be removed on the server, not merely
     un-ticked, or "Clear this item" would come back on the next pull */
  const removed = problemKeys.filter((k) => !s.problems[k]);
  const present = problemKeys.filter((k) => s.problems[k]);

  if (removed.length) {
    for (const ks of chunk(removed)) {
      const { error } = await sb.from('progress_items').delete().eq('user_id', userId).in('item_key', ks);
      if (error) throw new Error(error.message);
    }
  }

  if (present.length) {
    const rows = present.map((k) => problemToRow(userId, k, s.problems[k]));
    for (const c of chunk(rows)) {
      const { error } = await sb.from('progress_items').upsert(c, { onConflict: 'user_id,item_key' });
      if (error) throw new Error(error.message);
    }
    /* Reviews are replaced wholesale per item: the schedule is small, and a
       diff would be more code than it saves. The delete must come first, or a
       removed re-solve would linger. */
    for (const ks of chunk(present)) {
      const { error } = await sb.from('reviews').delete().eq('user_id', userId).in('item_key', ks);
      if (error) throw new Error(error.message);
    }
    const reviewRows = present.flatMap((k) => reviewsToRows(userId, k, s.problems[k].reviews));
    for (const c of chunk(reviewRows)) {
      const { error } = await sb.from('reviews').upsert(c, { onConflict: 'user_id,item_key,due' });
      if (error) throw new Error(error.message);
    }
  }

  if (drillKeys.length) {
    const rows: DrillRow[] = drillKeys.map((k) => {
      const isTpl = isTemplateKey(k);
      const status = isTpl ? (s.templates[k]?.status || '') : (s.patterns[k] || '');
      return { user_id: userId, key: k, kind: isTpl ? 'template' : 'pattern', status };
    });
    for (const c of chunk(rows)) {
      const { error } = await sb.from('drill_states').upsert(c, { onConflict: 'user_id,key' });
      if (error) throw new Error(error.message);
    }
  }

  if (noteKeys.length) {
    const rows: NoteRow[] = noteKeys.map((k) => ({ user_id: userId, key: k, body: s.notes[k] ?? '' }));
    for (const c of chunk(rows)) {
      const { error } = await sb.from('notes').upsert(c, { onConflict: 'user_id,key' });
      if (error) throw new Error(error.message);
    }
  }

  if (unlockKeys.length) {
    const rows: UnlockRow[] = unlockKeys
      .filter((k) => s.unlocked[k])
      .map((k) => ({ user_id: userId, week: Number(k) }));
    if (rows.length) {
      const { error } = await sb.from('week_unlocks').upsert(rows, { onConflict: 'user_id,week' });
      if (error) throw new Error(error.message);
    }
  }

  if (profileDirty) {
    const { error } = await sb.from('profiles').update({ start_date: s.startDate }).eq('id', userId);
    if (error) throw new Error(error.message);
  }

  useStore.getState().clearDirty(dirtyKeys);
  return dirtyKeys.length;
}

/* ------------------------------------------------------------------ wipe -- */

/* "Reset everything" has to reach the server too, or the next pull restores
   what was just deleted. */
export async function wipeRemote(sb: SupabaseClient, userId: string) {
  for (const t of ['reviews', 'progress_items', 'drill_states', 'notes', 'week_unlocks']) {
    const { error } = await sb.from(t).delete().eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
  useStore.getState().clearPendingWipe();
  setLastSync(userId, new Date().toISOString());
}

/* ------------------------------------------------------------ upload all -- */

/* First sign-in on a browser that already has local progress. Explicit, never
   automatic — silently merging someone's work into an account is not a
   decision software should make for them. */
export async function uploadLocal(sb: SupabaseClient, userId: string): Promise<number> {
  useStore.getState().markAllDirty();
  return push(sb, userId);
}

/* --------------------------------------------------------------- one pass -- */

export async function syncOnce(sb: SupabaseClient, userId: string): Promise<SyncResult> {
  try {
    if (useStore.getState().pendingWipe) {
      await wipeRemote(sb, userId);
      return { pushed: 0, pulled: 0 };
    }
    /* push first: local pending edits are newer than anything the pull would
       hand back for the same key, and pushing first keeps the two consistent
       if the pull fails halfway */
    const pushed = await push(sb, userId);
    const pulled = await pull(sb, userId, getLastSync(userId));
    setLastSync(userId, new Date().toISOString());
    return { pushed, pulled };
  } catch (e) {
    return { pushed: 0, pulled: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

export { snapshot };
