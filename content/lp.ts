/* Behavioural — 11 companies, values, story bank
   Moved VERBATIM from legacy/data.js — this file is content, not code.
   Edit this to change the plan; gen-sheet.js regenerates the markdown sheet
   from it, so the sheet cannot drift.

   Progress keys are content-addressed, so APPENDING to any list is safe;
   reordering within a list remaps that list's saved progress. */
/* eslint-disable */
// @ts-nocheck

const PLAN: any = {};

PLAN.lp = {};


PLAN.lp.scoring = {
  intro:'LP is not a soft round you turn up to. It is a structured, rubric-scored evaluation running through the entire loop, and it carries roughly half the decision.',
  rounds:[
   ['Every technical round','15–20 min at the end','Your coding interviewer also scores LP. They will ask one or two behavioural questions after the problem, and they write them up against named principles.'],
   ['The dedicated behavioural round','45–60 min','Usually 3–5 stories, each with 4–8 follow-up probes. This is where depth is tested.'],
   ['The bar-raiser','45–60 min','A trained interviewer from OUTSIDE the hiring team, with veto power. They are not measuring you against this team — they are measuring whether you raise the bar for Amazon overall. Often the hardest LP probing of the loop.'],
   ['Debrief','after','Every interviewer submits written notes tagged to principles. Gaps are visible: if nobody scored you on Dive Deep, that is itself a problem.']
  ],
  rubric:[
   ['What they write down','Interviewers take near-verbatim notes as you speak. Vague answers produce vague notes, and vague notes do not get you hired.'],
   ['They score the ACTION','Not the outcome, not the team. What did YOU do, decide, and change?'],
   ['They probe for depth','The story is the setup. The follow-ups are the test. A polished story with thin follow-ups reads as rehearsed rather than lived.'],
   ['They look for data','"It got much faster" is a claim. "p99 went from 3.2s to 380ms" is evidence. Amazon is a metrics culture and this is scored.'],
   ['They look for failure','A candidate with no failure stories is either inexperienced or not self-aware. Both are rejections.'],
   ['Coverage matters','You are scored against specific principles. If you tell four Deliver Results stories, you have one data point across four rounds.']
  ],
  reality:[
   'The bar-raiser can reject you when every coding round passed. This happens constantly.',
   'You will be interrupted mid-story. That is not rudeness — they are steering toward the part they need to score.',
   'Two hours of stories from a 45-minute round means you told too few, too long. Aim for a 2-minute story plus 6 minutes of probing.',
   'They can tell a fabricated story within three follow-ups, because invented detail does not survive "what exactly did you say to them?"'
  ]
};


PLAN.lp.star = {
  intro:'STAR is the format. Amazon uses it with very specific proportions, and most candidates get the balance backwards — long setup, thin action.',
  parts:[
   ['S — Situation','15 sec · ~10%','Context only. Company, team, what the system did, what was wrong. Two or three sentences. If you are still describing the architecture at 60 seconds, you have lost them.'],
   ['T — Task','15 sec · ~10%','YOUR specific responsibility. Not the team goal — the part you owned. "I was asked to…" or "I decided to…".'],
   ['A — Action','60–75 sec · ~60%','THE BULK. What you did, in first person, in sequence. Decisions you made, alternatives you rejected and why, who you convinced, what you built. This is the only part that gets scored properly.'],
   ['R — Result','20 sec · ~15%','Quantified. Latency, cost, revenue, incident count, hours saved, users affected. If you genuinely cannot measure it, say what you observed and be explicit that it was not measured.'],
   ['L — Learning','10 sec · ~5%','Not formally in STAR, but Amazon expects it. What you would do differently. Volunteering this pre-empts the most common follow-up.']
  ],
  rules:[
   'Say "I", not "we". Amazon scores your actions. If a story genuinely was a team effort, say what YOUR part was inside it.',
   'Present tense for the situation, past tense for actions. It keeps the narration crisp.',
   'One story, one primary principle. Know which one you are answering before you start talking.',
   'Have the numbers ready before the interview. Digging for them mid-story kills the pace.',
   'Practise the 2-minute version AND the 30-second version. Sometimes they only want the headline.',
   'Never read from notes. Rehearsed-but-natural is the target; recited is worse than rough.'
  ],
  timing:'Target: 2 minutes for the story, then 5–8 minutes of follow-ups. If you talk for five minutes uninterrupted, the interviewer has no time to probe, and un-probed stories score low because they cannot be verified.'
};


PLAN.lp.probes = {
  intro:'The story is the setup. These are the test. Prepare answers to every one of these for every story you own — the follow-ups are where fabricated stories fall apart and real ones earn their score.',
  groups:[
   ['On your specific contribution',[
     'What exactly was YOUR part in this?',
     'Who else was involved, and what did they do?',
     'What would have happened if you had not been there?',
     'Was this your idea, or were you assigned it?'
   ]],
   ['On the decision',[
     'What alternatives did you consider?',
     'Why did you reject the other options?',
     'What data did you have at the time?',
     'What did you get wrong in your initial assessment?',
     'Who disagreed with you, and how did you handle it?'
   ]],
   ['On depth (this is Dive Deep, and it is where people fail)',[
     'Walk me through how it actually worked, technically.',
     'How did you know that was the root cause and not a symptom?',
     'What did the metric look like before and after?',
     'How did you measure that?',
     'What was the hardest bug, and how did you find it?'
   ]],
   ['On difficulty and failure',[
     'What was the hardest part?',
     'What went wrong?',
     'What would you do differently?',
     'What did you learn?',
     'If you had twice the time, what would you have changed?'
   ]],
   ['On impact',[
     'How do you know it worked?',
     'What was the business impact?',
     'Did it hold up over time?',
     'What did it cost — in effort, in money, in complexity?'
   ]],
   ['On people',[
     'How did you convince them?',
     'What did they say?',
     'What happened to the relationship afterwards?',
     'How did you handle it when someone pushed back?'
   ]]
  ],
  tactics:[
   ['When you do not know a number','Say so, then give the shape: "I do not have the exact figure, but it was roughly a 5x improvement and we stopped getting paged." Guessing precisely is worse than being honest about approximation.'],
   ['When you are interrupted','Stop and answer. Do not finish your sentence first. They are steering toward what they need to score.'],
   ['When the probe goes deeper than your story','Go with it. This is what Dive Deep looks like — you are being invited to demonstrate real understanding. Never bluff; they will keep going.'],
   ['When you genuinely did not do the thing','Say so and reframe: "I was not the one who built that, but I did X." Claiming someone else\'s work is the fastest rejection there is.'],
   ['When they ask for a second example','Have one. "Give me another time you did this" is standard, and having only one story per principle shows.']
  ]
};


PLAN.lp.antipatterns = [
 ['Saying "we" throughout','The single most common failure. Amazon scores individual actions. Record yourself and count — most people say "we" 20+ times in a two-minute story without noticing.',
  'FIX: rewrite every story in first person, then rehearse it. Where the work truly was collective, say "the team decided X; I owned Y and did Z."'],
 ['No numbers','"It improved performance a lot" is unverifiable and scores as a claim, not a result.',
  'FIX: dig out the real figures now, before the interview. Latency, error rate, throughput, cost, hours, incident count, number of users. Any real number beats an adjective.'],
 ['A 6-minute story','You have crowded out the follow-ups, and un-probed stories score low because they cannot be verified.',
  'FIX: time yourself. Two minutes. Cut the architecture description first — it is almost always the bloat.'],
 ['No failure stories','A candidate who has never failed is either junior or not self-aware. Both are rejections, and "biggest failure" is asked in most loops.',
  'FIX: prepare two genuine failures with real consequences, and what changed in your behaviour afterwards. Not "I worked too hard."'],
 ['A fake failure','"My weakness is that I care too much" is transparent and actively damaging — it reads as evasion.',
  'FIX: pick something that actually cost the business, that you actually caused, and that you actually fixed your process over.'],
 ['One story reused for everything','Interviewers compare notes at debrief. The same story in three rounds is visible and reads as thin experience.',
  'FIX: build the coverage matrix. 12–15 distinct stories mapped across the principles.'],
 ['Blaming others','"The other team gave us bad requirements" reads as lack of ownership, which is the LP they care most about.',
  'FIX: even when it was genuinely someone else\'s fault, the story is about what YOU did about it.'],
 ['Only success stories with tidy endings','Real engineering is messy. Perfect arcs read as fabricated.',
  'FIX: include the part that went badly, the thing you missed, the pushback you got.'],
 ['Reciting','A word-perfect story delivered at speed sounds memorised, and memorised sounds untrue.',
  'FIX: rehearse the STRUCTURE and the numbers, not the sentences. Different words each time is a good sign.'],
 ['Answering a different principle','Being asked about Have Backbone and telling a Deliver Results story means the interviewer has nothing to score.',
  'FIX: before you speak, name the principle to yourself. If you are unsure what they are asking for, ask them to clarify — that is allowed and reads well.']
];


PLAN.lp.worked = {
 question:'Tell me about a time you took ownership of something outside your remit.',
 principle:'Ownership (primary) · Dive Deep and Bias for Action (secondary)',
 story:[
  ['S — Situation (18 sec)',
   'Our backend runs as a monolith on Kubernetes, and we started getting paged two or three nights a week for pods restarting under load. It was logged as an infra issue and sat with the platform team for about three weeks with no progress.',
   'Short. Enough context to follow, no architecture tour. Note the concrete pain — "two or three nights a week" is already a number.'],
  ['T — Task (12 sec)',
   'It was not my service and not my team, but I was on the on-call rota being woken up by it, so I decided to find the actual cause rather than keep acknowledging alerts.',
   'This is the Ownership hook: explicitly outside the remit, explicitly a decision to act. "I decided" not "I was asked."'],
  ['A — Action (75 sec)',
   'I started with the pod events rather than the application logs, and saw exit code 137 — OOMKilled, not a crash. The container limit was 1GB and the JVM had no heap configuration, so it was sizing the heap from the node\'s memory, about 16GB, and blowing past the container limit. ' +
   'I reproduced it locally by running the image with a 1GB constraint and driving load at it. ' +
   'Two options: raise the limit, which was the fast fix everyone wanted, or make the JVM container-aware, which meant a config change plus a rollout. I pushed for the second because raising the limit would have masked it until the next traffic increase. ' +
   'I set MaxRAMPercentage to 75 and accounted for metaspace and thread stacks on top of heap. ' +
   'The platform lead pushed back — he thought it was a genuine leak. I took a heap dump under load and showed him the dominator tree: it was steady-state, no leak. He agreed and we shipped it. ' +
   'I also added a Grafana panel for container memory versus JVM heap, because nobody could see the gap.',
   'This is 60% of the runtime and it is all first-person decisions. Notice: a rejected alternative WITH the reason, a named disagreement and how it was resolved, and evidence rather than assertion. The heap dump is the Dive Deep moment.'],
  ['R — Result (20 sec)',
   'Restarts went from roughly 15 a week to zero, and they stayed at zero through the next quarter including a traffic increase. We stopped being paged for it entirely. The dashboard later caught the same class of problem in a different service before it caused an incident.',
   'Numbers, durability ("stayed at zero"), and a second-order impact. The last sentence quietly demonstrates broader value.'],
  ['L — Learning (12 sec)',
   'What I would do differently is escalate sooner. I sat with three weeks of bad sleep before deciding it was mine to fix. Now when something wakes me twice, I either own it or get it explicitly owned by someone else that week.',
   'A real, specific behaviour change. This pre-empts "what would you do differently?" and it is not a humblebrag.']
 ],
 probesAndAnswers:[
  ['How did you know it was OOMKilled and not an application crash?','Exit code 137 in kubectl describe, and the kernel OOM message in the node events. An application exception would exit 1 and leave a stack trace in the logs — there was none.'],
  ['Why not just raise the memory limit?','It would have worked until the next traffic increase, and it would have cost us capacity across every replica. The JVM was misconfigured; raising the limit treats the symptom. I said that explicitly at the time.'],
  ['What did the platform lead actually say?','He thought it was a memory leak and wanted a profiler run before any config change. That was a reasonable position — I just had evidence it was not. I took the heap dump, showed him retained size was flat across an hour under load, and he changed his mind in about ten minutes.'],
  ['What was the hardest part?','Convincing people it was worth fixing properly when a one-line limit increase would have stopped the pages that night. The pressure to take the fast fix was real.'],
  ['How did you measure the result?','Restart count from the kube-state metrics, weekly. It was about 15 a week before and zero after, sustained over the following quarter.'],
  ['Would this have been caught earlier with better process?','Yes. We had no alert on container memory versus heap, and no default JVM configuration in the base image. I fixed the first; the second is still open, and I would push for it if I were doing it again.']
 ],
 why:'This story works because: it names a decision made against the easy option, it contains a disagreement resolved with evidence, every claim has a number behind it, the learning is a genuine behaviour change, and the follow-ups go deeper than the story without running out of material. It also happens to be true for the person telling it — which is why the probes are answerable.'
};

/* freq: how often this comes up for an SDE2 / mid-level backend candidate.
   high = expect it in most loops · med = likely once · low = rare below senior */


PLAN.lp.principles = [

{id:'ownership', n:1, name:'Ownership', freq:'high',
 official:'Leaders are owners. They think long term and do not sacrifice long-term value for short-term results. They act on behalf of the entire company, beyond just their own team. They never say "that is not my job."',
 means:'You did something because it needed doing, not because it was assigned to you — and you stayed with it past the point where you could have handed it off.',
 signal:'Will this person let a problem rot because it sits in someone else\'s column? Amazon is deliberately under-staffed relative to scope, so people who wait to be told are expensive.',
 asked:[
  'Tell me about a time you took on something outside your job responsibilities.',
  'Describe a time you saw a problem nobody owned and acted on it.',
  'Tell me about a time you had to make a decision with long-term consequences.',
  'When have you sacrificed a short-term win for a long-term one?'
 ],
 probes:[
  'Why was it your problem?',
  'What would have happened if you had done nothing?',
  'Did anyone tell you to stop?',
  'How did you balance this against your actual assigned work?'
 ],
 strong:'You crossed a boundary deliberately, you can say why the easy option was wrong, and you stayed involved through the follow-through — including the unglamorous parts like documentation, alerting, or handover.',
 weak:'"I helped out another team when they asked." That is cooperation, not ownership. Ownership starts with nobody asking.',
 pairs:'Bias for Action · Dive Deep · Deliver Results',
 yourAngle:'Your on-call and production experience is the natural source here. An incident you chased past the point of "restart it and go back to bed" is an Ownership story.'},

{id:'dive-deep', n:2, name:'Dive Deep', freq:'high',
 official:'Leaders operate at all levels, stay connected to the details, audit frequently, and are sceptical when metrics and anecdote differ. No task is beneath them.',
 means:'You went to the actual mechanism rather than stopping at the plausible explanation.',
 signal:'The single most-probed principle for engineers. They are testing whether you understand what you built or merely operated it. This is the one where bluffing is detected fastest.',
 asked:[
  'Tell me about the most complex problem you have debugged.',
  'Describe a time the data contradicted what everyone believed.',
  'Tell me about a time you found a root cause others had missed.',
  'When did you have to learn something deeply and quickly?'
 ],
 probes:[
  'Walk me through exactly how it worked.',
  'How did you know that was the root cause and not a symptom?',
  'What did you rule out, and how?',
  'What tools did you use?',
  'What did the numbers look like before and after?'
 ],
 strong:'You can go three levels deeper than the story required, unprompted. You name the specific tool, the specific metric, the specific line of reasoning that eliminated the wrong hypothesis.',
 weak:'"I looked at the logs and found the issue." No mechanism, no elimination, no measurement. Also weak: a deep story you can no longer explain, which reads as someone else\'s work.',
 pairs:'Ownership · Insist on the Highest Standards · Are Right, A Lot',
 yourAngle:'A slow Postgres query you traced through EXPLAIN, or a Kubernetes issue where the obvious cause was wrong. These are your strongest raw material — you have felt them.'},

{id:'deliver-results', n:3, name:'Deliver Results', freq:'high',
 official:'Leaders focus on the key inputs for their business and deliver them with the right quality and in a timely fashion. Despite setbacks, they rise to the occasion and never settle.',
 means:'You shipped, under constraint, and the outcome was measurable.',
 signal:'Can you finish? Amazon has plenty of people with good ideas. This principle is about whether the thing actually landed.',
 asked:[
  'Tell me about a time you delivered under a tight deadline.',
  'Describe a project where you had to overcome significant obstacles.',
  'Tell me about a goal you achieved that seemed out of reach.',
  'When did you have to push through despite setbacks?'
 ],
 probes:[
  'What did you cut to make the date?',
  'What was the setback and how did you get past it?',
  'What did the result actually measure?',
  'Did it hold up afterwards?'
 ],
 strong:'A named constraint (time, people, dependency), an explicit trade-off you chose, and a quantified outcome that survived contact with reality.',
 weak:'A story where nothing went wrong. There was no obstacle, so there was nothing to demonstrate.',
 pairs:'Bias for Action · Ownership · Insist on the Highest Standards',
 yourAngle:'A release you got out despite a blocking dependency, or a migration you completed without downtime. Have the before/after numbers.'},

{id:'customer-obsession', n:4, name:'Customer Obsession', freq:'high',
 official:'Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust. Although leaders pay attention to competitors, they obsess over customers.',
 means:'You changed a technical decision because of what it did to the person using the thing.',
 signal:'Amazon\'s founding principle, asked in almost every loop. For backend engineers the trap is having no customer story at all because "I do not talk to customers."',
 asked:[
  'Tell me about a time you went above and beyond for a customer.',
  'Describe a time you used customer feedback to drive a change.',
  'Tell me about a time you had to balance customer needs against business or technical constraints.',
  'When did you say no to a customer?'
 ],
 probes:[
  'Who was the customer, specifically?',
  'How did you know that was what they needed?',
  'What did it cost you to do that?',
  'How did you measure whether it helped?'
 ],
 strong:'Your "customer" can be an internal team, another service, or the on-call engineer downstream — say so explicitly and it counts. The strength is showing you traced a technical choice to a human consequence.',
 weak:'"I do not have customer contact." Reframe it. Every backend engineer has consumers of their API, their data or their alerts.',
 pairs:'Ownership · Insist on the Highest Standards · Earn Trust',
 yourAngle:'You have a frontend consuming your backend pods. Their experience of your latency or your error responses IS the customer relationship.'},

{id:'bias-for-action', n:5, name:'Bias for Action', freq:'high',
 official:'Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking.',
 means:'You moved without full information, having correctly judged that the decision was reversible.',
 signal:'Do you stall? Amazon distinguishes one-way doors (irreversible, deliberate) from two-way doors (reversible, act fast). Knowing the difference is the actual test.',
 asked:[
  'Tell me about a time you made a decision with incomplete information.',
  'Describe a time you had to move fast on something.',
  'Tell me about a calculated risk you took.',
  'When did you act without waiting for approval?'
 ],
 probes:[
  'What information were you missing?',
  'What was the worst case if you were wrong?',
  'How would you have reversed it?',
  'Did it turn out to be the right call?'
 ],
 strong:'You explicitly reasoned about reversibility, and you had a rollback. Using the two-way-door framing unprompted lands very well because it is Amazon\'s own language.',
 weak:'Recklessness dressed as speed — acting fast with no assessment of downside. And its opposite: a story where you gathered data for six weeks first.',
 pairs:'Ownership · Deliver Results · Are Right, A Lot',
 yourAngle:'A production hotfix you shipped behind a flag, or a config change you made during an incident with a rollback ready.'},

{id:'earn-trust', n:6, name:'Earn Trust', freq:'high',
 official:'Leaders listen attentively, speak candidly, and treat others respectfully. They are vocally self-critical, even when doing so is awkward. They benchmark themselves against the best.',
 means:'You said the awkward true thing, or you admitted your own mistake before anyone caught it.',
 signal:'"Vocally self-critical" is the operative phrase. They want someone who surfaces their own errors, not someone who is merely pleasant.',
 asked:[
  'Tell me about a time you made a mistake. What did you do?',
  'Describe a time you had to give difficult feedback.',
  'Tell me about a time you lost someone\'s trust and rebuilt it.',
  'When have you been vocally self-critical?'
 ],
 probes:[
  'Who did you tell, and how quickly?',
  'What was the consequence?',
  'How did they react?',
  'What did you change afterwards?'
 ],
 strong:'You raised it yourself before it was discovered, you owned the consequence without hedging, and you changed a process rather than just promising to be careful.',
 weak:'A mistake with no consequence, or one you were caught doing. Also weak: blaming the process rather than owning your part in it.',
 pairs:'Ownership · Have Backbone · Insist on the Highest Standards',
 yourAngle:'A production issue you caused. Everyone has one. The story is what you did in the first ten minutes and what you changed afterwards.'},

{id:'backbone', n:7, name:'Have Backbone; Disagree and Commit', freq:'high',
 official:'Leaders are obligated to respectfully challenge decisions when they disagree, even when doing so is uncomfortable or exhausting. Once a decision is determined, they commit wholly.',
 means:'You pushed back on someone with more authority, with evidence — and then, if you lost, you executed the decision properly anyway.',
 signal:'BOTH halves are scored, and most candidates only tell the first. Disagreeing is easy; committing wholeheartedly to a decision you argued against is the harder, rarer signal.',
 asked:[
  'Tell me about a time you disagreed with your manager.',
  'Describe a time you challenged a decision you thought was wrong.',
  'Tell me about a time you had to commit to a decision you disagreed with.',
  'When did you stand alone on a position?'
 ],
 probes:[
  'What exactly did you say?',
  'What data did you bring?',
  'What happened after the decision was made?',
  'Did you turn out to be right?',
  'How is your relationship with that person now?'
 ],
 strong:'Named disagreement, evidence rather than opinion, an explicit escalation path, and then — crucially — genuine commitment afterwards. "I still think I was right, and I made it work anyway" is a very strong ending.',
 weak:'Only disagreeing (no commit half), or only committing (no backbone). Also weak: disagreeing with a peer. The signal is stronger when there was a power gradient.',
 pairs:'Earn Trust · Are Right, A Lot · Dive Deep',
 yourAngle:'This is one of the two questions that catches people. Prepare it specifically. A technical decision you argued against with data — architecture, tooling, a deadline.'},

{id:'invent-simplify', n:8, name:'Invent and Simplify', freq:'med',
 official:'Leaders expect and require innovation and invention from their teams and always find ways to simplify. They are externally aware, look for new ideas from everywhere, and are not limited by "not invented here."',
 means:'You removed complexity, or you solved something in a way nobody on the team had considered.',
 signal:'Simplification counts as much as invention, and is far more available to a mid-level engineer. Deleting things is a legitimate answer.',
 asked:[
  'Tell me about a time you simplified a complex process.',
  'Describe something you invented or an unconventional solution you found.',
  'Tell me about a time you improved an existing system significantly.',
  'When did you challenge how something had always been done?'
 ],
 probes:[
  'What made it complex in the first place?',
  'What did you remove?',
  'Why had nobody done this before?',
  'What did the simplification cost you?'
 ],
 strong:'A measurable reduction — lines of code, steps in a process, services, deploy time, manual work eliminated. Simplification with a number is very strong and very underused.',
 weak:'Describing normal feature work as invention. Also weak: a "simplification" that just moved complexity somewhere else, with no acknowledgement.',
 pairs:'Deliver Results · Dive Deep · Frugality',
 yourAngle:'Automating something manual, collapsing duplicated code, or replacing a hand-rolled component with something standard. Your custom event-driven components are also an invention story if you can say why you built rather than bought.'},

{id:'highest-standards', n:9, name:'Insist on the Highest Standards', freq:'med',
 official:'Leaders have relentlessly high standards — many people may think these standards are unreasonably high. Leaders continually raise the bar and drive their teams to deliver high-quality products, services and processes. They ensure defects do not get sent down the line.',
 means:'You refused to ship something that met the requirement but not the bar, and you can say what the bar was.',
 signal:'Do you have a bar at all, and can you articulate it? Also: do you hold OTHERS to it, which is the harder half.',
 asked:[
  'Tell me about a time you were not satisfied with the quality of something.',
  'Describe a time you pushed back on shipping.',
  'Tell me about how you have raised the bar for your team.',
  'When did you refuse to accept "good enough"?'
 ],
 probes:[
  'What specifically was not good enough?',
  'What was the cost of holding the line?',
  'Did anyone push back?',
  'How do you decide when good enough IS good enough?'
 ],
 strong:'A specific, articulable standard, a real cost paid to hold it, and — importantly — evidence you know when NOT to. Perfectionism without judgement is a negative signal.',
 weak:'"I am a perfectionist." Also weak: holding a standard nobody else agreed with and shipping late for no measurable benefit.',
 pairs:'Earn Trust · Dive Deep · Deliver Results',
 yourAngle:'A code review where you blocked a merge, a test suite you insisted on, or an incident postmortem where you pushed for the real fix over the quick one.'},

{id:'learn-curious', n:10, name:'Learn and Be Curious', freq:'med',
 official:'Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities and act to explore them.',
 means:'You learned something hard because you were curious, not because you were told to.',
 signal:'Amazon changes stack and domain frequently. They want people who self-direct their learning rather than waiting for training.',
 asked:[
  'Tell me about something you learned recently outside your job.',
  'Describe a time you had to get up to speed on something unfamiliar, fast.',
  'Tell me about a time your curiosity led to a better outcome.',
  'How do you stay current?'
 ],
 probes:[
  'Why that, specifically?',
  'How did you go about learning it?',
  'What did you do with it?',
  'What are you learning right now?'
 ],
 strong:'Self-directed, applied to something real, with an outcome. "I learned X and then used it to do Y" beats "I read about X."',
 weak:'Listing courses or certifications with no application. Also weak: having no answer to "what are you learning right now?" — that question is nearly always asked.',
 pairs:'Dive Deep · Invent and Simplify',
 yourAngle:'Kafka and microservices, which you are learning without using at work, is a genuinely good answer — self-directed, and you will have a built artefact to point at.'},

{id:'are-right', n:11, name:'Are Right, A Lot', freq:'med',
 official:'Leaders are right a lot. They have strong judgement and good instincts. They seek diverse perspectives and work to disconfirm their beliefs.',
 means:'You made a judgement call that turned out well — and you actively looked for evidence you were wrong before committing.',
 signal:'"Work to disconfirm their beliefs" is the part being tested. They want someone who seeks the counter-argument, not someone who is merely confident.',
 asked:[
  'Tell me about a time you had to make a judgement call without data.',
  'Describe a time you were wrong. How did you realise?',
  'Tell me about a decision you made that others disagreed with.',
  'How do you know when your instinct is wrong?'
 ],
 probes:[
  'What made you confident?',
  'Who did you ask, and what did they say?',
  'What would have changed your mind?',
  'Have you been wrong about something similar?'
 ],
 strong:'Showing the disconfirmation step explicitly: "I went to the person most likely to disagree with me and asked them to break it." That single sentence is what this principle is looking for.',
 weak:'A story that is just "I was right." No process, no doubt, no seeking of other views — that reads as arrogance rather than judgement.',
 pairs:'Dive Deep · Have Backbone · Bias for Action',
 yourAngle:'A design decision where you deliberately sought the strongest objection before committing.'},

{id:'frugality', n:12, name:'Frugality', freq:'low',
 official:'Accomplish more with less. Constraints breed resourcefulness, self-sufficiency and invention. There are no extra points for growing headcount, budget size or fixed expense.',
 means:'You achieved the outcome without the resources that seemed necessary.',
 signal:'Resourcefulness under constraint. For engineers this is usually cost, or doing something with existing tools rather than new infrastructure.',
 asked:[
  'Tell me about a time you achieved something with limited resources.',
  'Describe a time you reduced cost.',
  'Tell me about a time you had to do more with less.'
 ],
 probes:[
  'What resource were you short of?',
  'What did you give up?',
  'What did it save, quantified?'
 ],
 strong:'A real number — cloud spend, licence cost, engineer-hours saved by automation, capacity reclaimed. Right-sizing over-provisioned infrastructure is a very natural version of this.',
 weak:'Cutting corners and calling it frugality. Frugality is about resourcefulness, not about lower quality.',
 pairs:'Invent and Simplify · Deliver Results',
 yourAngle:'Right-sizing Kubernetes resource requests, or removing an unnecessary dependency. Both have measurable cost impact.'},

{id:'hire-develop', n:13, name:'Hire and Develop the Best', freq:'low',
 official:'Leaders raise the performance bar with every hire and promotion. They recognise exceptional talent and willingly move them throughout the organisation. Leaders develop leaders and take seriously their role in coaching others.',
 means:'You made someone else better, deliberately.',
 signal:'Rarely a primary question at SDE2, but a mentoring story is often accepted where one is asked. Have one, do not build three.',
 asked:[
  'Tell me about a time you mentored someone.',
  'Describe how you have helped a colleague grow.',
  'Tell me about feedback you gave that changed someone\'s performance.'
 ],
 probes:[
  'What specifically did you do?',
  'How did you know they improved?',
  'What did you learn from mentoring them?'
 ],
 strong:'A named change in the other person\'s capability, with evidence. "They went from needing review on every PR to reviewing mine" is concrete.',
 weak:'"I answer questions when people ask." That is being helpful, not developing anyone.',
 pairs:'Earn Trust · Insist on the Highest Standards',
 yourAngle:'Onboarding a new joiner, or a code review habit you taught that stuck. One story is enough at this level.'},

{id:'think-big', n:14, name:'Think Big', freq:'low',
 official:'Thinking small is a self-fulfilling prophecy. Leaders create and communicate a bold direction that inspires results. They think differently and look around corners for ways to serve customers.',
 means:'You proposed something significantly beyond the immediate scope, and made the case for it.',
 signal:'Hard to demonstrate genuinely at SDE2 and interviewers know that. A scoped-up proposal that you actually got funded counts.',
 asked:[
  'Tell me about a time you proposed something ambitious.',
  'Describe a time you looked beyond the immediate problem.',
  'Where do you think your current system should be in two years?'
 ],
 probes:[
  'Who did you have to convince?',
  'What happened to the idea?',
  'What would it have taken to do it properly?'
 ],
 strong:'An idea larger than your remit that you actually advanced — a proposal document, a prototype, a funded piece of work. Even "it was rejected, and here is what I learned about how to pitch" is usable.',
 weak:'A vision with no action attached. Thinking big without doing anything is just talking.',
 pairs:'Invent and Simplify · Ownership',
 yourAngle:'Your monolith-to-microservices analysis is exactly this — a case for a direction bigger than any one ticket, with an honest cost assessment.'},

{id:'best-employer', n:15, name:'Strive to be Earth\'s Best Employer', freq:'low',
 official:'Leaders work every day to create a safer, more productive, higher performing, more diverse and more just work environment. They lead with empathy, have fun at work, and make it easy for others to have fun.',
 means:'You improved the working environment for the people around you.',
 signal:'Rarely asked below senior. If it comes up, a story about improving team process or supporting a struggling colleague works.',
 asked:[
  'Tell me about a time you improved your team\'s working environment.',
  'Describe how you have supported a struggling teammate.'
 ],
 probes:['What changed as a result?','How did others respond?'],
 strong:'A concrete process change with a human outcome — reducing on-call burden, fixing a painful deploy, making onboarding shorter.',
 weak:'Generic statements about team culture with nothing you actually did.',
 pairs:'Earn Trust · Hire and Develop the Best',
 yourAngle:'If your on-call rota improved because of the alerting you fixed, that is this principle as well as Ownership.'},

{id:'broad-responsibility', n:16, name:'Success and Scale Bring Broad Responsibility', freq:'low',
 official:'We started in a garage, but we are not there any more. We are big, we impact the world, and we are far from perfect. We must be humble and thoughtful about even the secondary effects of our actions.',
 means:'You considered the second-order consequences of a technical decision.',
 signal:'Rarely asked below senior. Security, privacy, accessibility, environmental cost and data handling are the realistic angles for an engineer.',
 asked:[
  'Tell me about a time you considered the wider impact of a decision.',
  'Describe a time you raised a concern about privacy, security or ethics.'
 ],
 probes:['Who else was affected?','What did you do about it?'],
 strong:'A specific second-order effect you noticed and acted on — data retention, a security implication, a downstream team you would have broken.',
 weak:'Abstract statements about responsibility with no decision attached.',
 pairs:'Earn Trust · Are Right, A Lot',
 yourAngle:'Data handling on the upstream Postgres data you work with, or a security concern you raised in review.'}

];

