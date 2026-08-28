/* The Method — altitude, decomposition, primitives, blind prompts
   Moved VERBATIM from legacy/data.js — this file is content, not code.
   Edit this to change the plan; gen-sheet.js regenerates the markdown sheet
   from it, so the sheet cannot drift.

   Progress keys are content-addressed, so APPENDING to any list is safe;
   reordering within a list remaps that list's saved progress. */
/* eslint-disable */
// @ts-nocheck

const PLAN: any = {};

PLAN.method = {};

/* ---------------------------------------------------------- 1. ALTITUDE --- */

PLAN.method.altitude = {
 intro:'The most common way to lose a design round is to answer at the wrong level of abstraction. It is also the cheapest to prevent — one sentence in the first minute.',
 evidence:'Two real Amazon rounds, the same error in opposite directions. In an LLD round on audio buffers, the candidate drifted UP into high-level design, spent the round there, and ran out of time. In an HLD round on Alexa broadcasting, the candidate started DOWN in entity models and the interviewer had to redirect him. Neither candidate lacked knowledge. Both spent the round at the wrong altitude.',
 levels:[
  ['HLD — system design','Boxes, arrows, data flow, storage choices, scale numbers, failure modes.','"Design YouTube." "How would you scale this?" "Walk me through the flow."','Naming a class. Writing a method signature. Discussing an interface.'],
  ['LLD — object design','Classes, interfaces, relationships, method signatures, patterns, thread safety.','"Design a parking lot." "Write production-ready classes." "What are the entities?"','Choosing between Kafka and SQS. Sharding. CDN placement.'],
  ['Code','Compiling syntax, real method bodies, tests.','"Write it out." "Implement this on paper." A machine-coding round.','Drawing architecture diagrams.']
 ],
 signals:[
  ['They said "design a SYSTEM" or named a product','HLD','YouTube, Uber, a notification service. Start with actors and the request path.'],
  ['They said "design a CLASS / classes / objects"','LLD','Parking lot, elevator, a logging framework.'],
  ['They handed you paper, or an IDE','Code','Production syntax is expected. Write, do not narrate.'],
  ['They mentioned SCALE, QPS, users, regions','HLD','Numbers in the prompt are an altitude marker.'],
  ['They mentioned EXTENSIBILITY, "add a new type later"','LLD','That is an Open/Closed hint, which lives at object level.'],
  ['They gave you a list of requirements on paper','LLD or code','The scoping phase is done. Your job is to read precisely, not to elicit.'],
  ['The problem is a real thing their team is building','Either — ASK','No prep-list shape to infer from. This is exactly when the check below matters most.']
 ],
 theCheck:'"Before I start — would you like me to begin with the high-level flow and components, or go straight into the class design?" Ask it in the first minute. It costs ten seconds, it is never penalised, and it prevents the single most expensive mistake in the round.',
 recovery:[
  ['You are too LOW and they want HLD','Stop mid-sentence. "Let me step back up — here is the end-to-end flow, and I will come back to the data model." Then draw the request path. Do not apologise at length; one sentence and move.'],
  ['You are too HIGH and they want LLD','"Let me get concrete." Name the three or four core classes immediately and write one real method. Concreteness is the fastest way back down.'],
  ['They redirect you','Take it as information, not failure. It happened to the Alexa candidate and he passed. Redirection means they are still invested in the conversation.'],
  ['You genuinely cannot tell','Ask again mid-round. "Is this the level of detail you want, or should I go deeper?" Checking twice reads as calibration, not confusion.']
 ],
 drift:'The specific trap in an LLD round: HLD feels productive. Discussing sharding and queues generates a lot of words and zero scoreable LLD signal. If you notice yourself talking about infrastructure in a class-design round, you are drifting. Say "that is the deployment story — let me get back to the classes" and descend.'
};

/* ----------------------------------------------------- 2. DECOMPOSITION --- */

