/* The shapes the tracker stores and computes over.

   Progress keys are content-addressed and stable across edits to content/:
     ds-<sectionId>-<block>-<index>   DSA question, block 'b' | 'c'
     pt-<sectionId>-<index>           pattern drill
     sd-<n>                           system design session
     ld-<problemId>                   LLD problem
     lp-story-<index>                 behavioural story slot
     tq-<moduleId>-<index>            tech Q&A
     pp-<moduleId>-<group>-<index>    tech practice problem
     mk-<index>                       recorded mock
     bp-<group>-<index>               blind prompt
     pk-<companyId>-<index>           company pack

   APPENDING to any list is safe. Reordering within a list remaps that list's
   saved progress, which is why these keys must not be restructured casually.  */

export type Status = '' | 'clean' | 'ugly' | 'failed';

/* what a bucket of work counts toward for company readiness */
export type Kind = 'core' | 'hard' | 'tech' | 'sd' | 'lld' | 'lp' | 'mock' | 'pack';

export interface Review {
  due: string;          /* YYYY-MM-DD */
  done: boolean;
}

export interface ProblemLog {
  /* No longer collected — the field stays so that anything already written is
     still loaded, synced and shown read-only rather than silently destroyed. */
  trigger?: string;
  technique?: string;   /* what actually solved it */
  mistake?: string;     /* the mental model that was wrong — the point of the log */
}

export interface ProblemState {
  done: boolean;
  status: Status;
  mins: number;
  log: ProblemLog;
  /* Approach family ids ticked for this problem — see content/approaches.ts.
     Replaces the free-text "technique" box, which nobody filled in. */
  approaches?: string[];
  reviews: Review[];
}

export interface AppState {
  v: number;
  startDate: string;                            /* YYYY-MM-DD, must be a Monday */
  problems: Record<string, ProblemState>;
  patterns: Record<string, string>;             /* 'unknown' | 'learning' | 'fast' */
  templates: Record<string, { status?: string }>;
  notes: Record<string, string>;
  unlocked: Record<string, boolean>;            /* manual week overrides */
}

/* every checkable item normalises to this, whatever track it came from */
export interface Item {
  key: string;
  lc: number | null;
  name: string;
  note: string;
  diff: string;
  kind: Kind;
  group: string;
}

/* one goal inside a week — a problem, a pattern drill, or a template */
export interface Goal {
  key: string;
  type: 'problem' | 'pattern' | 'template';
  label: string;
  note: string;
  group: string;
  lc: number | null;
  name: string;
}

export interface Week {
  n: number;
  core: Goal[];
  addon: Goal[];
  phase: number;
  from: string;
  to: string;
}

export interface WeekProgress {
  core: number;
  coreTotal: number;
  addon: number;
  addonTotal: number;
  complete: boolean;
}

export function blankState(startDate: string): AppState {
  return {
    v: 3,
    startDate,
    problems: {},
    patterns: {},
    templates: {},
    notes: {},
    unlocked: {},
  };
}

/* Reading a problem that has never been touched must not mutate the store,
   so this returns a frozen default rather than creating an entry. */
const EMPTY: ProblemState = Object.freeze({
  done: false, status: '' as Status, mins: 0,
  log: Object.freeze({}), reviews: Object.freeze([]) as unknown as Review[],
});

export function problemOf(state: AppState, key: string): ProblemState {
  return state.problems[key] || EMPTY;
}