/* 15 slots. Prompts chosen so that filling them gives coverage across every
   high and medium frequency principle, with two spare for whatever your
   actual career hands you. */

PLAN.lp.slots = [
 ['A problem nobody owned that you fixed anyway','Ownership · Bias for Action','The clearest Ownership story. Cross a boundary, stay for the follow-through.'],
 ['The hardest thing you have ever debugged','Dive Deep · Ownership','Must survive three levels of "how did you know?". Choose one you can still explain.'],
 ['A mistake you made that had real consequences','Earn Trust · Ownership','Raised by you, not discovered. What process changed afterwards.'],
 ['A time you disagreed with your manager or a senior engineer','Have Backbone · Earn Trust','BOTH halves: the disagreement AND the commitment afterwards.'],
 ['Your biggest professional failure','Earn Trust · Learn and Be Curious','The other question that catches people. Real cost, real change.'],
 ['Delivering under a hard deadline or a blocking dependency','Deliver Results · Bias for Action','Name what you cut. There must be a trade-off.'],
 ['A decision made with incomplete information','Bias for Action · Are Right, A Lot','Use the two-way-door framing. Say what your rollback was.'],
 ['Something you simplified or automated away','Invent and Simplify · Frugality','Quantify the reduction — steps, code, time, cost.'],
 ['A time you refused to ship something','Insist on the Highest Standards','What the bar was, and what holding it cost.'],
 ['Improving something for the team or a downstream consumer','Customer Obsession · Best Employer','Your "customer" can be internal. Say who, specifically.'],
 ['Something hard you taught yourself and then used','Learn and Be Curious','Self-directed, applied, with an outcome.'],
 ['A time you were wrong and changed your mind','Are Right, A Lot · Earn Trust','The disconfirmation step is the whole point.'],
 ['Mentoring or levelling someone up','Hire and Develop the Best','One is enough at SDE2. Needs evidence they actually improved.'],
 ['A proposal bigger than your remit','Think Big · Invent and Simplify','Even if rejected — what you learned about making the case.'],
 ['Spare — whatever your best story is that these prompts missed','—','Every career has one that does not fit a template. Keep the slot.']
];


PLAN.lp.plan = [
 ['Weeks 2–4','Write stories 1–5','Draft only. Get them on paper with real numbers dug out of Jira, Grafana, git history — whatever you still have access to. Do this while you are still employed.'],
 ['Weeks 5–8','Write stories 6–11','By now you know the format. Faster.'],
 ['Weeks 9–11','Write stories 12–15, build the coverage matrix','Check every high-frequency principle has at least two stories.'],
 ['Week 12','Rehearse all 15 out loud, recorded','Two minutes each. Count how many times you say "we". Rewrite the ones over 2:30.'],
 ['Week 13','Probe drill','Have someone ask you the follow-ups cold. If you cannot answer six probes on a story, it is not ready.'],
 ['Ongoing','Two per Sunday','This is the schedule that actually gets it done. Fifteen stories in one weekend does not work.']
];


PLAN.lp.mining = [
 ['Your incident history','On-call pages, postmortems, the thing that woke you at 3am. Richest single source: Ownership, Dive Deep, Earn Trust.'],
 ['Your git history','Search your own commits for the big refactors and the reverts. The reverts are failure stories.'],
 ['Jira / tickets','Look for the ones that took far longer than estimated. There is always a story in why.'],
 ['Grafana and dashboards','This is where your NUMBERS are. Before/after latency, error rate, restart counts, throughput. Screenshot them now.'],
 ['Code review comments','Times you pushed back, times you were pushed back on. Have Backbone and Highest Standards live here.'],
 ['Your production system','Frontend and backend pods on Kubernetes, Postgres upstream, custom event-driven components, a monolith. Every one of those is a decision someone made, and you have opinions about all of them.'],
 ['WARNING','Do this while you still have access. If a layoff comes in December you lose Grafana, Jira and the git history on the same day. Export what you need NOW.']
];

/* ======================================================= COMPANIES · LP ===
   Behavioural is not one round with one framework. Every company on this
   ladder scores it, each against its OWN named rubric, and the story that
   wins at Amazon is not shaped like the story that wins at Google.

   Per company:
     meta       where behaviour sits in the loop, and what it is worth
     scoring    rounds[] who scores it · rubric[] what they write down · reality[]
     framework  the story format THEY want, with their proportions
     probes     groups[] the follow-ups · tactics[] how to handle them
     anti       [name, why it fails, the fix]
     worked     one annotated story cut for that company
     values     the named rubric itself, one page per value
     prep       what to actually do, and when
     source     what is PUBLISHED vs reconstructed from candidate reports

   The STORY BANK is shared across all of them. Fifteen stories, re-cut per
   company - that is the entire reason for putting them side by side.

   value row = {id,n,name,freq,official,means,signal,asked[],probes[],
                strong,weak,pairs,yourAngle}                                */


PLAN.lp.co = [];

/* -------------------------------------------------------------- AMAZON --- */

PLAN.lp.co.push({
 id:'amazon', name:'Amazon', tier:2, rung:'Rung two',
 navSub:'16 principles · ~half the decision',
 label:'Leadership Principles',
 weight:'Roughly half of the hiring decision. The largest behavioural weight on the ladder.',
 oneLine:'The most codified behavioural rubric in the industry, and the one that rejects the most otherwise-qualified engineers.',
 scoring:PLAN.lp.scoring,
 framework:PLAN.lp.star,
 probes:PLAN.lp.probes,
 anti:PLAN.lp.antipatterns,
 worked:PLAN.lp.worked,
 values:PLAN.lp.principles,
 prep:PLAN.lp.plan,
 source:'Fully published. Amazon lists all 16 Leadership Principles with official wording on its jobs site, and the bar-raiser programme is publicly acknowledged. The scoring detail here comes from candidate reports and published interviewer guidance.',
 contrast:'Against Google: Amazon wants "I", Google tolerates "we". Amazon rewards conviction (Are Right, A Lot); Google rewards changing your mind (intellectual humility). The same story, told the same way, scores differently in the two rooms.'
});

/* -------------------------------------------------------------- GOOGLE --- */

PLAN.lp.co.push({
 id:'google', name:'Google', tier:3, rung:'Rung three',
 navSub:'Googleyness · one dedicated round',
 label:'Googleyness & Leadership',
 weight:'One dedicated round of four or five, plus behavioural questions appended to technical rounds. It rarely saves a weak coder. It regularly sinks a strong one.',
 oneLine:'Scored by a hiring committee that never met you, from written notes - so the job is to hand your interviewer sentences worth writing down.',

 scoring:{
  intro:'Google does not have a bar raiser. It has something stranger and, for your purposes, more demanding: a hiring committee that reads written feedback from people who interviewed you and decides without ever speaking to you. Your interviewer is not the decision maker. They are a witness writing a deposition.',
  rounds:[
   ['Recruiter screen','30 min','Motivation, level calibration, timeline. Lightly behavioural, but "why Google" and "why now" are logged.'],
   ['Googleyness & Leadership round','~45 min','The dedicated round. Three to five behavioural questions, often including hypotheticals ("what would you do if..."), scored against a rubric on ambiguity, collaboration, humility and emergent leadership.'],
   ['Every technical round','5-10 min at the end','Most interviewers close with one behavioural question. It is short, it is still written up, and a flat answer here is a flat data point in your packet.'],
   ['Hiring committee','after, without you','Googlers who did not interview you read the written feedback and the scores. They can and do reject candidates whose interviewers all said hire. Notes that say "candidate was collaborative" are worthless to them; notes that quote you are not.'],
   ['Team match','after HC','A separate stage. You can pass the committee and still wait months. Behaviour matters again here, informally, in conversations with prospective managers.']
  ],
  rubric:[
   ['Written notes, read by strangers','This is the structural difference from Amazon. Give the interviewer a specific, quotable line: a number, a decision, a sentence you actually said. Vague warmth does not survive transcription.'],
   ['Scored on a scale, not a verdict','Interviewers submit a rating - strong hire through strong no-hire - plus prose. A middling behavioural score next to a middling coding score is a reject even with no red flag anywhere.'],
   ['Emergent leadership, not authority','The named construct. Did you step up when the gap appeared, and - this is the half everyone misses - did you step back when someone better placed took over?'],
   ['Intellectual humility is measured directly','Google research made this famous: the willingness to admit error and be persuaded is treated as a predictor, not a weakness. "I was wrong, here is what changed my mind" scores positively here. At Amazon that same sentence needs careful handling.'],
   ['Hypotheticals are fair game','"What would you do if a teammate consistently missed deadlines?" Google asks situational questions more than Amazon does. Answer with a real precedent if you have one, then the hypothetical: "here is what I did last time, and here is what I would do here."'],
   ['No red flags is a requirement, not a bonus','The committee is scanning for reasons to say no. One story where you talk about a colleague dismissively can end it regardless of your coding.']
  ],
  reality:[
   'Roughly three of four rounds strong with no red flags is the shape that passes. A single strong-no-hire on Googleyness is usually terminal.',
   'You will not be interrupted as often as at Amazon. That is not approval - it means the interviewer is taking notes, and silence is them writing.',
   'The committee sees your packet cold. Anything that needed your tone of voice to land did not survive the trip.',
   'The internal name and scope of this round has changed more than once. The attributes below are stable across every version of it; the label is not.'
  ]
 },

 framework:{
  intro:'STAR still, but with Google proportions. Amazon wants sixty percent action. Google wants roughly forty percent action and a genuine share of the time spent on how you thought, who you brought with you, and what you would do differently. The reflective part is not padding here - it is a scored attribute.',
  parts:[
   ['S - Situation','20 sec · ~15%','Slightly more context than Amazon allows, because Google interviewers are often outside your domain and the committee certainly is. One sentence of "why this was hard" belongs here.'],
   ['T - Task','15 sec · ~10%','What was ambiguous about it. Google’s favourite setup is a problem with no clear owner and no clear definition - say which part was undefined.'],
   ['A - Action','50-60 sec · ~40%','What you did, and crucially who you did it with. Naming the collaboration is scored; at Amazon it dilutes the story, here it is the point. Say what you rejected and why.'],
   ['R - Result','20 sec · ~15%','Quantified, same as everywhere. Add the second-order effect if there was one - did the approach get reused, did the team keep the practice?'],
   ['L - Learning','25 sec · ~20%','The big one. Amazon treats this as a nice extra. Google treats it as evidence of intellectual humility, which is a named attribute. "What I would do differently" answered thinly is a missed score, not a missed flourish.']
  ],
  rules:[
   '"We" is permitted here in a way it is not at Amazon - but your own contribution must still be unambiguous. The formula that works: "the team decided X; I argued for it because Y, and I built Z."',
   'Volunteer one thing you got wrong in every story. Not a fake weakness - a real call that did not work. This is the single highest-scoring habit in a Google behavioural round.',
   'Name the people you disagreed with respectfully. Contempt for a colleague, even a deserving one, is the most common red flag written up.',
   'Have one story where you stepped BACK - handed something over, deferred to someone better placed, killed your own proposal. Almost nobody prepares this and it is half of emergent leadership.',
   'Prepare for hypotheticals. Two or three "what would you do if" answers, each anchored to something you actually did.',
   'Speak in specifics the interviewer can copy down. "Latency went from 3.2s to 380ms" is transcribable. "It got much better" is not.'
  ],
  timing:'Target two to two and a half minutes, then follow-ups. Google interviewers usually let you finish, so policing the length is on you. A five-minute answer in a 45-minute round means they get three questions instead of five, and a thin packet is a reject.'
 },

 probes:{
  intro:'Google probes sideways rather than downward. Amazon drills into the technical mechanism; Google asks about the people, the alternatives and the aftermath. Prepare both directions on every story.',
  groups:[
   ['On ambiguity',[
     'What was unclear when you started?',
     'How did you decide where to begin?',
     'What did you do when you realised the requirements were wrong?',
     'How much of this was defined for you, and how much did you define?'
   ]],
   ['On collaboration and disagreement',[
     'Who did you work with on this?',
     'Tell me about someone who disagreed with you.',
     'How did you handle it when they did not come around?',
     'What would that person say about working with you?',
     'Did you ever hand something over? Why?'
   ]],
   ['On humility (this is the scored one)',[
     'What did you get wrong?',
     'When did you change your mind, and what changed it?',
     'What feedback have you received that was hard to hear?',
     'Tell me about a time someone else had a better idea than yours.'
   ]],
   ['On impact and users',[
     'Who benefited from this, and how do you know?',
     'What did the users actually experience before and after?',
     'Did it hold up? Is it still running?',
     'What was the cost - to you, to the team, to the codebase?'
   ]],
   ['Hypotheticals',[
     'What would you do if a teammate was consistently missing deadlines?',
     'How would you handle being assigned a project you thought was a bad idea?',
     'You disagree with your manager on a technical decision. What happens next?',
     'You inherit a system nobody understands and it breaks. Walk me through the first day.'
   ]]
  ],
  tactics:[
   ['When asked what you got wrong','Answer immediately and concretely. Hesitation here reads as either no self-awareness or a rehearsed evasion, and both get written up. Have the answer ready before the question.'],
   ['When given a hypothetical','Anchor it: "the closest thing I have actually done is X, and it taught me Y - so here I would...". A pure hypothetical answer is a guess; an anchored one is evidence.'],
   ['When they ask what a colleague would say about you','Give the real critical version, not the flattering one. "She would say I push for decisions too early, and she has told me so" scores far above "she would say I am collaborative."'],
   ['When there is silence','Let it sit. They are writing. Filling the gap with more talking is how good stories get diluted.'],
   ['When you genuinely do not have the story','Say so and offer the nearest real one. Google interviewers accept "I have not faced exactly that; the closest is..." - inventing does not survive the follow-ups.']
  ]
 },

 anti:[
  ['Only stepping up, never stepping back','Emergent leadership is a two-sided construct at Google. Every story ends with you heroically taking over. That reads as someone who cannot be a teammate, only a lead.',
   'FIX: prepare one story where you handed something off, deferred, or killed your own idea - and say why that was the right call.'],
  ['No admitted error anywhere','Four stories, zero mistakes. Intellectual humility is a named, measured attribute, and this pattern scores against you directly.',
   'FIX: put one genuine, consequential error into every story’s Learning section. Not "I should have documented it better."'],
  ['Contempt for a colleague','"The other team was incompetent so I rewrote it." One sentence like this is the most commonly written red flag in the whole loop.',
   'FIX: describe the constraint the other person was under, then what you did. You can say the code was bad. Do not say the person was.'],
  ['Amazon-shaped answers at Google','Relentless "I", conviction with no doubt, no collaborators named. It reads as an aggressive lone operator, which is exactly the profile Google filters for.',
   'FIX: same stories, recut. Add the people, add the doubt, add the handover. Keep the numbers.'],
  ['Vague, untranscribable language','"I took ownership and drove alignment." The committee reads this and learns nothing. Notes made of abstractions score as a weak interview even if the conversation felt warm.',
   'FIX: one number, one named decision, one sentence you actually said, per story.'],
  ['Treating the hypothetical as a trick','Freezing or deflecting on "what would you do if...". These are standard here and refusing to engage reads as rigidity.',
   'FIX: prepare three. Deadline-missing teammate, disagreeing with your manager, inheriting an unowned mess.'],
  ['"Why Google" answered with scale','"Because of the scale and the impact." Everyone says it. It is not a reason, it is a description.',
   'FIX: name a specific system, team or published paper, and connect it to something you have actually built.'],
  ['Talking past the round','A five-minute answer starves the packet. Three deep questions is a thinner file than five, and the committee sees the file, not the warmth.',
   'FIX: two minutes, then stop talking and let them probe.']
 ],

 worked:{
  question:'Tell me about a time you had to make progress on something that was not clearly defined.',
  principle:'Comfort with ambiguity · Emergent leadership · Intellectual humility',
  story:[
   ['S - Situation','Our platform ran a mix of frontend and backend pods on Kubernetes with Postgres behind them. We started getting intermittent 5xx spikes in the evening - maybe forty a night out of a few hundred thousand requests. Nobody owned it. It was too small to page on and too persistent to ignore, and two teams each had a plausible reason it was the other one.',
    'Names the ambiguity explicitly and quantifies the problem in the first breath. "Nobody owned it" is the Google setup - an undefined problem with no assigned owner is exactly what the ambiguity attribute looks for.'],
   ['T - Task','Nothing was assigned to me. I decided to spend a week on it because I was the only person who had recently touched both the ingress config and the connection pooling, and it was going to keep getting deprioritised otherwise.',
    'States that it was self-initiated, and gives a non-heroic reason - you had context nobody else had. Initiative without self-congratulation is the tone that scores.'],
   ['A - Action','I started by asking what I could rule out cheaply. I correlated the 5xx timestamps against pod restarts, deploys, and Postgres connection counts, and the only clean correlation was with connection-pool exhaustion during the nightly reporting job. My first theory was that the job was leaking connections. I spent two days on that and it was wrong - the pool was returning them fine. What was actually happening was that the job held long transactions, so MVCC kept old row versions alive, autovacuum fell behind, and query latency crept up until requests queued past the pool timeout. I took that to the data engineer who owned the reporting job rather than changing it myself, because she knew what the job could tolerate. We agreed on batching it into chunks with commits between them. She made the change; I added the pool-saturation metric and the alert so the next person would not need a week.',
    'The action carries three scored things at once. The rejected hypothesis, stated plainly and without embarrassment, is intellectual humility with evidence. Handing the fix to the person who owned the job is emergent leadership stepping BACK - the half candidates never prepare. And the alert at the end is the second-order thinking the Learning section rewards.'],
   ['R - Result','The 5xx spikes went to zero and stayed there for the eight months I watched it. The saturation alert fired twice afterwards for unrelated reasons and both times someone caught the cause in under an hour rather than a week.',
    'Quantified, and then the second-order result - the practice outlived the incident. That sentence is what a committee member underlines.'],
   ['L - Learning','Two things. I spent two days on the leak theory because it was the explanation I already knew how to check, not because the evidence pointed there - I now write down what I would expect to see if a hypothesis were true before I go looking. And I nearly patched the reporting job myself to save time. That would have been faster that week and worse afterwards, because I would have owned a job I did not understand.',
    'Two real errors, one of process and one of judgement, each with a specific behaviour change. This is the highest-scoring paragraph in the whole answer and it is the one most candidates leave off.']
  ],
  probesAndAnswers:[
   ['What made you think it was connection pooling rather than the application?','The correlation was clean and the alternatives were not. Pod restarts did not line up, and the errors were 503s from the ingress rather than 500s from the app, which meant requests were not reaching a healthy pod at all. That points at saturation rather than a code path.'],
   ['You said your first theory was wrong. How long did it take you to accept that?','Longer than it should have - about two days. What ended it was writing down the falsifier: if connections were leaking, the pool’s in-use count would not return to baseline after the job finished. It did return. That was unambiguous and I stopped.'],
   ['Why not just fix the reporting job yourself?','I could have, and it would have been a small diff. But I did not know the job’s consistency requirements - whether committing between chunks was safe for the report it produced. The person who owned it answered that in ten minutes. Guessing would have traded a week of my time for a correctness risk I could not evaluate.'],
   ['What would the data engineer say about working with you on this?','That I turned up with the evidence rather than the conclusion, which I know she appreciated because she said so. She would also probably say I was pushy about the timeline - I wanted it in that sprint and it was not her top priority, and I pressed harder than I needed to.'],
   ['What would you do differently if it happened again tomorrow?','Add the metric first. I built the pool-saturation dashboard at the end as a gift to the next person, and if I had built it on day one it would have pointed straight at the answer and saved most of the week.']
  ],
  why:'It is an undefined problem with no owner, so it hits the ambiguity attribute directly. It contains a hypothesis that was wrong, stated without defensiveness, which is intellectual humility with evidence attached rather than a claim about yourself. It contains a deliberate step back - giving the fix to its owner - which is the half of emergent leadership almost nobody prepares. The colleague is described as a collaborator with her own valid priorities, not an obstacle. And every claim has a number or a mechanism a stranger can write down.'
 },

 values:[
  {id:'ambiguity', n:1, name:'Comfort with ambiguity', freq:'high',
   official:'Google describes thriving without complete information, and being energised rather than blocked by problems that are not yet well defined.',
   means:'You made real progress on something nobody had specified, and you can explain how you chose where to start.',
   signal:'The most reliably asked Googleyness theme, because Google’s own work looks like this. They are testing whether an undefined problem makes you productive or paralysed.',
   asked:['Tell me about a project with unclear requirements.','Describe a time you had to make a decision without enough information.','How do you start on something nobody has scoped?','Tell me about a time the goal changed halfway through.'],
   probes:['What was actually undefined?','How did you decide where to begin?','What did you do when it turned out you had guessed wrong?','Who did you go to for the missing context?'],
   strong:'You name the specific unknowns, the cheapest experiment that would resolve one of them, and the fact that you went and ran it. You are comfortable saying you started in the wrong place and corrected.',
   weak:'"I asked my manager for clarification and then did what he said." That is a story about someone else resolving the ambiguity. Also weak: a story where nothing was ever actually unclear.',
   pairs:'Bias to action · Intellectual humility',
   yourAngle:'An incident with no obvious owner is the ideal raw material, and you have them - an intermittent production problem where two teams each thought it was the other one.'},

  {id:'humility', n:2, name:'Intellectual humility', freq:'high',
   official:'Google has publicly identified the willingness to admit error and to be persuaded by better evidence as one of the attributes it selects for.',
   means:'You changed your mind because the evidence changed, and you can say so without discomfort.',
   signal:'The attribute Google talks about most in public and the one candidates handle worst, because every other company has trained them to project certainty. Here, admitting error is the score.',
   asked:['Tell me about a time you were wrong.','When did someone change your mind?','What is a piece of feedback that was hard to hear?','Tell me about a time a colleague had a better solution than yours.'],
   probes:['What specifically changed your mind?','How long did it take you to accept it?','What did you do about it afterwards?','Has it changed how you approach that kind of problem?'],
   strong:'A real, consequential error with a named cost, followed by a specific and durable change in behaviour. Bonus: you credit the person who corrected you and describe their argument accurately.',
   weak:'"I was wrong about a variable name." Trivial. Or a humblebrag error - "I was wrong to work so many hours." Or, worst, a long defence of why you were actually mostly right.',
   pairs:'Comfort with ambiguity · Collaboration',
   yourAngle:'The two days you spent on a wrong hypothesis before the evidence killed it. Debugging stories carry this naturally, because the wrong theory is part of the narrative rather than an admission bolted on.'},

  {id:'action', n:3, name:'Bias to action', freq:'high',
   official:'Google describes a preference for doing over deliberating - shipping something small and learning from it rather than waiting for certainty.',
   means:'Faced with uncertainty you ran the cheap experiment instead of scheduling a meeting about it.',
   signal:'Paired with ambiguity in almost every round. They want the smallest thing you could do to learn something, not a plan.',
   asked:['Tell me about a time you moved without full information.','Describe something you shipped fast.','When did you decide not to wait for consensus?','Tell me about a time you fixed something outside your remit.'],
   probes:['What was the risk of moving early?','What would waiting have cost?','How did you limit the blast radius?','Did it work? What did you do when it did not?'],
   strong:'You show the risk calculation, not just the speed. A small reversible step taken quickly, with a stated way to undo it, beats a large confident one.',
   weak:'Recklessness dressed as decisiveness - shipping without a rollback, going around a process because it was slow, with no acknowledgement of the risk you took.',
   pairs:'Comfort with ambiguity · Emergent leadership',
   yourAngle:'Adding the metric or the alert before anyone asked for it. Small, reversible, and it changes what the team can see.'},

  {id:'collab', n:4, name:'Collaboration and no ego', freq:'high',
   official:'Google describes wanting people who make the team better and who are genuinely good to work through hard problems with.',
   means:'The people around you did better work because you were there, and you can name them.',
   signal:'This is where red flags get written. One dismissive sentence about a colleague outweighs a paragraph of technical strength.',
   asked:['Tell me about working with a difficult colleague.','Describe a time you had to build consensus.','How do you handle a teammate who is not delivering?','Tell me about mentoring someone.'],
   probes:['What was their perspective?','What would they say about you?','Did the relationship survive?','What did you change about your own approach?'],
   strong:'You describe the other person’s constraints accurately and sympathetically, and you changed something about your own behaviour rather than only theirs. You can name what they were right about.',
   weak:'The colleague is an obstacle with no interior life. "They were resistant to change." "The other team was incompetent." Every such sentence is a written note.',
   pairs:'Intellectual humility · Emergent leadership',
   yourAngle:'The disagreement where you turned up with evidence rather than a conclusion, and the other person moved because the evidence was good.'},

  {id:'emergent', n:5, name:'Emergent leadership', freq:'high',
   official:'Google explicitly asks for leadership without authority - stepping up when a gap appears, and stepping back when someone else is better placed.',
   means:'You led when nobody appointed you, and you stopped leading when it was right to.',
   signal:'A two-sided construct, and candidates prepare only one side. The step-back story is rare enough that having one is a genuine differentiator.',
   asked:['Tell me about a time you led without being the lead.','Describe stepping into a gap nobody was filling.','When did you hand something over?','Tell me about a time you deferred to someone else’s judgement.'],
   probes:['Why you?','Who else could have done it?','When did you stop leading it, and why?','What happened to it after you let go?'],
   strong:'Both halves in one story: you took it on because you had the context, and you handed it back the moment somebody better placed could carry it. You describe the handover as a decision, not an exit.',
   weak:'Every story ends with you taking over and staying in charge. It reads as a person who cannot be led, which is a specific and disqualifying profile here.',
   pairs:'Bias to action · Collaboration',
   yourAngle:'Finding the root cause but giving the fix to whoever owned the code. That is the exact shape of the step-back half.'},

  {id:'user', n:6, name:'User focus', freq:'med',
   official:'"Focus on the user and all else will follow" is the first of Google’s published Ten Things. It is quoted at candidates and it is scored.',
   means:'You can name the human being affected by your work and what changed for them.',
   signal:'Backend engineers fail this by describing systems rather than people. The 5xx rate is not the user experience - the user experience is a booking that failed at the payment step.',
   asked:['Who used what you built?','Tell me about a time you pushed back on a requirement for the user’s sake.','How did you know it was working for people?','Describe a trade-off between a technical goal and a user outcome.'],
   probes:['What did the user actually see?','How did you measure their experience rather than the system’s?','Did anyone complain? What did they say?','What would you have built differently knowing that?'],
   strong:'You translate every metric into an experience. "Forty 5xx a night" becomes "about forty people an evening got an error page mid-checkout, and most of them did not try again."',
   weak:'Pure system language throughout. Latency, throughput, error rate, and no person anywhere in the story.',
   pairs:'Doing the right thing · Collaboration',
   yourAngle:'You run a real production system with real users. Translate one of its metrics into what a person experienced - that translation is the whole answer.'},

  {id:'status-quo', n:7, name:'Challenging the status quo', freq:'med',
   official:'Google describes wanting people who question how things are done, and who do it in a way that improves things rather than just objecting.',
   means:'You changed something everyone had accepted, and you brought people with you.',
   signal:'The constructive half is the test. Objecting is easy; the score is in whether the thing actually changed and whether people were still on your side afterwards.',
   asked:['Tell me about a process you changed.','When did you disagree with how something was being done?','Describe convincing people to do something differently.','What is something your team does that you think is wrong?'],
   probes:['Who resisted, and why?','What was their strongest argument?','How did you get from disagreement to a decision?','Did it stick after you moved on?'],
   strong:'You state the opposing argument fairly and well, and the change survived you. Steel-manning the other side is unusual and scores immediately.',
   weak:'A complaint with no outcome, or a change you forced through that reverted the moment you left. Also weak: describing the resistance as irrational.',
   pairs:'Emergent leadership · Intellectual humility',
   yourAngle:'Any convention in your codebase you argued to change - and be honest if it only half-stuck.'},

  {id:'right-thing', n:8, name:'Doing the right thing', freq:'low',
   official:'"You can make money without doing evil" is one of Google’s published Ten Things, and ethics questions do appear in the Googleyness round.',
   means:'You raised something inconvenient because it was correct to raise it.',
   signal:'Asked less often than the others, but a bad answer here is disproportionately damaging - this is a red-flag detector, not a differentiator.',
   asked:['Tell me about a time you raised a concern nobody wanted to hear.','Describe a shortcut you refused to take.','When did you have to say something was not ready?','Tell me about a problem that was easier to ignore.'],
   probes:['What was the pressure to stay quiet?','Who did you tell, and how?','What did it cost you?','What happened next?'],
   strong:'Real cost - a slipped date, an uncomfortable conversation with someone senior, a decision that went against you and that you accepted. Proportionate, not dramatic.',
   weak:'A story with no cost, so nothing was actually risked. Or a whistleblower narrative that suggests you escalate before you talk to anyone.',
   pairs:'User focus · Collaboration',
   yourAngle:'A release you argued to hold, or a data-handling shortcut you refused. Small and real beats large and rehearsed.'}
 ],

 prep:[
  ['Week 13','Apply - Google’s pipeline is 8-12 weeks','Behavioural prep can trail the application. The application cannot trail the prep.'],
  ['Week 14','Recut four existing Amazon stories for Google','Same events. Add the collaborators, add the error, add the step-back. Keep the numbers.'],
  ['Week 15','Write the step-back story','The one where you handed something over. If you genuinely do not have one, that is worth knowing now.'],
  ['Week 16','Three hypotheticals, anchored','Missed deadlines · disagreeing with your manager · inheriting an unowned mess. Each anchored to something real.'],
  ['Week 17','"Why Google", specifically','Name a system, a team or a paper. Connect it to something you have built. Ten sentences, not a paragraph of admiration.'],
  ['Week 18','Record one Googleyness round','Five questions, 45 minutes, on camera. Watch for contempt, for missing collaborators, and for stories with no admitted error.']
 ],

 source:'Partly published. Google publishes the Ten Things and has spoken publicly - including in Laszlo Bock’s Work Rules! - about intellectual humility, emergent leadership, comfort with ambiguity and conscientiousness as selection attributes. Google does not publish a numbered rubric the way Amazon publishes the Leadership Principles, and the internal name for this round has changed more than once. The eight attributes here are the stable set across those versions plus consistent candidate reporting; treat the grouping as a working model, not an official list.',
 contrast:'Against Amazon: same stories, different cut. Amazon wants conviction, ownership and "I". Google wants the collaborator named, the error volunteered, and at least one moment where you stepped back. Against Microsoft: Google is more formal and more written, and the decision sits with a committee rather than with the last interviewer in the room.'
});

