'use client';

/* The tracker's state, persisted to localStorage.

   This is the drop-in replacement for legacy/app.js's `state` + save(). Every
   write went through one save() there; here every write goes through one
   Zustand set(), which is the seam Stage 4 hooks cloud sync into.

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

export interface UiState {
  theme: 'dark' | 'light';
  open: Record<string, boolean>;    /* expandable panels, by id */
  navQuery: string;
  refQuery: string;
}

export interface Store extends AppState {
  ui: UiState;
  hydrated: boolean;

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

  replaceAll: (next: AppState) => void;
  reset: () => void;
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
  return { problems };
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...blankState(PLAN.meta.start),
      ui: { theme: 'dark', open: {}, navQuery: '', refQuery: '' },
      hydrated: false,

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
      })),

      setTemplate: (key, status) => set((s) => ({
        templates: {
          ...s.templates,
          [key]: { status: s.templates[key]?.status === status ? '' : status },
        },
      })),

      setNote: (key, text) => set((s) => ({ notes: { ...s.notes, [key]: text } })),

      unlockWeek: (n) => set((s) => ({ unlocked: { ...s.unlocked, [n]: true } })),

      /* The date input can be cleared, which yields ''. Every calendar helper
         parses the start date, so an empty one turns the app to NaN — and it
         would be persisted. Refuse it. */
      setStartDate: (date) => {
        if (!isValidDate(date)) return false;
        set({ startDate: date });
        return true;
      },

      setTheme: (theme) => set((s) => ({ ui: { ...s.ui, theme } })),
      toggleOpen: (id) => set((s) => {
        const open = { ...s.ui.open };
        if (open[id]) delete open[id]; else open[id] = true;
        return { ui: { ...s.ui, open } };
      }),
      setNavQuery: (navQuery) => set((s) => ({ ui: { ...s.ui, navQuery } })),
      setRefQuery: (refQuery) => set((s) => ({ ui: { ...s.ui, refQuery } })),

      replaceAll: (next) => set({
        v: 3,
        startDate: isValidDate(next.startDate) ? next.startDate : PLAN.meta.start,
        problems: next.problems || {},
        patterns: next.patterns || {},
        templates: next.templates || {},
        notes: next.notes || {},
        unlocked: next.unlocked || {},
      }),

      reset: () => set({ ...blankState(PLAN.meta.start) }),
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 3,
      partialize: (s) => ({
        v: s.v, startDate: s.startDate, problems: s.problems, patterns: s.patterns,
        templates: s.templates, notes: s.notes, unlocked: s.unlocked, ui: s.ui,
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

/* The persisted slice only — what Stage 4 will push to the server. */
export function snapshot(): AppState {
  const s = useStore.getState();
  return {
    v: s.v, startDate: s.startDate, problems: s.problems, patterns: s.patterns,
    templates: s.templates, notes: s.notes, unlocked: s.unlocked,
  };
}
