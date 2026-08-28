# Target Ladder — 154-Day Plan

**Revised:** 2026-08-27 · **Supersedes:** the 30-day Google-only graphs & trees plan (kept outside the repo in `_archive-v1/`)
**Window:** Mon 31 Aug 2026 → Sun 31 Jan 2027 · 22 weeks · 154 days · ~500 hours
**Ladder:** JP Morgan / Amex / Expedia → Amazon / Microsoft / Adobe → Google / Uber
**Split:** 43% DSA · 57% system design + LLD + tech

> **Status: BUILT.** The tracker in this repo implements this plan — open `index.html`. The full question and pattern sheet is `recognition-sheet.md`, generated from `data.js` by `gen-sheet.js`, so the two cannot drift.
>
> Since the first revision, two things in here were found to be under-scoped and have been rebuilt: **behavioural was Amazon-only** and is now a rubric per company across all eleven (Part 5.3), and **DSA listed questions without resolving them** — every one of the 501 now carries its approach and cost, each section carries the derivation from an unseen statement to the right pattern row, and there is a page on why the moves are correct.
>
> Open questions are still collected in **Part 10** — answering them will change parts of the plan.

---

## PART 0 — WHAT CHANGED, AND WHY

### 0.1 The premise that changed

The v1 plan answered one question: *how do I clear Google L4 on graphs and trees in 30 days?* The 91-day app generalised it to four companies but kept the same centre of gravity — Google, algorithms, four tracks with DSA at 65% of the hours.

The actual goal is different, and bigger:

> Switch jobs inside a 3-month window by clearing a JP Morgan / Amazon / Microsoft / Adobe tier company, then spend the 2-month notice period converting Google-level DSA into an actual Google or Uber offer.

That is **a ladder, not a target**. Three consequences, all of which the old plan gets wrong:

1. **The first interview is in week 4, not week 22.** JPM-tier loops need to be booked while you are still on Day 25. The old plan has you doing Tarjan bridges in week 2 and does not touch Kafka, Spring internals or Kubernetes at all — so on the day of your first real loop you would be maximally prepared for the company you interview at *last*.
2. **DSA is not the deciding round at the bottom of the ladder.** At JPM / Amex / Expedia the algorithms are easy-to-medium. What decides it is tech depth, LLD, and whether you can talk about the system you actually run in production. The old plan has **zero hours** on that.
3. **The tech round is a whole workstream.** I grepped v1 and the app: `kafka` appears exactly once, as a single conceptual line inside SD 4. `spring`, `jvm`, `hibernate`, `docker`, `kubernetes`, `microservice` — zero occurrences. For Google that omission is defensible. For everything below Google it is the round you fail.

### 0.2 The three fixes

| Fix | What it means |
|---|---|
| **Resequence by ladder rung, not by topic** | Tech + SD terms + easy-medium DSA front-load into Phase 1. Tarjan, rerooting, binary lifting and the DP hard tier move to Phase 3, where the Google loop actually is. |
| **Add a fifth section: Tech** | Thirteen modules, ~115 hours, built around Java / Spring Boot / JPA / Postgres / Docker / Kubernetes — including **Spring event-driven and async**, which is what you build daily — plus Kafka and microservices, which you do not use and must learn cold. |
| **Extend to 154 days** | 3 months to a tier-1/tier-2 offer, then 2 months of notice period aimed at Google and Uber. Matches your real constraint instead of pretending it is 13 weeks. |

### 0.3 The good news nobody expects

**Going from 65% DSA to 43% DSA does not reduce your DSA hours. It increases them.**

| | Old (91 days) | New (154 days) |
|---|---|---|
| DSA | 65 weekdays × 3h = **195h** | 110 weekdays × 2h = **220h** |
| Tech | 0h | **110h** |
| System design | 13 × 4h = 52h | 22 × 4h = **88h** |
| LLD | 10 × 4h = 40h | 22 × 4h = **88h** |
| **Total** | ~287h | **~506h** |

The percentage falls because the denominator grows. In absolute terms DSA gains 25 hours and problem volume goes from ~206 to roughly **280–300**. You are not trading away the Google bar to get the JPM bar. You are buying both with a longer runway.

---

## PART 1 — THE LADDER

### 1.1 Three phases

| Phase | Days | Weeks | Dates | Rung | The bar |
|---|---|---|---|---|---|
| **1 · Foundation + tech blitz** | 1–42 | 1–6 | 31 Aug → 11 Oct | JP Morgan · Amex · Expedia | DSA easy-medium, clean and fast. Tech depth on your own stack. SD vocabulary. Basic LLD. |
| **2 · Product-tier push** | 43–91 | 7–13 | 12 Oct → 29 Nov | Amazon · Microsoft · Adobe | DSA medium-hard. Amazon hybrid LLD. Full SD designs end-to-end. 15 LP stories. |
| **3 · Google tier** | 92–154 | 14–22 | 30 Nov → 31 Jan | Google · Uber | Hard tier, implicit graphs, DP hards, rerooting. Recorded mocks. Uber machine coding. |