PLAN.method.decompose = {
 intro:'A procedure that turns a prompt you have never seen into parts you have. It is deliberately mechanical — under pressure you want a checklist, not inspiration.',
 hld:[
  ['1. Actors','Who or what touches this system? End user, admin, a third-party service, a device, another internal service, a scheduled job. Write them down the left of the board. Most candidates skip this and it is where the interesting requirements hide.'],
  ['2. Nouns → entities','Pull the nouns out of the prompt. "Spotify wants to notify Alexa users about a feature" gives you: Partner, Notification, User, Device, Feature. That is your data model before you have thought about storage.'],
  ['3. Verbs → operations','Pull the verbs. Publish, deliver, acknowledge, dismiss, retry. Each verb becomes an API call or an event.'],
  ['4. Classify every operation','For each verb ask four things: read or write? synchronous or asynchronous? who initiates it? does the caller need the result? Those four answers pick your primitives for you — a write nobody waits for is a queue, a read everyone repeats is a cache.'],
  ['5. Draw ONE request, end to end','A single user, a single action, the happy path, no failure, no scale. Client → edge → service → store → response. Get agreement on this before anything else. The Alexa candidate did exactly this and the interviewer confirmed the direction before pushing further.'],
  ['6. Now add scale','Where does one become a million? Apply the estimate. Only the components on the hot path need to scale, and saying which ones do NOT is scored.'],
  ['7. Now add failure','Run the failure generator over every box and every arrow. This is where the round actually happens.'],
  ['8. Now add the awkward requirement','Multi-region, GDPR, audit, cost. Usually the last ten minutes.']
 ],
 lld:[
  ['1. Read the requirements PRECISELY','If they were handed to you on paper, the eliciting phase is over. Number them. Find the two that are ambiguous and confirm your reading of those specifically. This is a different opening from the usual "ask clarifying questions" and it catches people out.'],
  ['2. Nouns → classes, verbs → methods','Do it out loud so the interviewer sees the derivation. Enums for every closed set.'],
  ['3. Relationships and cardinality','Draw the lines and label them 1..*, 0..1. Cardinality mistakes are visible and cheap to avoid.'],
  ['4. What VARIES? → interface','The single highest-value question in LLD. Pricing, scheduling, matching, formatting, notification channel. Each axis of change gets an interface; nothing else does.'],
  ['5. What is SHARED and CONTENDED? → concurrency','Which object do two actors reach for at the same time? That object is your unit of locking, and naming it before being asked is the Amazon differentiator.'],
  ['6. Pick the ONE flow that proves the design','Not every class. The flow that exercises the interesting part: park a vehicle, mix a playlist, dispense a note. Write it with real method bodies.'],
  ['7. Show one extension','"Here is how a new X slots in — one class, no edits." Highest-scoring thirty seconds of the round.']
 ],
 unknownShape:'When the domain is unfamiliar, do steps 1 to 3 anyway. You do not need to understand audio engineering to notice that a frame is a message, a stage is a processing step, X frames per second is a throughput requirement, and "must not drop" is a durability constraint. The translation IS the work.'
};

/* ------------------------------------------------------- 3. PRIMITIVES --- */

