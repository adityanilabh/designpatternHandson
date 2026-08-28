/* Regenerate PART II (system design) and PART IV (tech) of recognition-sheet.md
   from data.js, so the sheet and the tracker cannot drift.
   Run:  node gen-sheet.js                                                    */
var fs = require('fs');
var path = require('path');
/* Paths are resolved against this file, not the working directory, so the
   generator runs the same from the repo root or from anywhere else. */
var DATA = path.join(__dirname, 'legacy', 'data.js');
var SHEET = path.join(__dirname, 'recognition-sheet.md');
var PLAN;
eval(fs.readFileSync(DATA, 'utf8'));

function cell(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|'); }


/* ---- shared: emit a worked solution ---- */
function emitCode(w, title, lines, why) {
  if (title) { w('**' + title + '**'); w(''); }
  w('```java');
  lines.forEach(function (l) { w(l); });
  w('```');
  w('');
  if (why) { w('> ' + why); w(''); }
}
function emitAscii(w, lines, title) {
  if (!lines || !lines.length) return;
  if (title) { w('**' + title + '**'); w(''); }
  w('```');
  lines.forEach(function (l) { w(l); });
  w('```');
  w('');
}
function emitTable(w, heads, rows, boldFirst) {
  w('| ' + heads.join(' | ') + ' |');
  w('|' + heads.map(function () { return '---'; }).join('|') + '|');
  rows.forEach(function (r) {
    var cells = r.map(function (c, i) {
      return (boldFirst && i === 0) ? '**' + cell(c) + '**' : cell(c == null ? '—' : c);
    });
    w('| ' + cells.join(' | ') + ' |');
  });
  w('');
}
function emitList(w, title, items) {
  if (!items || !items.length) return;
  w('**' + title + '**');
  w('');
  items.forEach(function (i) { w('- ' + i); });
  w('');
}

/* ------------------------------------------------------- BEHAVIOURAL --- */
function behavioural(w) {
  var L = PLAN.lp, U = L.universal;

  w('## BEHAVIOURAL — CURATED COMPANIES LP');
  w('');
  w('Behavioural is not one round with one framework. Every company on this ladder scores it, ' +
    'each against its own named rubric, and the story that wins at Amazon is not shaped like the ' +
    'story that wins at Google. **The story bank is one bank** — ' + L.slots.length + ' stories, recut per room. ' +
    'That is the entire reason for putting the companies side by side.');
  w('');

  var totalValues = 0;
  L.co.forEach(function (c) { totalValues += c.values.length; });
  emitTable(w, ['Company', 'Rubric', 'Values', 'What it is worth'],
    L.co.map(function (c) { return [c.name, c.label, String(c.values.length), c.weight]; }), true);
  w('> ' + L.co.length + ' companies · ' + totalValues + ' individually drillable values and principles.');
  w('');

  /* the recut matrix - the highest-leverage page in the section */
  w('### THE RECUT MATRIX — same story, eleven rooms');
  w('');
  w(U.recut.intro);
  w('');
  emitTable(w, ['Room', 'Register', 'Add', 'Remove'], U.recut.rows, true);
  w('**One event, four rooms.** ' + U.recut.worked.intro);
  w('');
  U.recut.worked.rows.forEach(function (r) {
    w('- **' + r[0] + '** — ' + r[1]);
  });
  w('');

  /* the ten shapes */
  w('### THE TEN SHAPES — what to write, and what it covers');
  w('');
  w(U.coverage.intro);
  w('');
  emitTable(w, ['Story shape', 'Covers', 'Note'], U.coverage.shapes, true);
  w('> ' + U.coverage.rule);
  w('');

  /* per company */
  L.co.forEach(function (c) {
    w('---');
    w('');
    w('### ' + c.name.toUpperCase() + ' · ' + c.label);
    w('');
    w('**' + c.rung + '.** ' + c.oneLine);
    w('');
    w('**What it is worth.** ' + c.weight);
    w('');

    w('**Where behaviour is scored**');
    w('');
    emitTable(w, ['Round', 'Time', 'What happens'], c.scoring.rounds, true);
    emitTable(w, ['What they are scoring', 'Why it matters'], c.scoring.rubric, true);
    emitList(w, 'Things nobody tells you', c.scoring.reality);

    w('**The story format they want**');
    w('');
    emitTable(w, ['Part', 'Budget', 'What goes in it'], c.framework.parts, true);
    emitList(w, 'Rules for this room', c.framework.rules);
    w('> **Timing.** ' + c.framework.timing);
    w('');

    w('**The follow-up probes**');
    w('');
    c.probes.groups.forEach(function (g) {
      w('*' + g[0] + '*');
      w('');
      g[1].forEach(function (q) { w('- ' + q); });
      w('');
    });
    emitTable(w, ['Situation', 'What to do'], c.probes.tactics, true);

    w('**Anti-patterns — ' + c.anti.length + ' ways to lose this room**');
    w('');
    c.anti.forEach(function (a, i) {
      w((i + 1) + '. **' + a[0] + '** — ' + a[1]);
      w('   *' + a[2] + '*');
    });
    w('');

    w('**' + c.label + '**');
    w('');
    emitTable(w, ['#', 'Value', 'Freq', 'What it means', 'Strong', 'Weak'],
      c.values.map(function (v) { return [String(v.n), v.name, v.freq, v.means, v.strong, v.weak]; }));

    w('<details><summary><b>Every value in full — how it is asked, the probes, your angle</b></summary>');
    w('');
    c.values.forEach(function (v) {
      w('#### ' + c.name + ' · ' + v.n + '. ' + v.name + '  *(' + v.freq + ' frequency)*');
      w('');
      w('> *How ' + c.name + ' words it:* ' + v.official);
      w('');
      w('**Means.** ' + v.means);
      w('');
      w('**What they are testing.** ' + v.signal);
      w('');
      emitList(w, 'How it is asked', v.asked);
      emitList(w, 'The probes that follow', v.probes);
      w('**Strong.** ' + v.strong);
      w('');
      w('**Weak.** ' + v.weak);
      w('');
      w('**Pairs with.** ' + v.pairs);
      w('');
      if (v.yourAngle) { w('**Your angle.** ' + v.yourAngle); w(''); }
    });
    w('</details>');
    w('');

    w('<details><summary><b>A worked story, annotated, with the probes answered</b></summary>');
    w('');
    w('**Question.** ' + c.worked.question);
    w('');
    w('**Scoring against.** ' + c.worked.principle);
    w('');
    c.worked.story.forEach(function (s) {
      w('**' + s[0] + '**');
      w('');
      w('> ' + s[1]);
      w('');
      w('*Why it is shaped this way:* ' + s[2]);
      w('');
    });
    w('**The probes, and how they are answered**');
    w('');
    c.worked.probesAndAnswers.forEach(function (r) {
      w('- **' + r[0] + '** — ' + r[1]);
    });
    w('');
    w('**Why this one works here.** ' + c.worked.why);
    w('');
    w('</details>');
    w('');

    w('**The schedule for this room**');
    w('');
    emitTable(w, ['When', 'What', 'Note'], c.prep);

    w('**How this room differs.** ' + c.contrast);
    w('');
    w('> *Source and confidence.* ' + c.source);
    w('');
  });

  /* shared */
  w('---');
  w('');
  w('### EVERY LOOP ASKS THESE');
  w('');
  w(U.openers.intro);
  w('');
  U.openers.rows.forEach(function (r) {
    w('**' + r[0] + '** — ' + r[1]);
    w('');
    w('> ' + r[2]);
    w('');
  });
  w('**Questions worth asking.** ' + U.openers.questions.intro);
  w('');
  emitTable(w, ['Ask', 'What it tells you'], U.openers.questions.rows, true);

  w('### THE RECRUITER SCREEN');
  w('');
  w(U.screen.intro);
  w('');
  emitTable(w, ['', 'What to do'], U.screen.rows, true);

  w('### OFFERS AND NEGOTIATION');
  w('');
  w(U.offer.intro);
  w('');
  emitTable(w, ['', 'What to do'], U.offer.rows, true);

  w('### THE STORY BANK');
  w('');
  w(L.slots.length + ' slots, shared by all ' + L.co.length + ' companies. Two per Sunday from week 2. ' +
    'Each one needs real numbers and answers to the probes — then recut per room using the matrix above.');
  w('');
  L.slots.forEach(function (r, i) {
    w((i + 1) + '. **' + r[0] + '** — ' + r[1] + (r[2] ? '. ' + r[2] : ''));
  });
  w('');
  emitTable(w, ['Source', 'What is in there'], L.mining, true);
  emitTable(w, ['When', 'What', 'Note'], L.plan);
}

/* -------------------------------------------------------------- PART I --- */
function partOne() {
  var out = [];
  function w(s) { out.push(s == null ? '' : s); }

  var totalP = 0, totalB = 0, totalC = 0;
  PLAN.sections.forEach(function (s) { totalP += s.p.length; totalB += s.b.length; totalC += s.c.length; });

  w('# PART I — DSA');
  w('');
  w('Seventeen sections, ' + totalP + ' pattern rows, ' + (totalB + totalC) + ' questions. Weight is deliberately ' +
    'uneven — Arrays, Strings, Trees, Graphs and DP carry the plan; Bit/Math and Design are small on purpose.');
  w('');
  w('Each section has four parts. **Derive** is the reasoning chain from an unseen statement to the right row of ' +
    'block A. **A · Patterns** is the machinery, read as *disguise → move*. **B** is the tier 1–2 set and **C** the ' +
    'Google/Uber hard tier — and every question in both carries the actual approach and its cost, so a section you ' +
    'are weak at does not just point you at LeetCode.');
  w('');
  w('> In the tracker the approach sits behind a click, so it cannot spoil a problem you are about to solve. ' +
    'Here it is inline — read the sheet as reference, solve from the tracker.');
  w('');
  w('---');
  w('');

  /* the correctness arguments, once, up front - they apply to every section */
  w('## §0 · WHY IT IS CORRECT — the argument shapes');
  w('');
  w(PLAN.proof.intro);
  w('');
  w('> ' + PLAN.proof.note);
  w('');
  PLAN.proof.rows.forEach(function (r) {
    w('**' + r[0] + '** — ' + r[1]);
    w('');
    w('> *Say it like this:* ' + r[2]);
    w('');
    w('*Where:* ' + r[3]);
    w('');
  });
  w('**The drill.** ' + PLAN.proof.drill);
  w('');
  w('---');
  w('');

  PLAN.sections.forEach(function (s) {
    w('## §' + s.n + ' · ' + s.name.toUpperCase() + (s.sub ? ' — ' + s.sub : ''));
    w('');
    if (PLAN.derive[s.id]) {
      w('**Derive it.** ' + PLAN.derive[s.id]);
      w('');
    }

    w('### A · Patterns');
    w('');
    emitTable(w, ['Pattern', 'The disguise — what you actually hear', 'The move', 'Cost'], s.p, true);

    var tbl = (PLAN.approach || {})[s.id] || {};

    w('### B · Tier 1–2  *(' + s.b.length + ')*');
    w('');
    emitTable(w, ['LC', 'Name', 'D', 'The thing it teaches', 'The approach, and what it costs'],
      s.b.map(function (r) {
        return [String(r[0]), '**' + cell(r[1]) + '**', r[2], r[3] || '—', tbl[String(r[0])] || '—'];
      }));

    w('### C · Google / Uber L4  *(' + s.c.length + ')*');
    w('');
    if (s.cx) { w('**Extra machinery.** ' + s.cx); w(''); }
    emitTable(w, ['LC', 'Name', 'D', 'Why it is here', 'The approach, and what it costs'],
      s.c.map(function (r) {
        return [String(r[0]), '**' + cell(r[1]) + '**', r[2], r[3] || '—', tbl[String(r[0])] || '—'];
      }));

    w('---');
    w('');
  });

  return out.join('\n');
}

/* ------------------------------------------------------------- PART II --- */
function partTwo() {
  var out = [];
  function w(s) { out.push(s == null ? '' : s); }

  w('# PART II — SYSTEM DESIGN');
  w('');
  w('**The recognition goal here is different.** In DSA you recognise *which algorithm*. In system design you recognise **which requirement implies which building block** — and then you survive the cross-question. Nobody fails an SD round for not knowing what a CDN is. They fail it on the follow-up.');
  w('');
  w('**Tier note:** the gradient does **not** run to Google. Google L4 has little or no system design. The heavy SD rounds are **JP Morgan, Amex, Expedia, Amazon and Uber** — so Block B here is the big one, and Block C means "Uber / Apple / Amazon-senior depth", not "Google".');
  w('');
  w('Each session carries the **actual prompts**, what to clarify, the numbers, the decision points **with a verdict**, and **the specific cross-questions with their answers**.');
  w('');
  w('---');
  w('');
  w('## §18 · THE FRAMEWORK — memorise this, use it every single time');
  w('');
  w('| Step | Minutes | What you actually do |');
  w('|---|---|---|');
  PLAN.sdFramework.forEach(function (r) {
    w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' | ' + cell(r[2]) + ' |');
  });
  w('');
  w('**Numbers to have memorised:** ' + cell(PLAN.sdNumbers) + '.');
  w('');
  w('---');
  w('');
  w('## §19 · REQUIREMENT → BUILDING BLOCK');
  w('');
  w('This is the SD equivalent of the DSA pattern table. **Drill it the same way.**');
  w('');
  w('| You hear | Reach for | The cross-question that follows |');
  w('|---|---|---|');
  PLAN.sdTriggers.forEach(function (r) {
    w('| ' + cell(r[0]) + ' | **' + cell(r[1]) + '** | ' + cell(r[2]) + ' |');
  });
  w('');
  w('### The six cross-question categories');
  w('');
  w('Every design must survive all six. Write the answers; do not just think them.');
  w('');
  w('| Category | Shape | Examples |');
  w('|---|---|---|');
  PLAN.sdCross.forEach(function (r) {
    w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' | ' + cell(r[2]) + ' |');
  });
  w('');
  w('---');
  w('');

  var lastTier = null;
  PLAN.sd.forEach(function (s) {
    if (s.tier !== lastTier) {
      lastTier = s.tier;
      w('## ' + (s.tier === 'b'
        ? 'BLOCK B · TIER 1–2 — JPM · Amex · Expedia · Amazon · Microsoft · Adobe'
        : 'BLOCK C · TOP TIER — Uber · Apple · Amazon-senior'));
      w('');
    }
    w('### SD ' + s.n + ' · ' + s.t + '  *(week ' + s.wk + ')*');
    w('');
    if (s.who) w('**Who asks it.** ' + s.who + '  ');
    if (s.anchor) w('**Case-study anchor.** ' + s.anchor);
    w('');
    w('**Asked as:**');
    w('');
    s.asked.forEach(function (a) { w('- ' + a); });
    w('');
    if (s.clarify && s.clarify.length) {
      w('**Clarify in the first three minutes:**');
      w('');
      s.clarify.forEach(function (a) { w('- ' + a); });
      w('');
    }
    if (s.scale) { w('**Back of the envelope.** ' + s.scale); w(''); }
    if (s.terms && s.terms.length) {
      w('**Terms you must own**');
      w('');
      w('| Term | In one sentence |');
      w('|---|---|');
      s.terms.forEach(function (r) { w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' |'); });
      w('');
    }
    if (s.decisions && s.decisions.length) {
      w('**Decision points**');
      w('');
      w('| Decision | Options | Verdict, and why |');
      w('|---|---|---|');
      s.decisions.forEach(function (r) {
        w('| **' + cell(r[0]) + '** | ' + cell(r[1] || '—') + ' | ' + cell(r[2]) + ' |');
      });
      w('');
    }
    if (s.cross && s.cross.length) {
      w('**Cross-questions** — cover the right column and say it out loud');
      w('');
      w('| They ask | The answer\'s spine |');
      w('|---|---|');
      s.cross.forEach(function (r) { w('| ' + cell(r[0]) + ' | ' + cell(r[1]) + ' |'); });
      w('');
    }
    if (s.fail && s.fail.length) {
      w('**What sinks candidates here:**');
      w('');
      s.fail.forEach(function (a) { w('- ' + a); });
      w('');
    }

    var sol = (PLAN.sdSolution || {})[s.n];
    if (sol) {
      w('#### Worked solution');
      w('');
      emitList(w, 'Functional requirements', sol.req.functional);
      emitList(w, 'Non-functional requirements', sol.req.nonFunctional);
      w('**Estimation**'); w('');
      emitTable(w, ['Quantity', 'Working', 'Result'], sol.estimate, true);
      w('**API**'); w('');
      emitTable(w, ['Endpoint', 'Request', 'Response', 'Note'], sol.api, false);
      w('**Data model**'); w('');
      emitTable(w, ['Table', 'Columns', 'Why'], sol.dataModel, true);
      emitAscii(w, sol.arch, 'Architecture');
      sol.flows.forEach(function (f) { emitList(w, f[0], f[1]); });
      w('**Deep dive**'); w('');
      sol.deepDive.forEach(function (d) {
        w('*' + d[0] + '*'); w('');
        String(d[1]).split('\n\n').forEach(function (para) { w(para); w(''); });
      });
      w('**Scaling**'); w('');
      emitTable(w, ['Bottleneck', 'What you do'], sol.scaling, true);
      w('**Trade-offs**'); w('');
      emitTable(w, ['Decision', 'Chose', 'Over', 'Because'], sol.tradeoffs, true);
      w('**What each company pushes on**'); w('');
      emitTable(w, ['Company', 'What they push on'], sol.angle, true);
    }

    w('---');
    w('');
  });
  return out.join('\n');
}