Rest days — **28, 56, 84, 112, 140**. One per month. Load-bearing. Do not reallocate them; five months at seven days a week is how people arrive at the Google loop burnt out and underperform rounds they were ready for.

### 1.2 The interview calendar

This is the part the old plan had no concept of. **Applying is work, and it is not study — it happens on the plan's clock, not after it.**

| Week | Days | Action |
|---|---|---|
| 2 | 8–14 | Resume rewritten around Kubernetes + event-driven + Postgres. Referral list built. |
| **3** | 15–21 | **Apply / trigger referrals: JPM, Amex, Expedia.** |
| 4–7 | 22–49 | JPM-tier loops. Expect 2–4 weeks from apply to onsite at this tier. |
| **7** | 43–49 | **Apply: Amazon, Microsoft, Adobe.** These take 4–8 weeks to reach onsite — start before Phase 2 content is finished. |
| 10–14 | 64–98 | Amazon / Microsoft / Adobe loops. **Target: offer in hand by end of week 13 (29 Nov).** |
| **13** | 85–91 | **Apply: Google, Uber.** Google's loop is slow — referral to hiring committee is routinely 8–12 weeks. Applying here is what makes Phase 3 land inside the notice period. |
| 17–22 | 113–154 | Google / Uber loops, during notice period. |

> **If you take only one thing from Part 1:** the Google application goes out in week 13, not week 22. The pipeline is longer than the preparation.

### 1.3 What each rung actually tests

| Tier | Companies | DSA bar | Decides it | Tech round? | LLD flavour |
|---|---|---|---|---|---|
| **1** | JP Morgan · Amex · Expedia | Easy–medium, clean | **Tech deep-dive + your production experience** | **Yes — heavy.** Java / Spring / SQL / concurrency, 45–60 min | Light OOD, sometimes none |
| **2** | Amazon · Microsoft · Adobe | Medium, occasional hard | LP (Amazon ≈ half the signal) · practical coding · OOD | Light — some Java / SQL probing | **Amazon hybrid** (design + running code + algorithmic core). Adobe: OOD. Microsoft: practical. |
| **3** | Google · Uber | **Hard, cold, narrated** | Algorithms, and how you drive the room | No | Uber: machine coding, 60–90 min, must **finish** |

### 1.4 Why this order is right

Interview at your weakest-prepared rung when it costs least, and at your strongest-prepared rung when it counts most. Three specific reasons:

1. **Interview reps are a skill you cannot practise alone.** Your JPM loop in week 4 is worth more as training than any mock, and it costs you nothing if it fails.
2. **An offer in hand changes the Google conversation.** Not for leverage games — for your own nerves. Walking into a Google loop already employed *and* already holding an offer is a different psychological state, and Google rounds are decided partly on composure.
3. **The notice period is real, protected study time.** Two months where you are winding down at work is the best possible window for Google's hard tier. Spending it on Kafka basics would be a misallocation.

---

## PART 2 — THE SPLIT

### 2.1 Weekly shape

| Day | Old | **New** |
|---|---|---|
| Mon–Fri | 3h DSA | **2h DSA + 1h Tech** |
| Saturday | 4h system design | 4h system design — *restructured, see Part 4* |
| Sunday | 4h LLD | 4h LLD — *restructured, see Part 5* |

23 hours per week. **10h DSA (43%) · 13h everything else (57%).** That is your 45/55, within rounding.

### 2.2 Where the hours go

```
DSA          220h  ████████████████████████████████████████████  43.5%
Tech         110h  ██████████████████████                        21.7%
System des.   88h  ██████████████████                            17.4%
LLD           88h  ██████████████████                            17.4%
```

### 2.3 What gives when you fall behind

You will fall behind. Decide now, in writing, what gets cut — because deciding it at 11pm on a Wednesday produces the wrong answer every time.

**Cut in this order:**

1. Company packs. The old plan carried 97 optional pack items; they are capped at 15% readiness weight and they are not the lever.
2. Phase 3 stretch items.
3. Tech modules 10 (observability / CI) and 6 (REST / auth) — compressible to reading.

**Never cut, in any circumstance:**

- **The log and the revision queue.** They feel optional. They are the mechanism that converts hours into ability, and they are always the first casualty. If you are behind, cut *content* and keep *process* — never the reverse.
- **Phase 1 tech modules 2, 5, 7, 9** (concurrency, Postgres, Kafka, Kubernetes). That is the JPM offer.
- **DSA days covering implicit graphs, state augmentation, knapsack and two-sequence DP.** That is the Google offer.

---

## PART 3 — SECTION 1: DSA

### 3.1 The resequencing principle

Same content as the 91-day plan, redistributed so that **at every point in time you are strongest at the rung you are currently interviewing for.**

