/* Translation between the store's shape and the database rows.

   Kept apart from the engine so the wire format is readable in one place, and
   so a schema change touches only this file. */

import type { AppState, ProblemState, Review, Status } from '../types';

export interface ProgressRow {
  user_id: string;
  item_key: string;
  done: boolean;
  status: string;
  mins: number;
  log_trigger: string | null;
  log_technique: string | null;
  log_mistake: string | null;
  updated_at?: string;
}

export interface ReviewRow {
  user_id: string;
  item_key: string;
  due: string;
  done: boolean;
}

export interface DrillRow {
  user_id: string;
  key: string;
  kind: 'pattern' | 'template';
  status: string;
  updated_at?: string;
}

export interface NoteRow {
  user_id: string;
  key: string;
  body: string;
  updated_at?: string;
}

export interface UnlockRow {
  user_id: string;
  week: number;
}

/* Template drills are keyed by array index — "0", "1", … — while pattern
   drills carry a pt- prefix. Both live in drill_states, so the row's `kind`
   is what tells them apart on the way back. */
export function isTemplateKey(key: string): boolean {
  return /^\d+$/.test(key);
}

export function problemToRow(userId: string, key: string, p: ProblemState): ProgressRow {
  return {
    user_id: userId,
    item_key: key,
    done: !!p.done,
    status: p.status || '',
    mins: p.mins || 0,
    /* empty string and "not written" are the same thing here, and null keeps
       the column honest about which rows actually carry a log */
    log_trigger: p.log?.trigger?.trim() || null,
    /* The approach checkboxes ride in log_technique, encoded as a JSON array.

       The column is literally "what technique solved it", so this is the same
       fact in a better shape — and doing it this way needs no migration, which
       matters because the schema is already live. A row written before the
       checkboxes existed holds prose, not JSON; rowToProblem tells them apart
       by whether it parses, so nothing anyone typed is lost. */
    log_technique: p.approaches?.length
      ? JSON.stringify(p.approaches)
      : (p.log?.technique?.trim() || null),
    log_mistake: p.log?.mistake?.trim() || null,
  };
}

export function reviewsToRows(userId: string, key: string, reviews: Review[]): ReviewRow[] {
  return (reviews || []).map((r) => ({
    user_id: userId, item_key: key, due: r.due, done: !!r.done,
  }));
}

export function rowToProblem(row: ProgressRow, reviews: ReviewRow[]): ProblemState {
  /* Only carry log fields that actually hold something. Manufacturing three
     empty strings per item would make the round trip inexact and add ~45KB of
     nothing to localStorage across a full 900-item sheet. */
  const log: ProblemState['log'] = {};
  if (row.log_trigger) log.trigger = row.log_trigger;
  if (row.log_mistake) log.mistake = row.log_mistake;

  /* log_technique holds either a JSON array of approach ids (written by the
     checkboxes) or free prose (written before they existed). Parse decides. */
  let approaches: string[] | undefined;
  if (row.log_technique) {
    const raw = row.log_technique.trim();
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          approaches = parsed as string[];
        }
      } catch { /* not JSON after all — fall through and keep it as prose */ }
    }
    if (!approaches) log.technique = row.log_technique;
  }

  return {
    done: !!row.done,
    status: (row.status || '') as Status,
    mins: row.mins || 0,
    log,
    ...(approaches && approaches.length ? { approaches } : {}),
    reviews: reviews
      .map((r) => ({ due: r.due, done: !!r.done }))
      .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0)),
  };
}

/* Assembles a partial AppState from pulled rows, ready for applyRemote. */
export function rowsToState(
  progress: ProgressRow[],
  reviews: ReviewRow[],
  drills: DrillRow[],
  notes: NoteRow[],
  unlocks: UnlockRow[],
  startDate?: string
): Partial<AppState> {
  const byItem = new Map<string, ReviewRow[]>();
  reviews.forEach((r) => {
    if (!byItem.has(r.item_key)) byItem.set(r.item_key, []);
    byItem.get(r.item_key)!.push(r);
  });

  const problems: Record<string, ProblemState> = {};
  progress.forEach((row) => {
    problems[row.item_key] = rowToProblem(row, byItem.get(row.item_key) || []);
  });

  const patterns: Record<string, string> = {};
  const templates: Record<string, { status?: string }> = {};
  drills.forEach((d) => {
    if (d.kind === 'template') templates[d.key] = { status: d.status };
    else patterns[d.key] = d.status;
  });

  const noteMap: Record<string, string> = {};
  notes.forEach((n) => { noteMap[n.key] = n.body; });

  const unlocked: Record<string, boolean> = {};
  unlocks.forEach((u) => { unlocked[String(u.week)] = true; });

  const out: Partial<AppState> = { problems, patterns, templates, notes: noteMap, unlocked };
  if (startDate) out.startDate = startDate;
  return out;
}