PLAN.method.primitives = {
 intro:'Every system you will be asked to design is an assembly of about twenty parts. If you know what each part is FOR, what it costs, and when it is the wrong choice, then an unheard-of system is an assembly problem rather than a recall problem. This is the system-design equivalent of the DSA pattern table.',
 note:'Learn the "wrong choice" column as hard as the "for" column. Anyone can add a cache; the signal is knowing when not to.',
 rows:[
  ['Client / device','Where the request starts, and the only place that knows the user is offline.','Mobile, browser, an IoT device, another service.','Assuming it is always connected. Offline is a first-class state, not an error.','Retries, local cache, staleness.'],
  ['DNS + load balancer','Spreads traffic across identical instances and removes dead ones.','Any horizontally scaled tier.','Treating it as a bottleneck solution. An LB does not fix a slow database.','An extra hop; health-check config.'],
  ['API gateway','One edge for auth, rate limiting, routing and request shaping.','More than two or three public services.','Letting business logic accumulate in it — that becomes a distributed monolith.','A single point of failure to make redundant.'],
  ['Stateless service','Does the work. Scales by adding copies because it holds nothing.','Almost every request path.','Putting session state in it, which destroys the property that makes it scalable.','Nothing much. This is the cheap part.'],
  ['Cache','Serves repeated reads without touching the store.','Read-heavy, ratio above roughly 10:1.','Write-heavy workloads, or data that must never be stale. A cache in front of an in-memory store is usually redundant.','Invalidation, stampedes, one more thing to be down.'],
  ['Relational DB','Transactions, joins, constraints, and queries you did not anticipate.','Default choice. Money, orders, anything with invariants across rows.','Genuinely schemaless data, or write volume past one machine.','Vertical ceiling; schema migrations.'],
  ['Key-value store','O(1) access by exact key, at very high throughput.','Sessions, feature flags, counters, feed rows.','Anything needing a range scan or a join.','No query flexibility at all.'],
  ['Wide-column store','Huge write volume with range reads inside a partition.','Chat messages, time series, event history.','Small datasets, or anything needing ad-hoc queries.','Operations; you must design the partition key up front.'],
  ['Search index','Full text, relevance ranking, faceting.','Search boxes, log search, typeahead.','As a system of record. It is a derived view and it will drift.','Index lag; a rebuild path you must own.'],
  ['Object store','Cheap durable storage for large opaque blobs.','Images, video, backups, uploads.','Small structured records, or anything you query by content.','Latency; no transactions.'],
  ['CDN / edge','Serves bytes from near the user.','Static assets, video, anything read far more than written.','Personalised or authorised content, unless you sign URLs.','Cache invalidation across a global fleet.'],
  ['Message queue','Hands work to a worker so the caller does not wait.','Email, image processing, anything slow and non-interactive.','When the caller needs the answer now, or when several independent consumers need the same message.','At-least-once delivery, so consumers must be idempotent.'],
  ['Log / stream','A durable, replayable, ordered-per-key record that many consumers can read independently.','Event-driven architectures, audit, CDC, anything needing replay.','Simple point-to-point work handoff — a queue is simpler and cheaper.','Operational weight; a rebalance model to reason about.'],
  ['Worker / consumer','Executes queued work, scaled independently of the request path.','Everything behind a queue or a stream.','Work that must complete inside the request.','Consumer lag becomes a thing you monitor.'],
  ['Scheduler / cron','Runs something on a clock.','Digests, cleanup, reconciliation, expiry sweeps.','Assuming one instance runs it. In a three-pod deployment it fires three times.','Needs a distributed lock or a leader.'],
  ['Push / notification gateway','Reaches a device you do not control and may not be online.','Mobile push, email, SMS, a device like Alexa.','Anything requiring a guaranteed immediate response.','Offline devices, per-channel failure, dedup on reconnect.'],
  ['Registry','Maps an identity to a location. Which node holds this connection, this shard, this service.','WebSockets, sharded state, service discovery.','Small static topologies where DNS is enough.','Becomes a hot dependency; needs TTLs.'],
  ['Geo index','Answers "what is near this point" without scanning everything.','Ride matching, delivery, store locators.','Non-spatial lookups. Do not reach for it because coordinates exist.','Boundary cases; cell size tuning.'],
  ['Append-only ledger','An immutable record where corrections are new entries, never updates.','Money, audit, anything needing "why is this number what it is".','High-churn mutable state.','Storage growth; balances must be derived or snapshotted.'],
  ['Coordination service','Distributed locks, leader election, config that must be consistent.','Exactly-once scheduling, primary election, shared config.','Anything on the hot path — it is a consensus system and it is slow.','A hard dependency you must keep alive.'],
  ['Rate limiter / throttle','Protects a downstream from more load than it can take.','Public APIs, expensive endpoints, any third-party dependency.','Internal calls where backpressure would be better.','A hot-path round trip, and a failure mode of its own.'],
  ['Analytics / warehouse','Answers questions across the whole dataset, slowly, without touching production.','Reporting, ML features, business questions.','Anything a user waits for.','Hours of lag; a separate pipeline to maintain.']
 ]
};

/* ---------------------------------------------- 4. FAILURE GENERATOR --- */