| Topic | Old placement | New placement | Why |
|---|---|---|---|
| Tarjan bridges, Euler / Hierholzer | Week 2 | **Phase 3** | Google-only. Nobody below Google asks it. |
| Rerooting, binary lifting | Week 4 | **Phase 3** | Same. |
| Implicit / state-space graphs | Week 2 | **Phase 3** (Phase 2 primer) | The Google differentiator; it should be freshest in January. |
| Arrays, strings, hashing, two pointers, sliding window | Weeks 8, 10 | **Phase 1, weeks 1–2** | This is what JPM and Amex actually ask. Currently it sits three weeks *after* your first loop. |
| Linked lists, matrices, basic recursion | Scattered | **Phase 1** | Microsoft-tier bread and butter. |
| BFS / DFS, topological sort, DSU basics | Weeks 1–2 | **Phase 1, weeks 4–6** | Medium bar, needed by tier 2. |
| DP (15 days) | Weeks 5–7 | **Split** — mental model + linear + knapsack in Phase 2; interval, tree, bitmask in Phase 3 | DP mediums are Amazon-tier; DP hards are Google-tier. |
| Hard tier, blind simulation, stamina loops | Weeks 11–13 | **Phase 3, weeks 18–22** | Immediately before the Google loop. |

### 3.2 Phase by phase

**Phase 1 · weeks 1–6 · ~60h · ~90 problems — "clean and fast on mediums"**
Arrays · strings · hashing · two pointers · sliding window · prefix sums · binary search (boundaries and on-the-answer) · linked lists · stacks and queues · monotonic stack · basic recursion and backtracking · sorting and greedy · BFS / DFS · topological sort · DSU basics · binary tree traversal and basic tree recursion · heap patterns.

> **Bar:** an unseen medium, narrated, clean, edge cases and complexity stated, **in ≤ 20 minutes.** Speed and cleanliness, not cleverness.

**Phase 2 · weeks 7–13 · ~70h · ~100 problems — "medium-hard, and the DP mental model"**
Dijkstra and state augmentation · 0-1 BFS · Bellman-Ford · MST · DSU hard tier · tree DP · LCA · BST depth · Trie · intervals · design problems (LRU / LFU) · **DP I–X**: mental model, linear, LIS, Kadane, grids, knapsack, two-sequence, palindromes, state machines.

> **Bar:** unseen medium ≤ 15 min. First hards solved inside 40. Amazon speed-runs (LC 200, 994, 146) under 10 minutes cold.

**Phase 3 · weeks 14–22 · ~90h · ~100 problems — "Google hard tier"**
Implicit / state-space graphs · bitmask states · Tarjan · Euler / Hierholzer · rerooting · binary lifting · segment tree and BIT · **DP XI–XIV**: interval, tree, bitmask, awkward corners · pattern composition · the blind hard pool · recorded mocks · full-loop stamina simulation.

> **Bar:** unseen hard, cold, narrated, **≤ 35 min, ≥ 70% success over 10 attempts.**

### 3.3 Templates

The 29-template library carries over unchanged (Appendix A). What changes is *when* each must be cold:

- **By day 21** — binary search first-true / last-true · sliding window · prefix sum + hashmap · monotonic stack · BFS level tracking · iterative DFS · iterative inorder · DSU · Kahn
- **By day 70** — Dijkstra lazy · Dijkstra augmented · 0-1 BFS · Bellman-Ford · tree DP scaffold · Trie · LRU · memo→tabulation · 0/1 knapsack · LIS O(n log n) · two-sequence grid
- **By day 130** — Tarjan bridges · binary lifting · Hierholzer · Fenwick · Morris · submask enumeration · KMP · DFS 3-colour

### 3.4 Volume

~290 problems over 154 days, plus re-solves. Roughly two new problems per weekday — the correct density for two hours when one of them goes on narrating and logging rather than typing.

---

## PART 4 — SECTION 2: SYSTEM DESIGN

### 4.1 Every Saturday gets four blocks, not one

The old plan's SD day was "learn some concepts, do a design." That produces someone who can *deliver* a design and falls apart on the follow-up. The follow-up is the interview.

| Block | Time | What |
|---|---|---|
| **1 · Critical terms** | 45 min | The 8–12 terms for the day, each defined in one sentence *you* wrote, plus one concrete product that uses it. Vocabulary is scored signal — using "quorum" or "hot partition" correctly and unprompted moves you up a band. |
| **2 · The design** | 90 min | Timed, whiteboard or paper, 6-step framework, out loud, recorded. |
| **3 · Case study** | 45 min | How a real company actually solved it — the published engineering-blog version. **You need one real system per topic to point at.** |
| **4 · Cross-questions** | 60 min | 8–10 follow-ups fired at your own design, answered cold. This block does not exist today and it is the highest-value one. |

### 4.2 Cross-question doctrine

For every design you must survive these six categories. Write the answers; do not just think them.

| Category | The question shape | Examples |
|---|---|---|
| **Failure** | "What happens when X goes down?" | Redis dies. The leader dies mid-write. The queue backs up. |
| **Scale** | "10× the traffic. What breaks first?" | The single hot partition. The fan-out. The DB connection pool. |
| **Consistency** | "Two users do this at the same instant." | Double-booking. Double-charging. Lost update. |
| **Cost** | "This is expensive. Where?" | Cross-AZ traffic. Storing every event forever. Over-provisioned pods. |
| **Change** | "Now add this requirement." | Multi-region. GDPR delete. An audit trail. |
| **Justify** | "Why not the other option?" | Why Kafka not SQS. Why Postgres not Cassandra. Why not just a cron job. |

