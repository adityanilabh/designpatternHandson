/* Regenerate PART II (system design) and PART IV (tech) of recognition-sheet.md
   from data.js, so the sheet and the tracker cannot drift.
   Run:  node gen-sheet.js                                                    */
var fs = require('fs');
var PLAN;
eval(fs.readFileSync('data.js', 'utf8'));

function cell(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|'); }

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
    w('---');
    w('');
  });
  return out.join('\n');
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
var md = fs.readFileSync('recognition-sheet.md', 'utf8');

function splice(text, startMarker, endMarker, replacement) {
  var a = text.indexOf(startMarker);
  var b = text.indexOf(endMarker);
  if (a < 0 || b < 0) { throw new Error('markers not found: ' + startMarker); }
  return text.slice(0, a) + replacement + text.slice(b);
}

md = splice(md, '# PART II — SYSTEM DESIGN', '# PART III — LLD', partTwo());
md = splice(md, '# PART IV — TECH', '# PART V — HOW THIS SHEET MAPS', partFour());
fs.writeFileSync('recognition-sheet.md', md, 'utf8');

console.log('regenerated from data.js:');
console.log('  Part II —', PLAN.sd.length, 'system design sessions');
console.log('  Part IV —', PLAN.tech.length, 'tech modules');
