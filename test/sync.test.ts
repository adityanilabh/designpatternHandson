/* The store <-> database translation must round-trip exactly.

   A bug here does not throw — it silently drops or mangles progress on the way
   to the server, and you find out when a device pulls something wrong. So the
   test is a full round trip over a realistic state, asserting deep equality
   rather than spot-checking fields. */
import { describe, it, expect } from 'vitest';
import {
  problemToRow, reviewsToRows, rowToProblem, rowsToState, isTemplateKey,
} from '../lib/sync/mapping';
import type { ProblemState } from '../lib/types';

const UID = '11111111-2222-3333-4444-555555555555';

const rich: ProblemState = {
  done: true,
  status: 'ugly',
  mins: 47,
  log: {
    trigger: '"at most K stops" — the budget goes INTO the state',
    technique: 'Dijkstra on (node, stopsUsed); dist is 2-D not 1-D',
    mistake: 'I think of visited as positional when it is state-al',
  },
  reviews: [
    { due: '2026-09-01', done: true },
    { due: '2026-09-03', done: false },
    { due: '2026-09-07', done: false },
    { due: '2026-09-16', done: false },
  ],
};

describe('problem round trip', () => {
  it('survives state -> row -> state unchanged', () => {
    const row = problemToRow(UID, 'ds-graph-c-12', rich);
    const revs = reviewsToRows(UID, 'ds-graph-c-12', rich.reviews);
    expect(rowToProblem(row, revs)).toEqual(rich);
  });

  it('keeps the log fields distinct — mixing them would be invisible', () => {
    const row = problemToRow(UID, 'k', rich);
    expect(row.log_trigger).toContain('at most K stops');
    expect(row.log_technique).toContain('Dijkstra');
    expect(row.log_mistake).toContain('state-al');
  });

  it('stores an absent log as null, not an empty string', () => {
    const bare: ProblemState = { done: true, status: '', mins: 0, log: {}, reviews: [] };
    const row = problemToRow(UID, 'k', bare);
    expect(row.log_trigger).toBeNull();
    expect(row.log_technique).toBeNull();
    expect(row.log_mistake).toBeNull();
  });

  it('treats whitespace-only log text as absent', () => {
    const ws: ProblemState = {
      done: false, status: '', mins: 0,
      log: { trigger: '   ', technique: '\n', mistake: '' }, reviews: [],
    };
    expect(problemToRow(UID, 'k', ws).log_trigger).toBeNull();
  });

  it('sorts re-solves by due date on the way back', () => {
    const row = problemToRow(UID, 'k', rich);
    const shuffled = [
      { user_id: UID, item_key: 'k', due: '2026-09-16', done: false },
      { user_id: UID, item_key: 'k', due: '2026-09-01', done: true },
      { user_id: UID, item_key: 'k', due: '2026-09-07', done: false },
    ];
    expect(rowToProblem(row, shuffled).reviews.map((r) => r.due))
      .toEqual(['2026-09-01', '2026-09-07', '2026-09-16']);
  });

  it('preserves a done=false, status="" item — an explicitly un-ticked row', () => {
    const p: ProblemState = { done: false, status: '', mins: 0, log: {}, reviews: [] };
    const row = problemToRow(UID, 'k', p);
    expect(rowToProblem(row, [])).toEqual(p);
  });
});

describe('drill key space', () => {
  it('separates template drills from pattern drills', () => {
    /* templates are keyed by array index, patterns carry a pt- prefix; both
       share one table, so getting this wrong swaps two different key spaces */
    expect(isTemplateKey('0')).toBe(true);
    expect(isTemplateKey('28')).toBe(true);
    expect(isTemplateKey('pt-graph-3')).toBe(false);
    expect(isTemplateKey('ds-arr-b-0')).toBe(false);
  });
});

describe('rowsToState', () => {
  it('routes drills back to the right store slice by kind', () => {
    const out = rowsToState(
      [], [],
      [
        { user_id: UID, key: 'pt-graph-3', kind: 'pattern', status: 'fast' },
        { user_id: UID, key: '7', kind: 'template', status: 'learning' },
      ],
      [], []
    );
    expect(out.patterns).toEqual({ 'pt-graph-3': 'fast' });
    expect(out.templates).toEqual({ '7': { status: 'learning' } });
  });

  it('attaches each item only its own re-solves', () => {
    const out = rowsToState(
      [
        problemToRow(UID, 'a', rich),
        problemToRow(UID, 'b', { ...rich, reviews: [{ due: '2026-10-01', done: false }] }),
      ],
      [
        ...reviewsToRows(UID, 'a', rich.reviews),
        { user_id: UID, item_key: 'b', due: '2026-10-01', done: false },
      ],
      [], [], []
    );
    expect(out.problems!['a'].reviews).toHaveLength(4);
    expect(out.problems!['b'].reviews).toEqual([{ due: '2026-10-01', done: false }]);
  });

  it('maps week unlocks to string keys, matching the store', () => {
    const out = rowsToState([], [], [], [], [{ user_id: UID, week: 3 }, { user_id: UID, week: 7 }]);
    expect(out.unlocked).toEqual({ '3': true, '7': true });
  });

  it('omits startDate when the profile did not provide one', () => {
    expect(rowsToState([], [], [], [], [])).not.toHaveProperty('startDate');
    expect(rowsToState([], [], [], [], [], '2026-08-31').startDate).toBe('2026-08-31');
  });

  it('carries notes across verbatim, including empty ones', () => {
    const out = rowsToState([], [], [], [
      { user_id: UID, key: 'sec-graph', body: 'visited is state-al' },
      { user_id: UID, key: 'sec-dp', body: '' },
    ], []);
    expect(out.notes).toEqual({ 'sec-graph': 'visited is state-al', 'sec-dp': '' });
  });
});
