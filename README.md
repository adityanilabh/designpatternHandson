# Target Ladder

A 154-day interview-preparation plan and the tracker that runs it.
**JP Morgan / Amex / Expedia → Amazon / Microsoft / Adobe → Google / Uber.**

Open **`index.html`** in Chrome or Edge. No install, no server, no build step.
Set your start date to a **Monday** (Dashboard → Start date); the default is **2026-08-31**.

---

## What this is

Three files you read, one app you use.

| File | What it is |
|---|---|
| **`PLAN.md`** | The plan and its reasoning — the ladder, the 43/57 split, the interview calendar, phase exit criteria, and what to cut when you fall behind. |
| **`recognition-sheet.md`** | The full sheet in long form. 17 DSA sections, system design, LLD, tech — every pattern with its *disguise*, every question with what it teaches. |
| **`index.html`** | The tracker. The same content, checkable, with spaced repetition and per-company readiness. |
| `data.js` | All content, machine-readable. **Edit only this to change the plan.** |
| `app.js` · `styles.css` | State, persistence, rendering · styling (light/dark via `data-theme`). |

---

## Weekly Goal — the way to actually use this

Open the **Weekly Goal** tab and work one week at a time. Week N+1 stays **locked** until every core goal in week N is done, so there is no drifting between sections.

- **Core** — the spine: DSA, one system design session, LLD, tech, LP stories, mocks. Required to unlock the next week.
- **Addons** — pattern drills, blind prompts, templates, company packs. Optional per week, and finishing all of them finishes those sections outright.

The 22 weeks **partition the entire sheet** — all 1,194 trackable items appear in exactly one week each, verified by `test-weekly.js`. Finishing all 22 weeks is finishing the repo.

An **Unlock anyway** override exists so a week you cannot finish never traps you permanently. Use it deliberately, not habitually.

## For problems you have never seen

Every other section teaches machinery through **named** problems. Real rounds do not oblige — two Amazon LLD rounds in the wild were "mix songs from a DJ service and a recommendation service" and "handle audio buffers across stages at X frames per second." Neither is on any prep list.

**The Method** tab is the procedure for that case:

- **Altitude control** — the most common way to lose a design round, and one question in the first minute prevents it
- **Decomposition** — a mechanical 8-step (HLD) / 7-step (LLD) procedure from unknown prompt to known parts
- **22 primitives** — every system is an assembly of these, each with what it is *for* and when it is the **wrong** choice
- **A failure generator** — 11 questions you run over any system, so "what if the device is offline?" is something you raise, not something you were lucky to have prepared
- **The first three minutes** — what to do when you do not understand the question
- **Unknown domain** — translate it, do not learn it
- **Product thinking** — scored at Amazon, almost never prepared
- **A worked round**, beat by beat, on a real Alexa question
- **57 blind prompts with no solutions**, and a 20-point rubric

> The method is written down. The **fluency is not** — that comes from running unseen prompts under a clock, recorded, and scoring yourself. Ten of those beats the next fifty named problems.

## The one idea

> You read a question you have never seen, and within 60 seconds you say *"this is X wearing a costume."*

Not "I have solved this before" — that is memory, and it fails on twisted variants. **"I recognise the machinery"** — that is transfer, and it survives rewording.

So every section is organised in three blocks:

- **A · Patterns** — the machinery. Each row is *disguise → move*. The **disguise** column is what the interviewer actually says, and it is the whole point. Cover the right column, read a disguise, say the move. Under 5 seconds or it is not learned.
- **B · Tier 1–2** — JPM · Amex · Expedia · Amazon · Microsoft · Adobe.
- **C · Top tier** — Google / Uber for DSA. It means something different in every track (below).

**The rule:** never solve a question without first naming which row of block A it is. If you cannot name the row, you are pattern-matching on the problem statement rather than on the machinery.

---

## The ladder

| Phase | Days | Dates | Rung |
|---|---|---|---|
| **1 · Foundation + tech blitz** | 1–42 | 31 Aug → 11 Oct | JP Morgan · Amex · Expedia |
| **2 · Product-tier push** | 43–91 | 12 Oct → 29 Nov | Amazon · Microsoft · Adobe |
| **3 · Google tier** | 92–154 | 30 Nov → 31 Jan | Google · Uber |

Weekdays **2h DSA + 1h tech** · Saturday **4h system design** · Sunday **4h LLD**.
23 h/week × 22 weeks ≈ **506 hours**, split **43% DSA / 57% everything else**.

Going from 65% DSA to 43% did not cut DSA hours — it raised them from 195 to 220. The percentage fell because the denominator grew.

**Applying is work, and it is on the clock.** The Google application goes out in **week 13**, not week 22 — their pipeline is 8–12 weeks, which is longer than the preparation.

---

## The gradient inverts across tracks

The single most useful thing in here, and the reason a "hardest = Google" assumption misleads you:

| Track | Hardest at | So block C means |
|---|---|---|
| **DSA** | Google / Uber | The real hard tier. Large. |
| **LLD** | Amazon hybrid · Uber machine coding — *the middle* | Google does not do LLD at all. |
| **System design** | Uber · Apple · Amazon | **Google L4 has almost none** — SD carries zero weight for Google. |
| **Tech** | **JP Morgan · Amex — the bottom** | Google asks none of it. Block B is the heavy one. |