/* ----------------------------------------------------------- MICROSOFT --- */

PLAN.lp.co.push({
 id:'microsoft', name:'Microsoft', tier:2, rung:'Rung two',
 navSub:'Growth mindset · the AA round decides',
 label:'Culture & the As-Appropriate round',
 weight:'Runs through every round, then concentrates into one: the As-Appropriate interviewer, who is usually the most senior person you meet and who effectively makes the call.',
 oneLine:'The most conversational behavioural bar on the ladder, and the one where "here is what I got wrong and what I changed" is the literal answer they are looking for.',

 scoring:{
  intro:'Microsoft under Satya Nadella reorganised its culture around one idea borrowed from Carol Dweck: growth mindset, summarised internally as "learn-it-all, not know-it-all". That is not a poster. It is the thing the As-Appropriate interviewer is listening for, and it inverts the instinct every other loop trains into you - to look like you already knew.',
  rounds:[
   ['Recruiter screen','30 min','Motivation, level, team fit. "Why Microsoft" and "what do you want to work on" are asked seriously and passed on.'],
   ['Technical rounds (3-4)','45-60 min each','Coding and design, each closing with one or two behavioural questions. Interviewers debrief with each other during the day, sometimes between rounds, so a weak signal in round one shapes the questions in round three.'],
   ['As-Appropriate (AA) round','45-60 min','The distinctive Microsoft round. A senior engineer or manager from outside the immediate team, brought in near the end, who has seen the running feedback. Heavily behavioural: growth mindset, collaboration across boundaries, motivation, and "why this team". In practice this person makes the hire decision.'],
   ['Hiring manager conversation','30-45 min','Sometimes separate, sometimes folded into the AA. Team fit, what you want next, how you like to be managed.']
  ],
  rubric:[
   ['Growth mindset is the named construct','What did you learn, what changed, what would you do differently. A candidate who has never revised a belief is the anti-profile. This is scored more directly here than anywhere except Google.'],
   ['Collaboration across boundaries','"One Microsoft" is the internal phrase for not optimising your own team at the company’s expense. Stories that cross an org boundary land better than stories inside one team.'],
   ['Customer obsession, in Microsoft’s sense','Usually an internal or enterprise customer, not a consumer. "Who depends on this and what did they need" is the question underneath.'],
   ['Respect, integrity, accountability','Microsoft’s three published company values. Accountability shows up as owning an outcome that went badly without distributing the blame.'],
   ['Conversational, not rubric-recited','Notes are shorter and less formal than Amazon’s. That cuts both ways: you have more room to be a person, and less structure to hide behind if the story is thin.'],
   ['Live debriefing','Interviewers talk to each other during the loop. A concern raised in round two gets tested in round four, so the same story told twice with different details is noticed.']
  ],
  reality:[
   'The AA interviewer usually knows the running feedback before they walk in. If an earlier round flagged something, this round will probe exactly that.',
   'The coding bar is the most forgiving of your tier-two set. Behaviour and collaboration carry proportionally more weight than they do at Amazon or Google.',
   'A polished, hard-charging Amazon delivery does not land as well here. Microsoft interviewers report reading it as a lack of self-awareness.',
   '"Why Microsoft" and "why this team" are asked more sincerely than at most companies, and answered badly by almost everyone.'
  ]
 },

 framework:{
  intro:'STAR, but conversational. Microsoft interviewers interrupt to chat rather than to steer, and the round feels like a discussion. That is a trap: it is still scored, and the rambling that feels natural in conversation produces a thin write-up.',
  parts:[
   ['S - Situation','20 sec · ~15%','Include who the customer was - internal team, external client, another service. Microsoft frames almost everything around who depends on the work.'],
   ['T - Task','15 sec · ~10%','What you owned. If it crossed a team boundary, say so here; that is the One Microsoft hook.'],
   ['A - Action','55-65 sec · ~45%','What you did. Include at least one point where you did not know something and went and learned it - the learning is not a footnote at Microsoft, it belongs inside the action.'],
   ['R - Result','20 sec · ~15%','Quantified, and say who benefited rather than only what improved.'],
   ['L - Learning','20 sec · ~15%','Explicit. "What I took from that" is close to a required sentence here. Growth mindset is measured by whether you have one of these ready without being asked.']
  ],
  rules:[
   'Say what you did not know at the start and how you closed the gap. That single sentence is the growth-mindset marker, and its absence is noticed.',
   'Cross an org boundary in at least two stories. Working well with the team you are already on is the baseline, not the signal.',
   'Name the customer. Internal counts - the team consuming your API is a customer, and treating them as one is the answer.',
   'Own a bad outcome cleanly in one story. No distributed blame, no "the requirements changed". Accountability is a published value and it is tested.',
   'Match the conversational register without losing the structure. Answer like a person, but hit S-T-A-R-L or the write-up will be vague.',
   'Have a real answer to "why this team". Microsoft loops are team-specific and generic enthusiasm is transparent.'
  ],
  timing:'Two minutes, but expect to be interrupted with genuine curiosity rather than steering. Follow the tangent for thirty seconds, then bring it back yourself - the interviewer will not always do it for you, and an unfinished story is an unscored one.'
 },

 probes:{
  intro:'Microsoft probes for learning and for how you work with people. It probes the technical mechanism less hard than Amazon, and the interpersonal aftermath harder than most.',
  groups:[
   ['On growth mindset',[
     'What did you learn from that?',
     'What would you do differently now?',
     'Tell me about a time you failed.',
     'What is something you believed a year ago that you no longer believe?',
     'How do you learn something new when there is no documentation?'
   ]],
   ['On collaboration across boundaries',[
     'Who else was involved, and were they on your team?',
     'How did you get another team to prioritise something for you?',
     'Tell me about a time two teams disagreed about ownership.',
     'How do you work with someone in a different timezone or org?'
   ]],
   ['On customers',[
     'Who was the customer here?',
     'How did you know what they actually needed?',
     'Tell me about a time you pushed back on what a customer asked for.',
     'What did they say afterwards?'
   ]],
   ['On accountability',[
     'What went wrong, and what was your part in it?',
     'How did you tell people?',
     'What did you change so it would not happen again?',
     'Did it happen again?'
   ]],
   ['On motivation',[
     'Why Microsoft?',
     'Why this team?',
     'What do you want to be doing in three years?',
     'What kind of work do you find genuinely interesting?',
     'How do you like to be managed?'
   ]]
  ],
  tactics:[
   ['When the round feels like a chat','It is still scored. Keep the structure even while matching the register - a friendly ramble produces a write-up that says "pleasant, hard to assess".'],
   ['When asked what you failed at','Give a real failure with a real consequence and a real change. Microsoft rewards this answer more than any other company on the ladder; a deflection wastes the single best-scoring question in the loop.'],
   ['When the AA interviewer probes one specific area repeatedly','An earlier round flagged it. Answer that concern directly rather than working around it - they are giving you the chance to close it.'],
   ['When asked "why this team"','Name what the team builds and connect it to something you have done. If you genuinely do not know, ask them to describe it and respond honestly to the answer; that is better received here than a fabricated enthusiasm.'],
   ['When you disagree with the interviewer','Engage. Microsoft reads a willingness to be persuaded, and to persuade, as the point. Capitulating instantly scores as poorly as digging in.']
  ]
 },

 anti:[
  ['The know-it-all delivery','Total confidence, nothing learned, no gaps admitted. This is the specific anti-profile Microsoft named its culture change after, and interviewers are primed for it.',
   'FIX: one sentence per story about what you did not know at the start and how you closed it.'],
  ['Every story inside one team','Nothing crosses a boundary, so there is no evidence you can work with the rest of a large company - which is most of the job at Microsoft.',
   'FIX: two stories minimum involving another team, another org, or an external partner.'],
  ['No customer anywhere','A story about a system with no human or team on the other end of it. Customer obsession is a published value and internal customers count.',
   'FIX: name who consumed the thing you built and what changed for them.'],
  ['Distributed blame','"The requirements changed and the other team was late." Accountability is a published value; this sentence is scored against directly.',
   'FIX: name your own contribution to the bad outcome first, then the context.'],
  ['Amazon intensity','Relentless "I", constant urgency, colleagues as obstacles. It reads as a lack of self-awareness rather than as drive, and the AA interviewer writes that down.',
   'FIX: same stories, slower delivery, collaborators present, one thing you got wrong.'],
  ['Generic "why Microsoft"','"It is a great company with great products." The recruiter, the hiring manager and the AA interviewer will all ask, and they compare answers.',
   'FIX: one honest reason about the work, one about the team, and one about what you want to learn.'],
  ['Rambling because the round is friendly','The conversational tone lulls candidates into five-minute answers with no shape, which produce write-ups that say very little.',
   'FIX: keep the structure. Two minutes, land the result, offer the learning.']
 ],

 worked:{
  question:'Tell me about a time you had to learn something you did not know in order to get something done.',
  principle:'Growth mindset · One Microsoft · Accountability',
  story:[
   ['S - Situation','We had a Spring Boot service publishing domain events that three downstream teams consumed. One of them - the reporting team - kept getting duplicate rows, maybe a few hundred a week, and they had built a nightly dedupe job to work around it. That job had been running for months and everyone had stopped treating the duplicates as a bug.',
    'The customer is named in the first sentence and it is an internal one, which is the normal Microsoft shape. The detail that everyone had accepted the workaround sets up both the accountability and the growth-mindset beats.'],
   ['T - Task','It was our events causing it, so it was our problem, even though nobody had escalated it. I picked it up. I also had to admit at the start that I did not really understand our delivery guarantees - I had been treating the publisher as if it were exactly-once, and I had never checked.',
    'The admission is placed early and stated flatly. At Microsoft this is not a risk; it is the thing being measured, and putting it in the Task rather than saving it for the Learning makes it read as honesty rather than as a closing flourish.'],
   ['A - Action','I spent two evenings actually reading how our broker handled redelivery and what our consumer offsets were doing on rebalance, rather than assuming. It was at-least-once, which meant duplicates were guaranteed and not a bug at all - the bug was that we had never made the consumers idempotent. I wrote that up in a page and took it to all three consuming teams together rather than fixing only the reporting team’s symptom, because the other two almost certainly had the same problem and had not noticed. One had; one had not. We agreed on an event id plus a dedupe key at the consumer, and I changed our publisher to emit a stable id rather than generating one per attempt. The reporting team deleted their nightly job.',
    'The learning sits inside the action, which is the Microsoft placement. Going to all three teams instead of the one that complained is the One Microsoft beat, made concrete rather than claimed. And the fix is at the right layer - the publisher change plus the consumer contract - which shows the understanding was real.'],
   ['R - Result','Duplicate rows went to zero across all three consumers. The reporting team removed a nightly job that had been running for about eight months, and the third team found two silent double-counts in their own numbers once they went looking.',
    'Quantified, and the benefit is spread across three teams rather than one. The silent double-count is the detail that shows the cross-team move was worth making.'],
   ['L - Learning','The real lesson was that I had been operating a system whose delivery semantics I had never checked, and I had been confidently telling people it was fine. Now, when I inherit or build anything on a queue, the first thing I write down is the delivery guarantee and what the consumer does with a repeat. The second lesson was cheaper: the team that complains is rarely the only team affected.',
    'Two learnings, one about a real gap in your own understanding and one about how to work in a big organisation. That pairing is exactly the profile the AA round is calibrated for.']
  ],
  probesAndAnswers:[
   ['Why had nobody looked at this before?','It had a workaround that worked. The nightly job made the symptom invisible, so the cost had already been paid and nobody was feeling it any more. That is generally when a bug becomes permanent.'],
   ['You said you had assumed exactly-once. Had you told anyone that?','Yes, and that is the uncomfortable part. I had answered a question about it in a design review months earlier and given the wrong answer confidently. I went back and corrected it in the same channel.'],
   ['How did you get three teams into one conversation?','I wrote the page first and sent it, so nobody had to attend a meeting to find out what it was about. Two of the three answered in the thread and we only needed twenty minutes live. Turning up with the written analysis is what made it cheap for them to say yes.'],
   ['What did the team that had not noticed say?','They were not thrilled, understandably - it meant some historical numbers were wrong. We agreed I would help them work out which reports were affected, which took another day, and we corrected two of them.'],
   ['What would you do differently?','Check the delivery semantics before I publish anything on a queue rather than after someone complains, and put it in the service README so the next person does not have to rediscover it. I did that afterwards, but it should have existed from the start.']
  ],
  why:'It opens with an internal customer, names a real gap in the candidate’s own knowledge without flinching, and puts the learning inside the action where Microsoft looks for it. It crosses three team boundaries deliberately rather than fixing the one complaint, which is One Microsoft demonstrated rather than asserted. It contains a genuinely uncomfortable admission - having confidently told people the wrong thing - and a correction made in public. And it ends with a durable behaviour change rather than a resolution.'
 },

 values:[
  {id:'growth', n:1, name:'Growth mindset', freq:'high',
   official:'Microsoft describes its culture as "learn-it-all, not know-it-all" - the belief that ability is developed rather than fixed, and that mistakes are information.',
   means:'You did not know something, you noticed, and you closed the gap - and you can say so without discomfort.',
   signal:'The defining Microsoft construct and the most reliably probed. Every "what did you learn" and "what would you do differently" is scoring this. A candidate with no revised beliefs is the anti-profile the culture change was aimed at.',
   asked:['Tell me about a time you failed.','What have you learned recently?','What would you do differently?','What is something you believed that turned out to be wrong?','How do you get up to speed on something unfamiliar?'],
   probes:['How did you realise you were wrong?','What did you do about it?','Has anything actually changed in how you work?','Did you tell anyone?'],
   strong:'A real gap with a real consequence, closed by specific effort you can describe, followed by a durable change in practice. Correcting yourself publicly is the strongest version.',
   weak:'A failure that was somebody else’s fault. A "failure" that is really a success with a delay. Or a learning that amounts to "I learned to communicate more".',
   pairs:'Accountability · One Microsoft',
   yourAngle:'Any assumption about your own stack you carried for months before checking it - delivery semantics, an isolation level, what a timeout actually does. These are honest and they are technical.'},

  {id:'customer', n:2, name:'Customer obsession', freq:'high',
   official:'One of Microsoft’s stated cultural attributes. In practice the customer is frequently internal or enterprise rather than a consumer.',
   means:'You know who depends on your work and you found out what they actually needed rather than what they asked for.',
   signal:'Backend engineers answer this badly by describing the system. The consuming team is a customer, and treating them as one - going to them, asking, changing what you built - is the whole answer.',
   asked:['Who was the customer for this?','Tell me about a time you changed something based on user feedback.','Describe pushing back on what a customer asked for.','How do you know what you built was useful?'],
   probes:['How did you find out what they needed?','What did they ask for versus what they needed?','How did you tell them no?','What did they say afterwards?'],
   strong:'You went and talked to them. You can quote what they said. You changed the design as a result, and you can say what you removed as well as what you added.',
   weak:'The customer never appears. Or they appear as a source of unreasonable requirements rather than as someone with a problem.',
   pairs:'One Microsoft · Respect',
   yourAngle:'The teams consuming your APIs and events. You know exactly what they complain about, and that is the material.'},

  {id:'onems', n:3, name:'One Microsoft', freq:'high',
   official:'Microsoft’s shorthand for collaborating across organisational boundaries rather than optimising for your own team.',
   means:'You worked across a boundary where you had no authority and no shared manager, and something got better because of it.',
   signal:'Microsoft is very large and much of the job is influence across orgs. A candidate whose every story lives inside one team has not shown they can do the actual work.',
   asked:['Tell me about working with another team.','How did you get a team that does not report to you to prioritise something?','Describe a disagreement about ownership between teams.','Tell me about a time you helped a team you were not part of.'],
   probes:['What was in it for them?','What did you do when they said no?','How did you keep it moving without authority?','Would they work with you again?'],
   strong:'You made it cheap for the other team to say yes - you turned up with the analysis, the diff, or the migration path already done. You can state their competing priority fairly.',
   weak:'Escalating to a manager as the first move. Or a story where the other team is simply an obstruction that you eventually went around.',
   pairs:'Customer obsession · Respect',
   yourAngle:'Any change that needed a downstream consumer to move with you. The event-contract change is the archetype.'},

  {id:'accountability', n:4, name:'Accountability', freq:'high',
   official:'One of Microsoft’s three published company values, alongside Respect and Integrity.',
   means:'Something went badly, you owned your share of it plainly, and you changed what caused it.',
   signal:'Tested through failure questions. The scored behaviour is naming your own contribution first, before any context about what else went wrong.',
   asked:['Tell me about something that went wrong on your watch.','Describe a decision you made that you regret.','What is the worst production incident you have been part of?','How did you handle it when you missed a commitment?'],
   probes:['What was your part in it?','How did you communicate it, and to whom?','What did you change afterwards?','Did it recur?'],
   strong:'Your own contribution stated first and without hedging, told to the people affected quickly, and followed by a specific mechanism - a test, an alert, a checklist - that prevents the repeat.',
   weak:'A chain of external causes with your own role buried at the end, or absent. Also weak: an incident with no follow-through, so nothing actually changed.',
   pairs:'Growth mindset · Integrity',
   yourAngle:'A production incident where a change of yours contributed. The alert or the test you added afterwards is the proof.'},

  {id:'respect', n:5, name:'Respect', freq:'med',
   official:'A published Microsoft value: valuing others, listening, and assuming good intent.',
   means:'You worked well with someone you found difficult, and you can describe their point of view fairly.',
   signal:'A red-flag detector more than a differentiator. How you describe a frustrating colleague is the measurement, not what you did about them.',
   asked:['Tell me about a difficult colleague.','Describe a time you received harsh feedback.','How do you handle someone who dismisses your ideas?','Tell me about a disagreement that got personal.'],
   probes:['What was their perspective?','What did you do to understand it?','How did it end?','What would they say about you?'],
   strong:'You can state the other person’s case well enough that it sounds reasonable, and you changed something about your own approach.',
   weak:'Contempt anywhere in the description. Also weak: a story where you were purely patient and nothing was required of you.',
   pairs:'One Microsoft · Integrity',
   yourAngle:'A code review disagreement that got heated, and what the other reviewer turned out to be right about.'},

  {id:'inclusion', n:6, name:'Diverse and inclusive', freq:'med',
   official:'A stated Microsoft cultural attribute: seeking out different perspectives and making sure they are heard.',
   means:'You changed how a discussion ran so that a voice that was not being heard got heard.',
   signal:'Asked more often at Microsoft than at most companies on this ladder, and answered vaguely by almost everyone. A concrete mechanism beats a sentiment every time.',
   asked:['Tell me about working with someone very different from you.','How do you make sure quieter people are heard?','Describe a time a different perspective changed your mind.','How do you onboard someone new to the team?'],
   probes:['What did you actually do differently?','Did it change the outcome?','How did you know it was working?','Have you kept doing it?'],
   strong:'A specific mechanism - going around the room, asking for written input before a meeting, pairing a newer engineer on a design - with an outcome you can point to.',
   weak:'"I treat everyone the same." That answers a different question and reads as having nothing to say.',
   pairs:'Respect · One Microsoft',
   yourAngle:'How you run design discussions or onboard someone. Written proposals ahead of a meeting is a real mechanism and you can describe its effect.'},

  {id:'integrity', n:7, name:'Integrity', freq:'low',
   official:'A published Microsoft value: being honest, ethical and trustworthy in how the work gets done.',
   means:'You told an inconvenient truth when staying quiet was available and cheaper.',
   signal:'Low frequency, high damage. A bad answer here is disqualifying; a good one is rarely the reason you are hired.',
   asked:['Tell me about a time you had to deliver bad news.','Describe a shortcut you refused to take.','When did you disagree with a decision on principle?','Tell me about a time you were asked to do something you were not comfortable with.'],
   probes:['Who did you tell?','How quickly?','What did it cost?','What happened next?'],
   strong:'Told early, told to the right person, with a real cost accepted. Proportionate rather than dramatic.',
   weak:'Nothing was at stake, so nothing was demonstrated. Or an escalation that skipped every reasonable step first.',
   pairs:'Accountability · Respect',
   yourAngle:'Telling a stakeholder a date was going to slip before you were asked, and what that conversation cost.'},

  {id:'motivation', n:8, name:'Why Microsoft, why this team', freq:'high',
   official:'Not a value - a scored question. Microsoft loops are team-specific and every interviewer asks some version of it.',
   means:'You can say what this team builds and why it interests you, without flattery.',
   signal:'Asked by the recruiter, the hiring manager and the AA interviewer, who compare answers. Inconsistency across the three is noticed.',
   asked:['Why Microsoft?','Why this team?','What do you want to work on?','Where do you want to be in three years?','How do you like to be managed?'],
   probes:['What do you know about what we build?','What would you want to change about it?','What else are you considering?','What would make this the wrong move for you?'],
   strong:'One reason about the work itself, one about this specific team, one about what you want to learn. Concrete, and consistent every time you are asked.',
   weak:'Scale, brand, and "great products". Or an answer that would apply unchanged to any of the ten companies you are interviewing at.',
   pairs:'Growth mindset',
   yourAngle:'You run Kubernetes, Postgres and event-driven services daily. Find the Microsoft team whose product is one of those things and be specific about it.'}
 ],

 prep:[
  ['Week 7','Apply - Microsoft loops take 4-8 weeks to reach onsite','The AA round is at the end, so behavioural prep has runway.'],
  ['Week 8','Recut three Amazon stories for Microsoft','Add the learning inside the action, add the cross-team boundary, soften the intensity. Keep the numbers.'],
  ['Week 9','Write the failure story properly','Real consequence, your part first, durable change. This is the highest-yield single answer in a Microsoft loop.'],
  ['Week 10','Two cross-boundary stories','Another team, another org, or an external partner - where you had no authority.'],
  ['Week 11','"Why Microsoft, why this team"','Written down, three sentences, and consistent across recruiter, hiring manager and AA.'],
  ['Week 12','Record an AA simulation','45 minutes, mostly behavioural, one interviewer probing the same weak area repeatedly. Practise answering the concern rather than routing around it.']
 ],

 source:'Partly published. Microsoft publishes its three company values (Respect, Integrity, Accountability) and its cultural attributes (growth mindset, customer obsessed, diverse and inclusive, One Microsoft, making a difference), and Satya Nadella has written publicly about growth mindset and "learn-it-all" as the organising idea. The As-Appropriate round is not formally documented by Microsoft; its role and weight here come from consistent candidate reporting. Treat the round mechanics as a working model.',
 contrast:'Against Amazon: much less rubric-recitation, much more conversation, and the failure question is a gift rather than a trap. Against Google: the decision sits with a person you meet - the AA interviewer - rather than a committee reading notes, so the room matters more and the transcript matters less.'
});

/* --------------------------------------------------------------- ADOBE --- */

