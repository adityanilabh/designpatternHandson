/* Date and phase arithmetic. Ported unchanged from legacy/app.js.

   Dates are handled as YYYY-MM-DD strings and constructed with the local-time
   Date(y, m, d) form rather than Date.parse, which would read them as UTC and
   shift the day for anyone west of Greenwich.                                */
import PLAN from '../content/meta';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                     'Thursday', 'Friday', 'Saturday'];

export function iso(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export function today(): string {
  return iso(new Date());
}

export function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function addDays(s: string, n: number): string {
  const p = s.split('-').map(Number);
  return iso(new Date(p[0], p[1] - 1, p[2] + n));
}

export function diffDays(a: string, b: string): number {
  const x = a.split('-').map(Number), y = b.split('-').map(Number);
  return Math.round(
    (new Date(y[0], y[1] - 1, y[2]).getTime() - new Date(x[0], x[1] - 1, x[2]).getTime()) / 86400000
  );
}

export function fmtDate(s: string): string {
  const p = s.split('-').map(Number);
  return p[2] + ' ' + MONTHS[p[1] - 1];
}

export function dayOfWeek(s: string): number {
  const p = s.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]).getDay();
}

/* The raw number can be <1 (not started) or >154 (finished); the UI wants that
   distinction, so it is not clamped here. */
export function rawDayNumber(startDate: string, on = today()): number {
  return diffDays(startDate, on) + 1;
}

export function dayNumber(startDate: string, on = today()): number {
  return Math.max(1, Math.min(PLAN.meta.days, rawDayNumber(startDate, on)));
}

export function phaseRange(ph: { days: string }): [number, number] {
  const p = ph.days.split('–').map(Number);   /* en dash, as authored */
  return [p[0], p[1]];
}

export function currentPhase(startDate: string, on = today()) {
  const d = dayNumber(startDate, on);
  for (const ph of PLAN.phases) {
    const [from, to] = phaseRange(ph);
    if (d >= from && d <= to) return ph;
  }
  return PLAN.phases[0];
}

/* Math.round(0.0035 * 100) is 0, which reads as "nothing registered".
   One decimal below 10% keeps early progress visible and honest. */
export function fmtPct(x: number): string {
  const v = x * 100;
  if (v <= 0) return '0%';
  if (v < 10) return (v < 0.1 ? '<0.1' : v.toFixed(1)) + '%';
  return Math.round(v) + '%';
}

export function pct(x: number): number {
  return Math.round(x * 100);
}

/* Bar width. A non-zero score always gets a visible sliver, so "I ticked
   something and the bar did not move" cannot happen. */
export function barWidth(x: number): string {
  return (x > 0 ? Math.max(0.6, x * 100).toFixed(1) : '0') + '%';
}