### 4.3 The 22 sessions

| # | Wk | Topic | Case-study anchor |
|---|---|---|---|
| 1 | 1 | Fundamentals, estimation, latency numbers, CAP done properly | — |
| 2 | 2 | Caching: placement, eviction, invalidation, stampede | Facebook memcache leases |
| 3 | 3 | Databases: SQL vs NoSQL as a *decision*, indexing, B-tree vs LSM | Postgres index internals *(your stack)* |
| 4 | 4 | Sharding, replication, quorum, hot partitions | Discord: Cassandra → ScyllaDB |
| 5 | 5 | Queues, async, delivery semantics, idempotency, outbox | **Kafka vs SQS vs RabbitMQ** |
| 6 | 6 | **Kubernetes as a system-design primitive** — discovery, scaling, rollout, failure | *your production cluster* |
| 7 | 7 | URL shortener + Pastebin | — |
| 8 | 8 | Rate limiter and distributed counters | Stripe's rate limiters |
| 9 | 9 | News feed / timeline, hybrid fan-out | Twitter's celebrity problem |
| 10 | 10 | Chat system, WebSockets, presence | WhatsApp / Discord |
| 11 | 11 | **Payments, ledgers, double-entry, idempotent charges** | **JPM-tier core topic** |
| 12 | 12 | Amazon flavour: orders, inventory, reservations, saga | Amazon inventory holds |
| 13 | 13 | Search / typeahead + notification fan-out | — |
| 14 | 14 | Uber ride matching, geo indexing | **Uber H3** |
| 15 | 15 | Metrics and observability at scale, time-series storage | Prometheus |
| 16 | 16 | File storage / CDN / video streaming | Netflix Open Connect |
| 17 | 17 | **Distributed transactions: saga vs 2PC, compensations** | — |
| 18 | 18 | Multi-region, disaster recovery, RPO / RTO | **JPM and Amex care a lot** |
| 19 | 19 | Recorded mock × 2 | — |
| 20 | 20 | Recorded mock × 2 | — |
| 21 | 21 | Recorded mock × 2 | — |
| 22 | 22 | Final mock + rebuild the whole vocabulary from memory | — |

> Sessions 6, 11 and 18 are new, and they exist specifically because of *your* stack and *your* ladder. A Kubernetes system-design session is unusual — but you run frontend and backend pods in production, and "how would you deploy this?" is a question you can answer better than 90% of candidates. Sessions 11 and 18 are what a JP Morgan or Amex panel actually spends its time on.

---

## PART 5 — SECTION 3: LLD

### 5.1 Three different rounds wear the same name

| Flavour | Who | Format | What actually scores |
|---|---|---|---|
| **Whiteboard OOD** | Amazon, Adobe, Microsoft | 45–60 min, class diagram + key methods | Entities, relationships, extensibility. SOLID applied, not recited. |
| **Machine coding** | Uber, Flipkart, Swiggy-tier | 60–90 min, **runnable, tested code** | **Finishing.** An unfinished elegant design scores below a finished plain one. |
| **Amazon hybrid** | Amazon | 60 min: design *plus* working code *plus* an algorithmic core | Doing all three under one clock. Most candidates over-invest in the design and never run the code. |

### 5.2 The 22 sessions

| # | Wk | Session | Flavour | Notes |
|---|---|---|---|---|
| 1 | 1 | SOLID + the eight patterns that actually appear | — | Strategy, Factory, Observer, Builder, State, Decorator, Command, Singleton-and-why-it-is-usually-wrong |
| 2 | 2 | Parking lot | OOD | The "two sum" of LLD. Concurrency on spot allocation. |
| 3 | 3 | Elevator | OOD | State pattern, scheduling strategy |
| 4 | 4 | Vending machine + ATM | OOD | State, not a switch over an enum |
| 5 | 5 | Library / inventory management | OOD | JPM-flavoured, boring on purpose |
| 6 | 6 | **Machine-coding drill #1** — finish under the clock | Machine | Learning to *ship* in 90 minutes |
| 7 | 7 | Booking system (BookMyShow) | OOD + concurrency | Seat holds, TTL, optimistic vs pessimistic |
| 8 | 8 | Splitwise | OOD | LC 465 as the algorithmic core |
| 9 | 9 | **Amazon hybrid #1** | Hybrid | Design + run it + the algorithm inside |
| 10 | 10 | Chess / tic-tac-toe | OOD | Command pattern, undo |
| 11 | 11 | **Amazon hybrid #2** | Hybrid | — |
| 12 | 12 | Rate limiter / logger / cache as objects | OOD | Bridges into SD |
| 13 | 13 | **Amazon hybrid #3** + LP consolidation | Hybrid | 15 LP stories complete by here |
| 14 | 14 | Ride-hailing | Machine | Uber's actual round |
| 15 | 15 | Food delivery / e-commerce cart | Machine | Flipkart flavour |
| 16 | 16 | Notification system | OOD | Observer, strategy, retry |
| 17 | 17 | **Machine-coding drill #2**, timed and tested | Machine | — |
| 18 | 18 | Snake / game simulation | Machine | — |
| 19 | 19 | **Machine-coding drill #3** | Machine | — |
| 20 | 20 | Design review — refactor an old solution | — | Read your week-2 parking lot and rewrite it |
| 21 | 21 | Uber machine-coding simulation, full 90 min | Machine | — |
| 22 | 22 | LP rehearsal + light | — | — |