PLAN.lp.co.push({
 id:'adobe', name:'Adobe', tier:2, rung:'Rung two',
 navSub:'Four core values · craft is the signal',
 label:'Core values: Genuine, Exceptional, Innovative, Involved',
 weight:'Lighter than Amazon or Microsoft, and concentrated in the hiring-manager round. The behavioural bar is not the hard part of an Adobe loop - but "why Adobe" is asked seriously and answered badly.',
 oneLine:'The one company on this ladder where code craft itself is a behavioural signal: "Exceptional" is a value, and they notice how you write, not only whether it runs.',

 scoring:{
  intro:'Adobe publishes four core values - Genuine, Exceptional, Innovative, Involved - and unlike most value sets they map cleanly onto things an engineer actually does. The loop is less rubric-driven than Amazon’s: behavioural questions are spread thinly across technical rounds and then concentrated into a hiring-manager conversation, sometimes with a director round above it.',
  rounds:[
   ['Recruiter screen','30 min','Background, motivation, level. "Why Adobe" starts here.'],
   ['Technical rounds (2-4)','45-60 min','Algorithms and OOD. Behavioural questions appear at the end but briefly. Code quality is being assessed as a signal in its own right - naming, structure, edge cases - not just correctness.'],
   ['Hiring manager round','45-60 min','Where the behavioural weight sits. Past projects in depth, how you work, why Adobe, what you want next.'],
   ['Director / skip-level','30-45 min','Not always present. Broader: motivation, longevity, how you think about the product and the craft.']
  ],
  rubric:[
   ['Craft counts as behaviour','"Exceptional" is a published value and Adobe interviewers are unusually attentive to clean, well-named, edge-case-complete code. Sloppy code that passes the tests scores worse here than at Microsoft.'],
   ['Depth on your own projects','The hiring-manager round goes deep on what you have built. Anything on your resume is fair game and shallow answers are visible.'],
   ['Genuine means unpolished is fine','Adobe’s first value is Genuine, and candidates who over-rehearse read badly. A slightly rougher, obviously real answer outperforms a smooth generic one.'],
   ['Product interest is scored','More than at Amazon or Google. Adobe builds tools people love and they notice whether you have any relationship with them or with the domain.'],
   ['Involved means mentoring and community','Code review, mentoring, open source, internal talks. This is the value most candidates have no story for.'],
   ['Fewer probes than Amazon','Two or three follow-ups per story, not eight. That sounds easier and is a trap: it means one thin answer is a larger share of the evidence.']
  ],
  reality:[
   'The loop is less adversarial than Amazon or Google. That does not mean the bar is low - it means the signal is thinner, so each answer carries more.',
   '"Why Adobe" and "which of our products do you use or care about" come up more often than candidates expect, and "I use Photoshop" is not an answer.',
   'Adobe is a large product company with a long history; longevity and genuine interest are weighed. Someone who reads as using them as a stepping stone is noticed.',
   'The OOD round doubles as a behavioural signal - how you take feedback mid-design tells them how you take feedback generally.'
  ]
 },

 framework:{
  intro:'STAR, told naturally. The Adobe failure mode is over-polish: a candidate who sounds like they have recited the answer forty times reads as inauthentic, and Genuine is the first value on their list.',
  parts:[
   ['S - Situation','20 sec · ~15%','Real context, including what you cared about. Adobe tolerates - and slightly rewards - a bit of personality here.'],
   ['T - Task','15 sec · ~10%','What you owned.'],
   ['A - Action','55-65 sec · ~45%','What you did. Include one craft decision: why you structured it that way, what you refactored, what you named and why. That is the Exceptional signal and it costs one sentence.'],
   ['R - Result','20 sec · ~15%','Quantified, plus what it was like to maintain afterwards. Adobe cares about the second half.'],
   ['L - Learning','20 sec · ~15%','What you would do differently, and anything you passed on to someone else - that is the Involved hook.']
  ],
  rules:[
   'Put one code-craft decision in every technical story. Not "I wrote clean code" - the actual choice you made and the alternative you rejected.',
   'Do not over-rehearse. Genuine is their first value and the polish that wins at Amazon reads as performance here.',
   'Have one mentoring or code-review story. Involved is the value with the fewest prepared answers and the easiest differentiation.',
   'Know what Adobe builds beyond the consumer apps - Experience Cloud, Document Cloud, the developer platform. Engineers are frequently hired onto the parts nobody outside recognises.',
   'Be ready to go three levels deep on anything on your resume. The hiring-manager round is where depth is tested and the probing is gentle but persistent.',
   'Say what the code was like to live with six months later. Maintainability is the Adobe-shaped version of "result".'
  ],
  timing:'Two minutes, with fewer follow-ups than Amazon. Because the probe count is lower, the story itself has to carry more - land the result and the craft decision inside the answer rather than waiting to be asked.'
 },

 probes:{
  intro:'Fewer probes, gentler delivery, and the same underlying questions. The Adobe risk is being lulled by a friendly round into thin answers that nobody pushed back on.',
  groups:[
   ['On craft',[
     'Why did you structure it that way?',
     'What would you refactor if you went back?',
     'How did you handle the edge cases?',
     'What was it like to maintain six months later?',
     'How do you decide when code is done?'
   ]],
   ['On your projects',[
     'Walk me through the hardest part of that system.',
     'What was your specific contribution?',
     'What would you build differently now?',
     'What did you not get to do that you wanted to?'
   ]],
   ['On collaboration and mentoring',[
     'Tell me about a code review that changed your mind.',
     'Have you mentored anyone? What did they need?',
     'How do you give feedback on someone else’s design?',
     'Tell me about disagreeing with a teammate about implementation.'
   ]],
   ['On motivation',[
     'Why Adobe?',
     'Which of our products do you know?',
     'What kind of problems do you want to work on?',
     'Where do you see yourself in a few years?'
   ]],
   ['On innovation',[
     'Tell me about something you built that did not exist before.',
     'Describe a time you proposed an idea nobody asked for.',
     'What is the most creative solution you have shipped?'
   ]]
  ],
  tactics:[
   ['When the round feels easy','Assume the signal is thin and fill it yourself. Volunteer the craft decision, the maintenance outcome and the learning without waiting for a probe.'],
   ['When asked "why Adobe"','Answer about the engineering problem, not the brand. Document processing at scale, rendering, a creative-tools pipeline, the Experience Cloud data volume - pick something real.'],
   ['When asked which products you know','Honesty beats bluffing. "I have not used Illustrator seriously, but I have worked with the PDF spec and it is a genuinely hard format" is a good answer.'],
   ['When you have no mentoring story','Use code review. Reviewing well is mentoring, and describing how you review - what you comment on and what you let go - is a real answer to Involved.'],
   ['When they push on a resume item','Go deep immediately and say plainly where your knowledge stops. The gentle probing is still probing, and a confident vagueness is the thing it catches.']
  ]
 },

 anti:[
  ['Over-rehearsed delivery','Smooth, identical cadence on every story, no hesitation anywhere. Genuine is Adobe’s first published value and the polish that wins at Amazon reads as performance here.',
   'FIX: know the content cold, but let the delivery be a conversation. Pausing to remember a real detail is fine.'],
  ['No craft anywhere','Every story is about what the system did and nothing about how it was written. Exceptional is a published value and code quality is a scored signal at Adobe.',
   'FIX: one structural or naming decision per technical story, with the alternative you rejected.'],
  ['No Involved story','Nothing about mentoring, review, or making anyone else better. This is the value with the fewest prepared answers, which makes it the cheapest one to win.',
   'FIX: prepare one review or mentoring story. Describing how you review code counts.'],
  ['"Why Adobe" answered with Photoshop','Naming a consumer app you barely use. Most Adobe engineering is not that, and the answer signals no research.',
   'FIX: name a real engineering problem in their space - document processing, rendering, Experience Cloud scale - and connect it to what you do.'],
  ['Thin answers because nobody pushed','The probe count is low, so a candidate who answers only what was asked leaves a small evidence base behind.',
   'FIX: volunteer the second layer. The result, the maintenance outcome, the thing you would change.'],
  ['Sloppy code in the technical round','Passing the tests with poor naming, no edge cases, no structure. This costs more at Adobe than anywhere else on the ladder.',
   'FIX: name things properly, handle the empty and null cases out loud, and say what you would extract if this were production.']
 ],

 worked:{
  question:'Tell me about a piece of code or a system you are particularly proud of.',
  principle:'Exceptional · Involved · Genuine',
  story:[
   ['S - Situation','We had a pricing component inside our order service that had grown into a single method of about four hundred lines. Every new promotion type added another branch. It was correct - we had good tests - but every change took a day and a half, and two people had introduced bugs in it in the previous quarter.',
    'Names the real problem honestly, including the fact that the code was correct. Admitting that the thing you rewrote worked is the Genuine register - it resists the temptation to make the before-state worse than it was.'],
   ['T - Task','Nobody asked me to fix it. I picked it up during a quarter where we had two new promotion types coming, because I was going to be the one adding both of them.',
    'Self-initiated, with a plain and slightly self-interested reason. That reads as real rather than heroic.'],
   ['A - Action','I did not start by rewriting. I started by listing every promotion type we had and asking what actually varied between them - it turned out to be exactly two things: how the discount was computed, and what made an order eligible. Everything else in those four hundred lines was shared. So it became a small interface with a compute method and a predicate, one implementation per promotion type, and a resolver that picked the applicable ones in a defined order. I kept the old method as a delegating shim for one release and ran both paths in parallel against production traffic, comparing outputs, before deleting it. On naming: I deliberately called the interface PricingRule rather than PricingStrategy, because the domain people already said "rule" and matching their vocabulary meant they could read the class list and check it. Two of them did, and they caught an ordering mistake I had made between percentage and fixed-amount discounts.',
    'This is the Exceptional beat done properly. The design derives from "what varies", the migration is safe rather than brave, and the naming decision is justified in domain terms with an outcome attached. The parallel-run detail is the one that convinces an interviewer this actually happened.'],
   ['R - Result','The two new promotion types took about two hours each instead of a day and a half. The class list is readable by non-engineers, which is how the ordering bug got caught before it shipped. And that area has not had a production bug since - about a year now.',
    'Quantified in the currency that matters for a refactor - cost of the next change - plus the maintenance outcome Adobe asks about.'],
   ['L - Learning','The thing I would do differently is the parallel run. I compared outputs by logging both and diffing offline, which was fiddly and I nearly gave up on it. Writing a proper shadow comparison with a metric would have taken an extra afternoon and made it boring instead of nervy. I have done it that way since. The thing I would keep is asking the domain people to read the class names - that cost nothing and caught a real bug.',
    'A genuine, specific regret about method rather than outcome, and a practice worth passing on. The last sentence is the Involved hook - a habit other people can adopt.']
  ],
  probesAndAnswers:[
   ['Why an interface rather than just splitting the method up?','Because the axis of change was clear. Two things varied per promotion and everything else was shared, so an interface with those two operations meant a new promotion is one new class and no edits to existing code. If the variation had been messier I would have started with private methods and waited - I have over-abstracted before and it is worse than a long method.'],
   ['What would you refactor if you went back?','The resolver ordering is still implicit - it depends on the order rules are registered, which is a comment rather than a constraint. I would make precedence an explicit property on the rule so it cannot be got wrong by re-ordering a list.'],
   ['How did you make sure the behaviour was identical?','Parallel run against real traffic, comparing old and new output for every order for a release, and the existing test suite which was genuinely good. The tests were the reason this was safe to attempt at all.'],
   ['You said domain people read the class list. How did that work?','I sent them the list of rule class names and asked whether it matched what they thought the promotions were. That is all. One of them said the order looked wrong between two discount types, and she was right.'],
   ['Have you shared this approach with anyone else?','I wrote up the "list what varies before you extract anything" step for our team wiki, because that is the part people skip. Two other refactors since have used it, and one person came back and told me it stopped them extracting the wrong abstraction.']
  ],
  why:'It leads with craft, which is what Adobe notices. The design decision is derived rather than asserted - "what varies" is a visible piece of reasoning, not a pattern name dropped in. The naming choice is justified in domain terms and has a measurable consequence. The migration is careful rather than bold, which reads as someone who has broken production before. The regret is about method and is specific. And it ends with something passed on to other people, which is the Involved value that almost nobody prepares for.'
 },

 values:[
  {id:'genuine', n:1, name:'Genuine', freq:'high',
   official:'Adobe: sincere, trustworthy and reliable - what you say is what you mean.',
   means:'You answer honestly, including about the parts that did not work or that you do not know.',
   signal:'Adobe’s first value, and it changes the register of the whole loop. An obviously rehearsed candidate scores worse here than a slightly rough one who is clearly describing something real.',
   asked:['Tell me about a project that did not go well.','What are you not good at?','What did you not get to finish?','What is something you are still figuring out?'],
   probes:['What was your part in it?','What did you tell people at the time?','What do you wish you had said?','How do you feel about it now?'],
   strong:'Plain honesty with no spin. Admitting the limits of your knowledge inside a technical answer, unprompted, is the strongest form of it.',
   weak:'A flawlessly polished narrative with no rough edges. Or a "weakness" that is a strength in disguise.',
   pairs:'Involved · Exceptional',
   yourAngle:'The thing you shipped that you would not build the same way. Say it plainly, including why it seemed right at the time.'},

  {id:'exceptional', n:2, name:'Exceptional', freq:'high',
   official:'Adobe: setting high standards and delivering work you are proud of.',
   means:'Your code is good to read and good to change, and you can explain the decisions that made it so.',
   signal:'The value with the most direct engineering meaning, and Adobe interviewers assess it in the coding round itself. Naming, structure and edge cases are scored, not just correctness.',
   asked:['Tell me about code you are proud of.','What does good code look like to you?','Describe a refactor you did.','How do you decide when something is done?'],
   probes:['Why that structure?','What did you reject?','What was it like to maintain?','What would you change now?'],
   strong:'A design decision derived from what varies, with the rejected alternative named, and a maintenance outcome measured in the cost of the next change.',
   weak:'"I write clean code and follow best practices." No decision, no alternative, no consequence. Also weak: a rewrite with no migration story.',
   pairs:'Innovative · Genuine',
   yourAngle:'The strategy-shaped refactor in your order or pricing code. The "what varies" derivation is the part worth narrating.'},

  {id:'innovative', n:3, name:'Innovative', freq:'med',
   official:'Adobe: imaginative and creative in solving problems, and willing to try things that have not been tried.',
   means:'You built something that did not exist, or solved a problem in a way the team had not considered.',
   signal:'Adobe is a product company built on creative tools and this value is meant literally. It is not "I used a new framework" - it is a problem framed differently.',
   asked:['Tell me about something you built that nobody asked for.','Describe the most creative solution you have shipped.','When did you solve a problem in an unexpected way?','What have you automated?'],
   probes:['What made you think of it?','Who else had tried?','How did you get permission?','Did it survive?'],
   strong:'A reframing rather than a technology choice. The interesting part is why the obvious approach was wrong, and how you saw that.',
   weak:'Adopting a new library and calling it innovation. Or an idea that never shipped and has no outcome.',
   pairs:'Exceptional · Involved',
   yourAngle:'Any internal tool or automation you built because a manual process annoyed you. Small and real is fine; it needs a before and an after.'},

  {id:'involved', n:4, name:'Involved', freq:'med',
   official:'Adobe: engaged with the team, the company and the community - making other people better.',
   means:'Someone else is better at their job because of something you did.',
   signal:'The value with the fewest prepared answers on the whole ladder, which makes it the cheapest place to differentiate at Adobe.',
   asked:['Have you mentored anyone?','Tell me about a code review that mattered.','How do you help new people get up to speed?','What have you contributed outside your own tickets?'],
   probes:['What did they need?','What did you actually do?','How did it turn out for them?','Do you still do it?'],
   strong:'A named person, a specific gap, a specific thing you did, and what changed for them. Reviewing code well counts - describe what you comment on and what you deliberately let go.',
   weak:'"I am always happy to help the team." No person, no gap, no outcome.',
   pairs:'Genuine · Innovative',
   yourAngle:'How you review code, or the write-up you did that another engineer then used. Documentation that someone actually followed is a real Involved story.'},

  {id:'motivation', n:5, name:'Why Adobe', freq:'high',
   official:'Not a value - a question, asked seriously and repeatedly through an Adobe loop.',
   means:'You know what Adobe engineering actually is, beyond the consumer applications.',
   signal:'Adobe hires many engineers onto Experience Cloud, Document Cloud and platform work that nobody outside the company recognises. Naming one of those is immediate evidence of research.',
   asked:['Why Adobe?','Which of our products do you know?','What would you want to work on?','What do you know about this team?'],
   probes:['What interests you about that problem specifically?','Have you used it?','What else are you looking at?','What would make this a bad fit for you?'],
   strong:'One real engineering problem in their space connected to something you have built, plus honesty about which products you do and do not know.',
   weak:'"I love Photoshop." Or an answer that would apply unchanged to any large product company.',
   pairs:'Genuine',
   yourAngle:'Document Cloud and Experience Cloud are backend-heavy, high-volume, Java-and-data problems. That is your stack; say so concretely.'}
 ],

 prep:[
  ['Week 7','Apply alongside Amazon and Microsoft','Adobe loops move at a similar pace, 4-8 weeks to onsite.'],
  ['Week 8','Write the craft story','A refactor or a design decision, with the rejected alternative and the maintenance outcome.'],
  ['Week 9','Write the Involved story','Mentoring, code review, or a write-up someone else used. This is the cheapest differentiation in the loop.'],
  ['Week 10','Research Adobe engineering properly','Experience Cloud, Document Cloud, the developer platform. One paragraph you could say out loud.'],
  ['Week 11','Deliberately under-polish','Rehearse for content, not for delivery. Practise the stories until you know them, then stop.'],
  ['Week 12','One OOD mock, judged on code quality','Not just whether it works. Naming, edge cases, structure - the Exceptional signal is assessed live.']
 ],

 source:'Partly published. Adobe publishes its four core values - Genuine, Exceptional, Innovative, Involved - on its careers site. The loop structure, the weight on code craft, and the emphasis on the hiring-manager round come from consistent candidate reporting rather than from Adobe documentation; treat those as a working model.',
 contrast:'Against Amazon: far fewer probes and no bar raiser, which means each answer carries more evidence rather than less. Against Microsoft: similar warmth, but Adobe assesses code craft as a behavioural signal in a way Microsoft does not, and cares more about whether you have a genuine relationship with the product domain.'
});

/* ----------------------------------------------------------- JP MORGAN --- */

PLAN.lp.co.push({
 id:'jpm', name:'JP Morgan', tier:1, rung:'Rung one',
 navSub:'Business principles · HireVue first',
 label:'How We Do Business - the business principles',
 weight:'Two distinct gates. A pre-recorded video interview with no human in it, early, which filters before anyone reads your code. Then a hiring-manager and sometimes an MD conversation at the end.',
 oneLine:'The only company on this ladder that scores you on risk thinking - and the first one you will interview at, in week four, on a format you have probably never practised.',

 scoring:{
  intro:'JP Morgan is a bank, and the behavioural bar reflects that in one specific way that catches product-company engineers out: they are listening for whether you think about what could go wrong, who approves it, and what the audit trail looks like. A story where you shipped fast and broke something and fixed it fast - the Amazon-shaped story - lands differently in a room where an outage has a regulator attached to it.',
  rounds:[
   ['HireVue / pre-recorded video','20-30 min, no human','Three to five behavioural questions. Around 30 seconds to prepare, 60-90 seconds to answer, sometimes one retake, sometimes none. Nobody interrupts, nobody probes, nobody nods. It is reviewed later - increasingly with automated assistance - and it is a real filter.'],
   ['Technical rounds (2-3)','45-60 min','Java, Spring, SQL, concurrency, and a deep dive on a system you actually run. Behavioural questions bracket the technical content.'],
   ['Hiring manager','45-60 min','The main behavioural round. Your production experience in depth, how you handle risk and change, why JPM, and stability of intent.'],
   ['MD / senior round','30-45 min','Not always present. Broader and more values-shaped: integrity, client focus, how you work under scrutiny, and why financial services.']
  ],
  rubric:[
   ['Risk and control thinking','The differentiator, and the thing nobody prepares. Every story should be able to answer: what could have gone wrong, who signed off, how would you have known, how would you have rolled back.'],
   ['The client is real and specific','Trading desks, operations, compliance, an external corporate client. "The business" is a person with a name and a deadline, and knowing who yours was is scored.'],
   ['Integrity and escalation','Banks care disproportionately about whether you raise problems rather than absorb them quietly. Sitting on a defect to protect a date is the wrong answer here in a way it is not everywhere.'],
   ['Follow-through and stability','JPM interviews for people who will still be there in three years operating the thing they built. Enthusiasm for disruption reads worse here than at any product company.'],
   ['Teamwork in a large hierarchy','Working through a structure - approvals, change boards, other teams - rather than around it.'],
   ['The video round is scored blind','No probes, no chemistry, no recovery. Your answer has to be self-contained, structured and inside the time limit, which is a different skill from a conversation.']
  ],
  reality:[
   'The HireVue is the first real gate and candidates lose here without ever knowing why. Practise it on camera, to a timer, with no audience - it is genuinely unpleasant the first time.',
   'This is your week-four interview. It arrives before your behavioural prep would naturally be finished, which is why it is scheduled early in the plan rather than late.',
   '"Why JP Morgan" and "why financial services" are asked sincerely. Engineers answer them badly because they have not thought about it, and the answer "it is a stable large company" is heard as "I will leave".',
   'Your production experience is worth more here than anywhere else on the ladder. A candidate who runs Kubernetes and Postgres in anger and can talk about a real incident is exactly what this rung is buying.'
  ]
 },

 framework:{
  intro:'STAR, with a fifth element that is effectively mandatory: the control. What could have gone wrong, and what did you put in place so it did not. Adding one sentence of that to each story is the single highest-value adaptation on this ladder, because almost no candidate from a product background does it.',
  parts:[
   ['S - Situation','20 sec · ~15%','Name the client or the business function. "The reconciliation team", "the settlements desk", "the fraud operations group" - not "stakeholders".'],
   ['T - Task','15 sec · ~10%','What you owned, and what the deadline or regulatory constraint was if there was one.'],
   ['A - Action','50-60 sec · ~40%','What you did, including how you got it approved and who reviewed it. In a bank, "I merged it" is not a complete sentence.'],
   ['C - Control','15 sec · ~10%','The JPM-specific part. What could have gone wrong, what you put in place - a rollback, a feature flag, a reconciliation check, a dual-run, an alert - and how you would have known if it had.'],
   ['R - Result','20 sec · ~15%','Quantified, and include the absence of incidents as a result. "Zero breaks in eighteen months" is a strong sentence in this room.'],
   ['L - Learning','15 sec · ~10%','What you changed afterwards. Process changes count for more here than at a product company.']
  ],
  rules:[
   'Add the control sentence to every technical story. This is the adaptation that separates a bank-ready answer from a product-company one, and it costs fifteen seconds.',
   'Name a real client or business function. Vague "stakeholders" reads as someone who has never been close to the business.',
   'Do not lead with speed. "We shipped it in two days" is a warning here unless it is immediately followed by how it was made safe.',
   'For the HireVue: 90 seconds means roughly 200 words. Write and time three answers. No probes are coming, so the story must be complete without them.',
   'Have an escalation story - a time you raised something inconvenient early. This is scored more heavily at a bank than anywhere else on the ladder.',
   'Answer "why financial services" with something about the problem domain: correctness, money, reconciliation, latency, regulation. Not stability, not the brand.'
  ],
  timing:'Video round: 60-90 seconds, hard stop, no recovery. Live rounds: two minutes and normal follow-ups. Practise both - they are different skills and the video one is the one you will meet first.'
 },

 probes:{
  intro:'JPM probes for risk, for who approved things, and for whether you stay. The technical probing is deep but it is in the tech round; the behavioural round is about judgement under scrutiny.',
  groups:[
   ['On risk and control',[
     'What could have gone wrong?',
     'How would you have known if it had?',
     'What was your rollback?',
     'Who reviewed or approved the change?',
     'Have you ever caused a production incident? Walk me through it.'
   ]],
   ['On the client',[
     'Who was the business user here?',
     'How did you know what they needed?',
     'Tell me about a time you pushed back on a business request.',
     'What happened when you missed something they needed?'
   ]],
   ['On integrity and escalation',[
     'Tell me about a time you raised a problem nobody wanted to hear.',
     'Have you ever been asked to cut a corner?',
     'When did you have to say something was not ready?',
     'What would you do if you found a defect the day before a release?'
   ]],
   ['On working in a large organisation',[
     'How do you get a change through when three teams have to agree?',
     'Tell me about working with a team you had no authority over.',
     'How do you handle a process you think is unnecessary?',
     'Describe a time you had to work within a constraint you disagreed with.'
   ]],
   ['On motivation and stability',[
     'Why JP Morgan?',
     'Why financial services?',
     'Why are you leaving your current role?',
     'Where do you want to be in three to five years?',
     'What do you want from your next team?'
   ]]
  ],
  tactics:[
   ['On the HireVue, with no interviewer','Look at the camera lens, not the screen. Structure out loud - "there were three things I did" - because there is nobody to steer you. Stop before the timer rather than being cut off mid-sentence.'],
   ['When asked what could have gone wrong','Answer with a real failure mode and the specific control, not a general reassurance. "The migration could have locked the table under load, so we backfilled in batches with a kill switch and watched lock waits" is the register.'],
   ['When asked about a process you disagree with','Show you worked within it and then tried to change it, in that order. "I went around it" is the wrong answer in a regulated environment, however justified it felt.'],
   ['When asked why you are leaving','Be plain and forward-looking. Criticism of your current employer lands worse here than at a product company - discretion is itself a signal.'],
   ['When asked "why financial services"','Talk about correctness and consequence. Money that has to reconcile, transactions that cannot be lost, systems where being approximately right is a defect. That is a real answer and it is also true.']
  ]
 },

 anti:[
  ['No risk thinking anywhere','Stories about shipping fast with no mention of what could break, who approved it, or how you would have rolled back. This is the single most common way product-company engineers underperform at a bank.',
   'FIX: add the control sentence to every technical story. Rollback, flag, dual-run, reconciliation, alert - name the specific one.'],
  ['Treating the HireVue as a formality','No practice, no timer, reading from notes off-screen, rambling past the limit. It is a real filter and it happens before any human sees your code.',
   'FIX: three answers, on camera, to a 90-second timer, watched back. Do it twice.'],
  ['Speed as the headline','"We had it in production in two days." In a bank this raises a question rather than answering one.',
   'FIX: lead with the outcome and the safety, and let the speed be a detail inside it.'],
  ['"The business" as an abstraction','No named client, no named function, no idea who used the thing. It reads as an engineer who has never been near the people paying for the work.',
   'FIX: name the desk, the team or the operation. If you genuinely do not know who consumed your system, that is worth finding out before the interview.'],
  ['Going around the process','A story where the change board or the approval step was the obstacle you cleverly avoided. In a regulated environment this is disqualifying rather than resourceful.',
   'FIX: worked within it, then argued to change it. That is the story they want and it is usually the true one.'],
  ['"Why JPM" answered with stability','"It is a large, stable company." Every interviewer hears "I will leave when something more interesting comes along."',
   'FIX: the problem domain. Correctness, scale, regulation, latency, the fact that the systems have to be right rather than approximately right.'],
  ['Criticising your current employer','Common, and it reads as a discretion risk in an industry built on discretion.',
   'FIX: forward-looking reasons only. What you want next, not what you are escaping.'],
  ['No escalation story','Nothing where you raised an inconvenient problem. Banks weight this heavily because absorbing problems quietly is how they become incidents with regulators attached.',
   'FIX: prepare one. A defect found late, a date you said would slip, a design you flagged as unsafe.']
 ],

 worked:{
  question:'Tell me about a significant change you made to a production system.',
  principle:'Operational excellence · Integrity · Client service',
  story:[
   ['S - Situation','Our orders service wrote to a Postgres table that had grown to a few hundred million rows. The operations team - the people who chase failed orders - ran a status query against it that had gone from under a second to about forty seconds, and they were the ones who told us, which is not how I want to find out.',
    'A named client: the operations team, real people with a job. And the admission that they discovered it first, which is the honest version and reads as accountability rather than as a defect in the story.'],
   ['T - Task','I owned the change. What I had to add was a composite index and a partitioning change on a table that is written to continuously by a system that takes customer orders. The constraint was that we could not take a write outage.',
    'States the actual technical risk in one sentence. The constraint is named up front, which is the shape a bank interviewer is listening for.'],
   ['A - Action','I did it in stages rather than in one change. First I reproduced the query plan on a restored snapshot so I could confirm the index would be used before touching production - the planner was doing a sequential scan because the existing index had the columns in the wrong order for that predicate. I built the new index with CREATE INDEX CONCURRENTLY so it would not take a write lock, in a low-traffic window, and watched lock waits and replication lag while it built. I did not drop the old index at the same time; I left it for a release so that a rollback was just a planner hint away rather than a rebuild. The partitioning was separate and slower - expand, migrate, contract over three releases, with the application dual-reading during the middle one. Every step went through our change process and the DBA reviewed the migration, which caught that my first partition key would have put all recent orders in one partition and recreated the hot spot.',
    'Staged, reversible, reviewed. The rejected first partition key is the honest detail that makes the review sound real rather than ceremonial, and it credits the reviewer. This paragraph is doing the work of both Operational excellence and the control element.'],
   ['C - Control','The specific things that could have gone wrong were a write lock during the index build and a bad partition key creating a new hot spot. For the first, CONCURRENTLY plus a monitored window plus a documented abort - if lock waits crossed a threshold we would cancel the build, and I had the command ready. For the second, the DBA review caught it, and afterwards I added a check on partition row-count skew to the dashboard so a bad key would be visible within a day rather than a quarter.',
    'This is the paragraph that does not exist in a product-company answer, and it is the one that most distinguishes a candidate at JPM. Two named failure modes, a specific control for each, a documented abort, and a detection mechanism added afterwards.'],
   ['R - Result','The operations query went from about forty seconds to under a second. No write outage, no incident, and no rollback needed. That has held for a bit over a year, and the skew check has never fired, which is the outcome I wanted from it.',
    'Quantified, and the absence of incident is stated as a result. "No rollback needed" and "no incident" are the sentences that land in this room.'],
   ['L - Learning','Two things. The operations team should not have been the ones to tell us - we had no alert on query latency for the queries they cared about, only on ours, so I added a p95 alert on their three critical queries. And I would involve the DBA at the design stage rather than at review; the partition key mistake would have taken five minutes to avoid and took a review cycle to catch.',
    'Both learnings are process changes, which is the currency at a bank. The first also closes the loop on the uncomfortable opening detail.']
  ],
  probesAndAnswers:[
   ['What would you have done if the index build had started causing lock waits?','Cancelled it. CREATE INDEX CONCURRENTLY can be cancelled and it leaves an invalid index behind, which you then drop - that is a clean-up, not an outage. I had both commands written down before I started, which is the only reason I would have been willing to run it at all.'],
   ['Who approved this?','It went through our normal change process - a written change record with the rollback documented, technical review from the DBA, and sign-off from my tech lead. The partitioning work needed a second review because it spanned three releases.'],
   ['You said the ops team found it first. How did that conversation go?','Not comfortably. They had been working around it for a couple of weeks before they raised it, which told me they did not think we would prioritise it. I took that seriously - the alert I added afterwards was partly about the query and partly about making sure they did not have to be the monitoring.'],
   ['What if the partitioning had gone wrong mid-migration?','That is why it was expand-migrate-contract across three releases rather than one. During the middle release the application dual-read from both the old table and the partitioned one, so at any point the old path was still live and the rollback was a config change. The cost is that it takes three releases instead of one, and in this environment that is the right trade.'],
   ['Would you do anything differently with the timeline?','I would run it slower, not faster. I compressed the partitioning into three consecutive releases and there was a week where two migrations were in flight at once. Nothing went wrong, but if something had, working out which change caused it would have been harder than it needed to be.']
  ],
  why:'It has a named client who is a real team with a real job. It names the technical risk before the solution. Every step is staged, reversible and reviewed, and the review caught a genuine mistake that the candidate reports without defensiveness. The control paragraph names two specific failure modes with a specific control and abort procedure for each - that is the paragraph a bank is listening for and the one a product-company answer never contains. The result includes the absence of incident. And both learnings are process changes, one of which closes the uncomfortable detail the story opened with.'
 },

 values:[
  {id:'client', n:1, name:'Exceptional client service', freq:'high',
   official:'The first of JPMorgan Chase’s published business principles: be field and client focused, and do the right thing for the client.',
   means:'You know who consumed your system, what they needed, and what it cost them when it was wrong.',
   signal:'Engineers at banks sit closer to the business than at product companies, and JPM tests whether you have made that connection. A named desk or operations team in the first sentence of a story is worth a great deal.',
   asked:['Who used the system you built?','Tell me about working directly with a business user.','Describe a time you pushed back on a business request.','How do you find out what they actually need?'],
   probes:['What was their deadline and why?','What did they ask for versus what they needed?','How did you tell them no?','What happened when you got it wrong?'],
   strong:'A named function, a specific need, and a change you made because you understood their workflow rather than their ticket.',
   weak:'"Stakeholders" throughout. Or a story where requirements arrived as a document and nobody was ever spoken to.',
   pairs:'Operational excellence · Integrity',
   yourAngle:'Whoever operates or reconciles against your system - support, operations, finance. Find out who they are before the interview if you do not know.'},

  {id:'ops', n:2, name:'Operational excellence', freq:'high',
   official:'A published business principle: set the highest standards of performance, execute with discipline, and get it right the first time.',
   means:'You changed production safely - staged, reversible, monitored, reviewed - and can describe how.',
   signal:'The core of the JPM engineering behavioural bar and where your actual experience is worth the most. Anyone can describe a deploy; describing a safe one is the differentiator.',
   asked:['Tell me about a significant production change.','How do you deploy something risky?','Describe a migration you ran.','Tell me about a production incident you were part of.'],
   probes:['What was your rollback?','How would you have known it was going wrong?','Who reviewed it?','What would you do differently?'],
   strong:'Named failure modes, a specific control for each, a documented abort, and a detection mechanism added afterwards. Absence of incident stated as a result.',
   weak:'"We deployed it and monitored it." No named risk, no rollback, no reviewer. Or a story where speed is the point.',
   pairs:'Client service · Integrity',
   yourAngle:'Your Postgres migrations and your Kubernetes rollouts. Expand-migrate-contract, CONCURRENTLY, canary, readiness probes - this is your strongest ground on the whole ladder.'},

  {id:'integrity', n:3, name:'Integrity, fairness and responsibility', freq:'high',
   official:'A published business principle: a commitment to integrity, fairness and responsibility in how the business is conducted.',
   means:'You raised something inconvenient early, to the right person, and accepted the cost.',
   signal:'Weighted more heavily at a bank than anywhere else on this ladder, because quietly absorbed problems become regulatory events. The scored behaviour is raising it, not solving it heroically.',
   asked:['Tell me about a time you raised a concern nobody wanted to hear.','Have you ever been asked to cut a corner?','When did you have to say something was not ready?','What would you do if you found a serious defect the day before release?'],
   probes:['Who did you tell, and how quickly?','What was the pressure not to?','What did it cost you?','What happened afterwards?'],
   strong:'Raised early, through the right channel, with a real cost - a slipped date, an awkward conversation with someone senior - and no drama in the telling.',
   weak:'Nothing at stake. Or an escalation that skipped the person who should have heard it first.',
   pairs:'Operational excellence · Great team',
   yourAngle:'The release you argued to hold, or the defect you reported that cost your own team a date.'},

  {id:'team', n:4, name:'A great team and winning culture', freq:'med',
   official:'A published business principle: build the best team, treat people with respect, and work as a partnership across the firm.',
   means:'You got things done through a large organisation - approvals, other teams, people you had no authority over - without going around it.',
   signal:'JPM is very large and heavily structured. The test is whether you can work through structure rather than resent it.',
   asked:['How do you get a change through when several teams must agree?','Tell me about working with a team you had no authority over.','Describe a process you thought was unnecessary.','Tell me about mentoring or onboarding someone.'],
   probes:['What was in it for them?','How long did it take?','What did you do when someone said no?','Did you try to change the process afterwards?'],
   strong:'You made it cheap for others to agree, worked within the process, and then argued to improve it with evidence from having followed it.',
   weak:'A story where the process is the villain and you cleverly bypassed it. Also weak: escalating to a manager as the first move.',
   pairs:'Client service · Integrity',
   yourAngle:'Any change needing sign-off from a team that had no reason to prioritise you. Turning up with the migration already written is the move.'},

  {id:'risk', n:5, name:'Risk and control mindset', freq:'high',
   official:'Not a numbered principle, but the operating culture of the firm and the most distinctive thing a JPM interviewer listens for in an engineer.',
   means:'Before you change anything you have already asked what could go wrong, how you would know, and how you would undo it.',
   signal:'The single biggest gap between a product-company candidate and a bank-ready one. It is not a story you tell - it is a sentence you add to every other story.',
   asked:['What could have gone wrong?','How do you decide whether a change is risky?','Tell me about a time you were wrong about the risk of something.','What controls did you put around that?'],
   probes:['How would you have detected it?','What was the abort procedure?','Who else needed to know?','Did you add anything afterwards so the next person would see it sooner?'],
   strong:'Specific failure modes with specific controls, an abort you had prepared before you started, and detection added afterwards so the same class of problem is visible next time.',
   weak:'General reassurance - "we tested it thoroughly" - with no named failure mode and no rollback. Or risk mentioned only when asked.',
   pairs:'Operational excellence · Integrity',
   yourAngle:'You have real examples: index builds, migrations, rollouts. The material exists; what is missing is the habit of saying the control part out loud.'},

  {id:'motivation', n:6, name:'Why JPM, why financial services', freq:'high',
   official:'Not a principle - a question, asked at every stage from the HireVue to the MD round, and answered poorly by most engineers.',
   means:'You have an actual reason to work on financial systems that is about the problems rather than the salary or the stability.',
   signal:'The answer "large and stable" is heard as "will leave when something more interesting appears". Banks are sensitive to this because engineer attrition is expensive and visible.',
   asked:['Why JP Morgan?','Why financial services?','Why are you leaving your current role?','Where do you want to be in five years?'],
   probes:['What do you know about what this team builds?','What interests you about that specifically?','What else are you interviewing for?','What would make this the wrong move?'],
   strong:'The domain: correctness, reconciliation, money that must not be lost, latency with consequences, regulation as a design constraint. Connected to something you have actually built.',
   weak:'Stability, brand, size, or compensation. Or criticism of your current employer as the reason.',
   pairs:'Integrity',
   yourAngle:'You have built idempotent, event-driven systems where duplicates matter. That is a payments problem in everything but name - say it that way.'}
 ],

 prep:[
  ['Week 2','Resume rewritten, referrals lined up','Kubernetes, event-driven, Postgres. This is the profile rung one is buying.'],
  ['Week 3','Apply - JPM, Amex, Expedia','This is the earliest gate on the ladder. Interviews land in week four.'],
  ['Week 3','Record three HireVue answers','90 seconds, on camera, to a timer, watched back. Do not meet this format for the first time in the real thing.'],
  ['Week 3','Add the control sentence to four existing stories','What could have gone wrong, what you put in place, how you would have known. Fifteen seconds each.'],
  ['Week 4','Write the escalation story','A problem you raised early that cost you something.'],
  ['Week 4','"Why financial services", written down','Three sentences about correctness and consequence. Not stability.']
 ],

 source:'Partly published. JPMorgan Chase publishes its business principles - client focus, operational excellence, integrity/fairness/responsibility, and a great team and winning culture - in its annual How We Do Business report. The HireVue video stage, its timing and format, and the weight given to risk and control thinking come from consistent candidate reporting and from the general practice of the industry rather than from JPM documentation. Treat the round mechanics as a working model and the emphasis on control as a well-evidenced pattern rather than an official rubric.',
 contrast:'Against Amazon: speed is a liability here rather than an asset unless it is paired with safety, and "I decided and shipped it" needs a reviewer in the sentence. Against Google: no hypotheticals, far more weight on what you actually operate in production, and a video round with no human in it that Google has no equivalent of.'
});