No single curve peaks in January. That is why the tech track is front-loaded into Phase 1 and the DSA hard tier is back-loaded into Phase 3.

---

## What is in it

| | Count |
|---|---|
| DSA sections | 17 |
| Pattern rows (individually drillable) | 176 |
| DSA questions — block B / block C | 283 / 218 |
| System design sessions | 22 |
| The Method — altitude, decomposition, primitives, failure generator | 192 rows |
| Blind prompts (no solutions) | 57 |
| Amazon LP — principles, probes, anti-patterns, story bank | 238 rows |
| Design patterns (intent, UML, runnable code, gotchas) | 13 |
| LLD problems (entities, code, concurrency, extensions, cross-Q) | 13 |
| LLD full worked solutions (statement, approach, UML, API, schema, code) | 4 of 13 |
| LLD code patterns | 33 |
| LLD rows total | 594 |
| Tech modules | 13 |
| Tech code patterns | 34 |
| Tech Q&A — *question → spine → **follow-up*** | 197 |
| Concurrency practice problems (LeetCode + classic implementations) | 28 |
| Recorded mocks | 16 |
| Templates | 29 |
| Companies with readiness weights | 10 |
| **Total trackable items** | **692** |

Weighting is deliberately uneven: Graphs, Trees and DP carry 150 of the 501 DSA questions. Hashing, Intervals and Trie are small on purpose.

---

## Tabs

- **Dashboard** — current phase, day counter, the split, the interview calendar, this phase's exit criteria
- **DSA** — 17 sections, blocks A/B/C, searchable across patterns and problems
- **System design** — the 6-step framework, requirement→block triggers, the six cross-question categories, 22 sessions
- **LLD** — a 13-pattern catalogue with class diagrams and runnable code; 13 problems each with entities, the concurrency races, "now add X" follow-ups and cross-questions; and an expandable **Full solution** per problem carrying the statement, requirements, approach, ASCII class diagram, public API, schema and complete code
- **Tech** — 13 modules with runnable code patterns; every Q&A row is question → answer spine → **the follow-up they will actually ask**
- **Amazon LP** — roughly half of Amazon's signal, treated as a workstream: how it is scored across the loop, STAR with Amazon's proportions, all 16 principles with the questions and the probes that follow, 10 anti-patterns, one fully annotated worked story, and a **15-slot story bank you fill in and rehearse**
- **Revision** — the spaced-repetition queue
- **Ladder** — recorded mocks, then readiness per company grouped by rung
- **Reference** — templates, every trigger table in one searchable index, blind hard pool
- **Log** — every item with trigger / technique / **root cause**
- **Strategy** — why the plan is shaped this way

---

## Links out

Every problem row carries two links:

- **`LC 121`** — opens the problem on LeetCode. Slugs are derived from the title, with 385 explicit overrides for the rows where derivation would 404 (bundled headings, shortened titles).
- **`GfG`** — opens a GeeksforGeeks search. GfG has **no problem numbers** and its slugs carry an opaque numeric suffix that cannot be derived, so these go through search, which always resolves. 113 problems have a curated GfG search term where GfG names it differently — LC 53 is "Kadane's Algorithm", LC 121 is "Stock buy and sell".

Every system design session and every tech module ends with a **Read more** list. Rows marked `search` are worth reading but have no stable URL, so they open a search instead of a dead link — 100 direct links, 24 search rows. The general primers live under **Reference → Reading list**.

> Links are unverified by machine. If one 404s, say so and it gets fixed.

## The revision tracker

Open any item → set **Status**: **Clean** (correct, in time, fully explainable) / **Ugly** (correct but slow or guessing) / **Failed**.

Ugly or failed auto-schedules four blank-file re-solves at **+1, +3, +7, +16 days**, surfaced in the Revision tab and the header's `due` counter.

*Three re-solves of one hard problem beats one solve each of three hard problems.* That rule is why this tracker exists, and it is the first thing people drop.

---

## Where your progress is saved

1. **Browser storage** (`localStorage`) — automatic, every click. One "clear browsing data" away from gone.
2. **Linked file on disk** — Chrome/Edge. **Storage → Link file**, pick a `.json`; every change is written automatically. Re-grant permission once per browser restart.
3. **Export / import** — manual JSON snapshot. Works everywhere.

**Set up layer 2 today, and export a dated backup every Sunday.** Progress JSON is gitignored — it is yours, it changes on every click, and it does not belong in history.

---

## Editing the plan

Edit **`data.js`** only.

Progress keys are content-addressed: `ds-<section>-<block>-<index>`, `pt-<section>-<index>`, `sd-<n>`, `ld-<block>-<index>`, `tq-<module>-<index>`, `mk-<index>`, `pk-<company>-<index>`.

**Appending to the end of any list is always safe.** Reordering within a list re-maps that list's progress — export first if you do.

When a question fits no row of block A, that is the most valuable moment in the sheet: **add a row.** Both `recognition-sheet.md` and the per-section notes field in the tracker exist to be written in.
