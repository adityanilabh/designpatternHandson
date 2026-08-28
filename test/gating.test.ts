/* The unlock chain: week N opens only when week N-1's core is complete.

   Ported from legacy/test-gating.js against lib/weeks.ts.                    */
import { describe, it, expect } from 'vitest';
import { buildWeeks, weekUnlocked, currentWeek, weekProgress, WEEKS } from '../lib/weeks';
import { freshState, completeWeekCore, markGoal, START } from './helpers';

describe('gating', () => {
  it('opens week 1 always, and nothing else, with nothing done', () => {
    const s = freshState();
    expect(weekUnlocked(s, 1)).toBe(true);
    expect(weekUnlocked(s, 2)).toBe(false);
    expect(weekUnlocked(s, 3)).toBe(false);
    expect(currentWeek(s)).toBe(1);
  });

  it('opens each next week as the previous core completes', () => {
    const s = freshState();
    completeWeekCore(s, 1);
    expect(weekUnlocked(s, 2)).toBe(true);
    expect(weekUnlocked(s, 3)).toBe(false);
    expect(currentWeek(s)).toBe(2);

    completeWeekCore(s, 2);
    expect(weekUnlocked(s, 3)).toBe(true);
    expect(weekUnlocked(s, 4)).toBe(false);
    expect(currentWeek(s)).toBe(3);
  });

  it('does NOT open the next week when one core item is missing', () => {
    const s = freshState();
    const core = buildWeeks(START)[0].core;
    core.slice(0, -1).forEach((g) => markGoal(s, g));
    expect(weekProgress(s, buildWeeks(START)[0]).complete).toBe(false);
    expect(weekUnlocked(s, 2)).toBe(false);
    expect(currentWeek(s)).toBe(1);
  });

  it('honours a manual override for that week only', () => {
    const s = freshState();
    s.unlocked[3] = true;
    expect(weekUnlocked(s, 3)).toBe(true);
    expect(weekUnlocked(s, 2)).toBe(false);
    expect(weekUnlocked(s, 4)).toBe(false);
    /* currentWeek follows completion, not overrides */
    expect(currentWeek(s)).toBe(1);
  });

  it('opens week N+1 normally after an overridden week N is finished', () => {
    const s = freshState();
    s.unlocked[3] = true;
    completeWeekCore(s, 3);
    expect(weekUnlocked(s, 4)).toBe(true);
    /* the override does not retroactively open week 2 */
    expect(weekUnlocked(s, 2)).toBe(false);
  });

  it('reports week 22 as current once everything is complete', () => {
    const s = freshState();
    for (let n = 1; n <= WEEKS; n++) completeWeekCore(s, n);
    expect(currentWeek(s)).toBe(WEEKS);
    expect(weekUnlocked(s, WEEKS)).toBe(true);
  });

  it('counts core and addon progress separately', () => {
    const s = freshState();
    const w = buildWeeks(START)[0];
    completeWeekCore(s, 1);
    const p = weekProgress(s, w);
    expect(p.core).toBe(p.coreTotal);
    expect(p.complete).toBe(true);
    /* addons are optional and must not be required to unlock */
    if (w.addon.length) expect(p.addon).toBe(0);
  });
});