/* ------------------------------------------------------------- PART III --- */
function partThree() {
  var out = [];
  function w(s) { out.push(s == null ? '' : s); }
  var code = 0, cross = 0;
  PLAN.lldProblems.forEach(function (p) { code += (p.code || []).length; cross += p.cross.length; });

  w('# PART III — LLD / OOD / MACHINE CODING');
  w('');
  w('**Three different rounds wear this name**, and confusing them is how people lose it before writing a line.');
  w('');
  w('| Flavour | Who | Format | What scores |');
  w('|---|---|---|---|');
  PLAN.lldFlavours.forEach(function (r) {
    w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' | ' + cell(r[2]) + ' | ' + cell(r[3]) + ' |');
  });
  w('');
  w('**' + PLAN.lldProblems.length + ' problems · ' + code + ' code patterns · ' + cross + ' cross-questions.**');
  w('');
  w('---');
  w('');
  w('## THE 60-MINUTE SCRIPT');
  w('');
  w('| Clock | Phase | What you actually do |');
  w('|---|---|---|');
  PLAN.lldScript.forEach(function (r) {
    w('| ' + cell(r[0]) + ' | **' + cell(r[1]) + '** | ' + cell(r[2]) + ' |');
  });
  w('');
  w('## REQUIREMENT → PATTERN');
  w('');
  w('| You hear | Reach for | Where it shows up |');
  w('|---|---|---|');
  PLAN.lldPatterns.forEach(function (r) {
    w('| ' + cell(r[0]) + ' | **' + cell(r[1]) + '** | ' + cell(r[2]) + ' |');
  });
  w('');
  w('## SOLID AS REFACTORS');
  w('');
  PLAN.lldSolid.forEach(function (r) {
    w('### ' + r[0] + ' · ' + r[1]);
    w('');
    w(r[2]);
    w('');
    w('```java');
    r[3].forEach(function (l) { w(l); });
    w('```');
    w('');
  });
  w('## CONCURRENCY IN LLD');
  w('');
  w('The single biggest separator at Amazon. Raise the race before they ask.');
  w('');
  w('| The race | How you close it |');
  w('|---|---|');
  PLAN.lldConcurrency.forEach(function (r) { w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' |'); });
  w('');
  w('## CLASS DESIGN CHECKLIST');
  w('');
  w('| Check | Why |');
  w('|---|---|');
  PLAN.lldChecklist.forEach(function (r) { w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' |'); });
  w('');
  w('## MACHINE-CODING RULES');
  w('');
  PLAN.lldRules.forEach(function (r, i) { w((i + 1) + '. ' + r); });
  w('');
  w('---');
  w('');

  var lastTier = null;
  PLAN.lldProblems.forEach(function (p) {
    if (p.tier !== lastTier) {
      lastTier = p.tier;
      w('## ' + (p.tier === 'b'
        ? 'BLOCK B · TIER 1–2 — Amazon · Adobe · Microsoft · JPM'
        : 'BLOCK C · TOP TIER — Amazon hybrid · Uber / Flipkart machine coding'));
      w('');
    }
    w('### ' + p.name + '  *(' + p.flavour + ', ' + p.mins + ' min)*');
    w('');
    w('**Who asks it.** ' + p.who);
    w('');
    w('**Asked as:**');
    w('');
    p.asked.forEach(function (a) { w('- ' + a); });
    w('');
    w('**Clarify before you draw anything:**');
    w('');
    p.clarify.forEach(function (a) { w('- ' + a); });
    w('');
    w('**Entities**');
    w('');
    w('| Class | Kind | Role |');
    w('|---|---|---|');
    p.entities.forEach(function (r) { w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' | ' + cell(r[2]) + ' |'); });
    w('');
    w('**Patterns, and exactly where**');
    w('');
    w('| Pattern | Applied to |');
    w('|---|---|');
    p.patterns.forEach(function (r) { w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' |'); });
    w('');
    (p.code || []).forEach(function (c) {
      w('**' + c[0] + '**');
      w('');
      w('```java');
      c[1].forEach(function (l) { w(l); });
      w('```');
      w('');
      if (c[2]) { w('> ' + c[2]); w(''); }
    });
    if (p.concurrency && p.concurrency.length) {
      w('**Concurrency** — raise these before you are asked');
      w('');
      w('| The race | How you close it |');
      w('|---|---|');
      p.concurrency.forEach(function (r) { w('| ' + cell(r[0]) + ' | ' + cell(r[1]) + ' |'); });
      w('');
    }
    if (p.extend && p.extend.length) {
      w('**"Now add X"** — the highest-scoring thirty seconds');
      w('');
      w('| They ask for | You answer |');
      w('|---|---|');
      p.extend.forEach(function (r) { w('| ' + cell(r[0]) + ' | ' + cell(r[1]) + ' |'); });
      w('');
    }
    w('**Cross-questions**');
    w('');
    w('| They ask | The answer spine |');
    w('|---|---|');
    p.cross.forEach(function (r) { w('| ' + cell(r[0]) + ' | ' + cell(r[1]) + ' |'); });
    w('');
    w('**What sinks candidates here:**');
    w('');
    p.fail.forEach(function (a) { w('- ' + a); });
    w('');

    var sol = (PLAN.lldSolution || {})[p.id];
    if (sol) {
      w('#### Worked solution');
      w('');
      w(sol.statement);
      w('');
      emitList(w, 'Functional requirements', sol.req.functional);
      emitList(w, 'Non-functional requirements', sol.req.nonFunctional);
      w('**How to approach it**'); w('');
      emitTable(w, ['Step', 'What you do'], sol.approach, true);
      emitAscii(w, sol.uml, 'Class diagram');
      w('**Public API**'); w('');
      emitTable(w, ['Signature', 'Contract'], sol.api, false);
      if (sol.schema && sol.schema.length) {
        w('**Schema**'); w('');
        emitTable(w, ['Table', 'Columns', 'Note'], sol.schema, true);
      }
      w('**The solution**'); w('');
      sol.solution.forEach(function (c) { emitCode(w, c[0], c[1], c[2]); });
    }

    w('---');
    w('');
  });

  behavioural(w);
  return out.join(String.fromCharCode(10));
}

