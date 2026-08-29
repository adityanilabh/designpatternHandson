/* The approach checkboxes, and the column they ride in.

   The encoding is the part worth testing: approaches are stored in
   log_technique as a JSON array, because that column already means "what
   technique solved it" and reusing it avoids a migration against a live
   database. The cost of that choice is that one column now holds two shapes,
   so the round trip and the legacy-prose case both have to be pinned down. */
import { describe, it, expect } from 'vitest';
import APPROACHES, { FAMILIES, FAMILY_LABEL } from '../content/approaches';
import { problemToRow, rowToProblem } from '../lib/sync/mapping';
import { allItems } from '../lib/items';
import type { ProblemState } from '../lib/types';

const base = (over: Partial<ProblemState> = {}): ProblemState =>
  ({ done: false, status: '', mins: 0, log: {}, reviews: [], ...over });

const DSA = allItems().filter((i) => i.key.startsWith('ds-'));

describe('every DSA question has a usable list', () => {
  it('covers all of them', () => {
    const missing = DSA.filter((i) => !APPROACHES[i.key]?.length);
    expect(missing.map((i) => i.key)).toEqual([]);
  });

  it('never offers a single option, which would be a giveaway', () => {
    const thin = Object.entries(APPROACHES).filter(([, v]) => v.length < 2);
    expect(thin).toEqual([]);
  });

  it('always offers brute force, and offers it first', () => {
    for (const [key, list] of Object.entries(APPROACHES)) {
      expect(list[0], key).toBe('brute');
    }
  });

  it('every id has a label', () => {
    const ids = new Set(FAMILIES.map(([id]) => id));
    for (const [key, list] of Object.entries(APPROACHES)) {
      for (const f of list) {
        expect(ids.has(f), `${key} -> ${f}`).toBe(true);
        expect(FAMILY_LABEL[f]).toBeTruthy();
      }
    }
  });

  it('has no duplicates within a list', () => {
    for (const [key, list] of Object.entries(APPROACHES)) {
      expect(new Set(list).size, key).toBe(list.length);
    }
  });

  it('is specific, not one list repeated per section', () => {
    /* the bug this pins: an earlier generator had no rule for "Kadane", so
       Two Sum, Best Time to Buy and Sell Stock and Maximum Subarray all fell
       through to the section default and produced three identical lists */
    const twoSum = APPROACHES['ds-arr-b-0'];
    const stock = APPROACHES['ds-arr-b-1'];
    expect(twoSum).not.toEqual(stock);
    expect(twoSum).toContain('hash');
    expect(stock).toContain('dp');
  });
});

describe('approaches survive a sync round trip', () => {
  it('writes a JSON array and reads it back', () => {
    const row = problemToRow('u1', 'ds-arr-b-0', base({ approaches: ['brute', 'hash'] }));
    expect(row.log_technique).toBe('["brute","hash"]');
    expect(rowToProblem(row, []).approaches).toEqual(['brute', 'hash']);
  });

  it('leaves the column null when nothing is ticked', () => {
    const row = problemToRow('u1', 'ds-arr-b-0', base());
    expect(row.log_technique).toBeNull();
    expect(rowToProblem(row, []).approaches).toBeUndefined();
  });

  it('keeps prose written before the checkboxes existed', () => {
    const legacy = { ...problemToRow('u1', 'ds-arr-b-0', base()), log_technique: 'hashmap of complement' };
    const back = rowToProblem(legacy, []);
    expect(back.log.technique).toBe('hashmap of complement');
    expect(back.approaches).toBeUndefined();
  });

  it('does not mistake prose that merely starts with a bracket', () => {
    const odd = { ...problemToRow('u1', 'ds-arr-b-0', base()), log_technique: '[not json after all' };
    const back = rowToProblem(odd, []);
    expect(back.log.technique).toBe('[not json after all');
    expect(back.approaches).toBeUndefined();
  });

  it('rejects a JSON array that is not strings', () => {
    const odd = { ...problemToRow('u1', 'ds-arr-b-0', base()), log_technique: '[1,2,3]' };
    const back = rowToProblem(odd, []);
    expect(back.approaches).toBeUndefined();
    expect(back.log.technique).toBe('[1,2,3]');
  });

  it('prefers ticked approaches over stale prose on the same item', () => {
    const row = problemToRow('u1', 'ds-arr-b-0',
      base({ approaches: ['brute'], log: { technique: 'old note' } }));
    expect(row.log_technique).toBe('["brute"]');
  });
});

describe('the trigger field is retired but not destroyed', () => {
  it('still round trips, so nothing already written is lost', () => {
    const row = problemToRow('u1', 'ds-arr-b-0', base({ log: { trigger: 'keys <= 6' } }));
    expect(row.log_trigger).toBe('keys <= 6');
    expect(rowToProblem(row, []).log.trigger).toBe('keys <= 6');
  });
});