/* ---------------------------------------------------------------- UBER --- */

PLAN.lp.co.push({
 id:'uber', name:'Uber', tier:3, rung:'Rung three',
 navSub:'Eight cultural norms · ethics is real',
 label:'Cultural norms (2017 reset)',
 weight:'One dedicated round plus behavioural questions through the loop. Compressed, because the machine-coding round eats the schedule - which means each answer counts for more.',
 oneLine:'The company that publicly rewrote its values after a cultural crisis, and now asks about ethics in a way that is not ceremonial.',

 scoring:{
  intro:'Uber replaced its original fourteen "cultural values" - the set that included "always be hustlin\'" and "principled confrontation" - with eight cultural norms after the 2017 crisis. That history matters for your preparation in a concrete way: "We do the right thing. Period." is not decoration, and the ethics question in an Uber loop is asked by people who watched what happened when it was not asked.',
  rounds:[
   ['Recruiter screen','30 min','Motivation, level, timeline. Lightly behavioural.'],
   ['Technical rounds','45-60 min each','Algorithms close to the Google bar, plus a system design round where geo and real-time topics recur for obvious reasons.'],
   ['Machine coding','60-90 min','Runnable, tested code under a clock. Not behavioural on paper, but how you handle running out of time is read as behaviour - and it is where most candidates fail.'],
   ['Hiring manager / values round','45-60 min','The dedicated behavioural round. Ownership, ambiguity, disagreement with senior people, and at least one ethics or judgement question.'],
   ['Bar-raiser-equivalent','45-60 min','Not always present and not always named as such. A trained interviewer from outside the team, calibrating against the company bar rather than the team’s need.']
  ],
  rubric:[
   ['Ownership without a mandate','"We act like owners" is the norm that maps most directly onto engineering work. The scored version is fixing something nobody assigned you and staying for the consequences.'],
   ['Ideas over hierarchy, demonstrated','A story where you disagreed with someone senior and were right - or were wrong and said so - is directly on-rubric. This is one of the eight norms by name.'],
   ['Doing the right thing, tested seriously','Post-2017 this is a real question with a real answer expected. They want evidence you would raise something rather than absorb it.'],
   ['Perseverance through a bad stretch','"We persevere" - a project that went badly for months before it worked. Uber operations are relentless and they want evidence you do not fold.'],
   ['Global thinking, local reality','"We build globally, we live locally" - a system that had to work differently in different markets, timezones, currencies or regulatory regimes.'],
   ['Compressed schedule, higher stakes per answer','The machine-coding round takes an hour and a half of the loop. There is less behavioural time than at Amazon and each answer is a larger share of the evidence.']
  ],
  reality:[
   'The machine-coding round is the differentiator and the most common failure. An unfinished elegant design scores below a finished plain one, and how you narrate the last ten minutes is read as behaviour.',
   'The 2017 reset is recent enough that interviewers were there for it. Answers about ethics that sound performative land badly with people who lived through the real version.',
   'Disagreeing with a senior person is a positive story here in a way it is not everywhere. "We value ideas over hierarchy" is a published norm.',
   'Geo, real-time and matching problems recur across both the design and the behavioural rounds, because that is what the company is.'
  ]
 },

 framework:{
  intro:'STAR, told with more ownership than Google wants and less ceremony than JPM wants. Uber is closer to Amazon in register - "I decided, I built, I stayed" - but with an ethics dimension Amazon does not test and a tolerance for admitting a long bad stretch that Amazon does not reward.',
  parts:[
   ['S - Situation','20 sec · ~15%','Include the operational reality if there was one - traffic, markets, timezones, a launch date that was not moving.'],
   ['T - Task','15 sec · ~10%','What you took on, and whether anyone asked you to. "Nobody assigned this" is a good opening at Uber.'],
   ['A - Action','55-65 sec · ~45%','What you did. Include the disagreement if there was one and who it was with - seniority is not a reason to soften it here.'],
   ['R - Result','20 sec · ~15%','Quantified. Operational metrics land well: incidents, latency, throughput, cost per unit.'],
   ['L - Learning','15 sec · ~15%','What you changed. Also the right place for the honest version of how long it took and how bad it got in the middle - perseverance is a named norm.']
  ],
  rules:[
   'Have one story where you disagreed with someone significantly more senior. Say who they were and what the argument was. This is on-rubric by name.',
   'Have one genuine ethics or judgement story. Post-2017 this is asked seriously, and a performative answer is worse than a small honest one.',
   'Include one project that was bad for months before it worked. Perseverance is a named norm and almost every candidate only brings clean successes.',
   'Own things without a mandate. "It was not my system but it was breaking our users" is the Uber opening.',
   'If a story involves multiple markets, timezones or currencies, use it. "We build globally, we live locally" is the norm with the fewest good candidate stories.',
   'In machine coding, narrate the trade-off when you run short: "I am going to stub the persistence layer and finish the matching logic, because that is the part you asked for." Finishing something coherent is the behaviour being scored.'
  ],
  timing:'Two minutes, and expect fewer questions than at Amazon because the loop is compressed. That raises the cost of a rambling answer - you may only get three.'
 },

 probes:{
  intro:'Uber probes ownership, disagreement and judgement. The ethics probe is real and it goes one level deeper than candidates expect.',
  groups:[
   ['On ownership',[
     'Tell me about something you fixed that was not yours.',
     'What happens when you find a problem nobody owns?',
     'Describe staying with something after the interesting part was over.',
     'What is the worst thing you have had to operate?'
   ]],
   ['On ideas over hierarchy',[
     'Tell me about disagreeing with someone senior.',
     'What did you do when the decision went against you?',
     'Describe a time you were overruled and it turned out you were right.',
     'How do you push back on a manager?'
   ]],
   ['On doing the right thing',[
     'Tell me about a time you raised something uncomfortable.',
     'Have you ever been asked to do something you thought was wrong?',
     'What would you do if you found the metric everyone reports was misleading?',
     'Describe a decision where the fast option and the right option differed.'
   ]],
   ['On perseverance',[
     'Tell me about the longest you have spent on something hard.',
     'Describe a project that went badly for a long time.',
     'What kept you going?',
     'When did you know it was going to work?'
   ]],
   ['On scale and global reality',[
     'Tell me about something that worked in one market and not another.',
     'How have you handled timezones, currencies or locale?',
     'Describe the largest volume system you have run.',
     'What broke first when traffic grew?'
   ]]
  ],
  tactics:[
   ['When asked the ethics question','Answer with something real and proportionate. A small honest story - a metric you flagged as misleading, a shortcut you refused - lands better than a dramatic one that sounds constructed.'],
   ['When you disagreed and lost','Say so, and say what you did afterwards. "I disagreed, I lost, I supported it, and here is what happened" is a complete and well-scored answer.'],
   ['When machine coding is running out','Narrate the trade-off out loud and finish something coherent. Silence and an unfinished elegant design is the failure mode.'],
   ['When you have no global story','Use scale or operational reality instead. Timezone handling, a locale bug, or a regional outage all count.'],
   ['When asked about perseverance','Give the honest timeline including the bad middle. Compressing six months into "it took a while" wastes the norm.']
  ]
 },

 anti:[
  ['A performative ethics answer','A grand, tidy story about integrity that sounds constructed. The people asking lived through 2017 and are unusually sensitive to a rehearsed answer here.',
   'FIX: something small, real and slightly uncomfortable, with a cost you actually paid.'],
  ['No disagreement with seniority','Every story is collaborative and frictionless. "We value ideas over hierarchy" is a published norm and having nothing for it is a gap.',
   'FIX: one story with a named senior person and a real argument, including the version where you lost.'],
  ['Only clean successes','No project that was bad for months. Perseverance is a named norm and a portfolio of tidy wins does not evidence it.',
   'FIX: one long, grinding project with the honest middle included.'],
  ['Unfinished machine coding, unexplained','Running out of time on an elegant half-built design and going quiet. This is the most common way to fail an Uber loop.',
   'FIX: practise finishing. Narrate the trade-off, stub what you must, deliver something that runs.'],
  ['Waiting for a mandate','Stories where you were assigned everything you did. "We act like owners" is the closest norm to daily engineering and this is its opposite.',
   'FIX: one story where nobody asked you and you stayed for the consequences.'],
  ['Ignoring the history','Talking about Uber culture as though 2017 did not happen, or alternatively bringing it up as a criticism. Both land badly.',
   'FIX: know that the norms are a deliberate replacement, and let that inform the register of your ethics answer rather than becoming a topic.']
 ],

 worked:{
  question:'Tell me about a time you disagreed with a decision made by someone more senior than you.',
  principle:'We value ideas over hierarchy · We do the right thing · We act like owners',
  story:[
   ['S - Situation','We were adding a retry to a payment-adjacent call - a service that recorded an order against an external provider. The provider was timing out occasionally, maybe a dozen times a day, and orders were being lost. A senior engineer proposed a simple retry with backoff on the client side, which would have been in production the same week.',
    'A concrete, small, real disagreement. Payment-adjacent gives it stakes without inflating it into a crisis.'],
   ['T - Task','I thought it would double-charge people, and I was fairly junior to the person proposing it. I had to either say so properly or let it go.',
    'Names the seniority gap plainly, which is the point of the question. Also names the actual technical concern in one clause.'],
   ['A - Action','I did not argue it in the meeting, because I was not sure enough and I would have lost on confidence rather than on evidence. I went and checked what the provider actually did on timeout - whether the request had been processed. It had, in most cases: the timeout was on their response, not on their processing. So a retry would submit a second order that they would accept. I wrote that up with the provider’s own documentation and two examples from our logs where a manual retry had already produced a duplicate that operations had cleaned up by hand without telling us. Then I went to him directly rather than raising it in the group, because I did not want it to be a public correction. He looked at it and agreed within about ten minutes. We shipped an idempotency key instead, which took an extra week - and that week was a real cost, because orders were being lost while we built it.',
    'This is the whole answer. The disagreement is resolved with evidence rather than volume, the senior person is treated as reasonable and is, the delivery is private rather than performative, and the cost of being right - an extra week of lost orders - is stated instead of hidden. That last admission is what makes it credible.'],
   ['R - Result','No duplicate charges. The idempotency key has been in there about two years and it has caught roughly a hundred genuine duplicate submissions - which means the simple retry would have double-charged around a hundred people. Operations also stopped finding manual duplicates to clean up, which is how we learned they had been doing that quietly for months.',
    'The counterfactual is quantified, which is the strongest form this result can take. And the operations detail lands the "doing the right thing" norm without the candidate having to claim it.'],
   ['L - Learning','Two things. I nearly did not say anything because of the seniority difference, and the only reason I did was that I could go and check rather than having to win an argument on opinion - so now when I disagree I try to work out what evidence would settle it before I open my mouth. And the thing that actually bothers me is the operations team cleaning up duplicates by hand for months without it reaching us. We had no channel where that surfaced. I put a weekly duplicate-count metric on the dashboard so it would be visible.',
    'The first learning is a durable, transferable method. The second reaches past the immediate story to a systemic gap, and fixes it - which is ownership rather than the retelling of ownership.']
  ],
  probesAndAnswers:[
   ['Why not raise it in the meeting?','Because I did not have the evidence yet, and I would have been arguing "I think this might double-charge" against someone more experienced saying "retries are standard". I would have lost, and I would have lost for the wrong reason. Two hours of checking made it not an argument at all.'],
   ['What if he had disagreed after seeing your evidence?','Then I would have asked what he was seeing that I was not, and if I still disagreed I would have said so once more and then supported the decision. I would have wanted the duplicate metric either way, because it makes the disagreement testable rather than permanent.'],
   ['You said orders were being lost during the extra week. How did you weigh that?','Badly, at first - I was focused on being right about the duplicates. What we did was add the simple retry behind a flag for read-only operations, which were safe, while the idempotency work went on for the writes. That was his suggestion, and it was better than either of our original positions.'],
   ['How did the operations team end up cleaning duplicates without telling anyone?','Because it was a small enough number that it fitted into their day, and they assumed it was known. That is usually the answer. Nobody hides these things; they just absorb them until someone asks.'],
   ['Has this changed how you disagree with people?','Yes, quite specifically. I ask myself what evidence would settle this before I say anything, and if there is one I go and get it. If there is not - if it is genuinely a judgement call - I say that explicitly, because "this is a judgement call and here is mine" is a different conversation from "you are wrong".']
  ],
  why:'It hits three norms at once without announcing any of them. Ideas over hierarchy is demonstrated by the junior engineer being right and handling it with evidence rather than volume. Doing the right thing arrives through the hundred prevented double-charges and the operations team quietly absorbing duplicates, neither of which the candidate claims credit for in those terms. Acting like an owner shows up in the dashboard metric added afterwards for a problem that was not theirs. The senior engineer is portrayed as reasonable and turns out to have contributed the better compromise. And the candidate names the real cost of being right, which is what stops it sounding like a story about how clever they were.'
 },

 values:[
  {id:'owners', n:1, name:'We act like owners', freq:'high',
   official:'An Uber cultural norm: we see something that needs doing and we do it, and we stay with the consequences.',
   means:'You fixed something nobody assigned you and stayed for the unglamorous part afterwards.',
   signal:'The norm that maps most directly onto engineering work and the most reliably asked. The staying part is what distinguishes a strong answer.',
   asked:['Tell me about something you fixed that was not yours.','What do you do when you find a problem nobody owns?','Describe staying with something after the interesting part ended.','What is the worst system you have had to operate?'],
   probes:['Why you?','What did it cost you?','What happened after the fix?','Are you still on the hook for it?'],
   strong:'Unassigned work, followed by the boring aftermath - the alert, the runbook, the on-call rotation, the metric. Ownership is the second half.',
   weak:'A heroic fix with no follow-through, or work that was assigned and reframed as initiative.',
   pairs:'We persevere · We do the right thing',
   yourAngle:'An intermittent production problem you took on, plus the alert you added so the next person would not have to.'},

  {id:'ideas', n:2, name:'We value ideas over hierarchy', freq:'high',
   official:'An Uber cultural norm: the best idea wins regardless of who has it, and seniority is not an argument.',
   means:'You disagreed with someone senior, handled it properly, and can describe both the winning and the losing version.',
   signal:'Directly on-rubric by name, and one of the few places where a story about contradicting your manager is unambiguously positive.',
   asked:['Tell me about disagreeing with someone senior.','What did you do when the decision went against you?','Describe being overruled and turning out to be right.','How do you push back on your manager?'],
   probes:['How did you raise it?','What was their strongest argument?','What did you do after the decision?','Would you do it the same way again?'],
   strong:'Evidence rather than volume, delivered privately rather than performatively, with the cost of being right stated honestly. Having the losing version too is stronger than only the winning one.',
   weak:'Being right loudly. Or a disagreement with no seniority gap, which answers a different question.',
   pairs:'We do the right thing · We act like owners',
   yourAngle:'A design review where you went away, checked, and came back with the provider documentation rather than an opinion.'},

  {id:'right-thing', n:3, name:'We do the right thing. Period.', freq:'high',
   official:'An Uber cultural norm, and the one written in the shortest sentence. It replaced a set of values that a public crisis showed had not held.',
   means:'You raised something uncomfortable, or refused a shortcut, and accepted what that cost.',
   signal:'Asked seriously and probed one level deeper than candidates expect. The interviewers were often there for the reset and can tell a constructed answer from a real one.',
   asked:['Tell me about raising something uncomfortable.','Have you been asked to do something you thought was wrong?','What if the metric everyone reports is misleading?','When did the fast option and the right option differ?'],
   probes:['Who did you tell?','What was the pressure not to?','What did it cost?','What would you do if it happened again tomorrow?'],
   strong:'Small, specific, and costly to you. A misleading metric you corrected, a shortcut you refused, a number you would not report. Proportionate beats dramatic.',
   weak:'A grand narrative with no personal cost. Or an answer that treats the question as ceremonial.',
   pairs:'We value ideas over hierarchy · We are customer obsessed',
   yourAngle:'A dashboard number that was technically true and practically misleading, and what you did about it.'},

  {id:'persevere', n:4, name:'We persevere', freq:'med',
   official:'An Uber cultural norm: we keep going through the hard middle, because the work that matters is rarely quick.',
   means:'You stayed on something that was bad for months before it was good.',
   signal:'The norm with the fewest candidate stories, because everyone brings clean wins. Bringing the honest grinding version is a differentiator.',
   asked:['Tell me about the longest you have spent on something hard.','Describe a project that went badly for a long time.','What kept you going?','When did you know it would work?'],
   probes:['How bad did it get?','Did you consider stopping?','What changed?','What did it cost you personally?'],
   strong:'The honest timeline including the bad middle, what nearly made you stop, and the specific thing that turned it. Admitting you considered abandoning it makes it credible.',
   weak:'"It was challenging but we got there." Compressed, tidy, and evidencing nothing.',
   pairs:'We act like owners',
   yourAngle:'A migration or a refactor that took several times longer than planned, told with the real timeline.'},

  {id:'customer', n:5, name:'We are customer obsessed', freq:'med',
   official:'An Uber cultural norm: riders, drivers, eaters and merchants are all customers, and their experience is the measure.',
   means:'You know what the person on the other end of your system experienced when it went wrong.',
   signal:'Uber has several distinct customer types with conflicting interests, and answers that acknowledge that tension score above answers that treat "the user" as one group.',
   asked:['Who was the customer for your system?','Tell me about a trade-off between two groups of users.','How did you know it was working for them?','Describe a time you changed something because of what a user experienced.'],
   probes:['What did they actually see?','Which group lost out?','How did you decide?','What did they say?'],
   strong:'You name conflicting groups and the trade-off you made between them, rather than a single undifferentiated user who benefited.',
   weak:'System metrics only. Or "the customer" with no group, no experience, no conflict.',
   pairs:'We build globally, we live locally',
   yourAngle:'Any case where the operations team and the end user wanted different things, and how you chose.'},

  {id:'global', n:6, name:'We build globally, we live locally', freq:'med',
   official:'An Uber cultural norm: build platforms that work everywhere while respecting that every market is genuinely different.',
   means:'You have built something that had to behave differently by market, timezone, currency or regulation.',
   signal:'The norm with the fewest good stories among backend candidates, which makes even a modest one valuable.',
   asked:['Tell me about something that worked in one market and not another.','How have you handled timezones or locale?','Describe a regulatory or regional constraint you designed around.','What broke when you expanded?'],
   probes:['What was different about that market?','How did you find out?','What did you change - the platform or the market?','What would you do differently?'],
   strong:'A concrete local surprise - a locale bug, a currency rounding rule, a data-residency requirement - and a platform change that absorbed it rather than a special case bolted on.',
   weak:'"We supported multiple timezones" with no incident and no surprise.',
   pairs:'We are customer obsessed',
   yourAngle:'Timezone or currency handling that broke somewhere specific. Even a small one is better than none.'},

  {id:'bold', n:7, name:'We make big bold bets', freq:'low',
   official:'An Uber cultural norm: taking on things that might not work, deliberately and with eyes open.',
   means:'You committed to something with a real chance of failing, and can describe how you bounded the downside.',
   signal:'Lower frequency, and for engineers usually asked as a technology or architecture bet rather than a business one.',
   asked:['Tell me about a risky technical decision.','What is the biggest bet you have made?','Describe choosing an approach that might not have worked.','When did you commit before you were sure?'],
   probes:['What was the downside if it failed?','How did you bound it?','Did it work?','What did you learn if it did not?'],
   strong:'A bounded bet - a spike, a shadow deployment, a reversible migration - with an explicit exit condition decided in advance.',
   weak:'Recklessness described as boldness, or a "bet" with no real downside.',
   pairs:'We act like owners · We persevere',
   yourAngle:'An architectural change you committed to before it was proven, with the exit condition you set for yourself.'},

  {id:'differences', n:8, name:'We celebrate differences', freq:'low',
   official:'An Uber cultural norm: different backgrounds and perspectives make better decisions, and that has to be actively enabled.',
   means:'You changed how a discussion or a team ran so a perspective that was being missed got in.',
   signal:'Lower frequency for engineering loops, but a vague answer here is noticeably weaker than a concrete mechanism.',
   asked:['Tell me about working with someone very different from you.','How do you make sure quieter people are heard?','Describe a perspective that changed your design.','How do you onboard someone unfamiliar with the domain?'],
   probes:['What did you do differently?','Did it change the outcome?','Have you kept doing it?','How did you know it worked?'],
   strong:'A specific mechanism with an outcome - written proposals before a meeting, deliberately asking the newest person first, pairing across specialisms.',
   weak:'A statement of values with no mechanism and no outcome.',
   pairs:'We are customer obsessed',
   yourAngle:'How you run design discussions. A written RFC circulated before the meeting is a real mechanism with a real effect on who contributes.'}
 ],

 prep:[
  ['Week 13','Apply alongside Google','Uber loops run a similar length; the machine-coding round is the one to prepare hardest for.'],
  ['Week 14','Write the seniority-disagreement story','Both versions - the one where you were right and the one where you lost.'],
  ['Week 15','Write the ethics story','Small, real, and with a cost you actually paid. Not a constructed one.'],
  ['Week 16','Write the perseverance story','The honest timeline, including the part where you nearly stopped.'],
  ['Week 17','Machine coding under a clock, twice','60-90 minutes, finished and running. Practise narrating the trade-off at minute 50.'],
  ['Week 18','Record one values round','Four questions, 45 minutes. Check that the ethics answer does not sound rehearsed.']
 ],

 source:'Partly published. Uber published its eight cultural norms in 2017, replacing the earlier fourteen values, and the norms are quoted here in substance. The loop structure, the compression caused by the machine-coding round, and the weight given to the ethics question come from consistent candidate reporting rather than from Uber documentation; treat those as a working model.',
 contrast:'Against Amazon: similar ownership register, but Uber rewards a story where you disagreed with someone senior and Amazon rewards the story where you were right and delivered. Against Google: much more ownership, much less step-back, and an ethics question that is asked in earnest rather than as a red-flag screen.'
});

/* ---------------------------------------------------------- SALESFORCE --- */