### 5.3 Behavioural — the parallel workstream

Two STAR stories written every Sunday from week 2, reaching **15 stories by week 13**. Each with real numbers, each rehearsed to under two minutes.

**This was originally scoped as Amazon LP only, and that was wrong.** Every company on the ladder scores behaviour, each against its own named rubric, and preparing one of them is preparing one of eleven. The tracker's **Companies LP** tab now carries a rubric per company — Amazon's 16 Leadership Principles, Google's Googleyness attributes, Microsoft's growth mindset and the As-Appropriate round, Adobe's four core values, JPM's business principles and its HireVue stage, Uber's 2017 cultural norms, Salesforce's five ranked values, the Amex Blue Box, and Expedia, Apple and Flipkart — with 77 individually drillable values between them.

**The story bank stays one bank.** You are not writing eleven sets of stories; you are writing fifteen and learning to recut them. The events do not change — the emphasis, the pronoun, the closing beat and the delivery speed do:

| Room | What you add | What you remove |
|---|---|---|
| Amazon | The number, the alternative rejected, the decision you made alone | The collaborator who dilutes your contribution |
| Google | The collaborators, the thing you got wrong, the moment you stepped **back** | Conviction with no doubt in it |
| Microsoft | What you did not know at the start, the org boundary you crossed | The intensity — slow it down |
| JP Morgan | What could have gone wrong, the rollback, who reviewed it | Speed as the headline |
| Uber | The disagreement with someone senior, the honest bad middle | The tidy arc |
| Salesforce | The time you said no and found the safe route | Delivery framed as success |

Three consequences for the schedule:

1. **Rung one meets behaviour first, in week 3.** JP Morgan's HireVue is a pre-recorded video round with no interviewer, no probes and a 90-second limit. It filters before anyone reads your code, and it is a format nobody has practised. Record three answers to a timer in week 3.
2. **The control sentence is the cheapest adaptation on the ladder.** Fifteen seconds per story — what could have gone wrong, what you put in place, how you would have known — and it is the single biggest gap between a product-company candidate and a bank-ready one.
3. **The step-back story is the Google differentiator.** Emergent leadership is two-sided and candidates prepare only the half where they take over. Write the one where you handed something off.

Amazon remains the heaviest single weight — roughly half its signal, and the bar-raiser can reject you on it alone. Prepare "biggest failure" and "disagreed with a manager" specifically; those two catch people. But the same fifteen stories, recut, carry the other ten rooms.

---

## PART 6 — SECTION 4: TECH *(new)*

### 6.1 Your stack, and what it means

What you told me:

> Java + Spring Boot · Docker + Kubernetes (frontend and backend pods in production) · PostgreSQL via DBeaver against upstream data · some custom-built event-driven components in Spring Boot · **monolithic** application · **no Kafka**, but you want it · want microservices knowledge

This splits the tech track into two halves that need completely different treatment:

| | Modules | Treatment |
|---|---|---|
| **Deepen** — you use it daily | Java / JVM, concurrency, Spring, Postgres, Docker / K8s | You have the intuition; you lack the vocabulary and the internals. Interviewers go **deeper** here precisely because it is on your resume. Study is "why does this work", not "what is this". |
| **Acquire** — you have never used it | **Kafka, microservices** | Genuinely new. Needs hands-on, not reading. Must reach interview depth without production experience — and you must be honest about that in the room. |

**The thing to internalise:** running a monolith on Kubernetes with custom event-driven components is not a weakness to hide. It is a *better* story than "we use microservices" if you can articulate the trade-off. Most candidates parrot microservices without ever having felt the pain. You can say: *"we're monolithic, here's what actually hurts, here's the seam I'd split first, and here's why we haven't."* That answer beats an architecture diagram at every rung of this ladder.

### 6.2 The thirteen modules

~115 hours, one hour every weekday. Front-loaded: modules 1–8 and 12 land in Phase 1 because they are the JPM offer. Each module carries interview openers, **code patterns you must be able to type from memory**, question→spine→follow-up rows, and the traps that bite. The full detail lives in `recognition-sheet.md` Part IV, generated from `data.js` by `gen-sheet.js`.

