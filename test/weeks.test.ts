/* Does the weekly plan PARTITION the sheet?

   This is the invariant that makes "finish all 22 weeks" mean "finish the
   repo". Ported from legacy/test-weekly.js against lib/weeks.ts.            */
import { describe, it, expect } from 'vitest';
import PLAN from '../content';
import { buildWeeks, WEEKS, chunkTo } from '../lib/weeks';
import { allItems } from '../lib/items';
import { addDays, diffDays } from '../lib/calendar';
import { START } from './helpers';

const weeks = buildWeeks(START);

/* every key the plan should account for: all non-pack items, plus pack items,
   plus the pattern drills and templates that live in their own key spaces */
function expectedKeys(): Set<string> {
  const keys = new Set<string>();
  allItems().forEach((i) => keys.add(i.key));
  PLAN.sections.forEach((s: any) =>
    s.p.forEach((_p: any, ix: number) => keys.add(`pt-${s.id}-${ix}`)));
  PLAN.templates.forEach((_t: any, ix: number) => keys.add(String(ix)));
  return keys;
}

describe('week structure', () => {
  it('builds exactly 22 weeks, numbered 1..22', () => {
    expect(weeks).toHaveLength(WEEKS);
    expect(weeks.map((w) => w.n)).toEqual(Array.from({ length: WEEKS }, (_, i) => i + 1));
  });

  it('assigns phases 1/2/3 at weeks 1-6, 7-13, 14-22', () => {
    expect(weeks.filter((w) => w.phase === 1).map((w) => w.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(weeks.filter((w) => w.phase === 2).map((w) => w.n)).toEqual([7, 8, 9, 10, 11, 12, 13]);
    expect(weeks.filter((w) => w.phase === 3)).toHaveLength(9);
  });

  it('gives every week a contiguous 7-day range starting on the start date', () => {
    expect(weeks[0].from).toBe(START);
    weeks.forEach((w) => {
      expect(diffDays(w.from, w.to)).toBe(6);
    });
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i].from).toBe(addDays(weeks[i - 1].to, 1));
    }
  });

  it('has no empty core week — an empty core would auto-unlock the next', () => {
    weeks.forEach((w) => expect(w.core.length).toBeGreaterThan(0));
  });
});

describe('the partition', () => {
  const seen = new Map<string, number[]>();
  weeks.forEach((w) => {
    [...w.core, ...w.addon].forEach((g) => {
      if (!seen.has(g.key)) seen.set(g.key, []);
      seen.get(g.key)!.push(w.n);
    });
  });

  it('places every item in exactly one week', () => {
    const dupes = [...seen.entries()].filter(([, ws]) => ws.length > 1);
    expect(dupes.map(([k, ws]) => `${k} in weeks ${ws.join(',')}`)).toEqual([]);
  });

  it('leaves nothing out of the plan', () => {
    const missing = [...expectedKeys()].filter((k) => !seen.has(k));
    expect(missing).toEqual([]);
  });

  it('invents nothing that is not in the content', () => {
    const expected = expectedKeys();
    const extra = [...seen.keys()].filter((k) => !expected.has(k));
    expect(extra).toEqual([]);
  });

  it('accounts for all 1,199 trackable items', () => {
    const total = weeks.reduce((n, w) => n + w.core.length + w.addon.length, 0);
    expect(seen.size).toBe(1199);
    expect(total).toBe(1199);
  });
});

describe('chunkTo', () => {
  it('distributes evenly and preserves order', () => {
    const m = chunkTo([1, 2, 3, 4, 5, 6, 7], 1, 3);
    expect(m[1]).toEqual([1, 2, 3]);
    expect(m[2]).toEqual([4, 5]);
    expect(m[3]).toEqual([6, 7]);
  });

  it('handles fewer items than weeks without dropping any', () => {
    const m = chunkTo([1, 2], 1, 5);
    expect(Object.values(m).flat()).toEqual([1, 2]);
  });

  it('returns nothing for an inverted range', () => {
    expect(chunkTo([1, 2, 3], 5, 1)).toEqual({});
  });
});
