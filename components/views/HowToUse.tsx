import Link from 'next/link';
import { Table } from '@/components/content';

/* A server component on purpose: this is static prose and a table, and it is
   long. Rendering it on the client would ship a few KB of guidance into every
   page's bundle to say something that never changes. */

/* [tab, href, what it is, when you open it, the trap] */
const TABS: [string, string, string, string, string][] = [
  ['Weekly Goal', '/weekly',
    'The only screen that answers "what do I do today". Each week is a fixed list of problems, sessions and drills drawn from everywhere else.',
    'Every day. This is the front door.',
    'Week N+1 unlocks by finishing week N, not by the calendar arriving. Falling behind the dates is fine; skipping the work is not.'],
  ['The Method', '/method',
    'How to attack a problem you have never seen: altitude check, decomposition, the primitive catalogue, then 57 blind prompts with no solutions.',
    'Week 1, and again whenever you freeze on something unfamiliar.',
    'The prompts withhold solutions deliberately. Reading the method is not running it — 45 minutes, timed, out loud.'],
  ['DSA', '/dsa',
    '17 sections, 501 questions split into block B (core) and block C (hard), each section fronted by its pattern table and how to recognise it.',
    'Daily, in the order the week gives you.',
    'Solving without logging the root cause. The re-solve schedule is driven by your status, so an unrated tick teaches you nothing later.'],
  ['System design', '/sd',
    '22 sessions, each with the asked-as phrasings, back-of-envelope numbers, decision points and cross-questions — plus a 182-term design vocabulary.',
    'Twice a week, and the vocabulary whenever a term comes out mushy.',
    'Reading write-ups feels productive and is not. The session is done when you have produced your own one-pager, not when you have read someone else’s.'],
  ['LLD', '/lld',
    '13 machine-coding problems and the 13 design patterns that actually appear, with a worked solution behind each spoiler.',
    'Sundays, alongside the behavioural slot.',
    'Memorising class diagrams. The round tests whether you can name the axis of change and show one extension.'],
  ['Tech', '/tech',
    '13 modules and 197 questions on your own stack — Java, Spring, JPA, Postgres, Kafka, Kubernetes, observability — each with the follow-up they actually ask.',
    'Short daily blocks; this is the one that decays fastest.',
    'Recognising an answer is not being able to say it cold. If you read it and nodded, you have not done it.'],
  ['Companies LP', '/lp',
    '11 companies’ values with their official wordings, the anti-patterns, and a 15-slot story bank you fill once and reuse everywhere.',
    'Week 2 onwards, in small pieces.',
    'Leaving it until week 20. Stories need to be written, cut down, and said out loud several times — that takes weeks, not an evening.'],
  ['Revision', '/revision',
    'The queue of re-solves that are due. Anything you marked ugly or failed comes back at +1, +3, +7 and +16 days, blank-file.',
    'First thing, every day the badge is not zero.',
    'Treating it as optional. This is the part that converts "I solved it once" into "I can solve it under pressure".'],
  ['Ladder', '/ladder',
    'Readiness per company, weighted by what each one actually tests, with the biggest lever named for each.',
    'Weekly, for five minutes.',
    'Reading the percentage instead of the counts. Early on the score sits near zero by design; the counts are the honest signal.'],
  ['Reference', '/reference',
    'Start-here reading, the 29 code templates you should be able to type from memory, and the cross-cutting material.',
    'When you need a template or a source, not as a reading list.',
    'Collecting resources instead of using them.'],
  ['Log', '/log',
    'Everything you have recorded, newest first — statuses, times, and the root-cause notes.',
    'End of each week.',
    'Never reading it back. The log is worthless until you look for the pattern in your own mistakes.'],
  ['Strategy', '/strategy',
    'The argument behind the plan: why this split, why this order, why these companies in this sequence.',
    'Once, near the start. Again if you are tempted to redesign the plan.',
    'Rewriting the plan instead of working it. Plan-tinkering is the most comfortable form of procrastination there is.'],
];

export default function HowToUse() {
  return (
    <div className="howto">
      <p className="pane-p">
        The sheet is 989 tickable items across 154 days. It only works one way round:
        <b> the Weekly Goal tells you what to do, everything else is where that work lives</b>,
        and the Revision queue drags back anything you did badly. If you find yourself browsing
        the sections directly, you have stopped following the plan and started reading a book.
      </p>

      <h3 className="howto-h3">The daily loop</h3>
      <ol className="howto-loop">
        <li><b>Clear Revision first.</b> Re-solves are blank-file and timed. If the badge is red, nothing else starts.</li>
        <li><b>Open Weekly Goal</b> and take the next unticked row. Do not choose — the choosing is already done.</li>
        <li><b>Attempt it cold and timed</b> before opening anything. The left page of the dialog has the links; the optimal approach is behind a spoiler for a reason.</li>
        <li><b>Log it honestly.</b> Status, time on the slider, which approaches you actually tried, and the root cause if it went wrong.</li>
      </ol>

      <h3 className="howto-h3">The three statuses, and why they matter</h3>
      <p className="pane-p">
        Status is not decoration — it is the input to the spaced-repetition schedule.
        <b> Clean</b> means correct, in time, and you could explain every line: nothing comes back.
        <b> Ugly</b> means correct but slow or guessing. <b>Failed</b> means it did not work.
        Either of the last two schedules four blank-file re-solves at +1, +3, +7 and +16 days.
        Marking an ugly solve clean is not optimism, it is deleting the revision that would have
        fixed it.
      </p>

      <h3 className="howto-h3">What each tab is for</h3>
      <Table
        heads={['Tab', 'What it is', 'When you open it', 'The trap']}
        rows={TABS.map(([name, href, what, when, trap]) => [
          <Link className="lnk howto-tab" href={href} key="n">{name}</Link>,
          <span className="howto-what" key="w">{what}</span>,
          <span className="howto-when" key="o">{when}</span>,
          <span className="howto-trap" key="t">{trap}</span>,
        ])}
      />

      <h3 className="howto-h3">Inside a problem</h3>
      <p className="pane-p">
        Clicking any row opens a two-page dialog. The left page is what you <i>read</i> — the
        note, where to study it, how the section is recognised, the ladder of candidate approaches
        from blunt to sharp, and the optimal approach with its cost behind a spoiler. The right
        page is what you <i>write</i> — status, time, which approaches you reached for, and the
        root cause. They sit side by side so you can log against an approach you can still see.
      </p>

      <h3 className="howto-h3">Your progress</h3>
      <p className="pane-p">
        Everything is saved in this browser immediately, with or without a connection. Signing in
        adds cloud sync so the same progress follows you to another device; local edits always win
        over the server copy, so working offline never loses anything. The <b>Storage</b> button in
        the header shows exactly what is held where.
      </p>
    </div>
  );
}