| # | Module | Phase | Hrs | Core content | The five you must answer cold |
|---|---|---|---|---|---|
| **1** | **Java core + JVM** | 1 | 12 | Memory model, heap vs stack, GC algorithms, `equals`/`hashCode` contract, HashMap internals and treeify, ArrayList vs LinkedList, immutability, generics erasure, streams, Optional | Why is String immutable? · What breaks when `hashCode` is inconsistent? · How does HashMap resolve collisions after Java 8? · Heap or stack for an object with a primitive field? · What is a memory leak in a GC language? |
| **2** | **Concurrency** | 1 | 14 | Thread lifecycle, `synchronized` vs `Lock`, `volatile`, happens-before, ExecutorService, thread-pool sizing, `CompletableFuture`, `ConcurrentHashMap` internals, atomics, deadlock and livelock, `ThreadLocal` | `volatile` vs `synchronized`? · How do you size a thread pool? · What is the happens-before relationship? · How does `ConcurrentHashMap` avoid locking the whole map? · Reproduce a deadlock, then fix it. |
| **3** | **Spring core** | 1 | 10 | IoC / DI, bean lifecycle and scopes, `@Component` vs `@Bean`, AOP and proxies, **`@Transactional` propagation and isolation**, why self-invocation breaks it, circular dependencies | Why does `@Transactional` not work when called from the same class? · REQUIRED vs REQUIRES_NEW? · Constructor vs field injection, and why the answer is constructor? · What is a BeanPostProcessor for? · A singleton bean holding mutable state — what happens? |
| **4** | **Spring Boot** | 1 | 8 | Auto-configuration and `@ConditionalOn*`, starters, profiles, externalised config, Actuator, embedded server, WebFlux vs MVC conceptually | How does auto-configuration decide? · How do you override an auto-configured bean? · What does Actuator expose, and what must you *not* expose? · What is the config source precedence order? · When would you reach for WebFlux? |
| **5** | **PostgreSQL depth + JPA** | 1 | 14 | B-tree, partial and composite indexes and column order, `EXPLAIN ANALYZE`, isolation levels and MVCC, deadlocks, connection pooling (HikariCP), `VACUUM`, JPA lazy loading, **N+1**, `@Transactional` at the persistence boundary | Read an EXPLAIN plan out loud · Why does index column order matter? · Repeatable read vs read committed, with a concrete anomaly · Diagnose an N+1 · Why did the connection pool exhaust? |
| **6** | **REST / API design + auth** | 2 | 8 | Resource modelling, status codes, idempotency keys, pagination (offset vs cursor), versioning, OAuth2 flows, JWT structure / validation / revocation, CORS | Is PUT idempotent, and is POST ever? · How do you revoke a JWT? · Cursor vs offset pagination at scale? · Which OAuth2 flow for a mobile app? · Where does rate limiting belong? |
| **7** | **Kafka — from zero** | 1–2 | 16 | Topics, partitions, offsets · consumer groups and rebalancing · ordering guarantees and the partition key · delivery semantics · idempotent producer and transactions · retention and **log compaction** · DLQ · consumer lag · Spring Kafka. **Hands-on: run it in Docker, produce, consume, break it, watch a rebalance.** | Where is ordering actually guaranteed? · What happens when a consumer dies mid-batch? · Is exactly-once real, and how? · Kafka vs RabbitMQ vs SQS — pick one and defend it · How do you handle a poison message? |
| **8** | **Microservices — from zero** | 2 | 12 | Decomposition and bounded contexts, service discovery, API gateway, **circuit breaker / resilience4j**, retries with backoff and jitter, saga vs 2PC, outbox, config server, distributed tracing — **and when a monolith is the right answer** | How do you split a monolith, and what goes first? · A downstream service is slow — what stops it taking you down? · How do you keep a transaction consistent across two services? · How do you debug a request across five services? · Argue *against* microservices. |
| **9** | **Docker + Kubernetes depth** | 1 | 12 | Image layers, multi-stage builds · pods, deployments, services, ingress · **liveness vs readiness vs startup probes** · resource requests and limits, **OOMKilled** · HPA · ConfigMaps and Secrets · rolling updates and rollback · debugging `CrashLoopBackOff` · namespaces, StatefulSets | Liveness vs readiness — what breaks if you swap them? · Pod OOMKilled: what do you change? · How does a rolling update reach zero downtime? · Requests vs limits, and what happens if you set only limits? · Walk through debugging `CrashLoopBackOff`. |
| **10** | **Observability, testing, CI/CD** | 2–3 | 4 | Logs, metrics, traces · structured logging and correlation IDs · JUnit 5, Mockito, **Testcontainers** · the test pyramid · pipeline stages · blue-green vs canary | What do you log vs meter vs trace? · How do you test a Kafka consumer? · What does Testcontainers buy over an in-memory H2? · How do you roll back a bad deploy? · What is a flaky test costing you? |

### 6.3 The three narratives

Every tier-1 and tier-2 interview asks you to describe your work. Prepare **three** narratives — written, rehearsed, with numbers.

1. **"Walk me through your production system."** Frontend and backend pods, Kubernetes, Postgres upstream, the event-driven components. Include a failure you debugged and a real number: latency, volume, pod count, row count.
2. **"Where would you split the monolith?"** Name the seam, name what makes it a seam, name the cost, and say why you have not done it. This is the strongest thing you own — it demonstrates architectural judgement without requiring you to have built microservices.
3. **"You built event-driven components yourself — why not Kafka?"** After module 7 this becomes a *great* answer: the honest constraint at the time, plus exactly what Kafka would have given you (durability, replay, consumer groups, per-key ordering) and what it would have cost. This converts "no Kafka experience" from a gap into evidence of judgement.