PLAN.method.failures = {
 intro:'Do not memorise the failure modes of each design. Run this loop over any system, including one you have never seen, and it produces them. This is what turns "what if the device is offline?" from a question you were lucky to have prepared into one you would have raised yourself.',
 how:'Take every BOX and every ARROW in your diagram. For each one, walk the eleven questions. Most produce nothing; two or three produce the discussion that decides the round. Do this out loud — narrating the sweep is itself the signal.',
 loop:[
  ['DOWN','What if this component is completely unavailable?','Fail open or fail closed? Is there a fallback? Does the outage cascade or stop here?'],
  ['SLOW','What if it responds, but takes 30 seconds?','A timeout, or your threads pile up and you fail with it. Slowness is worse than failure because nothing trips.'],
  ['WRONG','What if it returns a plausible but incorrect answer?','Validation at the boundary. Do you trust a downstream blindly?'],
  ['LOST','What if the message never arrives?','Retry, at-least-once delivery, a reconciliation job. Or accept the loss and say so.'],
  ['DUPLICATED','What if it arrives twice?','Idempotency key. At-least-once delivery makes this certain, not hypothetical.'],
  ['OUT OF ORDER','What if message 2 arrives before message 1?','Sequence numbers, per-key ordering, or a design that does not care. Say which.'],
  ['RETRIED','What if the client sends it again because it timed out?','This is the duplicate case from the other side, and it is where double-charges live.'],
  ['OFFLINE','What if the recipient is not reachable at all right now?','A whole family — see below. This is the question that opened the Alexa round.'],
  ['CONCURRENT','What if two of these happen at the same instant?','The race. Lost update, double-booking, oversell. Name the atomic operation that closes it.'],
  ['10x / 100x','What if volume multiplies?','Which component saturates FIRST? Naming the first bottleneck is worth more than scaling everything.'],
  ['ELSEWHERE','What if the user, the data or the service is in another region or timezone?','Latency, data residency, clock skew, daylight saving.']
 ],
 offlineFamily:{
  intro:'"What happens when the device is offline" is not one question, it is seven. Knowing it as a family means you can generate the whole discussion rather than answering the one part they asked.',
  rows:[
   ['Store and forward','Where does the undelivered message live, and for how long?'],
   ['TTL / expiry','Is this still worth delivering in three weeks? A feature announcement usually is not. Say what expires and what does not.'],
   ['Delivery receipt','How do you know it arrived? Sent, delivered and read are three different events.'],
   ['Dedup on reconnect','The device reconnects and you replay. Does it now show the notification twice?'],
   ['Ordering on reconnect','Five queued messages arrive at once. Does order matter, and can you preserve it?'],
   ['Backlog cap','A device offline for a month. Do you keep everything, the last N, or only the latest per topic?'],
   ['Fallback channel','If push fails, do you email? Should you? That is a product decision, not a technical one.']
  ]
 },
 pickTwo:'You will not have time for eleven questions across every box. Pick the two or three that are genuinely interesting for THIS system and go deep on those. Announcing the sweep and then choosing — "the interesting failures here are the offline device and the duplicate delivery, let me take those" — shows judgement as well as coverage.'
};

/* ------------------------------------------------------ 5. AMBIGUITY --- */

PLAN.method.ambiguity = {
 intro:'The first three minutes of an unfamiliar problem. Confusion here is normal and not disqualifying — the Alexa candidate was confused for several minutes by the framing and still passed. What matters is having a procedure instead of freezing.',
 steps:[
  ['1. Restate it in your own words','"So a third party like Spotify wants to push an announcement to Alexa users who have their skill enabled — is that right?" This catches a misreading in ten seconds instead of twenty minutes.'],
  ['2. Ask for ONE concrete example, end to end','"Can you walk me through a single user experiencing this once?" The single most useful question in an ambiguous round. It converts an abstract prompt into a trace you can design against.'],
  ['3. Establish scope explicitly','"Are we building the publishing side, the delivery side, or both?" Write the boundary on the board. Anything outside it is now their choice, not your omission.'],
  ['4. Name your assumptions out loud','"I am going to assume the device registers once and we know its identity — stop me if that is wrong." Assumptions stated are free; assumptions hidden are penalised.'],
  ['5. Say what you are doing','"Let me take a minute to make sure I understand the problem before I design anything." Silence reads as stuck; narrated thinking reads as deliberate.'],
  ['6. Start with the happy path anyway','If it is still fuzzy after three minutes, design the simplest version that could work and let them correct you. A concrete wrong answer generates more useful feedback than continued questioning.']
 ],
 dontDo:[
  'Do not ask ten questions in a row. Two or three, then start designing. Interrogation is not clarification.',
  'Do not go silent. Thinking time is fine, but say you are thinking.',
  'Do not pretend to recognise a problem you do not. It falls apart in the follow-ups.',
  'Do not design for requirements they never gave you. Building a multi-region system when nobody mentioned regions is scope you invented and now have to defend.'
 ],
 whenGivenRequirements:'If they hand you a printed list — as in the Amazon playlist round with ten requirements — the eliciting phase is over and the test has changed. Number them. Read them twice. Find the two that are ambiguous or that conflict, and confirm only those. Then design against the list and check items off out loud as you cover them. Missing requirement seven because you never re-read the sheet is the failure mode here.'
};

/* --------------------------------------------------- 6. UNKNOWN DOMAIN --- */