PLAN.lp.co.push({
 id:'salesforce', name:'Salesforce', tier:2, rung:'Rung two (adjacent)',
 navSub:'Five values · Trust is ranked first',
 label:'Values: Trust, Customer Success, Innovation, Equality, Sustainability',
 weight:'Heavier than most product companies. Values are explicitly ranked and explicitly interviewed, usually in a dedicated round with a hiring manager or skip-level.',
 oneLine:'The one company that publishes its values in priority order and means the order - Trust outranks Customer Success, and they will test whether you understand what that implies.',

 scoring:{
  intro:'Salesforce publishes five values in a deliberate sequence: Trust, Customer Success, Innovation, Equality, Sustainability. The ordering is the interesting part and it is not decorative - Trust is first, which means that when customer success and trust conflict, trust wins. For an engineer that translates into something concrete: you do not ship the thing the customer wants if it puts their data or the platform at risk, and you tell them why. A candidate who understands that ordering has an advantage in the values round.',
  rounds:[
   ['Recruiter screen','30 min','Motivation, level, and often an early values question. "What do you know about our values" is a real opener here.'],
   ['Hiring manager','45-60 min','Background, past work, and values-shaped behavioural questions. Frequently the first place the values round properly begins.'],
   ['Technical rounds (2-3)','45-60 min','Coding, design, and often a practical or take-home-adjacent exercise. Behavioural questions bracket them.'],
   ['Values / culture round','45-60 min','A dedicated round, sometimes with a skip-level or a cross-functional interviewer. Trust, equality and customer success in earnest, plus give-back and what you want from the company.'],
   ['Panel / cross-functional','varies','Salesforce loops often include someone outside your function - a product manager, a solution engineer. They assess collaboration and how you explain technical work to non-engineers.']
  ],
  rubric:[
   ['Trust ranks first, and the ordering is tested','The distinguishing question: what do you do when the customer wants something that is not safe? The expected answer is that you say no and explain, not that you deliver it.'],
   ['Customer success means the customer\'s outcome, not their request','Salesforce is enterprise software. The customer is an admin, an ops team, another company\'s developers. Success means they achieved something, not that a ticket closed.'],
   ['Equality is a named value and it is asked','More reliably than at most companies on this ladder. A vague answer is noticeably weaker than a concrete mechanism.'],
   ['Give-back is real','The 1-1-1 model - one percent of equity, product and employee time to the community - is central to how Salesforce describes itself, and volunteering time is a normal part of the job. Genuine interest here is noticed; feigned interest is noticed differently.'],
   ['V2MOM is the internal language','Vision, Values, Methods, Obstacles, Measures - the planning framework used company-wide. Knowing what it is signals real research; using the vocabulary naturally signals more.'],
   ['Ohana as the culture word','Salesforce\'s term for its community of employees, customers and partners. You do not need to use it, but you should not be surprised by it.']
  ],
  reality:[
   'The values round is a real round with real weight, not a formality at the end. Candidates who prepare only technically are visibly unprepared for it.',
   'Trust questions frequently have a data or security angle, because that is what trust means for a company holding other companies\' customer data.',
   'Salesforce hires heavily into enterprise integration, platform and data work. Your event-driven and Postgres experience maps directly; say so in those terms.',
   'Because equality and give-back are asked sincerely, an answer that is transparently manufactured does more damage here than an honest "I have not done much of that, and here is what I do care about".'
  ]
 },

 framework:{
  intro:'STAR, with the value named. Salesforce interviewers frequently ask questions that map explicitly to one of the five values, and answering with the ordering in mind - especially where Trust and Customer Success pull against each other - is the differentiator.',
  parts:[
   ['S - Situation','20 sec · ~15%','Name the customer, and name whether they were internal or external. Enterprise context helps.'],
   ['T - Task','15 sec · ~10%','What you owned, and what the customer was asking for.'],
   ['A - Action','55-65 sec · ~45%','What you did. Where there was a tension between what they wanted and what was safe or correct, make that tension explicit - that is the Salesforce-shaped beat.'],
   ['R - Result','20 sec · ~15%','Quantified, in terms of what the customer achieved rather than what you delivered.'],
   ['L - Learning','20 sec · ~15%','What you changed, and if relevant what you would tell the customer differently. Trust is built in how bad news is delivered.']
  ],
  rules:[
   'Have one story where you told a customer no, and explained why, and the relationship survived. This is the highest-value single answer in a Salesforce loop.',
   'Frame results as customer outcomes. "They cut their reconciliation time from a day to an hour" beats "we shipped the API".',
   'Have a concrete equality or inclusion mechanism, not a sentiment. What you actually do differently in a meeting or an onboarding.',
   'Know what V2MOM stands for and roughly how it works. It costs five minutes and it is genuine evidence of research.',
   'Be honest about give-back. If you have volunteered, say what and for how long. If you have not, say what you would want to do and why - manufactured enthusiasm reads badly here.',
   'Speak about security and data handling in at least one story. Trust is first and for an engineer it means exactly this.'
  ],
  timing:'Two minutes with normal follow-ups. The values round is conversational but structured - expect four or five questions, each mapped to a value, with two or three probes each.'
 },

 probes:{
  intro:'Salesforce probes for the trust-versus-convenience trade-off, for how you deliver bad news, and for whether your inclusion answer has a mechanism in it.',
  groups:[
   ['On trust',[
     'Tell me about a time you had to tell a customer no.',
     'How do you handle a request that is technically possible but not safe?',
     'Describe delivering bad news to someone who did not want to hear it.',
     'Tell me about a security or data-handling decision you made.',
     'What would you do if you found customer data somewhere it should not be?'
   ]],
   ['On customer success',[
     'Who was your customer and what were they trying to achieve?',
     'Tell me about a time you went beyond the request.',
     'Describe understanding a need the customer had not articulated.',
     'How do you know your work succeeded for them?'
   ]],
   ['On innovation',[
     'Tell me about something you built that did not exist.',
     'Describe improving a process nobody asked you to improve.',
     'When did you challenge how something had always been done?'
   ]],
   ['On equality',[
     'How do you make sure everyone in a discussion is heard?',
     'Tell me about working with someone from a very different background.',
     'Describe a perspective that changed your approach.',
     'How do you onboard someone who is new to the domain?'
   ]],
   ['On motivation and give-back',[
     'Why Salesforce?',
     'What do you know about how we work?',
     'Have you been involved in anything outside your job?',
     'What would you want to do with volunteer time?'
   ]]
  ],
  tactics:[
   ['When trust and the customer request conflict','Say the order out loud. "They wanted X, and X would have exposed data across tenants, so the answer was no - and then the work was finding what would get them the outcome safely." That sentence is the value ordering demonstrated.'],
   ['When asked about equality','Give a mechanism, not a sentiment. What you do in a design discussion, how you onboard, how you handle the person who has not spoken. Then the outcome.'],
   ['When asked about give-back and you have none','Be honest and specific about what you would want to do. Manufactured community enthusiasm is transparent and is worse than an honest gap.'],
   ['When asked "why Salesforce"','Enterprise platform problems: multi-tenancy, integration, data volume, governance. Connect to what you build. Avoid the brand and the culture as reasons - everyone says those.'],
   ['When you meet a non-engineering interviewer','Adjust the register without dumbing down. Explaining a technical decision clearly to a product manager is what that panel slot is measuring.']
  ]
 },

 anti:[
  ['Not knowing the values, or their order','Salesforce publishes five values in a deliberate sequence and asks about them. Turning up without having read them is a visible lack of preparation at a company where this is a named round.',
   'FIX: Trust, Customer Success, Innovation, Equality, Sustainability. Know the order and know why Trust is first.'],
  ['Delivering whatever the customer asked for','A story where the customer wanted something risky and you built it because they asked. This inverts the value ordering, and it is the specific thing the trust question is testing.',
   'FIX: one story where you said no, explained why, and found the safe way to the same outcome.'],
  ['Sentiment instead of mechanism on equality','"I believe everyone should be heard." No mechanism, no outcome, and this value is asked more reliably here than almost anywhere.',
   'FIX: one specific practice with a result. Written proposals before a meeting, asking the newest person first, a pairing arrangement.'],
  ['Manufactured give-back enthusiasm','Sudden passion for volunteering that appeared during interview prep. At a company where this is genuinely part of the culture, it is easy to spot.',
   'FIX: honesty plus specificity about what you would actually want to do.'],
  ['Results framed as delivery','"We shipped the integration." Salesforce wants the customer outcome, because that is what Customer Success means.',
   'FIX: what the customer could do afterwards that they could not do before, with a number.'],
  ['Ignoring security and data entirely','Trust is the first value and for an engineer it is largely about data handling. A loop with no story touching security, access or data boundaries misses the top value.',
   'FIX: one story about a data-handling or access decision, however small.'],
  ['"Why Salesforce" answered with culture','"I love the Ohana culture." Everyone says it and it is not a reason to hire an engineer.',
   'FIX: the platform problem. Multi-tenancy, integration, governance, scale - connected to your own work.']
 ],

 worked:{
  question:'Tell me about a time you had to tell a customer or stakeholder no.',
  principle:'Trust · Customer Success',
  story:[
   ['S - Situation','An internal analytics team wanted direct read access to our orders database. Their reason was reasonable - they were building a dashboard, our API did not expose the aggregate they needed, and going through us meant waiting for our sprint. They had already asked twice and been told "we will get to it".',
    'The requester is sympathetic and their reasoning is sound. Setting them up as reasonable is what makes the refusal a trust story rather than a story about being difficult.'],
   ['T - Task','I was the one who had to answer it this time. The straightforward thing was to grant a read-only role and move on - it would have taken ten minutes and made them happy.',
    'States plainly that the easy path existed and was tempting. Without this, the refusal costs nothing and demonstrates nothing.'],
   ['A - Action','I said no, and I said why in specific terms rather than in policy terms. The orders table contained customer names and partial payment identifiers alongside the fields they wanted, and a read-only role does not distinguish between columns unless you build a view - so granting it would have put personal data in a dashboard tool where we had no control over who could query it or where the results went. I also did not want a second consumer coupled to our schema, because we were mid-way through the partitioning work and their queries would have broken. But I did not stop at no. I asked what the dashboard actually needed to show, which turned out to be four aggregates over a date range - no personal data at all. We built a read-only view exposing exactly those columns, gave them access to the view rather than the table, and put a materialised refresh on it because their queries were heavy. It took two days rather than ten minutes.',
    'The refusal is grounded in a specific mechanism - column-level access, personal data, schema coupling - rather than in policy. And it does not end at no: the second half is finding the safe route to the same outcome, which is the Trust-then-Customer-Success ordering demonstrated in a single decision.'],
   ['R - Result','They got their dashboard four days later instead of the following sprint, so they were better off than the path they had asked for. No personal data left our boundary. And when the partitioning landed six weeks later, their queries did not break, because they were reading a view rather than the table - which they would not have been.',
    'The customer ends up better served by the refusal than by the request, which is the strongest possible shape for this answer. The partitioning detail proves the second reason for the refusal was real and not hypothetical.'],
   ['L - Learning','The thing I got wrong was earlier: they had asked twice and been told "we will get to it", which is why they escalated to asking for raw access in the first place. A no with a date attached would have prevented the whole situation. I now try to answer requests like that with either a date or a genuine no rather than a soft deferral, because a soft deferral is how people end up asking for a workaround.',
    'The learning locates the real failure before the story started, which is more honest and more useful than a reflection on the refusal itself.']
  ],
  probesAndAnswers:[
   ['What if they had escalated over your head?','Then I would have wanted the conversation to happen, because the argument was about personal data leaving a controlled boundary and that is a decision that should be made above me if it is going to be made at all. I would have put the specifics in writing first so the decision was informed rather than a matter of who pushed harder.'],
   ['Was the schema coupling a real reason or a convenient one?','Both, honestly - but it turned out to be real. The partitioning six weeks later would have broken direct queries against that table. I would not have refused on those grounds alone, though; the personal data was the reason, and the coupling was the reason I did not just build them a filtered copy.'],
   ['Two days instead of ten minutes. How did you justify that to your own team?','It was one ticket in the next sprint, and I made the case that we were going to spend more than two days dealing with the consequences otherwise. It also gave us something reusable - two other teams have since consumed that view.'],
   ['How did you tell them no without damaging the relationship?','I told them the specific reason rather than citing a policy, and I turned up in the same conversation with the question of what they actually needed. Nobody minds a no that comes with someone trying to solve their problem. What damages a relationship is a no with no reason and no alternative.'],
   ['What would you have done if there had been no safe alternative?','Said so plainly and explained what would have to change - which in that case would have been separating personal data out of that table, which is work I would then have wanted to schedule properly rather than promise vaguely. A no with a reason and a path is survivable; a no with neither is what makes people go around you.']
  ],
  why:'The requester is reasonable, the easy path is stated, and the refusal is grounded in a specific mechanism rather than in policy - which is what makes it a Trust story rather than an obstruction story. It then demonstrates the value ordering explicitly: trust first, and then the actual work of getting the customer their outcome safely, which leaves them better off than the thing they asked for. The customer-success result is stated as what they could do, not what was shipped. And the learning locates the real failure before the refusal, in the soft deferral that caused the escalation, which is the kind of self-criticism that is hard to fake.'
 },

 values:[
  {id:'trust', n:1, name:'Trust', freq:'high',
   official:'Salesforce\'s first and explicitly highest value: nothing is more important than the trust of customers, employees and the wider community.',
   means:'You protected data, or told an inconvenient truth, when delivering what was asked would have been easier.',
   signal:'Ranked first deliberately, and the ordering is the test. When trust and customer success conflict, trust wins - and a candidate who demonstrates that ordering in a story is answering the question that was actually asked.',
   asked:['Tell me about telling a customer no.','How do you handle a request that is possible but not safe?','Describe a security or data-handling decision.','What would you do if you found customer data somewhere it should not be?','Tell me about delivering bad news.'],
   probes:['What was the easy path?','How did you explain it?','Did the relationship survive?','What did you offer instead?'],
   strong:'A specific mechanism as the reason - column-level access, tenancy boundary, retention - rather than a policy citation, followed by finding the safe route to the same outcome.',
   weak:'A no with no reason and no alternative. Or a story where you delivered the risky thing because the customer insisted.',
   pairs:'Customer Success',
   yourAngle:'Any request for direct database access, a data export, or a permission that would have crossed a boundary. These are common and you almost certainly have one.'},

  {id:'success', n:2, name:'Customer Success', freq:'high',
   official:'Salesforce\'s second value: the company succeeds when its customers succeed.',
   means:'You measured your work by what the customer could then do, not by what you delivered.',
   signal:'Enterprise framing. The customer is usually another company\'s admin or developer, and success is an outcome in their workflow rather than a closed ticket.',
   asked:['Who was your customer and what were they trying to achieve?','Tell me about going beyond the request.','Describe understanding a need they had not articulated.','How do you know your work succeeded for them?'],
   probes:['What did they ask for versus what they needed?','How did you find out?','What did they do differently afterwards?','How did you measure it?'],
   strong:'You asked what the outcome was rather than building the request, and the result is stated as a change in what the customer can do, with a number.',
   weak:'Delivery framed as success - "we shipped it on time" - with no evidence anyone was better off.',
   pairs:'Trust · Innovation',
   yourAngle:'The four-aggregate question. Asking what the dashboard needs to show rather than granting the access requested is this value in one move.'},

  {id:'innovation', n:3, name:'Innovation', freq:'med',
   official:'Salesforce\'s third value: continuous improvement and a willingness to reinvent how things are done.',
   means:'You improved something structurally rather than incrementally, often without being asked.',
   signal:'For engineers this is usually about platform thinking - building the reusable thing rather than the one-off. Salesforce is a platform company and that framing lands.',
   asked:['Tell me about something you built that did not exist.','Describe improving a process nobody asked you to improve.','When did you challenge how something had always been done?','What have you automated?'],
   probes:['What made you see it?','Who else benefited?','Was it reused?','What did it replace?'],
   strong:'A one-off request turned into something several teams then used. Reuse is the proof, and it is the platform-shaped version of this value.',
   weak:'Adopting a new tool and calling it innovation. Or an improvement nobody else ever touched.',
   pairs:'Customer Success',
   yourAngle:'The read-only view that two other teams later consumed. Building the reusable thing instead of the one-off is exactly this.'},

  {id:'equality', n:4, name:'Equality', freq:'high',
   official:'Salesforce\'s fourth value, and one it has campaigned on publicly, including on pay equity.',
   means:'You did something specific that changed who got heard or who got the opportunity.',
   signal:'Asked more reliably here than at most companies on this ladder, and answered with sentiment by almost everyone. A concrete mechanism is an immediate differentiator.',
   asked:['How do you make sure everyone is heard?','Tell me about working with someone very different from you.','Describe a perspective that changed your approach.','How do you onboard someone new to the domain?','What does an inclusive team look like to you?'],
   probes:['What did you actually do?','Did it change the outcome?','How did you know it worked?','Do you still do it?'],
   strong:'A named practice with an outcome. Circulating a written proposal before a design meeting so people who think slowly in a room can contribute is a real answer with a real effect.',
   weak:'"I treat everyone equally." That is a statement of intent and answers a different question.',
   pairs:'Trust',
   yourAngle:'How you run design discussions and how you onboard. The written-proposal-first mechanism is genuine, common, and effective - describe its effect on who contributed.'},

  {id:'sustainability', n:5, name:'Sustainability', freq:'low',
   official:'Salesforce\'s fifth value, covering environmental commitment and, more broadly, building things that last.',
   means:'You made a choice that cost more now and less later - or you thought about the cost of what you ran.',
   signal:'Rarely asked directly in an engineering loop. When it comes up it is usually as efficiency, cost or maintainability rather than as environmental policy.',
   asked:['Tell me about a decision that traded short-term speed for long-term maintainability.','Have you reduced the cost or resource footprint of something?','How do you think about technical debt?','What have you built that is still running?'],
   probes:['What did it cost at the time?','Did the long-term benefit materialise?','How did you make the case?','Would you make the same call now?'],
   strong:'A concrete efficiency or longevity outcome - cost reduced, resources cut, a system still running years later without special handling.',
   weak:'Nothing prepared at all, or an answer that treats the value as purely environmental and therefore irrelevant to engineering.',
   pairs:'Innovation',
   yourAngle:'Right-sizing Kubernetes requests and limits, or reducing a query cost. Real, measurable and unglamorous, which is the correct register.'},

  {id:'motivation', n:6, name:'Why Salesforce, and the give-back question', freq:'high',
   official:'Not a value - two questions Salesforce asks more sincerely than most companies, one about motivation and one about community involvement under the 1-1-1 model.',
   means:'You know what Salesforce engineering actually is, and you are honest about your relationship with the give-back culture.',
   signal:'The 1-1-1 model - one percent of equity, product and employee time given to the community - is central to how Salesforce presents itself, and volunteer time is a normal part of the job. Manufactured enthusiasm is transparent; honesty is not penalised.',
   asked:['Why Salesforce?','What do you know about how we work?','Have you been involved in anything outside your job?','What would you do with volunteer time?','What do you know about V2MOM?'],
   probes:['What interests you about that problem?','What else are you considering?','What would make this the wrong move?','Have you used any of our products?'],
   strong:'A platform-engineering reason - multi-tenancy, integration, governance, data volume - connected to your own stack, plus an honest and specific answer on give-back.',
   weak:'Culture and brand as the reason. Or sudden volunteering passion that appeared during interview prep.',
   pairs:'Trust · Equality',
   yourAngle:'Multi-tenant data isolation and event-driven integration are exactly your stack. V2MOM takes five minutes to learn and knowing it is cheap, visible evidence of research.'}
 ],

 prep:[
  ['Week 7','Apply alongside the tier-two set','Salesforce loops run 4-8 weeks to onsite.'],
  ['Week 8','Learn the five values in order, and why Trust is first','Fifteen minutes. It changes how you answer half the round.'],
  ['Week 9','Write the "told a customer no" story','The single highest-value answer in a Salesforce loop.'],
  ['Week 10','Write the equality mechanism story','A practice, not a sentiment, with an outcome.'],
  ['Week 11','Read up on V2MOM and the 1-1-1 model','Cheap, specific evidence of research. Decide your honest answer on give-back.'],
  ['Week 12','Record one values round','Five questions mapped to the five values. Check the equality answer has a mechanism in it.']
 ],

 source:'Largely published for the values themselves. Salesforce publishes its five core values in the stated order, and the 1-1-1 philanthropy model and V2MOM planning framework are both publicly described by the company. The loop structure, the existence and weight of a dedicated values round, and the emphasis on the trust-versus-request trade-off come from candidate reporting rather than from Salesforce documentation; treat the round mechanics as a working model.',
 contrast:'Against Amazon: Salesforce ranks its values explicitly and expects you to reason with the ranking, where Amazon expects all sixteen to be live at once. Against JPM: both care about saying no to a request, but JPM frames it as risk and control while Salesforce frames it as trust and then finding the safe route to the customer\'s outcome.'
});

/* --------------------------------------------------- AMERICAN EXPRESS --- */

PLAN.lp.co.push({
 id:'amex', name:'American Express', tier:1, rung:'Rung one',
 navSub:'Blue Box Values · payments domain',
 label:'The Blue Box Values',
 weight:'Moderate and consistent. Behavioural questions run through the loop and concentrate in a hiring-manager round. Closer to JPM than to a product company, with a little less ceremony.',
 oneLine:'A payments company, so "We Do What Is Right" is asked about money and data rather than in the abstract - and your idempotency work is on-topic.',

 scoring:{
  intro:'American Express publishes eight Blue Box Values, and they are used internally as a real vocabulary rather than as a wall poster. For an engineer the loop sits between JPM and a product company: less formal change-control language than a bank of JPM\'s size, but the same underlying seriousness about money, fraud and customer data.',
  rounds:[
   ['Recruiter screen','30 min','Background, motivation, level. "Why Amex" starts here and is asked again later.'],
   ['Technical rounds (2-3)','45-60 min','Java, Spring, SQL, some system design. Slightly more coding and slightly less internals depth than JPM.'],
   ['Hiring manager','45-60 min','The main behavioural round. Past work in depth, how you handle risk and customers, and team fit.'],
   ['Senior / panel round','30-45 min','Sometimes present. Values-shaped: integrity, customer backing, working across teams.']
  ],
  rubric:[
   ['Backing the customer is the flagship value','"We Back Our Customers" is the first Blue Box value and Amex\'s entire brand position. For an engineer it means knowing what a failure looked like to a cardholder or a merchant.'],
   ['Integrity in a payments context','Not abstract. It shows up as: what did you do when you found a discrepancy, a double charge, a number that did not reconcile.'],
   ['Risk awareness, in lighter form than JPM','Still expected - rollback, controls, who reviewed - but with less formal change-management vocabulary.'],
   ['Teamwork across a large organisation','"We Win As A Team" is a named value and Amex is large and matrixed.'],
   ['Different views are named explicitly','"We Need Different Views" is one of the eight, which makes an inclusion or dissent story directly on-rubric.']
  ],
  reality:[
   'Payments domain knowledge is worth real points here and you have more of it than you think - idempotency, exactly-once semantics, reconciliation, double-entry.',
   'The behavioural bar is less adversarial than Amazon\'s and less formal than JPM\'s, which means thin answers go unchallenged and therefore unscored.',
   '"Why Amex" is asked sincerely. The payments and fraud domain is a good honest answer; "large stable company" is not.',
   'This is a rung-one target, which means it arrives in week four alongside JPM - before behavioural prep would naturally be complete.'
  ]
 },

 framework:{
  intro:'STAR with a customer and a control. Effectively the JPM shape with slightly less formality: name the customer, name what could have gone wrong with money or data, and quantify.',
  parts:[
   ['S - Situation','20 sec · ~15%','Name who was affected. In a payments context that is a cardholder, a merchant, or an internal operations team.'],
   ['T - Task','15 sec · ~10%','What you owned and what the constraint was.'],
   ['A - Action','55-65 sec · ~45%','What you did, including who reviewed it. Where money or personal data was involved, say how you protected it.'],
   ['R - Result','20 sec · ~15%','Quantified, and include the absence of incidents where relevant.'],
   ['L - Learning','20 sec · ~15%','What you changed. Process improvements are valued here as they are at JPM.']
  ],
  rules:[
   'Use your payments-shaped work. Idempotency keys, duplicate detection, reconciliation - these are Amex\'s daily problems and speaking their language is an advantage you already have.',
   'Name the cardholder or merchant impact, not just the system metric.',
   'Add a control sentence where money or data was involved. Lighter than JPM, but present.',
   'Have a "different views" story - a time someone disagreed and was right, or you sought out a perspective you were missing. It is a named value with few prepared answers.',
   'Answer "why Amex" with the domain: payments correctness, fraud, the fact that a duplicate charge is a real person\'s money.'
  ],
  timing:'Two minutes with normal follow-ups, three to five probes per story.'
 },

 probes:{
  intro:'Amex probes the customer impact, the money, and how you work across a large organisation.',
  groups:[
   ['On backing the customer',[
     'Who was affected when this failed?',
     'Tell me about going out of your way for a user.',
     'How do you find out what customers actually experience?',
     'Describe a time you pushed back on something for the customer\'s sake.'
   ]],
   ['On integrity and money',[
     'Tell me about finding a discrepancy nobody had noticed.',
     'What did you do when the numbers did not reconcile?',
     'Have you ever had to report your own mistake?',
     'Describe a time you refused a shortcut.'
   ]],
   ['On different views',[
     'Tell me about a time someone disagreed with you and was right.',
     'How do you seek out perspectives you are missing?',
     'Describe working with someone whose approach was very different.'
   ]],
   ['On teamwork and delivery',[
     'How did you get another team to move for you?',
     'Tell me about a deadline you were not going to make.',
     'Describe a time you had to work within a constraint you disagreed with.'
   ]]
  ],
  tactics:[
   ['When you can use payments vocabulary','Use it. Idempotency, reconciliation, double-entry, exactly-once - it demonstrates domain fit without a single claim about wanting to work in payments.'],
   ['When asked about a discrepancy','Give the mechanism, not just the outcome. How you detected it, how you proved it, who you told, and how quickly.'],
   ['When the round is friendly','Fill the signal yourself. Amex interviewers probe less than Amazon, so volunteer the control and the customer impact rather than waiting.'],
   ['When asked "why Amex"','The domain. Money that has to be right, fraud as an adversarial problem, a card decline being a person standing at a till.']
  ]
 },

 anti:[
  ['No customer in the story','Systems only. "We Back Our Customers" is the first Blue Box value and a loop with no affected human in it misses it entirely.',
   'FIX: name the cardholder, merchant or operations impact in every story.'],
  ['Missing the payments angle you already have','Talking about your event-driven work generically when it is full of idempotency and duplicate-handling that is directly on-topic.',
   'FIX: reframe one story explicitly in payments terms. It is the same story with better vocabulary.'],
  ['Thin answers in a friendly room','Fewer probes than Amazon means an unelaborated answer stays unelaborated and therefore unscored.',
   'FIX: volunteer the second layer - the control, the customer impact, the learning.'],
  ['No "different views" story','A named value with very few prepared candidate answers, which makes it cheap to win and costly to skip.',
   'FIX: one story where someone disagreed with you and was right, or where you went looking for a perspective you lacked.'],
  ['"Why Amex" answered with stability','Same failure as at JPM and heard the same way.',
   'FIX: the domain. Correctness, fraud, real money, real people.']
 ],

 worked:{
  question:'Tell me about a time you found a problem that others had missed.',
  principle:'We Do What Is Right · We Back Our Customers',
  story:[
   ['S - Situation','We published order events to three consumers, and one of them - the reporting team - had a nightly job that deleted duplicate rows. It had been running for months. Nobody treated the duplicates as a bug any more because the workaround made them invisible.',
    'A quiet, unglamorous problem that had been normalised. That framing is the point: the interesting behaviour is noticing something everyone had stopped seeing.'],
   ['T - Task','I was adding a new consumer and I wanted to know whether I needed the same dedupe logic. That question turned out to be the whole thing.',
    'Honest and small. The discovery is incidental rather than heroic, which makes it credible.'],
   ['A - Action','I checked what our delivery guarantee actually was rather than assuming, and it was at-least-once - which meant duplicates were guaranteed by design and the bug was that no consumer was idempotent. I wrote that up and took it to all three consuming teams rather than only the one that had complained. One of them had never noticed, and when they went and looked they found two reports with silent double-counts in them. We agreed on an event id and a dedupe key at the consumer, and I changed our publisher to emit a stable id rather than a fresh one per delivery attempt.',
    'The mechanism is named precisely. Going to all three teams instead of the complaining one is what turns a fix into the value being demonstrated - and the silent double-count is the detail that proves it was worth doing.'],
   ['R - Result','Duplicates went to zero across all three consumers, the reporting team deleted a job that had been running about eight months, and two incorrect reports were corrected. Those reports were used for merchant-facing volume figures, so the correction mattered to someone outside the company.',
    'Quantified, and the last sentence connects a backend cleanup to a real external consequence - which is the "back our customers" register.'],
   ['L - Learning','I had operated that publisher for over a year without ever checking its delivery semantics, and I had told someone in a design review that it was exactly-once. I went back and corrected that in the same channel. Now the delivery guarantee is the first line in the README of anything I build on a queue.',
    'An uncomfortable admission - having confidently said the wrong thing - and a correction made publicly. That is the integrity beat, earned rather than claimed.']
  ],
  probesAndAnswers:[
   ['How did the duplicates go unnoticed for so long?','Because the workaround worked. Once the nightly job existed, the cost had already been paid and nobody was feeling it. That is generally how a bug becomes permanent.'],
   ['You said you had told someone the wrong thing. What did you do about that?','Went back to the same design-review thread and corrected it, so that anyone reading it later got the right answer. It was uncomfortable but it was a two-line message.'],
   ['How did the team who had not noticed react?','Not well initially, and reasonably so - it meant historical numbers were wrong. I spent a day helping them identify which reports were affected and we corrected two.'],
   ['What controls did you put in place?','The stable event id at the publisher, the dedupe key at each consumer, and a duplicate-rate metric on the dashboard so a regression would be visible within a day rather than found by a nightly cleanup job.'],
   ['Why go to all three teams rather than fixing the one complaint?','Because the cause was on our side, so the other two had the same exposure whether they had noticed it or not. Fixing only the team that complained would have left two teams with silent wrong numbers.']
  ],
  why:'It is a money-adjacent correctness problem, which is Amex\'s domain in miniature. The candidate finds something everyone had stopped seeing, fixes the cause rather than the symptom, and goes to teams who had not complained - which is backing the customer without saying the words. The integrity beat is a genuinely uncomfortable public correction. And the result lands on a merchant-facing number, which connects a backend fix to a person outside the company.'
 },

 values:[
  {id:'back-customers', n:1, name:'We Back Our Customers', freq:'high',
   official:'The first Blue Box Value: putting customers at the centre of everything, and backing them when it counts.',
   means:'You know what your failure looked like to a cardholder, a merchant or the team serving them.',
   signal:'Amex\'s brand position and its first value. Backend engineers miss it by describing systems; the answer is the person at the till whose card declined.',
   asked:['Who was affected when this failed?','Tell me about going out of your way for a user.','How do you find out what customers actually experience?','Describe pushing back for the customer\'s sake.'],
   probes:['What did they see?','How did you find out?','What did you change?','Did they notice the improvement?'],
   strong:'The failure translated into a human experience with a number attached, and a change made because of it.',
   weak:'Error rates and latency with no person anywhere in the story.',
   pairs:'We Do What Is Right',
   yourAngle:'A duplicate charge, a failed order, or a decline. Translate one system metric into what a person experienced.'},

  {id:'do-right', n:2, name:'We Do What Is Right', freq:'high',
   official:'A Blue Box Value: doing the right thing even when it is difficult, and holding to it under pressure.',
   means:'You reported a discrepancy, refused a shortcut, or corrected your own mistake in public.',
   signal:'In a payments company this is concrete rather than abstract. Money that does not reconcile is the archetypal setup.',
   asked:['Tell me about finding a discrepancy nobody noticed.','Have you had to report your own mistake?','Describe refusing a shortcut.','What did you do when the numbers did not add up?'],
   probes:['Who did you tell, and how fast?','What was the pressure not to?','What did it cost?','What changed afterwards?'],
   strong:'Your own error, reported quickly and publicly, with a mechanism added so it is caught next time.',
   weak:'A story with no personal cost, or one where the wrongdoing was someone else\'s.',
   pairs:'We Value Personal Integrity',
   yourAngle:'The design-review answer you got wrong and corrected in the same thread.'},

  {id:'different-views', n:3, name:'We Need Different Views', freq:'med',
   official:'A Blue Box Value: seeking out perspectives unlike your own because they produce better decisions.',
   means:'You went looking for a view you did not have, or changed your mind because of one.',
   signal:'A named value with very few prepared candidate answers, which makes it disproportionately cheap to win.',
   asked:['Tell me about someone who disagreed with you and was right.','How do you seek out perspectives you are missing?','Describe working with someone whose approach was very different.'],
   probes:['How did you go looking?','What did you change?','Did the outcome differ?','Do you still do that?'],
   strong:'A specific practice - asking the operations team before designing, circulating a proposal to a team outside your own - with an outcome attached.',
   weak:'A general belief in diverse perspectives with no instance and no mechanism.',
   pairs:'We Win As A Team',
   yourAngle:'Asking the domain or operations people to sanity-check a design, and the mistake they caught.'},

  {id:'team', n:4, name:'We Win As A Team', freq:'med',
   official:'A Blue Box Value: collective success over individual credit, across a large and matrixed organisation.',
   means:'You made another team\'s job easier, or got something done through people you had no authority over.',
   signal:'Amex is large. Working through structure rather than around it is the tested behaviour, as at JPM.',
   asked:['How did you get another team to move for you?','Tell me about sharing credit.','Describe a cross-team delivery.','What did you do when a dependency slipped?'],
   probes:['What was in it for them?','How did you handle the slip?','Who else benefited?','Would they work with you again?'],
   strong:'You turned up with the work half done for them, and the benefit landed on teams beyond your own.',
   weak:'Escalation as the first move, or a cross-team story where the other team is only an obstacle.',
   pairs:'We Need Different Views',
   yourAngle:'The event-contract change that needed three consumers to move with you.'},

  {id:'integrity', n:5, name:'We Value Personal Integrity', freq:'med',
   official:'A Blue Box Value: personal honesty and accountability as a condition of the work, not an add-on to it.',
   means:'You owned an outcome that went badly without distributing the blame.',
   signal:'Overlaps with Do What Is Right; this one is specifically about your own conduct rather than about the decision.',
   asked:['Tell me about a mistake you made.','How did you tell people?','Describe a commitment you could not keep.','What did you do when you were wrong in public?'],
   probes:['What was your part?','How quickly did you say so?','What did you change?','Did it recur?'],
   strong:'Your own contribution named first, told early, with a mechanism that prevents the repeat.',
   weak:'A chain of external causes with your own role buried at the end.',
   pairs:'We Do What Is Right',
   yourAngle:'A production incident a change of yours contributed to, and the alert you added afterwards.'},

  {id:'will-to-win', n:6, name:'We Have A Will To Win', freq:'low',
   official:'A Blue Box Value: competitive drive and follow-through, particularly when the work is hard or unglamorous.',
   means:'You finished something difficult that would have been easy to abandon.',
   signal:'Lower frequency and often folded into other questions. For engineers it usually appears as perseverance on a long migration.',
   asked:['Tell me about something difficult you finished.','Describe a project that dragged.','What kept you going?','When did you consider giving up?'],
   probes:['How long did it take?','What nearly stopped you?','Was it worth it?','What would you do differently?'],
   strong:'An honest timeline with the bad middle included and a concrete finish.',
   weak:'"It was challenging but we delivered." No middle, no cost, no evidence.',
   pairs:'We Win As A Team',
   yourAngle:'A multi-release migration that took longer than planned. The honest version is the strong version.'}
 ],

 prep:[
  ['Week 3','Apply alongside JPM and Expedia','Rung one moves fastest; interviews land in week four.'],
  ['Week 3','Reframe one story in payments vocabulary','Idempotency, duplicates, reconciliation. Same story, better language.'],
  ['Week 4','Write the discrepancy story','Something that did not reconcile and what you did about it.'],
  ['Week 4','Write the "different views" story','A named value with almost no prepared competition.'],
  ['Week 5','"Why Amex" in three sentences','The domain, not the stability.']
 ],

 source:'Largely published for the values. American Express publishes its Blue Box Values, which include backing customers, doing what is right, needing different views, winning as a team, valuing personal integrity and a will to win. Loop structure and relative weighting come from candidate reporting; treat those as a working model.',
 contrast:'Against JPM: the same domain seriousness with less formal change-control language, and slightly more coding. Against Amazon: far fewer probes, so unelaborated answers stay unscored rather than being drawn out of you.'
});