### 6.4 The Q&A bank

A drillable bank of **question → answer → follow-up**, separate from the modules, covering tech, SD theory and LLD theory. Target ~250 entries, self-rated three ways like the template library (shaky / slow / cold), surfaced in the Reference tab, filterable, with a random-fire mode.

This is your "tech questions of LLD and system design" ask. It is not reading material — it is a drill, and **the follow-up column is the point.** Anyone can define a circuit breaker; the interview is the second question.

---

## PART 7 — COMPANIES AND READINESS

### 7.1 Proposed weights

The readiness engine is generic — it reads `weights` per company and scores the buckets. Weights must sum to 1.0. `tech` is a new bucket.

| Company | Tier | core | hard | tech | sd | lld | lp | pack | Est. band |
|---|---|---|---|---|---|---|---|---|---|
| **JP Morgan** | 1 | .25 | — | **.35** | .15 | .15 | — | .10 | 55–70 |
| **American Express** | 1 | .30 | — | **.30** | .15 | .15 | — | .10 | 55–70 |
| **Expedia** | 1 | .35 | — | .25 | .15 | .15 | — | .10 | 55–70 |
| **Microsoft** | 2 | .35 | .05 | .15 | .10 | .15 | — | .20 | 50–65 |
| **Adobe** | 2 | .35 | .10 | .15 | .10 | .15 | — | .15 | 45–60 |
| **Amazon** | 2 | .25 | .05 | .05 | .10 | .15 | **.30** | .10 | 45–60 |
| **Flipkart** | 2 | .30 | .10 | .10 | .10 | **.25** | — | .15 | 40–55 |
| **Uber** | 3 | .25 | .15 | .05 | .15 | **.25** | — | .15 | 35–50 |
| **Apple** | 3 | .30 | .15 | .15 | .15 | .10 | — | .15 | 30–45 |
| **Google** | 3 | .35 | **.25** | — | — | — | — | .15 | 25–40 |

Bands are **estimates, not measurements.** The ordering between companies is far more reliable than the numbers.

### 7.2 What the readiness score cannot see

- **Getting the interview at all.** Referrals and recruiter contact. None of this matters without them, and it is not study. Week 2, not week 12.
- **Interview performance.** Driving, narrating, recovering when stuck. The highest-variance factor there is.
- **Headcount and timing.** Loops get cancelled, teams freeze, bars move quarter to quarter. A rejection is not a verdict on your ability.
- **Correlation.** Interviewing at all ten does not give you ten independent draws. Same person, same weaknesses, every loop.

---

## PART 8 — PROCESS DISCIPLINE

Carried from v1 unchanged, because it was right.

1. **No solution peeking before 25 minutes on a hard, 15 on a medium.** Struggle is the mechanism. Peeking early builds recognition of solutions, not the ability to derive them. When you do look, read **only the approach paragraph** — never the code. Close it. Re-derive.
2. **Every item gets a log entry with a ROOT CAUSE line.** "I made a mistake" is worthless. "I think of *visited* as positional when it is state-al" is a fixable defect that would otherwise recur in five more problems.
3. **Re-solve from a blank file at +1, +3, +7 and +16 days.** Three re-solves of one hard problem beats one solve each of three hard problems. Highest-leverage rule here, and the one people skip.
4. **Talk out loud, always.** The failure mode is not "couldn't solve it", it is "solved it silently and the interviewer could not score the signal."
5. **Weekends produce artefacts.** Every SD session ends with a written one-page design *and its cross-question answers*. Every LLD session ends with code that runs. A weekend that produced nothing you can re-read did not happen.
6. **Tech modules end with a hands-on artefact, not notes.** Kafka running in Docker with a consumer group you deliberately rebalanced. A deadlock you reproduced and fixed. An EXPLAIN plan you improved. Reading about Kafka does not survive a cross-question.
7. **Say "I", not "we", in every LP story.**

---

## PART 9 — EXIT CRITERIA, PER PHASE

**End of Phase 1 · day 42 · 11 Oct — "JPM-ready"**

| # | Criterion | Bar |
|---|---|---|
| 1 | Unseen medium, narrated | ≤ 20 min, clean, edge cases + complexity |
| 2 | Phase-1 templates | All nine, cold, under 3 min each |
| 3 | Tech modules 1–5 and 9 | Every "five you must answer cold" answered without notes |
| 4 | Kafka | Running locally; can explain partitions, consumer groups, ordering |
| 5 | Production narratives | All three written and rehearsed under 3 min |
| 6 | SD vocabulary | 60+ terms defined in your own words |
| 7 | Applications | JPM / Amex / Expedia submitted by day 21 |

**End of Phase 2 · day 91 · 29 Nov — "Amazon-ready"**