PLAN.method.domain = {
 intro:'"Design a system that handles audio buffers across stages at X frames per second." You do not know audio engineering. You do not need to. What you need is the shape.',
 translate:[
  ['What comes IN, and at what rate?','A frame every 1/X second. That is a message and a throughput requirement.'],
  ['What goes OUT?','A processed frame, presumably in order. That is an output contract.'],
  ['What sits between?','Stages. That is a pipeline of processing steps.'],
  ['What must not happen?','Dropping a frame, or reordering. That is durability and ordering.'],
  ['What is the constraint?','Real time. A frame late is a frame lost. That is a latency budget, not a throughput one.'],
  ['So what IS it?','A staged pipeline with bounded buffers between stages, backpressure when a stage falls behind, and a fixed latency budget per stage. You have practised every one of those parts.']
 ],
 script:'Say the translation OUT LOUD. "Let me map this to something I know — a frame is a message, a stage is a processing step, X per second is a throughput requirement, and not dropping frames is a durability constraint. So this is a pipeline with bounded buffers." That sentence does three things: it confirms your understanding, it invites correction early, and it demonstrates the exact skill they are testing.',
 rules:[
  'Never bluff domain knowledge. "I do not know how audio codecs work — can you tell me whether a frame is independent or depends on the previous one?" is a strong question, because the answer changes the design.',
  'Ask the question whose answer changes your design, not the question that shows you read about the domain.',
  'Domain nouns are a costume. Frame, packet, order, tick, event, message — mechanically they are the same thing until proven otherwise.',
  'If the interviewer says it is a real problem their team has, that is good news: it means there is no memorised answer and everyone is reasoning from first principles. That is a level playing field.'
 ]
};

/* ------------------------------------------------- 7. PRODUCT THINKING --- */

PLAN.method.product = {
 intro:'The Alexa interviewer asked several product-decision questions and explicitly appreciated answers given from both a technical and a product angle rather than the technically easiest one. This is scored, especially at Amazon, and almost nobody prepares for it.',
 frame:[
  ['Who is the user, and what do they experience?','Not "the system fails" — "the customer opens the app and sees a three-week-old announcement about a feature they already use."'],
  ['What is the cost of each option?','Engineering time, latency, money, complexity, and the ongoing operational burden. Name at least two dimensions.'],
  ['What would you measure to know you chose right?','Delivery rate, dismissal rate, complaint volume, opt-outs. If you cannot name the metric, you cannot claim the decision was good.'],
  ['Which is reversible?','A two-way door can be decided fast and changed later. A one-way door — a data model, a public API, an SLA — deserves more care. Using this framing is Amazon\'s own language.'],
  ['What would you ship first?','The smallest version that delivers value, and what you would learn from it.']
 ],
 examples:[
  ['"Should we deliver the notification if the device has been offline for a month?"','Technically: trivially yes, the queue holds it. Product: probably no — a stale feature announcement is noise, and noise trains users to ignore notifications. So: TTL on announcements, no TTL on transactional messages. Different classes, different policy.'],
  ['"Should a third party be able to notify every user?"','Technically: yes. Product: absolutely not — that is a spam vector and a trust problem. So: opt-in per skill, per-partner rate limits, and a review step. Raising this unprompted is a strong signal.'],
  ['"Do we guarantee delivery, or best effort?"','Ask what the message IS. A payment confirmation and a marketing announcement have opposite answers, and designing one policy for both is the actual mistake.'],
  ['"Should we retry a failed push forever?"','No. Retries cost money and annoy users. Bounded retry, then drop, and count the drops so you can see whether it matters.']
 ],
 tell:'The tell that you are answering technically-only: your answer contains no user in it. If you can give the whole answer without mentioning a person, you have answered half the question.'
};

/* ------------------------------------------------------- 8. BLIND BANK --- */

