/* Does the readiness score MEAN anything?

   The per-company percentage is the number the whole tracker points at, and it
   is computed by pure functions that no render test touches. Ported from
   legacy/test-readiness.js against lib/score.ts.

   The bug this file was written for: bucketItems pooled the 15 behavioural
   story slots into the LLD bucket as well as their own, capping LLD coverage
   at 46.4% however much you did, and crediting behavioural work as machine
   coding for the eight companies that carry no lp weight.                    */
import { describe, it, expect } from 'vitest';
import PLAN from '../content';
import { bucketItems, scoreOf, doneCountOf, readiness, stats } from '../lib/score';
import { allItems, packItems } from '../lib/items';
import { scheduleReviews, dueReviews, REVIEW_OFFSETS, overdueCount } from '../lib/reviews';
import { addDays, today } from '../lib/calendar';
import { freshState, markItemDone } from './helpers';
import type { Kind } from '../lib/types';

const keysOfKind = (k: Kind) => allItems().filter((x) => x.kind === k).map((x) => x.key);

describe('bucket composition', () => {
  const b = bucketItems();

  it('sizes every bucket from the content, not a hard-coded number', () => {
    expect(b.core).toHaveLength(PLAN.sections.reduce((n: number, s: any) => n + s.b.length, 0));
    expect(b.hard).toHaveLength(PLAN.sections.reduce((n: number, s: any) => n + s.c.length, 0));
    expect(b.sd).toHaveLength(PLAN.sd.length);
    expect(b.lld).toHaveLength(PLAN.lldProblems.length);
    expect(b.lp).toHaveLength(PLAN.lp.slots.length);
  });

  it('puts ONLY kind:lld in the lld bucket', () => {
    expect(b.lld.filter((x) => x.kind !== 'lld').map((x) => x.key)).toEqual([]);
  });

  it('counts an SD session titled "mock" in both sd and mock — the one deliberate overlap', () => {
    const sdMocks = allItems().filter((x) => x.kind === 'mock' && x.key.startsWith('sd-'));
    expect(sdMocks.length).toBeGreaterThan(0);
    sdMocks.forEach((x) => {
      expect(b.sd).toContain(x);
      expect(b.mock).toContain(x);
    });
  });

  it('lands no other item in two buckets', () => {
    const dupes: string[] = [];
    const names = Object.keys(b) as (keyof typeof b)[];
    names.forEach((k1, i) => {
      names.slice(i + 1).forEach((k2) => {
        if ((k1 === 'mock' && k2 === 'sd') || (k1 === 'sd' && k2 === 'mock')) return;
        b[k1].forEach((x) => { if (b[k2].includes(x)) dupes.push(`${x.key} in ${k1}+${k2}`); });
      });
    });
    expect(dupes).toEqual([]);
  });
});

describe('tracks do not leak into each other', () => {
  it('scores behavioural stories in lp and NOT in lld', () => {
    const s = freshState();
    keysOfKind('lp').forEach((k) => markItemDone(s, k));
    const b = bucketItems();
    expect(scoreOf(s, b.lp)).toBe(1);
    expect(scoreOf(s, b.lld)).toBe(0);
  });

  it('lets all 13 LLD problems reach 100% of the lld bucket', () => {
    const s = freshState();
    keysOfKind('lld').forEach((k) => markItemDone(s, k));
    const b = bucketItems();
    expect(scoreOf(s, b.lld)).toBe(1);
    expect(scoreOf(s, b.lp)).toBe(0);
  });
});

describe('every company can reach 100%', () => {
  PLAN.companies.forEach((c: any) => {
    it(`${c.id} weights sum to 1.00`, () => {
      const sum = Object.values(c.weights).reduce((n: number, w: any) => n + w, 0);
      expect(sum).toBeCloseTo(1, 9);
    });
  });

  it('reaches exactly 100% for every company when everything is clean', () => {
    const s = freshState();
    allItems().forEach((x) => markItemDone(s, x.key));
    const b = bucketItems();
    PLAN.companies.forEach((c: any) => {
      expect(readiness(s, c, b).score).toBeCloseTo(1, 9);
    });
  });

  it('still applies quality weighting below clean', () => {
    const s = freshState();
    allItems().forEach((x) => markItemDone(s, x.key, 'ugly'));
    expect(readiness(s, PLAN.companies[0], bucketItems()).score).toBeCloseTo(0.7, 9);
  });

  it('scores an unrated-but-done item at 0.85', () => {
    const s = freshState();
    const b = bucketItems();
    b.lld.forEach((x) => { s.problems[x.key] = { done: true, status: '', mins: 0, log: {}, reviews: [] }; });
    expect(scoreOf(s, b.lld)).toBeCloseTo(0.85, 9);
  });

  it('excludes optional company packs from the headline count', () => {
    const s = freshState();
    const packKeys = new Set(PLAN.companies.flatMap((c: any) => packItems(c).map((i) => i.key)));
    expect(stats(s).total).toBe(allItems().filter((x) => !packKeys.has(x.key)).length);
  });

  it('counts done items exactly, ignoring quality', () => {
    const s = freshState();
    const b = bucketItems();
    b.lld.slice(0, 5).forEach((x) => markItemDone(s, x.key, 'failed'));
    expect(doneCountOf(s, b.lld)).toBe(5);
    expect(scoreOf(s, b.lld)).toBeCloseTo((5 * 0.4) / b.lld.length, 9);
  });
});

describe('spaced repetition', () => {
  const key = 'ld-parking';

  it('schedules four re-solves at +1/+3/+7/+16 days', () => {
    const s = freshState();
    markItemDone(s, key, 'ugly');
    const revs = scheduleReviews(s, key);
    expect(revs).toHaveLength(REVIEW_OFFSETS.length);
    expect(revs.map((r) => r.due)).toEqual(REVIEW_OFFSETS.map((o) => addDays(today(), o)));
  });

  it('does not duplicate when re-rated the same day', () => {
    const s = freshState();
    markItemDone(s, key, 'ugly');
    scheduleReviews(s, key);
    scheduleReviews(s, key);
    expect(s.problems[key].reviews).toHaveLength(REVIEW_OFFSETS.length);
  });

  it('surfaces them in the queue and removes them when done', () => {
    const s = freshState();
    markItemDone(s, key, 'failed');
    scheduleReviews(s, key);
    const due = dueReviews(s);
    expect(due).toHaveLength(REVIEW_OFFSETS.length);
    expect(due.every((d) => d.key === key)).toBe(true);
    s.problems[key].reviews.forEach((r) => { r.done = true; });
    expect(dueReviews(s)).toHaveLength(0);
  });

  it('counts a past-due re-solve as overdue', () => {
    const s = freshState();
    markItemDone(s, key, 'ugly');
    scheduleReviews(s, key, addDays(today(), -30));
    expect(overdueCount(s)).toBe(REVIEW_OFFSETS.length);
  });
});
