/* ===== Target Ladder — plan data =====
   154 days / 22 weeks / 3 phases.  Section-major: the SECTION is the unit of
   content, the phases are the calendar.

   Compact row formats:
     pattern  = [name, disguise, move, cost]
     question = [lc, name, diff, note]      lc may be null for concept items
     qa       = [question, answerSpine, followUp]

   Progress keys are stable and content-addressed:
     DSA question   ds-<sectionId>-<block>-<index>     block = 'b' | 'c'
     pattern drill  pt-<sectionId>-<index>
     SD session     sd-<index>
     LLD problem    ld-<block>-<index>
     Tech Q&A       tq-<moduleId>-<index>
   Appending to the END of any list is always safe. */


/* Recomposes the full PLAN from the content modules. Import this only when
   you genuinely need everything (gen-sheet.js, the test suites, whole-sheet
   search). Routes should import the single module they render, so Next.js
   code-splits the content per route instead of shipping all of it. */
// @ts-nocheck
import meta from './meta';
import dsa from './dsa';
import sd from './sd';
import lld from './lld';
import tech from './tech';
import lp from './lp';
import method from './method';

const PLAN: any = Object.assign({}, meta, dsa, sd, lld, tech, lp, method);

export default PLAN;
export { default as meta } from './meta';
export { default as dsa } from './dsa';
export { default as sd } from './sd';
export { default as lld } from './lld';
export { default as tech } from './tech';
export { default as lp } from './lp';
export { default as method } from './method';