PLAN.method.blind = {
 intro:'Sixty prompts with NO solutions, deliberately. Solutions would turn this back into a list of named problems, which is the thing that does not transfer. Pick one blind, set 45 minutes, record yourself, then score against the rubric below.',
 rules:[
  'Pick without reading ahead. If you skim the list first you have contaminated the exercise.',
  '45 minutes, timed, recorded, out loud. Alone at a whiteboard counts.',
  'Run the method: altitude check, decompose, happy path, failure sweep, then the awkward requirement.',
  'Score yourself against the rubric before looking anything up.',
  'Then look things up — and add whatever you were missing to the primitive catalogue or the failure loop, in your own words.',
  'Ten of these beats the next fifty named problems. That is the whole argument of this section.'
 ],
 groups:[
  ['Real rounds from the wild — start here',
   'These four were actually asked. Two of them are Amazon LLD, and neither is on any prep list.',
   [
    'A third party such as Spotify wants to use Alexa to broadcast a new-feature announcement to users. Design it. [HLD]',
    'Design a system that handles audio buffers across several processing stages at X frames per second. [LLD — a real team problem]',
    'Mix songs from a DJ service and a recommendation service into one playlist, in a custom or equal proportion, with filters based on user preferences. Ten requirements, production-ready classes. [LLD, on paper]',
    'Scale a single-node key-value store to 50 million pairs at 1 million QPS, split evenly between reads and writes. [HLD]'
   ]],
  ['Devices, presence and the offline case',
   'Everything here forces the offline family. If you can only drill one group, drill this one.',
   [
    'Design firmware update rollout to 10 million IoT devices, most of which are offline most of the time.',
    'Design a smart-home system where a phone controls devices that may be unreachable.',
    'Design presence (online / away / offline) for 50 million users.',
    'Design a system that lets a doctor send a message to a patient app, guaranteed to be seen.',
    'Design offline-first sync for a mobile note-taking app, with conflict resolution.',
    'Design a car telemetry pipeline where vehicles lose connectivity in tunnels.'
   ]],
  ['Pipelines, staging and throughput',
   'The audio-buffer shape, in different costumes. Bounded buffers, backpressure, latency budgets.',
   [
    'Design a video transcoding pipeline with four processing stages and a fixed latency budget.',
    'Design a real-time bidding system that must respond within 100 milliseconds.',
    'Design a log ingestion pipeline handling 500,000 events per second.',
    'Design a system that processes sensor readings from a factory floor without dropping any.',
    'Design a live-captioning pipeline for a video call.',
    'Design an image-processing service where each upload passes through resize, watermark and virus scan.'
   ]],
  ['Matching, assignment and capacity',
   'The ride-hailing machine, reskinned. Watch for the capacity variant.',
   [
    'Assign incoming orders to delivery agents based on location and remaining capacity.',
    'Design a system matching freelancers to jobs by skill, availability and rating.',
    'Design airport gate assignment for an airline.',
    'Design a system that matches blood donors to hospitals by type, distance and urgency.',
    'Design load assignment for a fleet of warehouse robots.',
    'Design an on-call rota generator that respects holidays, time zones and fairness.'
   ]],
  ['Money, ledgers and correctness',
   'Idempotency, double-entry, sagas. JPM and Amex territory.',
   [
    'Design a system that splits a refund across three original payment methods.',
    'Design subscription billing with proration, upgrades and mid-cycle cancellation.',
    'Design a loyalty points system where points expire.',
    'Design an internal transfer system between wallets that must never lose a cent.',
    'Design a system that reconciles your ledger against a payment provider daily.',
    'Design a marketplace escrow that releases funds on delivery confirmation.'
   ]],
  ['Scarce resources and races',
   'The atomic-allocation machine. Parking, booking, inventory, all wearing different clothes.',
   [
    'Design an Amazon Locker system: couriers drop packages by size, customers collect with expiring codes.',
    'Design a system for booking shared meeting rooms across a company.',
    'Design ticket sales for an event where 100,000 people arrive at the same second.',
    'Design a system allocating GPU time on a shared research cluster.',
    'Design a library system for a university, including holds and recalls.',
    'Design campsite reservations where sites have variable date ranges.'
   ]],
  ['Trees, hierarchies and composition',
   'The composite machine.',
   [
    'Design an org chart service supporting "who reports to whom, transitively".',
    'Design a permissions system where folders inherit access from parents.',
    'Design a comment system with unlimited nesting.',
    'Design a build system that resolves a dependency graph.',
    'Design a category taxonomy for an e-commerce catalogue.'
   ]],
  ['Framework and library design',
   'Extensibility is the whole test here. Log4j is the classic.',
   [
    'Design a logging framework: levels, appenders, formatters, async writing.',
    'Design a dependency-injection container.',
    'Design a retry library with configurable backoff strategies.',
    'Design a feature-flag SDK with local evaluation and remote config.',
    'Design a validation framework for arbitrary objects.',
    'Design an ORM-lite that maps result sets to objects.'
   ]],
  ['Genuinely odd ones',
   'Chosen because they resist pattern-matching. If you can decompose these, you can decompose anything.',
   [
    'Design the system behind a hotel key card that must work when the network is down.',
    'Design a system to detect that a delivery drone has been stolen.',
    'Design the backend for a multiplayer drawing game with 100ms latency.',
    'Design a system that schedules irrigation for a farm based on weather forecasts.',
    'Design a queue-management system for a hospital emergency department.',
    'Design a system that decides when to reorder stock for 50,000 SKUs.',
    'Design the backend for an exam platform that must prevent cheating.',
    'Design a system that migrates 400 million rows between databases with zero downtime.',
    'Design a service that tells you whether a URL is safe, at browser scale.',
    'Design an elevator system for a 200-floor building with express and local cars.',
    'Design a system that detects duplicate images at upload time across 2 billion images.',
    'Design the backend for a food-ordering kiosk that works when the internet drops.'
   ]]
 ]
};


