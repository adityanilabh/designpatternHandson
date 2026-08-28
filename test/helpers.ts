import { blankState } from '../lib/types';
import { buildWeeks, goalDone } from '../lib/weeks';
import type { AppState, Goal } from '../lib/types';

export const START = '2026-08-31';   /* a Monday, as the plan requires */

export function freshState(): AppState {
  return blankState(START);
}

/* Marking a goal done depends on which store backs it — problems, pattern
   drills and templates each have their own key space. */
export function markGoal(state: AppState, g: Goal, status: 'clean' | 'ugly' | 'failed' = 'clean') {
  if (g.type === 'pattern') { state.patterns[g.key] = 'fast'; return; }
  if (g.type === 'template') { state.templates[g.key] = { status: 'fast' }; return; }
  state.problems[g.key] = { done: true, status, mins: 0, log: {}, reviews: [] };
}

export function markItemDone(state: AppState, key: string, status: 'clean' | 'ugly' | 'failed' = 'clean') {
  state.problems[key] = { done: true, status, mins: 0, log: {}, reviews: [] };
}

export function completeWeekCore(state: AppState, n: number) {
  buildWeeks(state.startDate)[n - 1].core.forEach((g) => markGoal(state, g));
}

export function coreComplete(state: AppState, n: number): boolean {
  return buildWeeks(state.startDate)[n - 1].core.every((g) => goalDone(state, g));
}
