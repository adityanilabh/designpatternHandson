'use client';

/* The tracker's state, persisted to localStorage and — once signed in —
   synced to Supabase.

   This is the drop-in replacement for legacy/app.js's `state` + save(). Every
   write went through one save() there; here every write goes through one
   Zustand set(), which is the seam the sync engine hooks into.

   Progress keys are content-addressed and unchanged from the legacy tracker,
   so a v2 blob migrates by copying it across.                                */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import PLAN from '../content/meta';
import { isValidDate, today } from './calendar';
import { scheduleReviews as scheduleInto } from './reviews';
import { blankState } from './types';
import type { AppState, ProblemState, Status } from './types';

export const STORE_KEY = 'targetladder.state.v3';
export const LEGACY_KEY = 'targetladder.state.v2';

/* What changed since the last successful push, so a sync sends one row rather
   than the whole 400KB state. Prefixed by kind because the key spaces overlap:
   a pattern drill and a note can share the same string.

   Kept as Record<string, true> rather than a Set because it is persisted, and
   Sets do not survive JSON. It must be persisted — an edit made offline has to
   still be pending after a reload. */
export type DirtyMap = Record<string, true>;

export const D = {
  problem: (k: string) => `p:${k}`,
  drill: (k: string) => `d:${k}`,
  note: (k: string) => `n:${k}`,
  unlock: (n: number | string) => `u:${n}`,
  profile: 'profile',
} as const;

export interface UiState {
  theme: 'dark' | 'light';
  open: Record<string, boolean>;    /* expandable panels, by id */
  navQuery: string;
  refQuery: string;
}

export interface Store extends AppState {
  ui: UiState;
  hydrated: boolean;
  dirty: DirtyMap;
  /* set by reset(); the sync engine deletes the account's server rows and
     clears it. Without this, resetting locally then syncing pulls everything
     straight back, which looks like the reset silently failed. */
  pendingWipe: boolean;

  toggleDone: (key: string) => void;
  setStatus: (key: string, status: Status) => void;
  setMins: (key: string, mins: number) => void;
  setLog: (key: string, field: 'trigger' | 'technique' | 'mistake', value: string) => void;
  toggleReview: (key: string, index: number, done: boolean) => void;
  rescheduleReviews: (key: string) => void;
  clearItem: (key: string) => void;

  setPattern: (key: string, status: string) => void;
  setTemplate: (key: string, status: string) => void;
  setNote: (key: string, text: string) => void;
  unlockWeek: (n: number) => void;
  setStartDate: (date: string) => boolean;

  setTheme: (t: 'dark' | 'light') => void;
  toggleOpen: (id: string) => void;
  setNavQuery: (q: string) => void;
  setRefQuery: (q: string) => void;

  replaceAll: (next: AppState, markDirty?: boolean) => void;
  reset: () => void;

  /* sync-engine hooks */
  markAllDirty: () => void;
  clearDirty: (keys: string[]) => void;
  clearPendingWipe: () => void;
  /* applies rows pulled from the server WITHOUT marking them dirty, so a pull
     does not immediately queue itself to be pushed straight back */
  applyRemote: (patch: Partial<AppState>) => void;
}

const EMPTY_PROBLEM: ProblemState = { done: false, status: '', mins: 0, log: {}, reviews: [] };

/* Clone just the one problem being written, so persisted objects are never
   mutated in place and React sees a new reference. */