PLAN.method.rubric = {
 intro:'Score yourself out of 20 immediately after each attempt, before looking anything up. The trend across attempts matters more than any single score.',
 rows:[
  ['Altitude','2','Did you check which level they wanted in the first minute? Did you stay there?'],
  ['Restated the problem','1','In your own words, confirmed before designing.'],
  ['Concrete example','2','Did you ask for one user doing one thing end to end?'],
  ['Scope stated','1','Did you write down what is in and out, and get agreement?'],
  ['Assumptions named','1','Said out loud and invited correction.'],
  ['Actors and entities','2','Extracted before designing, not discovered halfway through.'],
  ['Happy path first','2','One request, end to end, agreed before adding anything.'],
  ['Estimation','2','Numbers out loud, peak versus average distinguished.'],
  ['Failure sweep','3','Ran the loop. Picked the two or three interesting ones and went deep.'],
  ['Concurrency / races','2','Named the contended resource and the atomic operation.'],
  ['Product angle','1','At least one answer that mentioned an actual user.'],
  ['Finished','1','Reached a coherent whole rather than a beautiful fragment.']
 ],
 bands:[
  ['16–20','You would pass this round at tier 2, probably at tier 3.'],
  ['12–15','Solid. Usually one systematic gap — find it in the row scores, it will be the same row every time.'],
  ['8–11','The method is not automatic yet. Do five more before adding new content anywhere else in this repo.'],
  ['under 8','You are pattern-matching to remembered designs. Go back to the decomposition procedure and run it mechanically, in order, even when it feels slow.']
 ],
 log:'Keep a one-line note per attempt: prompt, score, and the single lowest row. If the same row is lowest three times running, that is your actual weakness, and it is almost never "did not know enough technology".'
};

/* --------------------------------------------------------- 9. WORKED --- */