/* -------------------------------------------------------------- PART IV --- */
function partFour() {
  var out = [];
  function w(s) { out.push(s == null ? '' : s); }
  var hrs = 0, qa = 0, code = 0;
  PLAN.tech.forEach(function (m) {
    hrs += m.hrs; qa += m.qa.length; code += (m.code || []).length;
  });

  w('# PART IV — TECH (Java · Spring · Postgres · Kafka · K8s · microservices)');
  w('');
  w('**The gradient inverts here.** The deepest tech questioning is at the **bottom** of your ladder — JP Morgan and Amex will go far deeper on `@Transactional`, thread pools and index plans than Google ever will. Google asks none of it. So Block B is the heavy one, and this whole track is front-loaded into Phase 1.');
  w('');
  w('**' + PLAN.tech.length + ' modules · ~' + hrs + ' hours · ' + code + ' code patterns · ' + qa + ' Q&A rows.**');
  w('');
  w('Every Q&A row is **question → the answer\'s spine → the follow-up they will actually ask.** Learn the follow-up; anyone can answer the first question.');
  w('');
  w('---');
  w('');

  PLAN.tech.forEach(function (m) {
    w('## §' + (21 + m.n) + ' · MODULE ' + m.n + ' — ' + m.name + '  *(phase ' + m.phase + ', ' + m.hrs + 'h)*');
    w('');
    if (m.note) { w('> ' + m.note); w(''); }
    if (m.asked && m.asked.length) {
      w('**How the interview opens:**');
      w('');
      m.asked.forEach(function (a) { w('- ' + a); });
      w('');
    }
    if (m.code && m.code.length) {
      w('### Patterns you must be able to write');
      w('');
      m.code.forEach(function (c) {
        w('**' + c[0] + '**');
        w('');
        w('```java');
        c[1].forEach(function (line) { w(line); });
        w('```');
        w('');
        if (c[2]) { w('> ' + c[2]); w(''); }
      });
    }
    w('### Question → spine → follow-up');
    w('');
    w('| Question | The answer\'s spine | The follow-up |');
    w('|---|---|---|');
    m.qa.forEach(function (r) {
      w('| **' + cell(r[0]) + '** | ' + cell(r[1]) + ' | ' + cell(r[2]) + ' |');
    });
    w('');
    if (m.traps && m.traps.length) {
      w('**Traps that bite:**');
      w('');
      m.traps.forEach(function (t) { w('- ' + t); });
      w('');
    }
    w('---');
    w('');
  });

  w('## TECH TRIGGERS');
  w('');
  w('Drill this the way you drill the DSA pattern tables.');
  w('');
  w('| You hear | Reach for |');
  w('|---|---|');
  PLAN.techTriggers.forEach(function (r) {
    w('| ' + cell(r[0]) + ' | **' + cell(r[1]) + '** |');
  });
  w('');
  return out.join('\n');
}

/* --------------------------------------------------------------- splice --- */
var md = fs.readFileSync(SHEET, 'utf8');

function splice(text, startMarker, endMarker, replacement) {
  var a = text.indexOf(startMarker);
  var b = text.indexOf(endMarker);
  if (a < 0 || b < 0) { throw new Error('markers not found: ' + startMarker); }
  return text.slice(0, a) + replacement + text.slice(b);
}

md = splice(md, '# PART I — DSA', '# PART II — SYSTEM DESIGN', partOne());
md = splice(md, '# PART II — SYSTEM DESIGN', '# PART III — LLD', partTwo());
md = splice(md, '# PART III — LLD', '# PART IV — TECH', partThree());
md = splice(md, '# PART IV — TECH', '# PART V — HOW THIS SHEET MAPS', partFour());
fs.writeFileSync(SHEET, md, 'utf8');

console.log('regenerated from data.js:');
console.log('  Part I   —', PLAN.sections.length, 'DSA sections');
console.log('  Part II —', PLAN.sd.length, 'system design sessions');
console.log('  Part III —', PLAN.lldProblems.length, 'LLD problems');
console.log('  Part IV —', PLAN.tech.length, 'tech modules');