function withProblem(
  state: Store,
  key: string,
  fn: (p: ProblemState) => ProblemState | null
): Partial<Store> {
  const current = state.problems[key] || EMPTY_PROBLEM;
  const draft: ProblemState = {
    ...current,
    log: { ...current.log },
    reviews: current.reviews.map((r) => ({ ...r })),
  };
  const next = fn(draft);
  const problems = { ...state.problems };
  if (next === null) delete problems[key];
  else problems[key] = next;
  return { problems, dirty: { ...state.dirty, [D.problem(key)]: true } };
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...blankState(PLAN.meta.start),
      ui: { theme: 'dark', open: {}, navQuery: '', refQuery: '' },
      hydrated: false,
      dirty: {},
      pendingWipe: false,

      toggleDone: (key) => set((s) => withProblem(s, key, (p) => {
        p.done = !p.done;
        if (!p.done) p.status = '';
        return p;
      })),

      /* Setting a status implies done. Ugly or failed schedules four blank-file
         re-solves — the rule the whole tracker exists to enforce. */
      setStatus: (key, status) => set((s) => withProblem(s, key, (p) => {
        p.status = p.status === status ? '' : status;
        if (p.status) p.done = true;
        if (p.status === 'ugly' || p.status === 'failed') {
          const shim = { problems: { [key]: p } } as unknown as AppState;
          scheduleInto(shim, key, today());
        }
        return p;
      })),

      setMins: (key, mins) => set((s) => withProblem(s, key, (p) => {
        p.mins = Number.isFinite(mins) && mins > 0 ? Math.floor(mins) : 0;
        return p;
      })),

      setLog: (key, field, value) => set((s) => withProblem(s, key, (p) => {
        p.log = { ...p.log, [field]: value };
        return p;
      })),

      toggleReview: (key, index, done) => set((s) => withProblem(s, key, (p) => {
        if (p.reviews[index]) p.reviews[index].done = done;
        return p;
      })),

      rescheduleReviews: (key) => set((s) => withProblem(s, key, (p) => {
        const shim = { problems: { [key]: p } } as unknown as AppState;
        scheduleInto(shim, key, today());
        return p;
      })),

      clearItem: (key) => set((s) => withProblem(s, key, () => null)),

      setPattern: (key, status) => set((s) => ({
        patterns: { ...s.patterns, [key]: s.patterns[key] === status ? '' : status },
        dirty: { ...s.dirty, [D.drill(key)]: true },
      })),

      setTemplate: (key, status) => set((s) => ({
        templates: {
          ...s.templates,
          [key]: { status: s.templates[key]?.status === status ? '' : status },
        },
        dirty: { ...s.dirty, [D.drill(key)]: true },
      })),

      setNote: (key, text) => set((s) => ({
        notes: { ...s.notes, [key]: text },
        dirty: { ...s.dirty, [D.note(key)]: true },
      })),

      unlockWeek: (n) => set((s) => ({
        unlocked: { ...s.unlocked, [n]: true },
        dirty: { ...s.dirty, [D.unlock(n)]: true },
      })),

      /* The date input can be cleared, which yields ''. Every calendar helper
         parses the start date, so an empty one turns the app to NaN — and it
         would be persisted. Refuse it. */
      setStartDate: (date) => {
        if (!isValidDate(date)) return false;
        set((s) => ({ startDate: date, dirty: { ...s.dirty, [D.profile]: true } }));
        return true;
      },

      /* UI preferences are device-local and deliberately never synced — a
         collapsed panel on your laptop should not fold it on your phone. */
      setTheme: (theme) => set((s) => ({ ui: { ...s.ui, theme } })),
      toggleOpen: (id) => set((s) => {
        const open = { ...s.ui.open };
        if (open[id]) delete open[id]; else open[id] = true;
        return { ui: { ...s.ui, open } };
      }),
      setNavQuery: (navQuery) => set((s) => ({ ui: { ...s.ui, navQuery } })),
      setRefQuery: (refQuery) => set((s) => ({ ui: { ...s.ui, refQuery } })),

      replaceAll: (next, markDirty = true) => {
        set({
          v: 3,
          startDate: isValidDate(next.startDate) ? next.startDate : PLAN.meta.start,
          problems: next.problems || {},
          patterns: next.patterns || {},
          templates: next.templates || {},
          notes: next.notes || {},
          unlocked: next.unlocked || {},
        });
        if (markDirty) get().markAllDirty();
      },

      reset: () => set((s) => ({
        ...blankState(PLAN.meta.start),
        ui: s.ui,
        hydrated: true,
        dirty: {},
        pendingWipe: true,
      })),

      markAllDirty: () => set((s) => {
        const dirty: DirtyMap = { [D.profile]: true };
        Object.keys(s.problems).forEach((k) => { dirty[D.problem(k)] = true; });
        Object.keys(s.patterns).forEach((k) => { dirty[D.drill(k)] = true; });
        Object.keys(s.templates).forEach((k) => { dirty[D.drill(k)] = true; });
        Object.keys(s.notes).forEach((k) => { dirty[D.note(k)] = true; });
        Object.keys(s.unlocked).forEach((k) => { dirty[D.unlock(k)] = true; });
        return { dirty };
      }),

      clearDirty: (keys) => set((s) => {
        const dirty = { ...s.dirty };
        keys.forEach((k) => delete dirty[k]);
        return { dirty };
      }),

      clearPendingWipe: () => set({ pendingWipe: false }),

      applyRemote: (patch) => set((s) => ({
        startDate: patch.startDate ?? s.startDate,
        problems: patch.problems ? { ...s.problems, ...patch.problems } : s.problems,
        patterns: patch.patterns ? { ...s.patterns, ...patch.patterns } : s.patterns,
        templates: patch.templates ? { ...s.templates, ...patch.templates } : s.templates,
        notes: patch.notes ? { ...s.notes, ...patch.notes } : s.notes,
        unlocked: patch.unlocked ? { ...s.unlocked, ...patch.unlocked } : s.unlocked,
      })),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 3,
      partialize: (s) => ({
        v: s.v, startDate: s.startDate, problems: s.problems, patterns: s.patterns,
        templates: s.templates, notes: s.notes, unlocked: s.unlocked, ui: s.ui,
        dirty: s.dirty, pendingWipe: s.pendingWipe,
      }) as unknown as Store,
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

/* One-time adoption of a v2 blob written by the legacy tracker. Runs only when
   v3 has never been written, so it cannot clobber newer progress. */
export function migrateLegacyState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(STORE_KEY)) return false;
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return false;
    const old = JSON.parse(raw);
    if (!old || typeof old !== 'object' || !old.problems) return false;
    useStore.getState().replaceAll({
      v: 3,
      startDate: old.startDate,
      problems: old.problems || {},
      patterns: old.patterns || {},
      templates: old.templates || {},
      notes: old.notes || {},
      unlocked: old.unlocked || {},
    });
    if (old.ui?.theme) useStore.getState().setTheme(old.ui.theme === 'light' ? 'light' : 'dark');
    return true;
  } catch {
    return false;
  }
}

/* The persisted slice only — what the sync engine pushes. */
export function snapshot(): AppState {
  const s = useStore.getState();
  return {
    v: s.v, startDate: s.startDate, problems: s.problems, patterns: s.patterns,
    templates: s.templates, notes: s.notes, unlocked: s.unlocked,
  };
}

/* Is there anything in this browser worth offering to upload? */
export function hasLocalProgress(): boolean {
  const s = useStore.getState();
  return (
    Object.keys(s.problems).length > 0 ||
    Object.values(s.patterns).some(Boolean) ||
    Object.values(s.templates).some((t) => t?.status) ||
    Object.values(s.notes).some((n) => n && n.trim()) ||
    Object.keys(s.unlocked).length > 0
  );
}