PLAN.method.worked = {
 prompt:'A third party such as Spotify wants to use Amazon Alexa to broadcast a notification to users about a newly launched feature. Design it.',
 note:'A real Amazon round. The candidate opened at the wrong altitude, was redirected, recovered, and passed. This is the method applied to it from the start.',
 beats:[
  ['0:00 — altitude check',
   '"Before I start — do you want the high-level flow and components, or the class design?"',
   'Ten seconds. In the real round the candidate began with entity models and had to be redirected to HLD. One question prevents that entirely.'],
  ['0:30 — restate',
   '"So a partner — Spotify — wants to reach Alexa users with an announcement about a new feature in their skill. Amazon is the delivery channel. Is that right?"',
   'Catches a misreading before you spend twenty minutes on it. Also surfaces the interesting word: PARTNER. A third party is not a first party, and that will matter.'],
  ['1:00 — one concrete example',
   '"Can you walk me through one user experiencing this once? Spotify publishes something, and then what does the user see and when?"',
   'The single most useful question in an ambiguous round. It converts an abstract prompt into a trace.'],
  ['2:00 — scope',
   '"Are we building the publishing side that Spotify calls, the delivery side to devices, or both? And is targeting in scope — all users, or a segment?"',
   'Write the boundary down. Everything outside it is now their decision.'],
  ['3:00 — actors and entities',
   'Actors: Partner (Spotify), Amazon platform, End user, Device. Nouns: Partner, Campaign, Notification, User, Device, Subscription. Verbs: publish, target, deliver, acknowledge, dismiss, expire.',
   'Note that "Subscription" appeared from thinking about actors — a partner may only reach users who enabled their skill. That constraint is the whole trust story and it fell out of step 1.'],
  ['4:00 — classify the operations',
   'Publish: write, asynchronous, partner-initiated, caller does not need the result. Deliver: write, async, platform-initiated, target may be unreachable. Acknowledge: write, async, device-initiated.',
   'Four questions per verb and the primitives pick themselves. "Async, caller does not wait, may fail" is a queue. "May be unreachable" is a push gateway plus store-and-forward.'],
  ['6:00 — the happy path, one request',
   'Spotify → Partner API (auth, validate, rate limit) → Campaign store → fan-out worker resolves the audience from the subscription store → per-device notification rows → push gateway → device → acknowledgement back.',
   'One line, end to end, no failure, no scale. GET AGREEMENT HERE. The real candidate did exactly this and the interviewer confirmed the direction before pushing.'],
  ['10:00 — estimate',
   '"How many Alexa users have the Spotify skill — tens of millions? If a campaign targets 50 million devices and we want it out in an hour, that is roughly 14,000 pushes per second sustained. That is the fan-out, and it is the part that has to scale."',
   'The number tells you which component is the hot one. Everything else is comparatively idle, and saying so is scored.'],
  ['13:00 — announce the failure sweep',
   '"Let me go through what can fail. The interesting ones here are the device being offline, duplicate delivery, and a partner targeting far more users than expected."',
   'Announcing the sweep, then CHOOSING, shows judgement rather than a recited checklist.'],
  ['15:00 — the offline device, in full',
   '"Offline is not one problem. Where does the undelivered notification live and for how long? Does a feature announcement still matter in three weeks — I would say no, so it needs a TTL, whereas a transactional message would not. When the device reconnects and we replay, do we dedup? Do we preserve order? If a device has been offline a month, do we deliver a backlog or only the latest per partner? And if push fails permanently, is email a fallback — that is a product question."',
   'This is the whole discussion the real interviewer wanted, generated from the offline family rather than remembered. Note the last sentence handing a product decision back.'],
  ['22:00 — duplicates and idempotency',
   '"Push delivery is at-least-once, so the device will sometimes get it twice. Each notification carries an id, the device dedups on it, and acknowledgement is idempotent so a retried ack does not double-count."',
   'Raise this before being asked. At-least-once makes duplicates certain, not hypothetical.'],
  ['26:00 — the partner problem',
   '"A third party can reach our users, so the risks are not only technical. I would opt in per skill so Spotify only reaches users who enabled it, rate-limit per partner per period, cap audience size, and put new campaign types through review. Otherwise this is a spam vector and it damages trust in the whole device."',
   'Unprompted product and trust thinking. In the real round the interviewer explicitly appreciated exactly this kind of answer.'],
  ['32:00 — scale the hot path',
   '"Fan-out is the bottleneck. Campaign publish writes one row; a worker pool expands it against the subscription index and writes per-device rows onto a stream, partitioned by device id so ordering per device holds. Consumers push. If fan-out falls behind, active devices are prioritised and inactive ones are backfilled lazily — most will not be listening in the next hour anyway."',
   'The same hybrid fan-out argument as a news feed, reused. This is what the primitive catalogue buys you.'],
  ['38:00 — what I would ship first',
   '"Version one: one partner, opt-in only, no targeting beyond skill-enabled, TTL of seven days, best-effort delivery. That gives us delivery rate and dismissal rate, and dismissal rate is what tells us whether this is useful or annoying."',
   'A ship-first answer plus the metric you would watch. Almost nobody offers this and it reads as senior.'],
  ['42:00 — close',
   '"Open questions I would want answered: whether ordering matters across partners, what the retention requirement is for delivery records, and whether there is a global cap on notifications per user per day across all partners — I suspect there should be."',
   'Ending with the questions you would ask next is stronger than trailing off. The last one is a real design insight offered as a question.']
 ],
 whatTheMethodDid:'Nothing above required knowing anything about Alexa. Altitude check, restate, one example, scope, actors, verbs, happy path, estimate, failure sweep, product angle, ship-first. The primitives — API gateway, queue, stream, worker, push gateway, registry — came from the catalogue. The offline discussion came from the failure family. The partner constraint came from listing actors in step one. That is the whole claim of this section: the procedure produces the design, so an unheard-of prompt is an assembly problem rather than a recall problem.'
};


/* ================================================= SYSTEM DESIGN SOLUTIONS ===
   The expandable half of each design session. Keyed by session number.

     req         functional and non-functional requirements
     estimate    the numbers, worked, not asserted
     api         the public surface
     dataModel   tables and keys, with the reason for each key
     arch        ASCII architecture diagram
     flows       the write path and the read path, step by step
     deepDive    the one component worth 15 minutes
     scaling     bottleneck -> fix, in the order they actually bite
     tradeoffs   decision, what you chose, over what, and why
     angle       what each company pushes on for THIS design

   Scope: what 45 focused minutes produces. A complete, defensible design -
   not a production runbook.                                                */


export default PLAN;