/* ------------------------------------------------------------- EXPEDIA --- */

PLAN.lp.co.push({
 id:'expedia', name:'Expedia', tier:1, rung:'Rung one',
 navSub:'Customer + data · lightest behavioural bar',
 label:'Customer focus, data, collaboration',
 weight:'The lightest behavioural bar on the ladder. Concentrated in the hiring-manager round, conversational elsewhere.',
 oneLine:'The least codified values framework here, which cuts both ways - little to memorise, and nothing to hide behind if the story is thin.',

 scoring:{
  intro:'Expedia does not run a heavily codified behavioural rubric of the kind Amazon or Salesforce use. The loop is more algorithmic than JPM or Amex and a little less deep on internals, and the behavioural weight sits mostly with the hiring manager. What recurs, unsurprisingly for a travel marketplace, is customer experience, data-driven decisions, and working across a lot of teams.',
  rounds:[
   ['Recruiter screen','30 min','Background, motivation, level.'],
   ['Technical rounds (2-3)','45-60 min','Algorithms - a little more than at JPM or Amex - plus system design. Availability, search, caching and booking races recur because they are the product.'],
   ['Hiring manager','45-60 min','Where the behavioural weight sits. Past projects, how you work, team fit, why Expedia.'],
   ['Panel / cross-functional','30-45 min','Sometimes present. Collaboration and communication with non-engineers.']
  ],
  rubric:[
   ['Customer experience in a marketplace','Two sides - travellers and supply partners - with genuinely conflicting interests. Acknowledging that tension is the differentiator.'],
   ['Data over opinion','A travel marketplace runs on experimentation. A story where you measured rather than argued lands well.'],
   ['Cross-team collaboration','Expedia Group is several brands and many teams; getting things done across them is normal work.'],
   ['Pragmatism','Less appetite for elegance than Adobe, less for process than JPM. Shipping the workable thing and iterating is the register.'],
   ['Conversational, low probe count','Few follow-ups. That makes each answer a larger share of the evidence.']
  ],
  reality:[
   'The behavioural bar is genuinely lighter here than at any other company on the ladder. The risk is complacency rather than difficulty.',
   'The domain maps unusually well onto your interview preparation: intervals and availability, caching, booking races and idempotency are all in the sheet already.',
   'Rung one, so this arrives in week four alongside JPM and Amex.',
   'Because there is no published values framework to prepare against, generic answers are the norm - which means a specific one stands out more than it would elsewhere.'
  ]
 },

 framework:{
  intro:'STAR, conversational, with data in the result. The most useful adaptation for Expedia is to have a number in every story - a marketplace company is instinctively experimental and an unmeasured claim reads as an opinion.',
  parts:[
   ['S - Situation','20 sec · ~15%','Name the user side - traveller, partner, internal ops.'],
   ['T - Task','15 sec · ~10%','What you owned.'],
   ['A - Action','55-65 sec · ~45%','What you did, and how you decided. Where you measured rather than argued, say so.'],
   ['R - Result','25 sec · ~20%','Quantified. This is the section Expedia weights most.'],
   ['L - Learning','15 sec · ~10%','What you changed.']
  ],
  rules:[
   'Put a number in every story. A measured result outweighs a well-argued one here.',
   'If you have a story where the data contradicted the assumption, lead with it.',
   'Acknowledge the two-sided marketplace where relevant - what is good for the traveller is often not good for the supply partner.',
   'Use the availability, booking-race and caching material you already have. It maps straight onto their product.',
   'Volunteer detail. Low probe count means anything you do not say is not assessed.'
  ],
  timing:'Two minutes, two or three follow-ups. Assume the story has to be complete on its own.'
 },

 probes:{
  intro:'Fewer probes than anywhere else on this ladder. The failure mode is a friendly conversation that produces very little evidence.',
  groups:[
   ['On customers and the marketplace',[
     'Who used what you built?',
     'Tell me about a trade-off between two groups of users.',
     'How did you know it was working?',
     'Describe a time you changed something after seeing real usage.'
   ]],
   ['On data',[
     'Tell me about a time the data contradicted what everyone believed.',
     'How do you decide between two approaches?',
     'What did you measure, and why that?',
     'Have you ever run an experiment that failed?'
   ]],
   ['On collaboration',[
     'Tell me about working across teams or brands.',
     'How do you handle a dependency that slips?',
     'Describe explaining a technical trade-off to a non-engineer.'
   ]],
   ['On motivation',[
     'Why Expedia?',
     'What interests you about travel?',
     'What do you want to work on?'
   ]]
  ],
  tactics:[
   ['When the round is light','Volunteer the second layer unprompted. Nobody is going to draw it out of you and unsaid is unscored.'],
   ['When asked why Expedia','The domain problems are real and specific - availability across suppliers, price and inventory freshness, search relevance, booking races. Pick one and connect it to something you have built.'],
   ['When you have no travel angle','Use the technical overlap instead. Booking races are inventory races; availability is intervals; freshness is caching. That is a genuine answer.'],
   ['When you have no experiment story','Use any measurement that changed your mind - a profiler result, a load test, a query plan. Data over opinion is the point, not A/B testing specifically.']
  ]
 },

 anti:[
  ['Coasting on a friendly round','The lightest bar on the ladder produces the thinnest evidence, and a pleasant conversation with no specifics is a weak write-up.',
   'FIX: treat the low probe count as your responsibility. Land the number, the trade-off and the learning without being asked.'],
  ['No numbers','A marketplace company runs on measurement, and an unquantified claim reads as an opinion.',
   'FIX: one number per story, minimum.'],
  ['One-sided customer view','Treating "the user" as a single group when the product has travellers on one side and hotels and airlines on the other.',
   'FIX: one story that names a genuine conflict between two user groups and how you chose.'],
  ['Missing the obvious domain overlap','Talking generically when your booking-race, availability and caching work maps directly onto their product.',
   'FIX: reframe one story in their vocabulary. It is the same work.'],
  ['"Why Expedia" answered with travel enthusiasm','"I love to travel." Everyone says it and it is not a reason to hire an engineer.',
   'FIX: a specific problem - inventory freshness across suppliers, search ranking, double-booking under concurrency.']
 ],

 worked:{
  question:'Tell me about a time you prevented a problem before it happened.',
  principle:'Customer focus · Data over opinion',
  story:[
   ['S - Situation','We were adding a reservation flow where two users could try to claim the last unit of something at the same time. The design in review used a read-then-write - check availability, then create the reservation - which is the obvious shape and is wrong under concurrency.',
    'A booking race, stated in one sentence. This is Expedia\'s core technical problem and using it as the story is deliberate.'],
   ['T - Task','I was reviewing the design rather than writing it. I could have left a comment and moved on, but the failure mode was overselling, which is visible to a customer and expensive to unwind.',
    'Names the customer consequence immediately rather than the technical defect - which is the framing that matters here.'],
   ['A - Action','Rather than arguing about it in the review, I wrote a small load test - fifty concurrent requests for the last unit - against a branch with the proposed design. It oversold eleven times out of fifty. That ended the discussion in about a minute, which an opinion would not have. We changed it to an atomic conditional update - decrement the count where the count is still greater than zero, and check rows-affected - and I ran the same test again: zero oversells in fifty, and then zero in five thousand. I also asked what we would do if it ever did happen anyway, because no control is perfect, and we added a reconciliation check that compares reservations against inventory nightly and alerts on a mismatch.',
    'The measurement is the whole answer - eleven out of fifty is not arguable. Adding the reconciliation for the case where the control fails anyway shows the thinking did not stop at the fix.'],
   ['R - Result','No oversells since launch, which is about fourteen months. The reconciliation check has fired twice, both times for a data-migration reason rather than a race, and both were caught the next morning instead of by a customer.',
    'Quantified, and the reconciliation firing for unrelated reasons is the detail that proves it was worth building.'],
   ['L - Learning','The load test took forty minutes to write and settled something that would otherwise have been a long argument between two people with different intuitions. I now write the test before the argument rather than after it. The other thing is that I nearly did not push - it was not my design and I had a review comment queued that would have been easy to leave and let go.',
    'A transferable method plus an honest admission about nearly not bothering. The second half is what stops it reading as self-congratulation.']
  ],
  probesAndAnswers:[
   ['Why not just use a transaction with SELECT FOR UPDATE?','That works too, and it was the other candidate. We chose the conditional update because it holds no lock across a round trip and it was simpler to reason about at our write volume. FOR UPDATE would have been the choice if the reservation needed several rows to be consistent together.'],
   ['What if the reconciliation finds a mismatch?','It alerts and it does not auto-correct, deliberately - an automatic fix on an inventory discrepancy could turn a small problem into a wrong one. Someone looks, decides, and there is a runbook for the two cases we have actually seen.'],
   ['How did the person whose design it was take it?','Fine, because the test was about the design rather than about him, and eleven out of fifty is not something anyone argues with. He wrote the conditional update.'],
   ['Would you always write a load test for this?','No - for something with no customer-visible failure mode it is not worth forty minutes. Overselling is visible and expensive, so the cost of being wrong justified the cost of checking.'],
   ['What would you do differently?','Push earlier. I had the concern in the review and sat on it for a day because it was not my design, and it was only when I realised I would keep thinking about it that I wrote the test.']
  ],
  why:'It is a booking race, which is Expedia\'s product problem stated in miniature. The customer consequence - overselling - is named before the technical defect. The decision is settled by measurement rather than argument, which is the data-over-opinion register a marketplace company runs on, and the numbers are specific. The follow-through adds a reconciliation for the case where the control fails anyway. And the learning admits the candidate nearly did not speak up, which keeps it honest.'
 },

 values:[
  {id:'customer', n:1, name:'Customer focus, both sides', freq:'high',
   official:'Not a numbered value set. Expedia Group is a two-sided travel marketplace and customer experience for both travellers and supply partners is the recurring theme of its engineering work.',
   means:'You know who was affected and, where two groups wanted different things, how you chose.',
   signal:'The two-sided framing is the differentiator. Most candidates answer as though there is one user.',
   asked:['Who used what you built?','Tell me about a trade-off between two user groups.','How did you know it was working for them?','Describe changing something after seeing real usage.'],
   probes:['What did they see?','Which group lost out?','How did you decide?','What did they say?'],
   strong:'A named conflict between two groups and an explicit choice, with the cost to the losing side acknowledged.',
   weak:'"The user" as a single undifferentiated group, or system metrics with nobody in them.',
   pairs:'Data over opinion',
   yourAngle:'Any case where operations and end users wanted opposite things - speed versus verification, automation versus control.'},

  {id:'data', n:2, name:'Data over opinion', freq:'high',
   official:'Not a published value, but the operating style of a marketplace that runs continuous experimentation.',
   means:'You settled a question by measuring rather than by arguing.',
   signal:'The highest-leverage adaptation for an Expedia loop. A number ends a disagreement in a way an argument does not, and they recognise that instinct.',
   asked:['Tell me about a time the data contradicted the assumption.','How do you choose between two approaches?','What did you measure and why?','Have you run an experiment that failed?'],
   probes:['How long did the measurement take?','What would you have done without it?','Did it change anyone\'s mind?','Do you always do this?'],
   strong:'A cheap measurement that settled an expensive argument, with the numbers, plus a sense of when it is not worth doing.',
   weak:'A confident claim with no evidence, or measurement described in general terms with no result.',
   pairs:'Customer focus',
   yourAngle:'The forty-minute load test. Cheap measurement, unarguable result.'},

  {id:'collab', n:3, name:'Cross-team collaboration', freq:'med',
   official:'Not a published value. Expedia Group spans several brands and many teams, and cross-team delivery is ordinary work.',
   means:'You delivered something that needed people outside your team, without authority over them.',
   signal:'Standard for a large company, tested conversationally rather than formally.',
   asked:['Tell me about working across teams.','How do you handle a dependency that slips?','Describe explaining a technical trade-off to a non-engineer.'],
   probes:['What was in it for them?','What did you do when it slipped?','How did you keep it moving?','Would they work with you again?'],
   strong:'You reduced the cost of saying yes, and you have a specific story about a slipped dependency and what you did instead of escalating.',
   weak:'Escalation as the first move, or a cross-team story with no friction in it at all.',
   pairs:'Pragmatism',
   yourAngle:'The event-contract change that needed downstream consumers to move.'},

  {id:'pragmatism', n:4, name:'Pragmatism', freq:'med',
   official:'Not a published value. The observed register of Expedia engineering: ship the workable thing and iterate.',
   means:'You chose the simpler option that was good enough, deliberately, and can say what you gave up.',
   signal:'Less appetite for elegance than Adobe and less for process than JPM. Knowing when not to build the better thing is the signal.',
   asked:['Tell me about a time you chose the simpler solution.','When have you accepted technical debt deliberately?','Describe shipping something you were not fully happy with.','How do you decide what is good enough?'],
   probes:['What did you give up?','Did it come back?','Would you make the same call now?','How did you decide?'],
   strong:'A deliberate trade with the cost named and, ideally, a note of what actually happened afterwards.',
   weak:'Debt taken accidentally and reframed as a decision, or a story where you always built the better thing.',
   pairs:'Data over opinion',
   yourAngle:'A time you shipped a workaround with a follow-up ticket, and what happened to that ticket - honestly.'}
 ],

 prep:[
  ['Week 3','Apply alongside JPM and Amex','Rung one; interviews land in week four.'],
  ['Week 3','Put a number in four stories','Expedia weights the result more than anything else.'],
  ['Week 4','Reframe the booking-race work in their vocabulary','Availability, inventory, double-booking. It is already in your sheet.'],
  ['Week 4','Write the two-sided trade-off story','A conflict between two user groups and an explicit choice.'],
  ['Week 5','"Why Expedia" in three sentences','A specific product problem, not travel enthusiasm.']
 ],

 source:'Least codified of the companies here. Expedia Group does not publish a numbered values framework comparable to Amazon\'s principles or Salesforce\'s values, and the themes described - customer focus across a two-sided marketplace, data-driven decisions, cross-team collaboration and pragmatism - are inferred from the shape of the business and from candidate reporting rather than quoted from company material. Treat this page as a working model with lower confidence than the published-values companies, and rely on the general behavioural preparation plus the domain overlap.',
 contrast:'Against JPM and Amex: the same rung, but more algorithmic and much lighter on risk and control language. Against Amazon: no rubric at all to prepare against, which makes specificity worth more rather than less.'
});

/* --------------------------------------------------------------- APPLE --- */

PLAN.lp.co.push({
 id:'apple', name:'Apple', tier:3, rung:'Rung three (adjacent)',
 navSub:'No public rubric · team-dependent',
 label:'Craft, secrecy and claimed expertise',
 weight:'Highly variable by team. Some loops are almost entirely technical; others are heavily conversational. The consistent element is depth on whatever you claim.',
 oneLine:'The company with no published values framework and the hardest probing of your own resume - do not write down anything you cannot go three levels deep on.',

 scoring:{
  intro:'Apple does not publish a behavioural rubric and its loops vary more by team than any other company here. What is consistent across candidate reports is a set of tendencies: deep probing of claimed expertise, comfort with limited context because of secrecy, attention to craft, and a real interest in why you want to work there specifically.',
  rounds:[
   ['Recruiter screen','30 min','Background and motivation. Often vague about the actual team, deliberately.'],
   ['Hiring manager','45-60 min','Your work in depth. This is where claimed expertise gets tested and where the behavioural weight usually sits.'],
   ['Technical rounds (3-5)','45-60 min','Varies enormously by team - algorithms, domain-specific depth, practical debugging, sometimes hardware-adjacent context.'],
   ['Cross-functional / panel','45-60 min','How you work with design, hardware or other software teams. Apple ships integrated products and cross-discipline collaboration is real work.']
  ],
  rubric:[
   ['Depth on anything you claim','The most consistent Apple pattern. They will pick something from your resume and keep going until you reach the edge of your knowledge - and the assessment is partly whether you say so plainly when you get there.'],
   ['Comfort with limited context','Secrecy means you may be asked to reason about a problem without being told what the product is. Being unsettled by that is itself a signal.'],
   ['Craft and detail','Apple\'s self-image is built on it. Sloppy work described casually lands badly.'],
   ['Cross-discipline collaboration','Software, hardware, design and operations ship together. Stories that stay entirely inside a backend team demonstrate less.'],
   ['Genuine motivation','"Why Apple" is asked seriously and "I love the products" is the answer everyone gives.']
  ],
  reality:[
   'Team variance is the defining feature. Two Apple loops can look almost nothing alike, so prepare breadth plus depth on your own claims rather than a specific format.',
   'Secrecy is real: you may not know what you would be working on until late, sometimes not until you start.',
   'The resume probing is the thing to prepare for. Remove anything you cannot defend three levels down.',
   'Apple is on this ladder as an adjacent option rather than a primary target - prepare it opportunistically rather than at the cost of the rung-two set.'
  ]
 },

 framework:{
  intro:'STAR, with unusual emphasis on technical depth inside the action. Apple interviewers follow the mechanism further than most, so the story needs to be one you genuinely understand rather than one you can narrate.',
  parts:[
   ['S - Situation','20 sec · ~15%','Context, briefly.'],
   ['T - Task','15 sec · ~10%','What you owned.'],
   ['A - Action','60-70 sec · ~50%','The mechanism, in detail. Expect to be taken deeper than you planned, so choose a story you can survive at three levels down.'],
   ['R - Result','20 sec · ~15%','Quantified.'],
   ['L - Learning','15 sec · ~10%','What you changed.']
  ],
  rules:[
   'Choose stories you understand to the bottom. Apple probing goes further than any other company here except Amazon\'s Dive Deep, and it goes further into the technology rather than into the decision.',
   'Say where your knowledge ends, plainly. "I do not know how that is implemented below this layer" is a good answer; a confident guess is the failure.',
   'Audit your resume before applying. Anything you cannot defend for ten minutes should not be on it.',
   'Have one cross-discipline story - working with hardware, design, operations, or another engineering discipline.',
   'Answer "why Apple" with the engineering problem, not the products. Scale, integration, constraint, privacy - something you can substantiate.'
  ],
  timing:'Two minutes and then expect the follow-ups to keep going. Budget for a story that gets taken apart rather than one that gets acknowledged.'
 },

 probes:{
  intro:'Apple probes downward, into the technology, and sideways into how you work with other disciplines.',
  groups:[
   ['On claimed expertise',[
     'Walk me through how that actually works, one level down.',
     'And below that?',
     'What happens if this component fails?',
     'Why is it designed that way rather than the alternative?',
     'What do you not know about it?'
   ]],
   ['On craft',[
     'What are you proudest of technically?',
     'What would you rewrite?',
     'How do you know when something is finished?',
     'Tell me about a bug that took a long time to find.'
   ]],
   ['On collaboration across disciplines',[
     'Tell me about working with a team outside software.',
     'How do you explain a technical constraint to a non-engineer?',
     'Describe a disagreement between engineering and another discipline.'
   ]],
   ['On motivation',[
     'Why Apple?',
     'What do you want to work on?',
     'How do you feel about not knowing what you will be working on?',
     'What are you looking for that you do not have now?'
   ]]
  ],
  tactics:[
   ['When the probing reaches your limit','Say so immediately and say what you would do to find out. Reaching the edge is expected; pretending not to have reached it is the failure.'],
   ['When they will not tell you what the product is','Engage with the abstraction as given. Ask the questions you would ask anyway - inputs, rates, constraints, failure modes - and do not push for the product name.'],
   ['When asked why Apple','Something substantiable. Privacy as an engineering constraint, integration across hardware and software, or scale at a specific service you can name.'],
   ['When the loop feels inconsistent','It is. Different interviewers on an Apple loop genuinely want different things; treat each round on its own terms rather than looking for a house style.']
  ]
 },

 anti:[
  ['A resume you cannot defend','The single most common Apple failure. Something listed that you touched once, probed until it collapses.',
   'FIX: audit and remove. Anything that cannot survive ten minutes of questioning is a liability rather than an asset.'],
  ['Bluffing at the edge of your knowledge','A confident guess when the probing goes one level too deep. Apple interviewers keep going, so the guess gets found.',
   'FIX: "I do not know below that layer - here is how I would find out." It is a good answer and it stops the descent cleanly.'],
  ['Being unsettled by secrecy','Pushing to know what the product is, or visibly disliking the ambiguity. That reaction is itself information.',
   'FIX: treat the abstraction as the problem. It usually is.'],
  ['Everything inside one discipline','No story involving hardware, design, operations or another engineering function. Apple ships integrated products.',
   'FIX: one cross-discipline story, even a modest one.'],
  ['"Why Apple" answered with fandom','"I have used Apple products my whole life." Universal, and it says nothing about the work.',
   'FIX: an engineering reason you can substantiate - privacy as a constraint, integration, or a specific service at scale.']
 ],

 worked:{
  question:'Tell me about the hardest bug you have found.',
  principle:'Depth · Craft',
  story:[
   ['S - Situation','We had a service that would, roughly once a week, stop consuming from its queue while still reporting healthy. No errors, no restarts, no memory growth. It would come back on its own after somewhere between twenty minutes and two hours.',
    'A hard, specific, non-obvious symptom. The detail that it self-recovered is what makes it genuinely difficult rather than merely annoying.'],
   ['T - Task','Nobody could reproduce it and it was rare enough that people had started restarting the pod and moving on. I picked it up because the self-recovery bothered me - something that fixes itself has a mechanism, and I wanted to know what it was.',
    'The reason for caring is technical curiosity rather than assignment, which is the right register for Apple.'],
   ['A - Action','I could not reproduce it, so I made it observable instead. I added a thread dump on demand and a consumer-lag metric, then waited for it to happen. When it did, the dump showed every consumer thread blocked on the same lock, held by a thread that was itself waiting on an HTTP call with no timeout set. The call was to an internal service that had occasional very long responses. Because the lock was held across the network call, one slow response stalled every consumer. It recovered when the socket eventually timed out at the OS level, which is why the delay was so variable - that is a kernel timeout, not an application one. The fix was two things: a real timeout on the HTTP client, and moving the network call outside the synchronised block, which it never needed to be inside. I checked the rest of the codebase for the same shape and found two more places doing it.',
    'The mechanism is followed all the way down - application lock, to HTTP client, to OS socket timeout - which is exactly the descent Apple probing performs. The variable recovery time is explained by the mechanism rather than left as a mystery. And searching for the same shape elsewhere is the craft beat.'],
   ['R - Result','It has not happened since, about eighteen months. The two other instances of the same pattern had not caused a visible problem yet, and one of them was on a call that would have been much worse - it was in the request path rather than a background consumer.',
    'Quantified, and the two latent instances demonstrate that the work generalised.'],
   ['L - Learning','The lesson I actually took was about defaults. That HTTP client had no default timeout, and I had assumed it did, because most of them do. I now check the timeout defaults of anything that goes over a network before I use it, and it is surprising how often the answer is "infinite". The other lesson is that unreproducible is not the same as uninvestigable - I spent a week trying to reproduce it before I switched to making it observable, and that week was wasted.',
    'A specific, transferable technical lesson about defaults, plus a genuine admission of a week spent the wrong way.']
  ],
  probesAndAnswers:[
   ['Why was the recovery time so variable?','Because it was the OS socket timeout doing the work rather than anything in the application. That is not a fixed short value, and it depends on what the remote end is doing - whether it is silent or slowly dribbling data. The variability is what eventually told me it was below the application layer.'],
   ['How did you get a thread dump from a pod at the moment it happened?','I added an endpoint that dumps threads on request, and the consumer-lag metric alerted when lag started climbing with no throughput. So the alert fired, and I hit the endpoint while it was still stuck. Before that I had been getting dumps after the restart, which showed nothing.'],
   ['Why was the network call inside the synchronised block?','No good reason - it had been added inside an existing block by someone extending the method, which is the usual way this happens. The lock was protecting a small piece of shared state that had nothing to do with the call.'],
   ['What would you have done if the thread dump had not shown it?','Next would have been the socket level - ss or netstat inside the pod to see whether there was an established connection sitting idle, and then tcpdump if that had not been enough. The point was to keep moving down a layer at a time.'],
   ['You said you spent a week trying to reproduce it. When should you have stopped?','After a day. The signal that it was not reproducible locally was clear early - it needed a slow response from a specific internal service under real conditions. Once something depends on a rare external timing, making it observable is faster than making it happen.']
  ],
  why:'It is a bug story that survives descent. Every follow-up has an answer one layer further down - lock, to client, to socket, to what the next diagnostic step would have been - which is what Apple probing is testing. The variable recovery time is explained rather than waved at. Checking the codebase for the same shape and finding two latent instances is craft rather than fix-and-forget. And the learning is a specific technical habit about defaults, plus an honest admission that the first week was spent the wrong way.'
 },

 values:[
  {id:'depth', n:1, name:'Depth on what you claim', freq:'high',
   official:'Not a published value. The most consistently reported characteristic of Apple interviews: sustained probing into anything on your resume.',
   means:'Everything you claim, you can explain several levels below the surface - and you say plainly where that stops.',
   signal:'The defining Apple pattern. The assessment is both how deep you go and how you behave when you run out.',
   asked:['Walk me through how that works.','And below that?','Why is it designed that way?','What do you not know about it?'],
   probes:['What happens if that component fails?','What is the alternative design and why was it not used?','How would you verify that?','Where does your knowledge end?'],
   strong:'Three or four levels of mechanism, then a clean stop: "below that I do not know, and here is how I would find out."',
   weak:'A confident guess at the edge. Or a resume item that collapses after two questions.',
   pairs:'Craft',
   yourAngle:'Pick two or three things you genuinely understand to the bottom - JVM behaviour, Postgres MVCC, Kubernetes scheduling - and make sure the resume leans on those.'},

  {id:'craft', n:2, name:'Craft and detail', freq:'high',
   official:'Not a published value, but Apple\'s self-description across its products, and it carries into how work is discussed.',
   means:'You care how the thing is made, not only whether it works.',
   signal:'Similar to Adobe\'s Exceptional, but applied to the whole system rather than mainly to code. Finishing properly is the theme.',
   asked:['What are you proudest of technically?','What would you rewrite?','How do you know when something is done?','Tell me about a bug that took a long time to find.'],
   probes:['Why that way?','What did you leave unfinished?','What would you do with another week?','Did anyone else notice?'],
   strong:'A finishing detail nobody asked for - checking the codebase for the same defect, the runbook, the metric - described without self-congratulation.',
   weak:'"It worked, so we moved on." Or craft claimed as a value with no instance.',
   pairs:'Depth',
   yourAngle:'Searching the rest of the codebase for the same shape after a fix. Small, real, and unmistakably craft.'},

  {id:'ambiguity', n:3, name:'Working without full context', freq:'med',
   official:'Not a published value. A practical consequence of Apple\'s secrecy: engineers frequently work on components without full knowledge of the product.',
   means:'You can design against a described problem without needing to know what it is for.',
   signal:'You may be given an abstracted problem deliberately. Pushing to know the product, or being visibly uncomfortable, is itself read.',
   asked:['How do you feel about not knowing what you will work on?','Tell me about working with incomplete information.','Have you built something without knowing how it would be used?'],
   probes:['What did you ask for instead?','How did you avoid over-designing?','What assumptions did you write down?','What would have changed your design?'],
   strong:'You ask about inputs, rates, constraints and failure modes rather than about purpose, and you write your assumptions down.',
   weak:'Needing the product context before you can start, or over-designing to cover every use you can imagine.',
   pairs:'Depth',
   yourAngle:'The unknown-domain method in this sheet is exactly this skill. Translate the shape, do not learn the domain.'},

  {id:'cross', n:4, name:'Cross-discipline collaboration', freq:'med',
   official:'Not a published value. Apple ships integrated hardware and software products, so working across disciplines is ordinary.',
   means:'You have worked with people who are not software engineers and adjusted how you communicate.',
   signal:'Backend candidates often have nothing here. Even a modest story - working with operations, support or a data team - is better than none.',
   asked:['Tell me about working with a team outside software.','How do you explain a technical constraint to a non-engineer?','Describe a disagreement between engineering and another discipline.'],
   probes:['What did they care about that you had not considered?','How did you find the common language?','What did you change?','How did it end?'],
   strong:'You changed your own framing to match theirs and something concrete came of it - a caught mistake, a better requirement.',
   weak:'A story where the non-engineers simply needed to be educated.',
   pairs:'Craft',
   yourAngle:'Asking domain or operations people to review your class names or your design. That is cross-discipline collaboration with an outcome.'},

  {id:'motivation', n:5, name:'Why Apple', freq:'high',
   official:'Not a value - a question, asked seriously, and answered with product enthusiasm by nearly everyone.',
   means:'You have an engineering reason that survives a follow-up.',
   signal:'The universal weak answer is fandom. A substantiable engineering reason is immediately differentiating.',
   asked:['Why Apple?','What do you want to work on?','What are you looking for that you do not have?','How do you feel about the secrecy?'],
   probes:['What do you know about that area?','What else are you considering?','What would make this the wrong move?','What would you miss about your current role?'],
   strong:'Privacy or on-device constraint as an engineering problem, integration across layers, or a specific service at scale - connected to your own work.',
   weak:'"I love Apple products." Or an answer that would fit any large technology company.',
   pairs:'Depth',
   yourAngle:'Apple runs very large backend services behind services people think of as on-device. That is your stack; be specific about which problem interests you.'}
 ],

 prep:[
  ['Opportunistic','Apple is adjacent to the ladder rather than on it','Prepare it if a referral appears; do not spend rung-two time on it.'],
  ['Before applying','Audit the resume','Remove anything you cannot defend for ten minutes. This is the highest-value single action for an Apple loop.'],
  ['Before the loop','Pick three deep areas','Things you understand to the bottom. Make sure the resume leans on those.'],
  ['Before the loop','One cross-discipline story','Even a modest one. Most backend candidates have none.'],
  ['Before the loop','"Why Apple" that survives a follow-up','An engineering reason, substantiable, not fandom.']
 ],

 source:'Least documented of the companies here. Apple publishes no behavioural rubric and no values framework for interviewing, and its loops vary substantially by team. Everything on this page is inferred from consistent candidate reporting and from the structural facts of how Apple works - secrecy, integrated hardware and software, and craft as a stated company self-image. Treat it as the lowest-confidence page in this section and prepare breadth plus depth on your own claims rather than a format.',
 contrast:'Against Amazon: the probing goes into the technology rather than into the decision, and there is no rubric to map answers onto. Against Google: no hypotheticals, no committee, and far more variance between one loop and the next.'
});

