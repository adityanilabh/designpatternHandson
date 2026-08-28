/* Spaced repetition.

   Ported from legacy/app.js. Rating an attempt ugly or failed schedules four
   blank-file re-solves. Three re-solves of one hard problem beats one solve
   each of three hard problems — that rule is why the tracker exists, and it is
   the first thing people drop.                                               */
import { today, addDays, diffDays } from './calendar';
import { allItems, findItem } from './items';
import type { AppState, Item, Review } from './types';

export const REVIEW_OFFSETS = [1, 3, 7, 16];

/* Idempotent: re-rating on the same day tops up missing offsets rather than
   duplicating the whole schedule. */
export function scheduleReviews(state: AppState, key: string, from?: string): Review[] {
  const base = from || today();
  const p = state.problems[key];
  if (!p) return [];
  if (!p.reviews) p.reviews = [];

  const have = new Set(p.reviews.filter((r) => !r.done).map((r) => r.due));
  REVIEW_OFFSETS.forEach((o) => {
    const due = addDays(base, o);
    if (!have.has(due)) p.reviews.push({ due, done: false });
  });
  p.reviews.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
  return p.reviews;
}

export interface DueReview {
  key: string;
  item: Item;
  due: string;
  index: number;
  delta: number;   /* negative = overdue */
}

export function dueReviews(state: AppState, on = today()): DueReview[] {
  const out: DueReview[] = [];
  allItems().forEach((x) => {
    const p = state.problems[x.key];
    if (!p || !p.reviews) return;
    p.reviews.forEach((r, index) => {
      if (r.done) return;
      out.push({ key: x.key, item: x, due: r.due, index, delta: diffDays(on, r.due) });
    });
  });
  out.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
  return out;
}

export function overdueCount(state: AppState, on = today()): number {
  return dueReviews(state, on).filter((d) => d.delta <= 0).length;
}

export { findItem };