| # | Criterion | Bar |
|---|---|---|
| 1 | Unseen medium | ≤ 15 min |
| 2 | Speed runs | LC 200, 994, 146, 236 under 10 min cold |
| 3 | DP | State definition stated in English before coding, every time |
| 4 | LP | 15 stories, real numbers, each under 2 min, "I" not "we" |
| 5 | Amazon hybrid | Design + running code + algorithm inside one 60-min clock |
| 6 | System design | Any of sessions 1–13 driven end-to-end in 45 min, trade-offs unprompted, cross-questions survived |
| 7 | Applications | Google / Uber submitted by day 91 |

**End of Phase 3 · day 154 · 31 Jan — "Google-ready"**

| # | Criterion | Bar |
|---|---|---|
| 1 | Unseen hard, cold, narrated | ≤ 35 min, ≥ 70% over 10 attempts |
| 2 | All 29 templates | Blank file, under 3 min each |
| 3 | Trigger recall | ≥ 85% from memory |
| 4 | Modelling | `neighbors(state)` for any implicit-graph problem in under 3 min |
| 5 | State augmentation | Given "at most K X", name the state tuple in under 60 sec |
| 6 | Machine coding | 90-min round finished with running, tested code |
| 7 | Stamina | 4 × 45-min rounds; round 4 within 15% of round 1 |

**Six of seven per phase is the pass bar.**

---

## PART 10 — WHAT I STILL NEED FROM YOU

Answer these in-line in this file and the build can start.

### Blocking

1. **Language for DSA.** Java (matches your stack, gives you `TreeMap` and `PriorityQueue` free, but more verbose under a 35-minute clock) or Python (faster to write, no built-in balanced BST, recursion-limit traps)? Pick one and never switch. *My lean: **Java**, because it removes context-switching against the tech track and LLD.*
2. **"mdui"** — in your stack description I could not resolve this. What is it? If it is interview-relevant it becomes tech-track content.
3. **Real hours.** Is 23h/week honest for you on a working week? If it is really 15–18, the plan needs re-cutting now rather than in week 6. Be pessimistic — a plan you beat is worth more than one you abandon.
4. **Notice period length.** I have assumed 2 months and that Phase 3 runs inside it. If it is 3 months, Phase 3 gets four more weeks and the Google application moves.

### Shapes the content

5. **Years of experience and current title.** Sets whether you target Amazon SDE2 vs SDE1, Google L4 vs L3, and which LP stories are credible.
6. **Anything already booked?** An application already out or a referral already in motion changes the sequencing immediately.
7. **Existing progress in the app.** Have you ticked anything? Resequencing re-maps progress keys (`d<day>-<index>`). If yes, export from Storage first — I will not touch `data.js` until you confirm.
8. **Location, and remote or onsite.** Affects which of these companies are actually hiring for you, and whether Flipkart / Swiggy-tier belongs on the ladder at all.
9. **Raw material for the narratives.** Incidents, migrations, performance wins, on-call saves from your daily work. The three narratives in §6.3 are only as good as what you feed them.

### Optional

10. Anything on the ladder you want removed, or a company you want added.
11. **A Kafka / microservices side project?** A small Spring Boot + Kafka + Docker Compose service is roughly 10 hours and converts "I studied it" into "I built it." Strong at tiers 1 and 2. It would come out of Phase 2's tech hours.

---

## APPENDIX A — THE 29 TEMPLATES

Unchanged from the app's current library. Grouped; the deadline by which each must be cold is in §3.3.

**Graph** — BFS with level tracking · DFS iterative · Kahn · DFS 3-colour · Dijkstra lazy · **Dijkstra augmented** · **0-1 BFS** · Bellman-Ford / exactly-k · DSU · Tarjan bridges

**Tree** — iterative inorder · tree DP scaffold · Trie · binary lifting

**DP** — memo→tabulation · 0/1 knapsack · LIS O(n log n) · two-sequence grid

**Core** — binary search first-true / last-true · binary search on the answer · sliding window · monotonic stack · prefix sum + hashmap · LRU cache

**Tier 2** — Hierholzer · Fenwick / BIT · Morris inorder · KMP failure function · submask enumeration

## APPENDIX B — TRIGGER TABLES

Every trigger table lives in `data.js` and is rendered, searchable, in the tracker's **Reference** tab. There are now 176 DSA pattern rows plus system-design, LLD and **tech** trigger tables — the last mapping "you hear this" to "reach for this":

- *"our consumers keep falling behind"* → consumer lag · partition count · per-message processing time
- *"the pod restarts under load"* → memory limit vs heap size · OOMKilled · requests vs limits
- *"the query got slow after the table grew"* → index column order · EXPLAIN · sequential scan
- *"the retry made it worse"* → thundering herd · backoff with jitter · circuit breaker
- *"it works on my machine"* → image layers · env config · Testcontainers

## APPENDIX C — ARCHIVE

The original 30-day Google graphs-and-trees plan is preserved verbatim outside this repo at **`_archive-v1/graphs-trees-30-day-google-l4.v1.md`**, along with the previous 91-day version of the tracker. Its Part 0 reality check and Day 0 diagnostic remain valid for Phase 3.