/* ------------------------------------------------------------ FLIPKART --- */

PLAN.lp.co.push({
 id:'flipkart', name:'Flipkart', tier:2, rung:'Rung two (adjacent)',
 navSub:'Audacity · machine coding decides',
 label:'Audacity, Bias for Action, Customer First, Integrity, Inclusion',
 weight:'Light relative to the machine-coding round, which is the real gate. Behavioural sits with the hiring manager and a senior round.',
 oneLine:'The behavioural bar is not what fails candidates here - the 90-minute machine-coding round is, and how you handle running out of time is read as behaviour.',

 scoring:{
  intro:'Flipkart\'s published values centre on audacity, bias for action, customer first, integrity and inclusion, and they map onto a high-velocity Indian e-commerce culture. For an engineer the loop is dominated by the machine-coding round, which is where most candidates are eliminated, so the behavioural preparation should be proportionate.',
  rounds:[
   ['Recruiter screen','30 min','Background, level, motivation.'],
   ['Machine coding','60-90 min','The differentiator. Runnable, tested code from a written problem statement, evaluated on design, extensibility and whether it actually runs. Most candidates fail here.'],
   ['Problem solving / DSA','45-60 min','Solid mediums.'],
   ['Design round','45-60 min','LLD and sometimes HLD, often building on the machine-coding solution.'],
   ['Hiring manager','45-60 min','Behavioural, team fit, motivation. Where the values questions live.']
  ],
  rubric:[
   ['Machine coding is the gate','It is scored on working code, clean separation of concerns, extensibility, and tests. Finishing beats elegance.'],
   ['Bias for action, meant literally','Velocity is genuinely part of the culture. Stories where you shipped and iterated land better than stories where you planned carefully.'],
   ['Customer first, in an e-commerce sense','Scale, order accuracy, delivery experience. Concrete customer-facing consequences.'],
   ['Audacity','Taking on something larger than your remit or your experience. This is the value most specific to Flipkart.'],
   ['Ownership through the messy part','High-growth environments generate a lot of unowned work; they want evidence you pick it up.']
  ],
  reality:[
   'The machine-coding round is the thing to prepare. Practise finishing a working, tested design in ninety minutes - most people have never done it under a clock.',
   'The behavioural bar is lighter than Amazon\'s and the round count is lower, so preparation should be proportionate rather than equal.',
   'Flipkart is adjacent to the ladder - a strong fit for your LLD work, and worth taking if a referral appears.',
   'Velocity stories land better here than careful ones, which is close to the opposite of the JPM register. Do not use the same delivery in both rooms.'
  ]
 },

 framework:{
  intro:'STAR, delivered at pace. Flipkart is a bias-for-action culture and a long careful answer reads as slow. Keep the stories tight and lead with what you did.',
  parts:[
   ['S - Situation','15 sec · ~10%','Short. Scale or growth context if there is one.'],
   ['T - Task','15 sec · ~10%','What you took on.'],
   ['A - Action','60-70 sec · ~50%','What you did, fast. Where you shipped something imperfect and iterated, say so - that is on-value here rather than a confession.'],
   ['R - Result','20 sec · ~15%','Quantified.'],
   ['L - Learning','15 sec · ~15%','What you changed.']
  ],
  rules:[
   'Lead with action. This is the one company on the ladder where "I shipped it and then improved it" is the preferred shape rather than a risk.',
   'Have an audacity story - something bigger than your remit or your experience at the time.',
   'Practise machine coding to a timer. It decides the loop and it is a skill, not a knowledge test.',
   'Keep the stories tight. A two-minute answer at Flipkart should feel faster than a two-minute answer at JPM.',
   'Have a customer-facing consequence in at least one story - orders, delivery, payments, returns.'
  ],
  timing:'Ninety seconds to two minutes, briskly. Fewer probes than Amazon.'
 },

 probes:{
  intro:'Flipkart probes for velocity, ownership and scale.',
  groups:[
   ['On bias for action',[
     'Tell me about something you shipped fast.',
     'When did you decide not to wait?',
     'Describe iterating on something imperfect.',
     'What is the fastest you have taken something from idea to production?'
   ]],
   ['On audacity and ownership',[
     'Tell me about taking on something you were not qualified for.',
     'Describe the largest thing you have owned.',
     'What did you do when nobody owned a problem?',
     'When have you been out of your depth?'
   ]],
   ['On customers and scale',[
     'What broke first when traffic grew?',
     'Tell me about a customer-facing failure.',
     'How did you handle a peak event?',
     'Describe a trade-off between speed and correctness.'
   ]],
   ['On the machine-coding round',[
     'Why did you structure it that way?',
     'How would you add feature X?',
     'What did you leave out, and why?',
     'What would you do with another thirty minutes?'
   ]]
  ],
  tactics:[
   ['When machine coding is running short','Say the trade-off out loud and finish something that runs. "I am stubbing persistence and finishing the core flow" is the scored behaviour.'],
   ['When asked about shipping fast','Do not hedge it into a careful story. Velocity is the value; add the safety detail as a clause rather than as the point.'],
   ['When asked about being out of your depth','Answer honestly. Audacity requires having been somewhere uncomfortable, and a story where you were always competent evidences nothing.'],
   ['When asked to extend your machine-coding design','This is why the extensibility mattered. If the design is clean, adding the feature is one class - say that and show where.']
  ]
 },

 anti:[
  ['Unfinished machine coding','The dominant failure. An elegant half-built design that does not run scores below a plain complete one.',
   'FIX: practise finishing. Two full ninety-minute runs before the loop, with tests, on a clock.'],
  ['Over-careful delivery','Bringing the JPM register - controls, approvals, staged rollout - to a bias-for-action culture reads as slow.',
   'FIX: lead with what you did. Keep the safety, but as a clause rather than the headline.'],
  ['No audacity story','Nothing you were underqualified for. It is the most Flipkart-specific value and it needs a real example.',
   'FIX: one story where you were out of your depth and took it anyway.'],
  ['No customer consequence','Pure infrastructure with no order, delivery or payment impact anywhere.',
   'FIX: one story with a customer-facing failure or improvement.'],
  ['Preparing behavioural at Amazon depth','Disproportionate. The machine-coding round is the gate and it is where the preparation time should go.',
   'FIX: four solid stories and two practice machine-coding runs, in that priority order.']
 ],

 worked:{
  question:'Tell me about a time you took on something you were not ready for.',
  principle:'Audacity · Bias for Action · Ownership',
  story:[
   ['S - Situation','Our order service was a monolith method that everyone was afraid of, and we needed to add two new promotion types in one quarter. The person who knew it best had left three months earlier.',
    'Short, and the departed expert is the detail that makes it genuinely uncomfortable rather than merely large.'],
   ['T - Task','I volunteered to restructure it, having never done a refactor of that size and never having owned that part of the codebase.',
    'The audacity beat, stated plainly and without dressing it up.'],
   ['A - Action','I did not try to understand all of it first, because that would have taken the quarter. I listed every promotion type we supported and asked what actually varied between them - it was two things: how the discount was computed and what made an order eligible. Everything else was shared. So I extracted an interface with those two operations and one implementation per promotion, kept the old method as a delegating shim for a release, and ran both paths against production traffic comparing outputs before deleting the old one. I shipped the first three promotion types in week two rather than waiting until all of them were converted, so we were getting value and finding problems while there was still time to fix them.',
    'The audacity is bounded by method rather than by bravery - what varies, shim, parallel run - and shipping incrementally is bias for action demonstrated rather than claimed.'],
   ['R - Result','Both new promotion types landed inside the quarter, at about two hours each instead of the day and a half the old method cost. No production incidents through the migration. And that area has not had a bug in about a year.',
    'Quantified in delivery speed, which is the currency here.'],
   ['L - Learning','What I would do differently is the parallel comparison - I did it by logging both outputs and diffing offline, which was fiddly and I nearly abandoned it. A proper shadow comparison with a metric would have cost an extra afternoon and made it boring. What I would keep is not trying to understand everything first. Asking what varies got me to a working structure in two days on a codebase I did not know.',
    'A specific method regret and a transferable principle, which is what stops an audacity story sounding like recklessness.']
  ],
  probesAndAnswers:[
   ['Were you not worried about breaking order processing?','Yes, which is why the old method stayed as a shim for a release and both paths ran in parallel against real traffic before anything was deleted. The bravery was in taking it on; the execution was deliberately boring.'],
   ['How did you know the two axes were the right ones?','Because when I listed all nine existing promotions, every one of them differed only in those two things. If the tenth had differed in a third way I would have found out during the migration and added it - the shim meant that was recoverable.'],
   ['What would you have done if it had gone wrong mid-quarter?','Stopped and shipped the two new promotions the old way, in the long method. That was always the fallback and it was one of the reasons for converting incrementally rather than all at once.'],
   ['How would you add a promotion that depends on the customer\'s history?','That is a new eligibility implementation - the predicate takes the order and can look up whatever it needs. One class, no edits to existing ones, which is the whole point of the split.'],
   ['You said you nearly abandoned the parallel comparison. What if you had?','Then I would have been deleting the old path on the strength of the test suite alone. The tests were good, so it probably would have been fine - but "probably fine" on order pricing is not a trade I would want to make again.']
  ],
  why:'The audacity is real - an unfamiliar critical codebase whose expert had left - and it is bounded by method rather than by confidence. The incremental shipping is bias for action shown rather than asserted. The safety measures are present but stated as clauses rather than as the headline, which is the right register for this room and the wrong one for JPM. And the follow-up about extending the design is the machine-coding conversation in miniature, which is where the loop actually gets decided.'
 },

 values:[
  {id:'audacity', n:1, name:'Audacity', freq:'high',
   official:'A published Flipkart value: aiming beyond what seems reasonable and taking on more than is comfortable.',
   means:'You took on something you were not obviously qualified for and made it work.',
   signal:'The most Flipkart-specific value. A career of competent, well-scoped work evidences nothing here.',
   asked:['Tell me about taking on something you were not ready for.','What is the largest thing you have owned?','When have you been out of your depth?','Describe a goal that seemed unrealistic.'],
   probes:['What made you think you could?','What went wrong?','What did you do when it did?','Would you do it again?'],
   strong:'Genuine discomfort, bounded by method rather than by bravery, with the fallback named.',
   weak:'Well-scoped work described as ambitious, or recklessness with no fallback.',
   pairs:'Bias for Action',
   yourAngle:'A refactor of a critical system you did not know, after the person who did know it left.'},

  {id:'action', n:2, name:'Bias for Action', freq:'high',
   official:'A published Flipkart value: speed of decision and delivery over exhaustive analysis.',
   means:'You shipped something imperfect and improved it rather than waiting for it to be right.',
   signal:'Meant literally in a high-growth e-commerce culture. This is the one room on the ladder where the careful register is a liability.',
   asked:['Tell me about something you shipped fast.','When did you decide not to wait?','Describe iterating on something imperfect.','How fast have you gone from idea to production?'],
   probes:['What did you leave out?','What broke?','How did you fix it?','Would you do it that way again?'],
   strong:'Incremental delivery with a visible fallback, and honesty about what you left out.',
   weak:'A careful staged rollout presented as speed, or speed with no safety net at all.',
   pairs:'Audacity · Customer First',
   yourAngle:'Shipping three of nine converted promotion types in week two rather than converting all of them first.'},

  {id:'customer', n:3, name:'Customer First', freq:'high',
   official:'A published Flipkart value: the customer outcome ahead of internal convenience.',
   means:'You know what a failure looked like to someone placing or receiving an order.',
   signal:'E-commerce specifics land: order accuracy, delivery, returns, payment failures, peak-event behaviour.',
   asked:['Tell me about a customer-facing failure.','What broke first when traffic grew?','How did you handle a peak event?','Describe a trade-off between speed and correctness.'],
   probes:['What did the customer see?','How many were affected?','How did you find out?','What did you change?'],
   strong:'A named customer-facing consequence with a count, and a change made because of it.',
   weak:'Infrastructure metrics with no order and no person in the story.',
   pairs:'Bias for Action',
   yourAngle:'Overselling, duplicate charges, or lost orders. All three are in your material already.'},

  {id:'integrity', n:4, name:'Integrity', freq:'med',
   official:'A published Flipkart value: honesty and doing the right thing, including when it is inconvenient.',
   means:'You reported a problem or a mistake that would have been easy to leave.',
   signal:'Standard integrity testing. In a high-velocity culture the specific temptation is to ship past a known defect.',
   asked:['Tell me about reporting your own mistake.','Have you shipped something you knew had a problem?','When did you say something was not ready?','Describe refusing a shortcut.'],
   probes:['Who did you tell?','How quickly?','What did it cost?','What changed?'],
   strong:'Your own error, reported fast, with a mechanism added afterwards.',
   weak:'A story with no cost, or one where the problem was somebody else\'s.',
   pairs:'Customer First',
   yourAngle:'A known defect you flagged before a release rather than after it.'},

  {id:'inclusion', n:5, name:'Inclusion', freq:'low',
   official:'A published Flipkart value: building teams where different people can do their best work.',
   means:'You did something specific that changed who contributed.',
   signal:'Lower frequency in engineering loops. A mechanism beats a sentiment, as everywhere.',
   asked:['How do you make sure everyone is heard?','Tell me about onboarding someone.','Describe a perspective that changed your approach.'],
   probes:['What did you do differently?','Did it change the outcome?','Do you still do it?'],
   strong:'A named practice with a result.',
   weak:'A statement of belief with no instance.',
   pairs:'Customer First',
   yourAngle:'How you onboard people onto a system you own - the written walkthrough that someone actually used.'}
 ],

 prep:[
  ['Opportunistic','Flipkart is adjacent to the ladder','Worth taking if a referral appears; your LLD work fits it well.'],
  ['Before the loop','Two full machine-coding runs','Ninety minutes, tested, finished, on a clock. This is where the loop is decided.'],
  ['Before the loop','Write the audacity story','Something you were not ready for.'],
  ['Before the loop','Speed up the delivery','The careful JPM register reads as slow here. Same stories, briskly.'],
  ['Before the loop','One customer-facing failure story','Orders, payments, delivery.']
 ],

 source:'Values largely published. Flipkart publishes a values set centred on audacity, bias for action, customer first, integrity and inclusion. The loop structure and the dominance of the machine-coding round come from consistent candidate reporting; treat the round mechanics as a working model.',
 contrast:'Against JPM: close to the opposite register. Flipkart rewards velocity and audacity where JPM rewards control and staged safety - the same story needs a genuinely different delivery. Against Amazon: fewer probes and a lighter behavioural weight, with the machine-coding round taking the place LP occupies at Amazon.'
});

/* ============================================== SHARED ACROSS COMPANIES ===
   The story bank is one bank. These pages are the machinery that lets the
   same fifteen stories serve eleven different rubrics.                    */


PLAN.lp.universal = {};

/* the recut matrix - one story, eleven rooms */

PLAN.lp.universal.recut = {
 intro:'You are not writing eleven story banks. You are writing fifteen stories and learning to recut them. The events do not change; the emphasis, the pronoun, the closing beat and the delivery speed do. This table is the whole reason for putting the companies side by side.',
 note:'Read a row as: same story, this is the sentence you add or remove for this room.',
 rows:[
  ['Amazon','"I", relentlessly. Sixty percent action. One principle per story, named before you start.','Add: the number, the alternative you rejected, the decision you made alone.','Remove: the collaborator who dilutes your contribution. Remove the hedge.'],
  ['Google','"We" is allowed if your part is unambiguous. Forty percent action, twenty percent learning.','Add: the collaborators by role, the thing you got wrong, the moment you stepped back.','Remove: the conviction with no doubt in it. Remove anything dismissive about a colleague.'],
  ['Microsoft','Conversational. The learning goes inside the action, not after it.','Add: what you did not know at the start, the org boundary you crossed, the internal customer.','Remove: the intensity. Slow the delivery down.'],
  ['Adobe','Natural, slightly unpolished. Craft is the differentiator.','Add: one structural or naming decision, the maintenance outcome, someone you made better.','Remove: the over-rehearsed cadence. Let a real detail surface mid-sentence.'],
  ['JP Morgan','Formal. Control sentence mandatory. Speed is a liability unless paired with safety.','Add: what could have gone wrong, the rollback, who reviewed it, the named business client.','Remove: "we shipped it in two days" as a headline. Remove going around a process.'],
  ['American Express','JPM shape, less ceremony. Payments vocabulary is an asset you already have.','Add: the cardholder or merchant consequence, idempotency and reconciliation language.','Remove: nothing much - this is the JPM cut with a lighter touch.'],
  ['Expedia','Conversational, number-led. Low probe count, so volunteer everything.','Add: the measurement that settled it, the two-sided user trade-off.','Remove: nothing - but say more than you are asked, because nobody will draw it out.'],
  ['Uber','Ownership register, close to Amazon, plus a real ethics dimension.','Add: the disagreement with someone senior, the honest bad middle, the unassigned work.','Remove: the tidy arc. A story with no grind in it evidences nothing here.'],
  ['Salesforce','Values-named. Trust outranks the customer request and they test the ordering.','Add: the time you said no and found the safe route, the equality mechanism, the customer outcome.','Remove: delivery framed as success. Reframe as what the customer could then do.'],
  ['Apple','Depth register. Expect the follow-ups to keep descending.','Add: two more layers of mechanism, and a clean statement of where your knowledge stops.','Remove: any claim you cannot defend three levels down. Remove it from the resume too.'],
  ['Flipkart','Brisk. Bias for action is meant literally.','Add: the audacity, the incremental ship, the customer-facing consequence.','Remove: the careful staged register. It reads as slow here.']
 ],
 worked:{
  intro:'One event, four rooms. This is the same incident - the intermittent 5xx caused by connection-pool exhaustion - told for four different rubrics. Nothing is invented between versions; the emphasis moves.',
  rows:[
   ['Amazon · Dive Deep','"I correlated the 5xx timestamps against pod restarts, deploys and connection counts. My first hypothesis was a connection leak and it was wrong - the pool returned them fine. The actual mechanism was long transactions holding MVCC row versions, autovacuum falling behind, query latency creeping until requests queued past the pool timeout. I proved it by watching the in-use count return to baseline while latency stayed elevated." The mechanism, three levels down, in first person, with the falsification step.'],
   ['Google · Intellectual humility','"I spent two days on the leak theory because it was the explanation I already knew how to check, not because the evidence pointed there. What ended it was writing down what I would expect to see if it were true. And I took the fix to the engineer who owned the reporting job rather than doing it myself, because she knew what it could tolerate." The error and the step-back, made central.'],
   ['JP Morgan · Control','"The risk in the fix was that batching the job with commits between chunks changes its consistency, so we confirmed with the owner that a partial view was acceptable before changing anything. I added a pool-saturation alert with a threshold below the timeout, so the next occurrence is visible before it becomes 5xx rather than after." What could go wrong, who approved, how you would know.'],
   ['Salesforce · Trust','"The forty errors a night were forty people whose checkout failed, most of whom did not retry. The operations team had been absorbing the complaints without telling us. Once I understood that, the alert I added was as much about them not having to be the monitoring as it was about the queue." The human on the other end, and the trust the fix restored.']
  ]
 }
};

/* the universal questions every loop asks and nobody prepares */

PLAN.lp.universal.openers = {
 intro:'Four questions appear in almost every loop on this ladder, at every company, and almost nobody prepares them. They are not behavioural stories, so they fall between the cracks - and because they open and close rounds, they set the frame for everything else.',
 rows:[
  ['"Tell me about yourself"','60-90 seconds, three beats: where you are now and what you own, one thing you have built that you are proud of, and why you are looking. Present tense, no chronology from university, no list of technologies. This is the single most-asked question in every loop and the most commonly rambled.',
   'Write it, time it, say it out loud twenty times. It should be boring to you before it is heard by anyone. Adjust one clause per company - the thing you emphasise as "proud of" should be the thing that rung values.'],
  ['"Why are you leaving?"','Forward-looking, never critical. "I have learned a lot running this platform and I want to work on it at a scale I cannot reach where I am" is complete. Criticism of your current employer lands worst at JPM and Amex, where discretion is itself assessed.',
   'One sentence about what you want next. Do not explain what is wrong where you are, even if asked twice - if pressed, name a structural limit rather than a person.'],
  ['"Why this company?"','The most-failed question on this ladder. The universal weak answer names scale, brand or products. The strong answer names a specific engineering problem in their domain and connects it to something you have actually built.',
   'Write three sentences per company. Reuse nothing. Each company page in this section has a "why" entry with the specific angle for that room.'],
  ['"Do you have any questions for us?"','Assessed, not a formality, and usually the last thing they remember. Two or three real questions. The strongest are about how the team works rather than about the company - what breaks most often, how decisions get made, what the last incident was.',
   'Have five prepared and pick from them. Never "no, I think you covered everything" - that reads as no interest. Never salary or process here; that is the recruiter.']
 ],
 questions:{
  intro:'Questions worth asking, by what they actually tell you. Pick two or three, and ask the ones whose answers you would act on.',
  rows:[
   ['What does the on-call rotation look like, and what paged you last?','Tells you the operational reality faster than any other question. A vague answer is itself an answer.'],
   ['How does a change get from my laptop to production?','Reveals the deployment culture, the review load and how much ceremony you are signing up for.'],
   ['What is the last technical decision the team disagreed about, and how was it resolved?','Reveals whether disagreement is safe, and whether decisions are made or drifted into.'],
   ['What would you want me to have accomplished in six months?','Tells you whether the role is defined. An unclear answer is a real signal about the team.'],
   ['What is the part of the system nobody wants to touch?','Every team has one. How readily they answer tells you about the honesty of the culture.'],
   ['What is the biggest constraint on the team right now - people, tech debt, or dependencies?','A direct question that gets surprisingly direct answers.'],
   ['How does this team work with the teams around it?','Especially useful at Microsoft and JPM, where cross-org work is most of the job.'],
   ['What made the last person who joined successful?','Gets you a concrete profile rather than a job description.']
  ]
 }
};

/* the recruiter screen - the stage nobody prepares */

PLAN.lp.universal.screen = {
 intro:'The recruiter screen is a filter, not a formality, and it happens before anyone reads your code. It is also the only conversation on the ladder where compensation is properly discussed, and where getting the sequencing wrong costs you real money.',
 rows:[
  ['What it is actually for','Confirming you are real, roughly the right level, available in a workable timeframe, and not going to be a surprise later. Also: motivation, which does get passed on in writing.'],
  ['The 90-second version of you','Same as "tell me about yourself" but tighter and less technical. The recruiter is not an engineer and will relay what you say - give them a sentence they can repeat accurately.'],
  ['Level, discussed early','Say what level you are targeting and why, in terms of scope rather than title. If you are targeting a level above your current one, have the reason ready - it is easier to set this now than to renegotiate later.'],
  ['Timeline, honestly','If you are interviewing elsewhere, say so without naming stages you have not reached. A real timeline speeds up scheduling; a fabricated one collapses.'],
  ['Compensation - the sequencing','You will be asked for a number or a current salary. Deflect once, politely: "I would rather understand the role and the level first - what is the band for this position?" If pressed a second time, give a researched range for the level and the market, not your current salary, and say it is flexible on the overall package.'],
  ['Never do this','Do not give a number before you know the level. Do not name your current salary in a market where you do not have to. Do not agree to a range you have not researched - once said, it becomes the ceiling.'],
  ['What to ask them','The interview structure and how many rounds, the level and its band, the team and what it builds, and the timeline. All four are reasonable and all four are useful.']
 ]
};

/* offers and negotiation */

PLAN.lp.universal.offer = {
 intro:'This is the part of the ladder with the highest hourly value and the least preparation. The plan puts an offer in hand by end of week 13 partly so the Google and Uber conversations happen from a different position - so it is worth knowing how to handle the conversation when it arrives.',
 rows:[
  ['Never accept on the call','"Thank you - I am glad, and I would like a few days to look at it properly." Nobody has ever lost an offer to that sentence. Enthusiasm plus a pause is the correct response.'],
  ['Get it in writing, in full','Base, bonus, equity with the vesting schedule and the valuation basis, sign-on, notice expectations, level and title. A verbal number is not an offer.'],
  ['Know what is negotiable where','Sign-on is usually the most flexible, equity next, base least. At the tier-one banks the base band is genuinely rigid and the sign-on is where movement happens. At the product companies equity has the most range.'],
  ['A competing offer is the strongest lever, and the plan creates one','This is the structural reason the ladder is ordered as it is. An offer in hand by week 13 is not just insurance for the Google loop - it is the only leverage that reliably moves a number.'],
  ['Ask, once, specifically','"Based on the level and what I am bringing on the platform side, I was hoping for X. Is there room?" One clear ask, a number, and then silence. Repeated small asks erode goodwill; one specific ask rarely does.'],
  ['Do not bluff a competing offer','It gets checked more often than people expect, and at this tier the recruiting communities are small. A real competing process, described honestly and without a number you cannot substantiate, is enough.'],
  ['Deadlines are usually softer than stated','An exploding offer with a 48-hour deadline is a pressure tactic more often than a constraint. Asking for a week is normal and is very rarely refused.'],
  ['Decide what you actually want before the call','Money, scope, team, learning, stability. If you have not ranked them beforehand you will negotiate for the one that is easiest to measure, which is money, and it may not be the one that matters.']
 ]
};

/* the shared coverage view */

PLAN.lp.universal.coverage = {
 intro:'One bank, many rubrics. A story that covers Amazon Ownership also covers Uber "we act like owners" and Microsoft accountability - but the closing beat is different in each room. This view is about gaps: a story shape you do not have anywhere is a hole across several companies at once.',
 shapes:[
  ['A problem nobody owned that you fixed anyway','Amazon Ownership · Uber act like owners · Google emergent leadership · Microsoft accountability','The most reusable shape in the bank. If you write one story, write this one.'],
  ['A time you were wrong','Google intellectual humility · Microsoft growth mindset · Amazon Earn Trust · Adobe Genuine','The second most reusable, and the one candidates most often lack. Amazon needs it handled carefully; Google and Microsoft reward it directly.'],
  ['You disagreed with someone senior','Uber ideas over hierarchy · Amazon Have Backbone · Google collaboration · JPM integrity','Have both endings - the one where you were right and the one where you lost and committed.'],
  ['You said no to a customer or stakeholder','Salesforce Trust · JPM client service · Amex do what is right · Amazon Customer Obsession','The highest-value single story for Salesforce, and useful everywhere.'],
  ['You went three levels deep on a mechanism','Amazon Dive Deep · Apple depth · JPM operational excellence','The technical story. Pick one you understand to the bottom, because Apple and Amazon will both take it apart.'],
  ['Something that was bad for months','Uber persevere · Amazon Deliver Results · Amex will to win · Flipkart audacity','Almost nobody prepares this. The honest timeline is the whole value.'],
  ['You made someone else better','Adobe Involved · Microsoft One Microsoft · Salesforce Equality · Google collaboration','Mentoring, review, or a write-up someone used. Cheap to prepare, rare in candidates.'],
  ['A production incident you caused or contributed to','Microsoft accountability · JPM risk and control · Amex integrity · Amazon Earn Trust','Own it plainly. The mechanism you added afterwards is the half that scores.'],
  ['A change you made safely to something critical','JPM operational excellence · Amex risk · Uber act like owners','The bank-shaped story. Rollback, review, staged, monitored.'],
  ['A measurement that ended an argument','Expedia data over opinion · Amazon Are Right A Lot · Google bias to action','Cheap evidence beating expensive debate. Very transferable.']
 ],
 rule:'Fifteen slots, ten shapes. Some shapes want two stories because they carry across four companies each. If a shape above has no story in your bank, that is a gap in several loops at once - and it is the most efficient thing you can fix.'
};

/* ================================================================= TECH ===
   The gradient INVERTS here: the deepest tech questioning is at the BOTTOM of
   the ladder. JPM and Amex go far deeper than Google, which asks none of it.
   qa row = [question, answerSpine, followUp] */

/* ================================================================= TECH ===
   The gradient INVERTS here: the deepest tech questioning is at the BOTTOM of
   the ladder. JPM and Amex go far deeper than Google, which asks none of it.

   Per module:
     asked  how the interviewer opens on this topic
     code   [title, [lines...], why it matters] — the pattern you must be able to write
     qa     [question, the answer spine, the follow-up they will actually ask]
     traps  the gotchas that bite in production and in interviews             */


export default PLAN;
