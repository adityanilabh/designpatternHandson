/* System design — framework, triggers, 22 sessions, worked solutions, reading
   Moved VERBATIM from legacy/data.js — this file is content, not code.
   Edit this to change the plan; gen-sheet.js regenerates the markdown sheet
   from it, so the sheet cannot drift.

   Progress keys are content-addressed, so APPENDING to any list is safe;
   reordering within a list remaps that list's saved progress. */
/* eslint-disable */
// @ts-nocheck

const PLAN: any = {};

PLAN.sdFramework = [
  ['1 · Requirements','3–5 min','Functional (3–5 bullets) and non-functional (scale, latency, consistency, availability). ASK ABOUT SCALE EVERY TIME — it drives every later decision and asking it is scored signal.'],
  ['2 · Estimation','3–5 min','DAU to QPS to storage to bandwidth. Out loud, rounded, no calculator.'],
  ['3 · API','3–5 min','3–6 endpoints with signatures. This forces the data model.'],
  ['4 · Data model','5 min','Entities, keys, and THE SHARD KEY — plus why it does not create a hot partition.'],
  ['5 · High-level design','10 min','Boxes and arrows. Client to LB to service to cache to DB to queue to worker.'],
  ['6 · Deep dive + bottlenecks','15 min','PICK THE INTERESTING PART YOURSELF. Then defend it against the six cross-question categories.']
];


PLAN.sdNumbers = 'L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent RTT ~150ms · 1M req/day ≈ 12 QPS · 86,400 s/day';


PLAN.sdTriggers = [
  ['Read-heavy, same data repeatedly','Cache — decide placement, eviction, invalidation','"The cache expires and 10k requests hit at once" => stampede: coalescing, early/jittered expiry, or a lock'],
  ['Nodes join and leave the cluster','Consistent hashing + virtual nodes','"Why virtual nodes?" => even distribution when a node dies'],
  ['Data outgrows one machine','Sharding','"Defend your shard key" => hot partitions, resharding, cross-shard queries'],
  ['Write-heavy, append-mostly','LSM-tree store, not a B-tree','"What does compaction cost you?"'],
  ['Read-heavy, complex queries, joins','Relational + read replicas','"Replication lag — what does the user see?"'],
  ['Slow work must not block the request','Queue + async worker + DLQ','"The queue backs up" => backpressure, autoscaling, shedding'],
  ['"What if the client retries?"','Idempotency key','Exactly-once = at-least-once + idempotency. Where is the key stored? What TTL? Two concurrent retries?'],
  ['Write to DB AND publish an event','Outbox pattern','"Why not just do both?" => the dual-write problem'],
  ['Limit requests per user','Token bucket, distributed via Redis','"What if Redis goes down?" => local fallback, fail-open vs fail-closed'],
  ['Feed with a few very popular producers','Hybrid fan-out','Pure fan-out-on-write breaks on celebrities — say this unprompted'],
  ['Persistent bidirectional connection','WebSockets + a connection registry','"How does node A reach a user connected to node B?"'],
  ['"Find things near me"','Geohash / quadtree / S2 / H3','"Why not a bounding-box scan?"'],
  ['Multi-service transaction involving money','Saga + compensating transactions','"Why not 2PC?" => availability, lock duration, coordinator failure'],
  ['Two customers buy the last item','Reservation with TTL, or optimistic decrement','"What if payment fails after the hold?"'],
  ['Money must be auditable','Double-entry ledger, append-only','JPM/Amex core. "How do you correct a mistake?" => a reversing entry, never an update'],
  ['"Users in Europe and the US"','Multi-region','"Active-active or active-passive? What is your RPO and RTO?"'],
  ['Search box that completes as you type','Trie / inverted index + ranking','"How do you update the index?"'],
  ['Uploads, images, video','Object store + CDN + presigned URLs','"Why not through your service?"'],
  ['Something must run exactly once daily','Scheduler + distributed lock/lease','"Two schedulers fire at once"'],
  ['"How do you know it is broken?"','Metrics, logs, traces + alerting on SLO','"What do you alert on?" => symptoms, not causes'],
  ['Deploy without downtime','Rolling / blue-green / canary','"How do you roll back a schema change?" => expand-migrate-contract']
];


PLAN.sdCross = [
  ['Failure','"What happens when X dies?"','Cache dies · leader dies mid-write · queue backs up · a region goes dark'],
  ['Scale','"10x traffic — what breaks first?"','Hot partition · fan-out · connection pool · a single-threaded consumer'],
  ['Consistency','"Two users, same instant"','Double-booking · double-charge · lost update · read-your-writes after a write'],
  ['Cost','"Where is the money going?"','Cross-AZ egress · retaining every event forever · over-provisioned pods · a chatty N+1'],
  ['Change','"Now add this"','Multi-region · GDPR delete · an audit trail · a new consumer of the same events'],
  ['Justify','"Why not the other one?"','Kafka not SQS · Postgres not Cassandra · cache not replica · a cron job not a queue']
];

/* tier 'b' = tier 1-2 (the heavy block here) · 'c' = Uber / Apple / Amazon-senior
   Per session:
     asked     the prompt as an interviewer actually poses it, plus its variants
     who       who asks this one
     clarify   what YOU ask in the first three minutes
     scale     the back-of-envelope for this specific problem
     terms     [term, one-line definition] — vocabulary is scored signal
     decisions [decision point, the options, the verdict and why]
     cross     [the follow-up they will ask, the answer spine]
     fail      what actually sinks candidates on this one
     anchor    the real system to point at                                     */


PLAN.sd = [

{n:1, wk:1, tier:'b', t:'Fundamentals & estimation', anchor:'',
 who:'Everyone. This is not a round — it is the tax you pay in every other round.',
 asked:[
  'How many servers would you need for 100M daily active users?',
  'Estimate the storage for five years of a photo-sharing app.',
  'What is the QPS of a service with 500M requests a day?',
  'Walk me through CAP, and tell me where your last system sat.'
 ],
 clarify:[
  'Is this peak QPS or average? (peak is usually 2–3x average)',
  'Read-heavy or write-heavy, and roughly what ratio?',
  'What latency are we promising — p50 or p99?',
  'Is this one region or several?'
 ],
 scale:'Anchor everything to: 1M requests/day ≈ 12 QPS · 100M DAU x 10 actions = 1B events/day ≈ 12k QPS average, ~35k peak · 1KB x 1B = 1TB/day = 365TB/year. Round aggressively and say you are rounding.',
 terms:[
  ['Latency numbers','L1 ~1ns · RAM ~100ns · SSD random read ~100us · disk seek ~10ms · same-DC RTT ~0.5ms · cross-continent ~150ms'],
  ['QPS','Queries per second. 86,400 s/day, so 1M/day ≈ 12 QPS. Always state peak separately.'],
  ['CAP','Under a network PARTITION you choose consistency or availability. It says nothing when there is no partition — which is most of the time.'],
  ['PACELC','The honest extension: on Partition choose A or C; Else choose Latency or Consistency. This is the one that actually describes daily trade-offs.'],
  ['Strong consistency','Every read sees the latest write. Costs a round trip or a quorum.'],
  ['Eventual consistency','Replicas converge given no new writes. Fine for a like count, not for a bank balance.'],
  ['Read-your-writes','A user always sees their own write, even if others do not yet. Cheapest fix for the "I posted it and it vanished" complaint.'],
  ['Monotonic reads','You never see the clock go backwards. Prevents a refresh showing older data.'],
  ['SLA / SLO / SLI','Contract / internal target / the actual measurement. Alert on the SLO, not the SLI.'],
  ['Nines','99.9% = 43 min/month down. 99.99% = 4.3 min. Each nine costs roughly 10x.']
 ],
 decisions:[
  ['Peak vs average','Design for average and hope · design for peak · autoscale','Size for peak, autoscale toward average. Say the peak-to-average ratio you assumed — 2-3x is defensible.'],
  ['Where to round','Exact arithmetic · powers of ten','Powers of ten, out loud. An interviewer scores the method, not the digits.']
 ],
 cross:[
  ['Why not just use a bigger machine?','Vertical scaling has a ceiling and a single failure domain. It is often the right FIRST answer though — say that, then say when it stops working.'],
  ['You said eventually consistent. What does the user actually see?','Name the concrete anomaly: a like count that flickers, a comment that disappears on refresh. Then name the mitigation: read-your-writes via sticky routing or reading your own writes from the primary.'],
  ['What is your p99 and why is it worse than p50?','Queueing, GC pauses, cold caches, a slow replica, retries. p99 is where the tail lives and it is what users actually feel.'],
  ['Four nines — what does that cost you?','Multi-AZ, automated failover, no manual deploys, an on-call rota. Say the operational cost, not just the architecture.']
 ],
 fail:[
  'Reaching for a calculator or going silent. Estimate out loud, badly and fast, and correct yourself.',
  'Reciting CAP as "pick two". It is only a choice during a partition.',
  'Never stating peak vs average, so every downstream number is ambiguous.'
 ]},

{n:2, wk:2, tier:'b', t:'Caching', anchor:'Facebook memcache leases (the stampede paper) · Redis vs Memcached',
 who:'JPM · Amex · Expedia · Amazon · Microsoft',
 asked:[
  'Design a caching layer for a read-heavy API.',
  'Our database is falling over under reads. What do you do?',
  'Design a distributed cache like Redis.',
  'How do you keep a cache and a database in sync?'
 ],
 clarify:[
  'What is the read-to-write ratio? (caching only pays above ~10:1)',
  'How stale can this data be — seconds, minutes, or never?',
  'What is the working-set size versus the total data size?',
  'Is a cache miss expensive, or just slower?'
 ],
 scale:'Cache sizing: hit rate follows the working set, not the total. 20% of keys usually serve 80% of reads. 100GB of data with a 10GB working set means 10GB of RAM buys you ~80% hit rate.',
 terms:[
  ['Cache-aside (lazy)','App checks cache, misses, reads DB, writes cache. The default. Simple, and the first request after a write is always a miss.'],
  ['Write-through','Write to cache and DB together. Cache is never stale; writes are slower.'],
  ['Write-back','Write to cache, flush to DB later. Fast, and you can lose data on a crash.'],
  ['Write-around','Write to DB only, let reads populate. Good when written data is rarely read soon after.'],
  ['TTL','Expiry time. The cheapest form of invalidation, and usually the right one.'],
  ['Cache stampede','A hot key expires and thousands of requests hit the DB at once.'],
  ['Request coalescing','Only one request recomputes; the rest wait on it. Also called single-flight.'],
  ['Consistent hashing','Keys map to a ring so adding or removing a node moves only 1/N of keys instead of all of them.'],
  ['Virtual nodes','Each physical node owns many ring positions, so load stays even when one dies.'],
  ['Hot key','One key taking a disproportionate share of traffic — a celebrity, a viral post. Breaks even a good sharding scheme.']
 ],
 decisions:[
  ['Cache placement','Client · CDN · app-local · shared cache tier · DB buffer pool','Usually a shared tier (Redis) plus a CDN for static. App-local is fastest but gives you N inconsistent copies.'],
  ['Invalidation','TTL only · explicit delete on write · versioned keys','TTL is the default. Explicit delete on write when staleness is visible. Versioned keys when you cannot enumerate what to delete.'],
  ['Eviction','LRU · LFU · FIFO · random','LRU by default. LFU when there is a stable hot set and you want to survive a scan. Say why you picked one.'],
  ['Redis vs Memcached','','Memcached is a simpler pure cache and multi-threaded. Redis gives data structures, persistence and replication. Pick Redis unless you genuinely only need get/set.']
 ],
 cross:[
  ['The cache expires and 10,000 requests hit at once. What happens?','A stampede. Three fixes: request coalescing so one caller recomputes, jittered/randomised TTLs so keys do not expire together, or an early-recompute window where one request refreshes before expiry while others serve the old value.'],
  ['What if Redis goes down entirely?','Decide fail-open or fail-closed. Fail-open means all traffic hits the DB — will it survive? Usually you need a circuit breaker plus load shedding, or the outage cascades.'],
  ['Two servers write the same key at the same time. Which wins?','Last write wins by default, which can resurrect stale data. If it matters, use a versioned/CAS write or invalidate-then-write rather than write-then-invalidate.'],
  ['How do you cache something a user is only allowed to see part of?','Cache the raw object and apply authorisation on read, or key the cache by (resource, permission-scope). Never cache the post-authorisation response under a shared key.'],
  ['One key gets 50% of your traffic. Now what?','Hot key. Replicate that key across several nodes with a random suffix, or push it into app-local cache with a short TTL.'],
  ['How do you warm a cold cache after a deploy?','Pre-warm from a snapshot of hot keys, or roll the deploy so only part of the fleet is cold at once.']
 ],
 fail:[
  'Saying "add a cache" without saying what happens on a miss, on a write, or when it is down.',
  'Not knowing the stampede answer. It is the single most common cache follow-up.',
  'Ignoring the read-to-write ratio. A cache in front of a write-heavy store is worse than no cache.'
 ]},

{n:3, wk:3, tier:'b', t:'Databases — the choice, not the preference', anchor:'Postgres B-tree and MVCC internals — your own stack',
 who:'JPM · Amex · Expedia. The deepest DB questioning is at tier 1.',
 asked:[
  'SQL or NoSQL for this, and defend it.',
  'Design the data model for [product].',
  'This query got slow after the table grew. Diagnose it.',
  'When would you NOT use a relational database?'
 ],
 clarify:[
  'What are the access patterns? (this decides the store, not the data shape)',
  'Do we need transactions across more than one entity?',
  'How much data, and how fast is it growing?',
  'Are the queries known in advance, or ad hoc?'
 ],
 scale:'A single well-indexed Postgres handles low tens of thousands of QPS and single-digit TB comfortably. Say that out loud — most systems never need more, and knowing the ceiling is worth more than knowing Cassandra.',
 terms:[
  ['B-tree','Sorted, balanced, good for reads and ranges. What Postgres and MySQL use.'],
  ['LSM-tree','Buffer writes in memory, flush sorted runs, compact later. Fast writes, read amplification, compaction cost. Cassandra, RocksDB, ScyllaDB.'],
  ['Selectivity','What fraction of rows a predicate keeps. Low selectivity means an index will not help.'],
  ['Covering index','Contains every column the query needs, so it never touches the heap.'],
  ['Leftmost prefix','A composite index on (a,b,c) serves a, a+b, a+b+c — never b alone.'],
  ['MVCC','Each write creates a new row version; readers never block writers. Dead versions need VACUUM.'],
  ['Isolation levels','Read committed (Postgres default) · repeatable read · serializable. Each forbids more anomalies and costs more.'],
  ['Normalisation','Store facts once. Trade joins for consistency. Denormalise deliberately, not accidentally.'],
  ['Write amplification','One logical write causing many physical writes — compaction, index maintenance, replication.']
 ],
 decisions:[
  ['SQL vs NoSQL','','Start relational. Move when you have a concrete reason: scale beyond one machine, a genuinely schemaless shape, or an access pattern relational storage serves badly. "It scales better" is not a reason on its own.'],
  ['B-tree vs LSM','','Read-heavy with ranges: B-tree. Write-heavy and append-mostly: LSM, and accept compaction.'],
  ['Index columns','','Equality columns first, then the range column. An index on (status, created_at) serves status=x AND created_at>y; the reverse order does not.'],
  ['Denormalise?','','Only when a join is measurably the bottleneck AND you have a plan for keeping the copies consistent.']
 ],
 cross:[
  ['Read me this EXPLAIN plan.','Name the scan type, compare estimated vs actual rows, find where the estimate is wrong. A seq scan on a big table with a selective predicate means a missing or unusable index. A huge estimate error means stale statistics — run ANALYZE.'],
  ['Why is your index not being used?','Wrong column order, a function applied to the column, low selectivity so the planner prefers a seq scan, or a type mismatch forcing a cast.'],
  ['Give me a lost update at READ COMMITTED.','Two transactions read balance=100, both compute 100-10, both write 90. One update vanished. Fix with SELECT FOR UPDATE, an atomic UPDATE ... SET balance = balance - 10, or a version column.'],
  ['Your connection pool exhausted. Diagnose it.','Long-running transactions, leaked connections, an N+1 holding connections, or missing statement timeouts. Pool size should be roughly cores x 2, not hundreds — a bigger pool usually makes it worse.'],
  ['How do you add a column to a 500M-row table with no downtime?','Expand-migrate-contract: add nullable, backfill in batches, dual-write, switch reads, then drop the old. Never a blocking ALTER in one shot.'],
  ['What breaks when you shard this?','Cross-shard joins, cross-shard transactions, and unique constraints across shards. Say which of those your design needs and how you avoid them.']
 ],
 fail:[
  'Choosing NoSQL as a default and being unable to say what specifically fails in Postgres.',
  'Not being able to read an EXPLAIN plan when the DB is on your resume.',
  'Talking about indexes without mentioning column order.'
 ]},

{n:4, wk:4, tier:'b', t:'Sharding & replication', anchor:'Discord: Cassandra to ScyllaDB · Instagram sharded Postgres',
 who:'JPM · Amex · Amazon · Uber',
 asked:[
  'This table is 10TB. Shard it.',
  'How do you scale reads? How do you scale writes?',
  'What is your shard key, and why does it not create a hot partition?',
  'A replica is lagging. What does the user see?'
 ],
 clarify:[
  'Read-heavy or write-heavy? (replicas fix reads; only sharding fixes writes)',
  'What are the query patterns — always by one key, or ad hoc?',
  'Is the data naturally partitionable by tenant or user?',
  'Do we need cross-shard transactions? (if yes, push back hard)'
 ],
 scale:'Rule of thumb: one node holds low single-digit TB and tens of thousands of QPS. 10TB means ~4-8 shards with headroom, not 100. Over-sharding costs more operationally than it saves.',
 terms:[
  ['Range sharding','Split by key range. Good for range scans, prone to hot spots at the ends (e.g. sharding by timestamp).'],
  ['Hash sharding','Hash the key. Even distribution, no range scans.'],
  ['Directory sharding','A lookup service maps key to shard. Flexible, and now the directory is a SPOF.'],
  ['Hot partition','One shard taking disproportionate load. The failure mode of every naive shard key.'],
  ['Leader-follower','One writer, many readers. Simple, and reads can be stale.'],
  ['Multi-leader','Writes anywhere, conflicts possible. Needs a resolution strategy.'],
  ['Quorum (R+W>N)','Read and write quorums overlapping guarantees you read the latest write.'],
  ['Replication lag','How far behind a follower is. The source of "I posted it and it vanished".'],
  ['Resharding','Moving data when you add shards. Consistent hashing keeps this to 1/N.'],
  ['Split brain','Two nodes both believe they are leader. Prevented by fencing tokens or a quorum-based election.']
 ],
 decisions:[
  ['Shard key','user_id · tenant_id · hash(id) · timestamp','Almost never timestamp — it makes the newest shard the hottest. Pick the key that appears in the majority of queries so most reads hit one shard.'],
  ['Replicas vs shards','','Replicas scale READS and give you failover. Shards scale WRITES and storage. Do not reach for sharding when the problem is read load.'],
  ['Sync vs async replication','','Async by default — sync replication couples your write latency to your slowest replica. Sync (or quorum) when losing the last few writes is unacceptable.'],
  ['Failover','Automatic · manual','Automatic with a quorum-based election and fencing. Manual failover means your RTO is however long it takes to wake someone up.']
 ],
 cross:[
  ['Defend your shard key.','Say the query distribution it serves, the hot-partition risk, and what happens when one tenant is 100x bigger than the rest — usually a dedicated shard for whales.'],
  ['You need to add shards. How, without downtime?','Consistent hashing so only 1/N moves; dual-write during migration; backfill; verify; cut over reads; stop dual-writing.'],
  ['A query needs data from three shards.','Scatter-gather, and now your latency is the slowest shard. If it is common, the shard key is wrong or you need a denormalised read model.'],
  ['The leader dies mid-write. What is lost?','With async replication, anything not yet replicated. State your RPO explicitly. With quorum writes, nothing acknowledged is lost.'],
  ['User posts a comment and refreshes — it is gone. Why?','They read from a lagging follower. Fix with read-your-writes: route that user to the leader for a short window, or track a write timestamp per session.'],
  ['Two nodes both think they are the leader.','Split brain. Quorum election plus fencing tokens so the stale leader is rejected by the storage layer.']
 ],
 fail:[
  'Sharding when replicas would have solved it.',
  'Choosing a shard key without saying what makes it hot.',
  'Claiming zero data loss with async replication.'
 ]},

{n:5, wk:5, tier:'b', t:'Queues, async & delivery semantics', anchor:'Kafka vs SQS vs RabbitMQ — and your own custom Spring event components',
 who:'JPM · Amex · Amazon · Uber. Directly connected to your Kafka module.',
 asked:[
  'Design an async job pipeline.',
  'A request takes 30 seconds. Make it not.',
  'How do you guarantee this is processed exactly once?',
  'Design a notification / email sending system.'
 ],
 clarify:[
  'Does the caller need the result, or just an acknowledgement?',
  'Does ordering matter, and ordering by what — globally, or per user?',
  'What happens if a message is processed twice? Is that harmless?',
  'Do we need to replay history, or is a consumed message gone forever?'
 ],
 scale:'Queue depth is the signal to watch. Producers at 1k/s and consumers at 800/s means 200 messages/s of unbounded growth — say what you do BEFORE the disk fills.',
 terms:[
  ['At-most-once','Commit the offset first, then process. Loses messages on a crash.'],
  ['At-least-once','Process first, then commit. Duplicates on a crash. The default choice.'],
  ['Exactly-once','At-least-once plus idempotency. Not a delivery property you can buy — it is something you build.'],
  ['Idempotency key','A client-supplied unique id; the server stores the result and returns it on a repeat.'],
  ['DLQ','Dead letter queue. Where a message goes after N failed attempts, so it stops blocking the partition.'],
  ['Backpressure','Making the producer slow down when consumers cannot keep up. Bounded queues give it to you for free.'],
  ['Outbox pattern','Write the row and the event in one local transaction; a relay publishes from the outbox table.'],
  ['Dual write','Writing to the DB and the broker separately. One can fail. This is the bug the outbox exists to prevent.'],
  ['Queue vs log','A queue deletes on consume. A log keeps messages, so new consumers can replay from the beginning.'],
  ['Visibility timeout','SQS: how long a consumed message is hidden before it reappears. Too short means duplicate processing.']
 ],
 decisions:[
  ['Queue vs log','SQS/RabbitMQ · Kafka','Need replay, multiple independent consumers, or ordering per key? Kafka. Just need work distributed to workers with per-message ack and retry? A queue is simpler and cheaper.'],
  ['Ordering','Global · per key · none','Per key, via the partition key. Global ordering means one partition means no parallelism — almost never worth it.'],
  ['Retry policy','Immediate · fixed · exponential with jitter','Exponential with jitter, capped, then DLQ. Immediate retries against a struggling downstream make the outage worse.'],
  ['Dual write vs outbox','','Outbox. Always. The dual-write problem is the thing an interviewer is checking you know.']
 ],
 cross:[
  ['What if the client retries the request?','Idempotency key: client generates it, server stores key to result with a TTL, a repeat returns the stored result. Two concurrent retries need a unique constraint on the key so one loses.'],
  ['Your consumer dies halfway through a batch.','The offset was not committed, so the messages are redelivered. Which means your consumer MUST be idempotent — say this before they ask.'],
  ['Is exactly-once real?','Inside Kafka, yes — idempotent producer plus transactional writes. End to end, no: the moment you touch an external system you need idempotency at the consumer.'],
  ['The queue is backing up. What do you do?','First diagnose: slow consumer, too few partitions, a poison message, or a downstream bottleneck. Then: scale consumers (up to partition count), shed low-priority load, and apply backpressure to producers.'],
  ['One message keeps failing and blocks everything.','Poison message. Retry with backoff, then route to a DLQ so the partition advances. Then have a process to inspect and replay the DLQ.'],
  ['How do you replay from the DLQ without causing chaos?','Fix the bug first, then replay at a throttled rate into a separate topic or with a flag, and rely on consumer idempotency.'],
  ['You built custom event components in Spring. Why not Kafka?','Answer honestly: the constraint at the time. Then say precisely what Kafka would have bought — durability, replay, consumer groups, per-key ordering — and what it costs: an operational dependency and a rebalance model to reason about.']
 ],
 fail:[
  'Saying "exactly once" as if the broker provides it.',
  'No DLQ, so one bad message stops the pipeline.',
  'Retrying non-idempotent operations. Especially payments.'
 ]},

{n:6, wk:6, tier:'b', t:'Kubernetes as a design primitive', anchor:'Your own production cluster — frontend and backend pods',
 who:'JPM · Amex · Expedia. Unusual as an SD topic, and YOUR strongest card.',
 asked:[
  'How would you deploy and scale this design?',
  'Walk me through what happens when a pod dies.',
  'How do you deploy with zero downtime?',
  'Your service is running out of memory in production. Walk me through it.'
 ],
 clarify:[
  'Stateless or stateful? (that decides Deployment vs StatefulSet)',
  'What is the acceptable downtime during a deploy?',
  'Is scaling driven by CPU, memory, or a queue depth?',
  'Single cluster or multi-region?'
 ],
 scale:'Pod sizing: requests set what the scheduler reserves, limits set the hard cap. A JVM pod with a 2GB limit and no -XX:MaxRAMPercentage will happily try to use more and get OOMKilled.',
 terms:[
  ['Pod','The scheduling unit. One or more containers sharing a network namespace and volumes.'],
  ['Deployment / ReplicaSet','Declarative desired state; a controller reconciles reality toward it.'],
  ['Service','A stable virtual IP plus a selector. How anything finds your pods.'],
  ['Ingress','L7 routing into the cluster — host and path based.'],
  ['Liveness probe','Fails, and the container is RESTARTED.'],
  ['Readiness probe','Fails, and the pod is REMOVED FROM SERVICE ENDPOINTS but keeps running.'],
  ['Startup probe','Gives a slow-booting app time before liveness starts counting.'],
  ['Requests vs limits','Reserved vs capped. Set both; setting only limits makes requests default to limits and wrecks bin-packing.'],
  ['OOMKilled','The container exceeded its memory limit and the kernel killed it. Exit code 137.'],
  ['CrashLoopBackOff','The container keeps exiting; the restart delay grows exponentially.'],
  ['HPA','Horizontal Pod Autoscaler — scales replica count on a metric.'],
  ['preStop + terminationGracePeriod','The drain window. Without it, a rolling update kills in-flight requests.']
 ],
 decisions:[
  ['Deployment vs StatefulSet','','Stateless: Deployment. Needs stable identity or per-pod storage (databases, Kafka): StatefulSet. And say out loud whether running the DB in-cluster is even a good idea.'],
  ['Probe design','','Liveness should check only "is this process wedged" — make it cheap and never depend on a downstream. Readiness SHOULD check downstreams. Swapping them is the classic mistake.'],
  ['Scaling signal','CPU · memory · custom (queue depth)','CPU for request-serving. Queue depth or consumer lag for workers — CPU lies about whether a consumer is keeping up.'],
  ['Rollout','Rolling · blue-green · canary','Rolling by default with maxUnavailable=0. Canary when the change is risky and you have the metrics to judge it.']
 ],
 cross:[
  ['What breaks if you swap liveness and readiness?','A pod that is briefly busy or waiting on a downstream gets RESTARTED instead of temporarily removed from rotation. Under load that becomes a restart loop that takes the whole service down.'],
  ['Your Java pod is OOMKilled. What do you change?','The JVM heap does not know about the container limit unless you tell it. Set -XX:MaxRAMPercentage, account for metaspace, thread stacks and direct buffers on top of heap, raise the limit if genuinely needed — and then actually find the leak with a heap dump.'],
  ['Latency spikes but memory is fine.','CPU throttling. A CPU limit throttles via cfs quota rather than killing, so the app just gets slower in bursts. Check container_cpu_cfs_throttled_seconds.'],
  ['Walk me through debugging CrashLoopBackOff.','kubectl describe pod for events (image pull, mount failure, probe failure) then kubectl logs --previous for the last crash, then the exit code — 137 is OOM, 1 is app error. Then check config and secrets actually exist.'],
  ['How do you get truly zero downtime?','Readiness gating the rollout, a preStop hook plus terminationGracePeriodSeconds long enough to drain, graceful shutdown in the app, and backward-compatible schema changes. Any one missing and you drop requests.'],
  ['You added HPA and it did not help.','The bottleneck was not the pods — it was the database, a connection pool, or a single Kafka partition. More replicas against a fixed downstream makes it worse.'],
  ['How do you rotate a secret with no restart?','Mounted secrets update on a delay and need the app to re-read; env vars do not update at all. Either use a mounted file with a watcher, or accept a rolling restart.']
 ],
 fail:[
  'Reciting Kubernetes concepts abstractly when you have production experience. Lead with a real incident.',
  'Not knowing the liveness vs readiness distinction cold. It is the most-asked K8s question there is.',
  'Treating HPA as a solution to every scaling problem.'
 ]},

{n:7, wk:7, tier:'b', t:'URL shortener + Pastebin', anchor:'bit.ly · the classic warm-up design',
 who:'Amazon · Microsoft · Adobe · Expedia. Often the first design they give you.',
 asked:[
  'Design TinyURL.',
  'Design Pastebin.',
  'Design a link shortener with custom aliases, expiry and click analytics.',
  'How do you generate 100M unique short codes without collisions?'
 ],
 clarify:[
  'Custom aliases, or system-generated only?',
  'Do links expire?',
  'Do we need analytics per click, and at what granularity?',
  'Read-to-write ratio? (this one is extremely read-heavy — say ~100:1)'
 ],
 scale:'100M new URLs/month ≈ 40 writes/s. At 100:1 that is ~4,000 reads/s. 100M x 500 bytes = 50GB/month, 3TB over five years. Small — say so, because it tells you a single DB plus a cache is plausible and sharding is a scale-out story, not a day-one need.',
 terms:[
  ['Base62','[a-zA-Z0-9]. 62^7 ≈ 3.5 trillion codes — 7 characters is plenty.'],
  ['Counter-based generation','A distributed counter, base62-encoded. No collisions by construction, but codes are guessable and sequential.'],
  ['Hash-based generation','Hash the URL, take the first N chars, handle collisions by retry. Same URL maps to the same code (a feature or a bug).'],
  ['Range allocation','Each app server claims a block of counter values from a coordinator, so it does not hit the counter per request.'],
  ['301 vs 302','301 permanent — the browser caches it and you lose analytics. 302 temporary — every click reaches you. Pick 302 if you want click data.'],
  ['Bloom filter','Cheap probabilistic "have I seen this code" check to avoid a DB round trip on custom-alias collisions.']
 ],
 decisions:[
  ['Code generation','Counter + base62 · hash + collision retry · random + check','Counter with range allocation per server. No collision handling, no coordination on the hot path. Mention that sequential codes are enumerable and, if that matters, encrypt or shuffle the counter.'],
  ['Storage','Relational · KV store','A KV store fits perfectly (code to URL), but relational is fine at this size. The interesting part is the cache, not the store.'],
  ['Redirect code','301 · 302','302 if analytics matter — 301 gets cached by the browser and your click counts vanish.'],
  ['Analytics','Synchronous count · async event stream','Async. Never make the redirect wait on an analytics write. Fire an event, aggregate offline.']
 ],
 cross:[
  ['Two users request the same custom alias at the same instant.','A unique constraint on the alias column; one insert fails and gets an error. Do not check-then-insert — that is a race.'],
  ['How do you stop someone enumerating all your links?','Sequential base62 is trivially enumerable. Either encrypt the counter (a format-preserving cipher) or accept it and treat links as unguessable-by-obscurity only, never as an access control.'],
  ['One link goes viral — 50k requests a second on one key.','Hot key. It is in the cache, which is the easy part; the risk is a single cache node. Replicate the key or push it to CDN/edge with a short TTL.'],
  ['How do expiries actually get deleted?','Do not run a delete sweep on the hot path. Lazy delete on read plus a background cleanup job, or a TTL in the store itself.'],
  ['The counter service is a single point of failure.','Range allocation means servers hold a block, so a brief counter outage does not stop writes. Or use per-server prefixes so there is no shared counter at all.'],
  ['Now support 10 billion links.','Shard by code prefix or hash. Because reads are by exact key, sharding is clean — no cross-shard queries. Say that; it is why this design scales so easily.']
 ],
 fail:[
  'Spending 20 minutes on code generation and never getting to caching, which is where all the traffic is.',
  'Picking 301 and then claiming per-click analytics.',
  'Not noticing that this is a tiny dataset and over-engineering the storage.'
 ]},

{n:8, wk:8, tier:'b', t:'Rate limiter', anchor:'Stripe’s rate limiters · Redis token bucket',
 who:'JPM · Amex · Amazon · Uber. Also a very common LLD crossover.',
 asked:[
  'Design a rate limiter.',
  'Limit each user to 100 requests per minute — across 50 servers.',
  'How do you protect a downstream service from being overwhelmed?',
  'Design an API gateway throttling layer.'
 ],
 clarify:[
  'Per user, per IP, per API key, or per endpoint?',
  'Hard limit or soft (throttle vs reject)?',
  'Is it acceptable to be approximate, or must it be exact?',
  'What do we return when limited — 429 with Retry-After?'
 ],
 scale:'The limiter itself is on the hot path of every request, so its cost matters. A Redis round trip per request adds ~1ms; at 50k QPS that is 50k extra Redis ops/s. That pressure is what pushes you toward local counters with periodic sync.',
 terms:[
  ['Fixed window','Count per clock minute. Simple, and allows 2x burst across the boundary.'],
  ['Sliding window log','Store every timestamp. Exact, and memory grows with traffic.'],
  ['Sliding window counter','Weighted blend of the current and previous window. Nearly exact, tiny memory. The usual answer.'],
  ['Token bucket','Tokens refill at a fixed rate up to a capacity. Allows controlled bursts. What most real systems use.'],
  ['Leaky bucket','Requests drain at a constant rate. Smooths output, no bursts.'],
  ['429 + Retry-After','The correct response. Tell the client when to come back.'],
  ['Fail-open vs fail-closed','When the limiter is down: let everything through, or reject everything. Almost always fail-open — a broken limiter should not be an outage.']
 ],
 decisions:[
  ['Algorithm','fixed · sliding log · sliding counter · token bucket','Token bucket for user-facing APIs (bursts are legitimate). Sliding window counter when you need accuracy with low memory. Say why fixed window is tempting and wrong: the boundary burst.'],
  ['Where it runs','Client · gateway/edge · per service','At the gateway, before your service does any work. Per-service limiters protect individual dependencies as a second layer.'],
  ['Distributed state','Redis central · local + periodic sync · consistent-hash the user to one node','Redis centrally is the simple correct answer. Local counters with sync are approximate but survive Redis being down and remove a hot-path round trip.'],
  ['Failure mode','','Fail-open with a local fallback limit. State this unprompted — it shows you have run one in production.']
 ],
 cross:[
  ['What if Redis goes down?','Fail-open, with a conservative local in-memory limit as a fallback so you are not completely unprotected. A limiter that takes down your API when it fails is worse than no limiter.'],
  ['Fixed window — show me the problem.','100/min limit. 100 requests at 11:00:59 and 100 more at 11:01:00 is 200 in one second, all legal. That is why sliding window or token bucket exists.'],
  ['Per user or per IP — what breaks with each?','Per IP punishes everyone behind a corporate NAT or mobile carrier. Per user requires authentication, so unauthenticated endpoints still need IP limiting. Usually both, at different tiers.'],
  ['Two servers process the same user simultaneously. Do they double-count?','With a central Redis counter and an atomic INCR, no. With local counters, yes — you allow up to N x limit in the worst case. Say which trade-off you took.'],
  ['How do you limit expensive endpoints differently?','Weighted tokens — a heavy endpoint costs 10 tokens, a cheap one costs 1. Same bucket, different price.'],
  ['A legitimate customer is being throttled during a spike.','Tiered limits by plan, burst capacity in the bucket, and a way to raise a specific customer’s limit without a deploy. That is a config lookup, not a code change.']
 ],
 fail:[
  'Answering with fixed window and not knowing the boundary burst.',
  'Never addressing what happens when the limiter itself fails.',
  'Forgetting to return Retry-After, so well-behaved clients cannot back off correctly.'
 ]}

];


PLAN.sd = PLAN.sd.concat([

{n:9, wk:9, tier:'b', t:'News feed / timeline', anchor:'Twitter’s celebrity problem · Instagram feed',
 who:'Amazon · Microsoft · Adobe · Uber',
 asked:[
  'Design Twitter / the Facebook news feed.',
  'Design Instagram’s home timeline.',
  'How do you handle a user with 100 million followers?',
  'Design a notification feed for an e-commerce app.'
 ],
 clarify:[
  'Chronological or ranked? (ranking changes the whole read path)',
  'How many followers does a typical user have — and the maximum?',
  'How fresh must the feed be? Seconds, or is a minute fine?',
  'Read-to-write ratio? (feeds are read-heavy, ~100:1)'
 ],
 scale:'300M DAU, 2 posts/day = 600M posts/day ≈ 7k writes/s. Each read is a feed fetch: 300M x 10 refreshes = 3B reads/day ≈ 35k QPS. Fan-out on write at an average 200 followers = 7k x 200 = 1.4M feed-row writes/s. That number is why hybrid exists.',
 terms:[
  ['Fan-out on write','Push the post into every follower’s feed at publish time. Fast reads, expensive writes, terrible for celebrities.'],
  ['Fan-out on read','Pull from everyone you follow at read time. Cheap writes, slow reads, bad for users following thousands.'],
  ['Hybrid fan-out','Push for normal users, pull for celebrities, merge at read. What every real system does.'],
  ['Feed store','Per-user list of post ids, usually capped at a few hundred, in Redis or a KV store.'],
  ['Cursor pagination','Paginate by (timestamp, id) rather than offset, so new posts do not shift pages.'],
  ['Write amplification','One post causing N feed writes. The core cost of fan-out on write.'],
  ['Ranking signals','Recency, affinity, engagement rate. Ranking turns the feed into a scoring problem on top of retrieval.']
 ],
 decisions:[
  ['Fan-out strategy','write · read · hybrid','Hybrid, with a follower-count threshold (say 10k) defining a celebrity. Say the threshold and say it is tunable.'],
  ['Feed storage','Full posts · post ids only','Ids only, hydrated from a post cache on read. Storing full posts N times is enormous duplication and makes edits impossible.'],
  ['Feed length','Unbounded · capped','Capped at ~500-1000 ids. Nobody scrolls further; older content falls back to a pull query.'],
  ['Pagination','Offset · cursor','Cursor. Offset pagination on a feed that is constantly prepended shows duplicates and skips items.']
 ],
 cross:[
  ['A user with 100M followers posts. Walk me through it.','Do NOT fan out. Mark them a celebrity, store the post once, and merge their posts into each follower’s feed at read time. This is the single question this design exists to test.'],
  ['How do you merge pushed and pulled content at read time?','Fetch the precomputed feed, fetch recent posts from the handful of celebrities the user follows, merge by timestamp, take the top N. Cache the merged result briefly.'],
  ['Someone deletes a post that is already in 200M feeds.','Do not chase it. Filter at read time by checking post existence/visibility in the hydration step — which is why you store ids, not copies.'],
  ['A new user follows 500 accounts. Their feed is empty.','Backfill asynchronously from those accounts’ recent posts, and serve a pull-based feed until the backfill completes.'],
  ['How do you make the feed personalised without killing latency?','Retrieve a candidate set cheaply (the feed store), then rank only those few hundred. Never rank the whole corpus at read time.'],
  ['The fan-out workers fall behind at peak.','Queue depth grows. Prioritise: fan out to active users first, lazily backfill inactive ones on their next read. Most followers will not open the app in the next hour.']
 ],
 fail:[
  'Picking pure fan-out on write and not raising the celebrity problem unprompted.',
  'Storing whole posts in every feed.',
  'Using offset pagination on a live feed.'
 ]},

{n:10, wk:10, tier:'b', t:'Chat system', anchor:'WhatsApp · Discord’s message store (Cassandra to ScyllaDB)',
 who:'Amazon · Microsoft · Uber',
 asked:[
  'Design WhatsApp / Messenger / Slack.',
  'Design a real-time chat with delivery receipts and presence.',
  'How do you deliver a message to a user connected to a different server?',
  'Design group chat for 1,000 members.'
 ],
 clarify:[
  '1:1 only, or groups? What is the maximum group size?',
  'Do we need read receipts and typing indicators?',
  'Message history — forever, or a retention window?',
  'End-to-end encrypted? (that removes server-side search entirely)'
 ],
 scale:'50M DAU, 40 messages/day = 2B messages/day ≈ 23k writes/s. Each message fans out to at least one recipient. Connections are the real cost: 10M concurrent WebSockets at ~10k connections per node means ~1,000 gateway nodes.',
 terms:[
  ['WebSocket','A persistent bidirectional connection. The reason chat needs a connection registry.'],
  ['Connection registry','A map of user to the gateway node holding their socket. Usually Redis with a TTL.'],
  ['Presence','Online/offline/last-seen. Extremely chatty — usually heartbeats plus a decay window, not real-time truth.'],
  ['Delivery receipt','sent / delivered / read. Three separate acknowledgements, each a message of its own.'],
  ['Offline queue','Messages stored for a user who is not connected, delivered on reconnect.'],
  ['Message ordering','Per conversation, not global. Use a per-conversation sequence number, not wall-clock time.'],
  ['Idempotent send','Client generates a message id so a retry after a flaky network does not duplicate.'],
  ['Fan-out (group)','A group message is one write plus N deliveries. Big groups are a fan-out problem, same as feeds.']
 ],
 decisions:[
  ['Transport','WebSocket · long polling · SSE','WebSocket for bidirectional. Mention long polling as the fallback for restrictive networks.'],
  ['Message store','Relational · wide-column','Wide-column (Cassandra/Scylla) partitioned by conversation_id, clustered by sequence. Chat is append-heavy with range reads by conversation — the ideal LSM workload.'],
  ['Routing across nodes','Registry lookup + direct RPC · pub/sub broadcast','Registry plus direct forward. Broadcasting every message to every gateway does not scale past a small fleet.'],
  ['Ordering','Server timestamp · per-conversation sequence','Per-conversation monotonic sequence. Clock skew across servers makes timestamps unreliable for ordering.']
 ],
 cross:[
  ['User A is on gateway 1, user B is on gateway 3. How does the message get there?','Look up B in the connection registry, forward the message to gateway 3 over an internal RPC or a pub/sub channel keyed by node. If B is absent, write to the offline queue.'],
  ['The recipient is offline. Then comes back on a different device.','Offline queue keyed by user, drained on connect. Multi-device means per-device delivery cursors, not one — each device tracks what it has received.'],
  ['Two messages arrive out of order.','Per-conversation sequence numbers; the client buffers and reorders on the gap. Do not rely on server timestamps across nodes.'],
  ['A gateway node dies with 10,000 connections.','Clients reconnect (with jittered backoff, or you get a thundering herd), get assigned a new node, the registry updates, and the offline queue covers the gap.'],
  ['Group of 1,000 — do you write 1,000 rows?','One message row per conversation, plus per-member delivery state. Do not duplicate message bodies per member. For very large groups, treat it like a feed and pull on read.'],
  ['How does presence not melt your system?','Heartbeats every ~30s with a TTL in Redis, and only push presence changes to users actively viewing that contact. Real-time global presence is the classic scaling trap.'],
  ['End-to-end encryption — what do you lose?','Server-side search, server-side spam filtering, and multi-device history sync becomes a key-management problem. Say this trade-off out loud.']
 ],
 fail:[
  'Not having an answer for cross-node delivery. It is the whole question.',
  'Using timestamps for ordering.',
  'Treating presence as trivially real-time.'
 ]},

{n:11, wk:11, tier:'b', t:'Payments, ledger & idempotent charges', anchor:'Stripe’s idempotency keys · double-entry bookkeeping',
 who:'JP MORGAN · AMEX. This is their home turf — expect real depth.',
 asked:[
  'Design a payment system.',
  'Design a wallet / ledger service.',
  'How do you make sure a customer is never double-charged?',
  'Design the money movement for a marketplace (buyer, seller, platform fee).'
 ],
 clarify:[
  'Are we moving real money, or internal credits?',
  'Do we own the ledger, or is a PSP (Stripe/Adyen) the source of truth?',
  'What is the reconciliation requirement — daily, real-time?',
  'Multi-currency? (that adds FX rate-at-time-of-transaction)'
 ],
 scale:'Payments are low QPS and high stakes. 1M transactions/day is only ~12 TPS — the design is not about throughput, it is about correctness under partial failure. Say that early; it reframes the whole conversation.',
 terms:[
  ['Double-entry','Every transaction writes two entries, debit and credit, summing to zero. The invariant that makes the ledger auditable.'],
  ['Append-only ledger','You never UPDATE a ledger row. Corrections are new reversing entries.'],
  ['Idempotency key','Client-supplied unique id per payment attempt. The single most important control in this design.'],
  ['Authorisation vs capture','Auth reserves funds; capture takes them. Two-phase, and the gap is where holds and expiries live.'],
  ['Reconciliation','Comparing your ledger against the PSP or bank statement and explaining every difference.'],
  ['Settlement','When money actually moves between institutions — hours or days after the transaction.'],
  ['Saga','A multi-step money flow with compensating transactions instead of a distributed lock.'],
  ['Compensating transaction','A business-level undo — a refund, not a rollback.'],
  ['Exactly-once (money)','Achieved with idempotency keys plus a unique constraint, never with a broker guarantee.'],
  ['PCI scope','Anything touching raw card data. Minimise it — tokenise at the edge so your services never see a PAN.']
 ],
 decisions:[
  ['Ledger model','Balance column · append-only entries','Append-only entries; balance is derived (and cached as a materialised snapshot). A mutable balance column has no audit trail and no way to explain a discrepancy.'],
  ['Consistency','Eventual · strong','Strong within the ledger. Money is the canonical case for not being eventually consistent. Across services, use a saga with compensations.'],
  ['Distributed transaction','2PC · saga','Saga. 2PC holds locks across services and its coordinator is a single point of failure — unacceptable for availability. Say this explicitly, it is the expected answer.'],
  ['Idempotency storage','In the payment row · a separate keys table','A separate table with a unique constraint on the key, storing the resulting response, with a TTL of at least 24h.']
 ],
 cross:[
  ['The client times out and retries the charge. What stops a double charge?','The idempotency key. First request inserts the key (unique constraint), processes, stores the result. The retry hits the constraint, finds the stored result, returns it. Two CONCURRENT retries: one insert wins, the other waits or returns 409.'],
  ['How do you correct a mistaken transaction?','A reversing entry, never an UPDATE. The original stays in the ledger forever — that is the point of append-only.'],
  ['Payment succeeded at the PSP but your service crashed before recording it.','This is why reconciliation exists. Poll the PSP for the status of any pending transaction, or consume their webhook — and make webhook handling idempotent too, since they retry.'],
  ['Two services both need to move money. How do you keep it consistent?','Saga with compensations: reserve, charge, credit; on failure at step 3, issue a refund for step 2. Each step idempotent, each compensation idempotent.'],
  ['A user’s balance is wrong. How do you find out why?','Replay the ledger entries for that account and compare against the cached balance. If you had a mutable balance column, you could not do this — which is the argument for the design.'],
  ['How do you handle a currency conversion?','Store the rate used and the timestamp on the transaction. Never recompute historic amounts from today’s rate.'],
  ['What happens on a partial refund with a marketplace fee?','Decide the policy first — is the platform fee refunded? — then encode it as explicit ledger entries. The design question is really a business-rules question, and saying that is a good answer.']
 ],
 fail:[
  'Not raising idempotency unprompted. At JPM and Amex this is disqualifying.',
  'Proposing 2PC without acknowledging its availability cost.',
  'A mutable balance column with no audit trail.'
 ]},

{n:12, wk:12, tier:'b', t:'Orders, inventory & reservations', anchor:'Amazon inventory holds · Ticketmaster seat locks',
 who:'AMAZON. Also Flipkart, Expedia (seats/rooms), and any e-commerce loop.',
 asked:[
  'Design Amazon’s checkout.',
  'Design a ticket booking system (BookMyShow / Ticketmaster).',
  'Two customers buy the last item at the same instant. What happens?',
  'Design the inventory service for a warehouse.'
 ],
 clarify:[
  'Is overselling ever acceptable, or must it be strictly prevented?',
  'How long may a reservation be held before payment?',
  'Single warehouse or many? (multi-warehouse turns this into an allocation problem)',
  'What happens if payment fails after the hold?'
 ],
 scale:'Peak is the whole story: a normal day at 500 orders/s becomes 50,000/s during a flash sale on one SKU. Design for the hot-SKU case — that single row is the bottleneck, not overall QPS.',
 terms:[
  ['Reservation / hold','Inventory taken out of available stock temporarily, with a TTL.'],
  ['TTL expiry','The hold releases automatically if payment does not complete. Needs a sweeper or a lazy check.'],
  ['Optimistic locking','Read version, write with WHERE version = x. Retry on conflict. Good under low contention.'],
  ['Pessimistic locking','SELECT ... FOR UPDATE. Holds a row lock. Correct under high contention, at the cost of throughput.'],
  ['Atomic decrement','UPDATE stock SET qty = qty - 1 WHERE sku = ? AND qty > 0. One statement, no read-modify-write race. Often the best answer.'],
  ['Oversell','Selling more than you have. Sometimes tolerated (airlines) and sometimes catastrophic (concert seats).'],
  ['Saga','Reserve inventory, charge payment, confirm order — with compensations at each step.'],
  ['Idempotency','The order-placement endpoint must be idempotent, or a double-click creates two orders.']
 ],
 decisions:[
  ['Concurrency control','optimistic · pessimistic · atomic decrement','Atomic conditional decrement for simple stock. Pessimistic for specific named units (seat 14A) where you must hold identity. Optimistic when contention is genuinely low.'],
  ['Hold expiry','Background sweeper · lazy check on read · TTL in the store','Lazy check plus a background sweeper. A sweeper alone leaves a window where expired holds still block sales.'],
  ['Order state','Status column · state machine + event log','Explicit state machine (created, reserved, paid, confirmed, shipped, cancelled) with allowed transitions. Interviewers probe illegal transitions.'],
  ['Cross-service consistency','2PC · saga','Saga with compensations: release inventory if payment fails, refund if fulfilment fails.']
 ],
 cross:[
  ['Two customers buy the last item simultaneously.','Atomic conditional decrement — UPDATE ... WHERE qty > 0. Exactly one update affects a row; the other gets zero rows affected and a clean out-of-stock response. Never SELECT then UPDATE.'],
  ['Payment fails after you reserved the seat.','The hold has a TTL and releases automatically. Additionally fire an explicit compensating release so the seat frees immediately rather than after the timeout.'],
  ['The hold expires while the user is on the payment page.','Either refuse the payment and show a clear message, or extend the hold once. Decide the policy and say it — silently taking payment for released stock is the failure everyone hits.'],
  ['A flash sale puts 50k requests/s on one SKU row.','That row is a single lock. Options: shard the stock into N buckets and decrement a random one, queue the requests and process serially, or admit users through a virtual waiting room. Say which and why.'],
  ['User double-clicks Place Order.','Idempotency key on the order request. Same key returns the same order, never a second one.'],
  ['How do you avoid overselling across three warehouses?','Either a single logical stock counter with allocation deciding the warehouse afterwards, or per-warehouse stock with the reservation naming the warehouse. Do not sum three counters and decrement one — that races.'],
  ['Is eventual consistency ever OK for inventory?','For DISPLAY, yes — "only 3 left" can be slightly stale. For the reservation itself, no. Separating those two is the mature answer.']
 ],
 fail:[
  'Read-then-write on stock. It is the exact race the question is testing.',
  'No answer for what happens when payment fails after the hold.',
  'Ignoring the hot-SKU case and only discussing aggregate QPS.'
 ]},

{n:13, wk:13, tier:'b', t:'Search, typeahead & notifications', anchor:'Elasticsearch inverted index · Google suggest',
 who:'Amazon (search suggestions is a favourite) · Adobe · Microsoft',
 asked:[
  'Design search autocomplete / typeahead.',
  'Design product search for an e-commerce site.',
  'Design a notification service (email, push, SMS).',
  'How do you rank suggestions, and how do you update the ranking?'
 ],
 clarify:[
  'Typeahead latency budget? (under 100ms or it feels broken)',
  'Personalised suggestions, or global?',
  'How fresh must the index be — instant, or minutes?',
  'For notifications: what are the user preference and quiet-hours rules?'
 ],
 scale:'Typeahead fires on every keystroke: 10M searches/day x 20 keystrokes = 200M requests/day ≈ 2.3k QPS average, far higher at peak. Debounce on the client and cache aggressively — most prefixes repeat.',
 terms:[
  ['Inverted index','term to list of document ids. The core structure of every search engine.'],
  ['Trie / prefix tree','Prefix to completions, with the top-k precomputed on each node.'],
  ['Top-k on node','Store the best k completions at each trie node so a lookup is O(prefix), not a subtree walk.'],
  ['Debounce','Client waits ~150ms of no typing before firing. Cuts request volume enormously.'],
  ['TF-IDF / BM25','Relevance scoring. Know the name and roughly what it does; you will not implement it.'],
  ['Index freshness','The lag between a write and it becoming searchable. Near-real-time is usually minutes, not milliseconds.'],
  ['Fan-out (notifications)','One event to many channels and many users, with per-user preferences.'],
  ['Deduplication','Collapsing 50 "someone liked your post" into one digest. A product requirement that shapes the architecture.'],
  ['Quiet hours / throttling','Per-user rules about when and how often you may notify.']
 ],
 decisions:[
  ['Typeahead structure','Trie with top-k · prefix range query on a sorted store · Elasticsearch completion suggester','Trie with precomputed top-k for latency. Say that rebuilding it is a batch job, which is why suggestions lag reality by minutes.'],
  ['Index updates','Real-time · near-real-time batch','Near-real-time. Full rebuild nightly, incremental updates every few minutes. Instant indexing is expensive and rarely required.'],
  ['Notification delivery','Synchronous · queued','Queued, always. One queue per channel so a slow SMS provider does not block email.'],
  ['Notification dedup','','Aggregate in a window before sending. This is a product decision with an architectural consequence — say both.']
 ],
 cross:[
  ['How do you keep typeahead under 100ms?','Precomputed top-k per prefix node, held in memory, plus an edge cache. The query does no ranking at request time — all ranking happened offline.'],
  ['A new trending term appears. How long until it suggests?','However often you rebuild. Say the number. If it must be instant, maintain a small real-time overlay index merged at query time with the batch index.'],
  ['How do you personalise without recomputing per user?','Retrieve a global candidate set, then re-rank the top ~20 with user signals at request time. Never personalise retrieval itself.'],
  ['The SMS provider is down and the queue is filling.','Circuit breaker on that channel, DLQ for failures, and fall back to another channel if the notification is important. Separate queues per channel are what make this containable.'],
  ['A user gets 200 notifications in a minute.','Aggregation window plus per-user rate limits plus quiet hours. Also an unsubscribe path — a notification system without one is a product bug.'],
  ['How do you handle typos?','Edit-distance matching on the index, or a separate spell-correction pass. Fuzzy matching in the trie explodes the search space, so it is usually a second lookup, not the main path.']
 ],
 fail:[
  'Doing ranking at query time and blowing the latency budget.',
  'One queue for all notification channels.',
  'No user preference or throttling model — the interviewer will ask about spam.'
 ]},

{n:14, wk:14, tier:'c', t:'Uber ride matching & geo indexing', anchor:'Uber H3 hexagonal grid · Google S2',
 who:'UBER. Also Lyft, DoorDash, Swiggy, Zomato-style loops.',
 asked:[
  'Design Uber / Lyft.',
  'Find all drivers within 2km of this rider.',
  'How do you handle 1M drivers updating their location every 4 seconds?',
  'Design food delivery dispatch.'
 ],
 clarify:[
  'How often do drivers report location? (this dominates write volume)',
  'Matching by distance only, or ETA, rating, surge?',
  'How large is the search radius, and does it expand on failure?',
  'Is a driver allowed to decline? (that turns matching into an offer loop)'
 ],
 scale:'1M active drivers reporting every 4s = 250k writes/s of pure location churn. That number is the reason you do NOT put live location in your primary database — it goes to an in-memory geo store with a short TTL.',
 terms:[
  ['Geohash','Interleave lat/long bits into a string; shared prefix means nearby. Simple, with edge-case pain at cell boundaries.'],
  ['Quadtree','Recursively subdivided grid, adapts to density. Good for uneven distributions like cities vs countryside.'],
  ['S2','Google’s sphere-to-cell library. Hilbert-curve ordering, well-behaved cells.'],
  ['H3','Uber’s hexagonal grid. Hexagons have uniform neighbour distance — no diagonal problem. The one to name in an Uber interview.'],
  ['Cell / bucket','A region id. Nearby search means "my cell plus its neighbours", not a distance scan.'],
  ['Boundary problem','The nearest driver may be in an adjacent cell. Always query neighbours too.'],
  ['Supply/demand','Drivers vs riders per cell over time. Drives surge and repositioning.'],
  ['Dispatch/offer loop','Offer to a driver, wait for accept, time out, offer to the next. Matching is a sequence, not one decision.'],
  ['ETA vs distance','Straight-line distance is wrong across a river. Real matching uses road-network ETA.']
 ],
 decisions:[
  ['Geo index','geohash · quadtree · S2 · H3','H3 for an Uber interview and say why: uniform hexagon neighbours, no diagonal distortion. Geohash is fine as the simple answer if you name the boundary problem.'],
  ['Location storage','Primary DB · in-memory geo store','In-memory (Redis geo / a dedicated service) with a TTL. Location is high-churn, low-value, and disposable — persisting every ping is a mistake.'],
  ['Matching','Nearest · ETA-based · batched optimisation','Start with nearest-by-ETA within an expanding radius. Mention batch matching (matching several riders and drivers together every few seconds) as the optimisation — it beats greedy per-request matching.'],
  ['Consistency','','Two riders must never be matched to the same driver. That single assignment needs a lock or an atomic state transition on the driver record — this is the correctness core.']
 ],
 cross:[
  ['Why not just SELECT ... WHERE distance < 2km?','A full scan over a million rows per request. Geo indexing turns it into a lookup of a handful of cells.'],
  ['The nearest driver is just over the cell boundary.','Query the cell and all its neighbours, then filter by true distance. Hexagons make this cleaner — six equidistant neighbours instead of eight at two different distances.'],
  ['250k location writes per second. Where do they go?','Not the primary DB. In-memory geo store keyed by driver, TTL a few minutes, no durability. If you need history, sample it and stream it to cold storage separately.'],
  ['Two riders get matched to the same driver.','The assignment must be an atomic state transition on the driver — compare-and-set from AVAILABLE to ASSIGNED. Whoever loses re-enters matching.'],
  ['The driver does not respond to the offer.','Timeout (say 15s), release, offer to the next candidate. Track decline rates — this is the offer loop and it is where the product actually lives.'],
  ['Surge pricing — how do you compute it?','Supply/demand ratio per cell over a rolling window, smoothed to avoid flapping. Say "smoothed" — instant surge changes are a bad user experience and interviewers know it.'],
  ['A whole city’s drivers go offline (network outage).','TTLs expire and they vanish from the index, which is correct behaviour. Riders see no availability; you need a degraded-mode message rather than an infinite spinner.']
 ],
 fail:[
  'Proposing a bounding-box scan.',
  'Storing every location ping durably.',
  'No answer for the double-assignment race.'
 ]},

{n:15, wk:15, tier:'c', t:'Metrics & observability at scale', anchor:'Prometheus · Facebook Gorilla time-series compression',
 who:'Uber · Apple · Amazon-senior. Also strong signal at JPM if you run production.',
 asked:[
  'Design a metrics/monitoring system.',
  'Design a distributed tracing system.',
  'How do you store a billion time series?',
  'How would you alert on this design you just built?'
 ],
 clarify:[
  'Metrics, logs, or traces? (they are three different storage problems)',
  'What retention — high resolution for how long?',
  'Query patterns: dashboards (predictable) or ad-hoc investigation?',
  'What is the cardinality of the labels? (this is the killer)'
 ],
 scale:'10k hosts x 1k metrics x 1 sample per 10s = 1M samples/s. At 16 bytes raw that is 16MB/s = 1.4TB/day. Gorilla-style delta-of-delta compression takes that to ~1.4 bytes/sample — which is why time-series databases exist instead of using Postgres.',
 terms:[
  ['Time series','A metric name plus a label set, over time. The unit of storage.'],
  ['Cardinality','The number of distinct label combinations. Adding user_id as a label is how you kill a metrics system.'],
  ['Pull vs push','Prometheus scrapes targets; StatsD receives pushes. Pull gives you a free health signal; push works behind NAT and for short-lived jobs.'],
  ['Downsampling','Keeping 10s resolution for a day, 1m for a month, 1h for a year.'],
  ['Delta-of-delta encoding','Timestamps are regular, so store the change in the change. Near-free compression.'],
  ['Span / trace','A trace is a request; a span is one operation within it. Linked by a propagated trace id.'],
  ['Sampling','Storing 1% of traces. Head-based (decide at the start) or tail-based (decide after seeing the whole trace — keeps the slow ones).'],
  ['SLO burn rate','How fast you are consuming your error budget. The correct thing to alert on.']
 ],
 decisions:[
  ['Metrics vs logs vs traces','','Metrics for "is it broken" (cheap, aggregated). Logs for "what exactly happened" (expensive, detailed). Traces for "where did the time go" (sampled). Saying this distinction cleanly is most of the round.'],
  ['Pull vs push','','Pull for long-lived services — you get target health for free. Push for batch jobs that die before a scrape.'],
  ['Storage','Relational · TSDB · columnar','Purpose-built TSDB. Say why a relational store fails: no delta compression, and the index cost per series is ruinous.'],
  ['Sampling for traces','head · tail','Tail-based if you can afford it — it keeps the slow and failed traces, which are the ones you actually want. Head-based is cheaper and throws away the interesting ones.']
 ],
 cross:[
  ['Someone adds user_id as a metric label. What happens?','Cardinality explosion — one series per user. Memory and index blow up and the system falls over. Labels must be low-cardinality; high-cardinality dimensions belong in logs or traces.'],
  ['Why is "CPU > 80%" a bad alert?','It is a cause, not a symptom, and it is often fine. Alert on user-visible symptoms and SLO burn rate; put CPU on a dashboard for diagnosis.'],
  ['You have metrics, logs and traces, and the app is slow. What first?','Metrics to confirm and localise (which service, which endpoint, p99 vs p50), traces to find where the time goes, logs last for the specific failing request. Cheapest to most expensive.'],
  ['How do you keep a year of data without keeping a year of raw samples?','Downsample in tiers and drop raw after the high-resolution window. Say the retention policy as part of the design, not an afterthought.'],
  ['A trace crosses five services and a Kafka hop. How does the id survive?','Propagate it in HTTP headers and in Kafka message headers, and make sure your async executor copies the context — this is where trace ids are usually lost.'],
  ['The monitoring system goes down. How do you know?','Dead-man’s switch: an alert that fires when the heartbeat STOPS. Monitor the monitor externally.']
 ],
 fail:[
  'Not raising cardinality unprompted — it is the defining failure of this domain.',
  'Conflating metrics and logs into one storage design.',
  'Alerting on causes instead of symptoms.'
 ]},

{n:16, wk:16, tier:'c', t:'File storage, CDN & video streaming', anchor:'Netflix Open Connect · YouTube transcoding pipeline',
 who:'Apple · Amazon · Adobe (media is their domain)',
 asked:[
  'Design Dropbox / Google Drive.',
  'Design YouTube / Netflix.',
  'Design an image upload and serving pipeline.',
  'How do you stream video to 100M concurrent viewers?'
 ],
 clarify:[
  'Upload size limits? (over ~100MB you need chunked/resumable uploads)',
  'Do we need sharing, permissions, versioning?',
  'Live streaming or video on demand? (completely different pipelines)',
  'What is the geographic distribution of viewers?'
 ],
 scale:'Video dominates everything: 1 hour of 1080p ≈ 3GB, and you store 4-6 encoded variants, so ~15GB per source hour. 500 hours uploaded per minute (YouTube scale) is why transcoding is the expensive part, not storage.',
 terms:[
  ['Object store','S3-style. Flat key to blob, cheap, durable, not a filesystem.'],
  ['Presigned URL','A time-limited signed URL letting the client upload or download directly, bypassing your servers.'],
  ['Chunked / resumable upload','Split into parts, upload independently, retry only failed parts, assemble server-side.'],
  ['Content-addressed storage','Key by hash of content. Gives you free deduplication.'],
  ['CDN / edge','Cached copies near the user. The reason video is viable at all.'],
  ['Cache hit ratio at edge','The whole economics of streaming. A 95% hit ratio means origin serves 5% of traffic.'],
  ['Transcoding','Converting the source into multiple resolutions and bitrates. CPU-expensive, done async.'],
  ['Adaptive bitrate (HLS/DASH)','Video split into segments at several bitrates; the client switches based on bandwidth.'],
  ['Manifest','The playlist file telling the client what segments exist at what bitrates.']
 ],
 decisions:[
  ['Upload path','Through your service · presigned direct-to-storage','Presigned direct upload. Never proxy large files through your application servers.'],
  ['Storage','Filesystem · object store','Object store, with metadata (owner, permissions, versions) in a database. Separating blob from metadata is the core structural decision.'],
  ['Transcoding','Sync · async pipeline','Async queue with workers. The upload returns immediately; the video becomes playable as each rendition completes.'],
  ['Delivery','Origin · CDN','CDN, with the origin only serving cache misses. For very large scale, ISP-embedded caches (what Netflix Open Connect actually is).']
 ],
 cross:[
  ['A 5GB upload fails at 90%.','Chunked resumable upload — only the failed chunk is retried. Without it, the user starts over and gives up.'],
  ['Two users upload the identical file.','Content-addressed storage: hash the content, find it exists, just add a metadata reference. This is how Dropbox dedupes.'],
  ['How does the video start playing before transcoding finishes?','Prioritise one baseline rendition, publish it, and let higher qualities appear as they complete. The manifest is updated as renditions land.'],
  ['A new video goes viral and it is not in any edge cache.','Every request misses to origin — a stampede at CDN scale. Mitigate with origin shielding (a mid-tier cache absorbing misses) and pre-warming for predictable launches.'],
  ['How do you stop someone sharing a direct link to paid content?','Signed URLs with a short expiry and, for video, per-segment tokens. Signing the manifest is not enough if the segments are publicly addressable.'],
  ['How do permissions work if the CDN serves the file?','Authorise at the point of issuing the signed URL, not at delivery. The CDN never checks permissions — the signature is the permission.'],
  ['Live streaming instead of VOD — what changes?','No pre-transcoding time, so you transcode in real time; segments are produced continuously; the manifest is a sliding window; and latency becomes the primary constraint.']
 ],
 fail:[
  'Proxying uploads and downloads through application servers.',
  'Making transcoding synchronous.',
  'Not separating blob storage from metadata storage.'
 ]}

]);


PLAN.sd = PLAN.sd.concat([

{n:17, wk:17, tier:'c', t:'Distributed transactions — saga vs 2PC', anchor:'The outbox pattern · Uber’s and Amazon’s saga usage',
 who:'Uber · Amazon-senior · JPM. The question behind every multi-service design.',
 asked:[
  'Two services both need to change state atomically. How?',
  'Design a booking flow spanning payment, inventory and notification.',
  'Why not use two-phase commit?',
  'You write to the database and publish an event. How do you make that atomic?'
 ],
 clarify:[
  'Does the user need a synchronous answer, or can this complete asynchronously?',
  'Is a compensating action actually possible? (you cannot un-send an email)',
  'What is the acceptable window of inconsistency?',
  'Who owns the overall state of the workflow?'
 ],
 scale:'Not a throughput question. The metric that matters is the inconsistency window — how long can step 2 be done while step 3 is not? Say a number (seconds, minutes) and design the reconciliation to match.',
 terms:[
  ['2PC','Prepare then commit, coordinated. Gives atomicity, holds locks across services, and the coordinator is a SPOF.'],
  ['Saga','A sequence of local transactions, each with a compensating action. Eventual consistency, no distributed locks.'],
  ['Choreography','Services react to each other’s events. No central controller; hard to see the whole flow.'],
  ['Orchestration','One coordinator drives the steps. Easier to reason about and debug; the orchestrator is a dependency.'],
  ['Compensating transaction','A business-level undo (a refund), not a database rollback.'],
  ['Outbox pattern','Write the row and the event to an outbox table in ONE local transaction; a relay publishes from the outbox.'],
  ['Dual write','Writing to two systems separately. One can fail. The bug the outbox prevents.'],
  ['Idempotent consumer','Required, because at-least-once delivery means every step can run twice.'],
  ['Semantic lock','Marking a record as "pending" so other operations know it is mid-saga.']
 ],
 decisions:[
  ['2PC vs saga','','Saga, essentially always in a service architecture. Say why: 2PC holds locks for the duration of a network call, blocks on coordinator failure, and trades availability for an atomicity you can usually get another way.'],
  ['Choreography vs orchestration','','Orchestration for anything with more than ~3 steps or that needs to be debuggable. Choreography is elegant for two services and becomes unfollowable at five.'],
  ['Publishing events','Direct publish after commit · outbox','Outbox. This is the expected answer and the interviewer is checking whether you know the dual-write problem exists.'],
  ['Failure handling','Retry forever · retry then compensate · retry then human','Retry with backoff, then compensate, then a dead-letter with alerting. Say that some failures need a human — pretending everything auto-resolves is not credible.']
 ],
 cross:[
  ['Why not just write to the DB and then publish to Kafka?','If the publish fails after the commit, the event is lost and the systems diverge silently. If you publish first and the commit fails, you have announced something that did not happen. That is the dual-write problem.'],
  ['How does the outbox relay work exactly?','A poller (or CDC on the WAL) reads unpublished outbox rows, publishes them, marks them sent. At-least-once, so consumers must be idempotent. Debezium is the CDC answer if they push.'],
  ['Step 3 of 5 fails. Walk me through it.','Compensate 2 then 1, in reverse order, each compensation idempotent and retryable. Mark the saga failed with the reason. If a compensation itself fails, retry then escalate — it does not silently disappear.'],
  ['What if you cannot compensate? You already sent the email.','Then order the steps so irreversible actions come LAST, after everything reversible has succeeded. That reordering is the design answer.'],
  ['A compensating transaction runs twice.','It must be idempotent — a refund keyed by the original transaction id, not "refund 10 more". Same discipline as the forward path.'],
  ['How do you know a saga is stuck?','Persist saga state with a timestamp and alert on anything in a non-terminal state past a threshold. Without that, stuck sagas are invisible until a customer complains.'],
  ['Is there any case for 2PC?','Within one database across tables, or across resources that support XA and where you control both and availability is not paramount. Being able to say when it IS right is what separates a real answer from a memorised one.']
 ],
 fail:[
  'Not knowing the dual-write problem.',
  'Describing a saga with no compensation for a step that cannot be undone.',
  'Choreography for a six-step flow, with no way to see the current state.'
 ]},

{n:18, wk:18, tier:'c', t:'Multi-region & disaster recovery', anchor:'AWS multi-AZ vs multi-region · bank DR requirements',
 who:'JP MORGAN · AMEX (regulatory DR requirements are real) · Apple',
 asked:[
  'Make your design multi-region.',
  'A whole region goes down. What happens?',
  'What is your RPO and RTO?',
  'How do you serve European and US users with one system?'
 ],
 clarify:[
  'Is this for latency (users near data) or for disaster recovery? (different designs)',
  'What is the acceptable data loss — zero, or a few seconds?',
  'Are there data residency rules? (GDPR means EU data may not leave)',
  'Active-active, or active-passive with failover?'
 ],
 scale:'Cross-region RTT is ~80-150ms. A synchronous cross-region write costs you that on every write. That single number decides active-active vs active-passive more than anything else.',
 terms:[
  ['RPO','Recovery point objective — how much data you may lose. Async replication means RPO > 0, always.'],
  ['RTO','Recovery time objective — how long until you are back. Manual failover means RTO is measured in people, not machines.'],
  ['Active-passive','One region serves; the other stands by. Simple, wasteful, and failover is a real event you must rehearse.'],
  ['Active-active','Both serve. No wasted capacity, and you now own conflict resolution.'],
  ['Conflict resolution','LWW · CRDT · application-level merge. Needed the moment two regions accept writes for the same data.'],
  ['Data residency','Legal requirement that data stays in a jurisdiction. Changes the sharding key to region.'],
  ['Geo-DNS / anycast','Routing users to the nearest healthy region.'],
  ['Split brain','Both regions believing they are primary during a partition.'],
  ['Failover drill','Actually practising it. An untested failover plan is a hypothesis.']
 ],
 decisions:[
  ['Active-active vs active-passive','','Active-passive unless you genuinely need write latency in both regions. Active-active means conflict resolution, and most teams underestimate that cost by an order of magnitude.'],
  ['Replication','sync · async','Async across regions — sync means every write pays 150ms. If RPO must be zero, you need synchronous quorum, and you must accept the latency. State the trade explicitly.'],
  ['Partitioning by region','','If data residency applies, region becomes part of the partition key and cross-region reads become a product decision, not a technical one.'],
  ['Failover','automatic · manual','Manual with a well-rehearsed runbook is often BETTER than automatic — automatic failover on a network blip causes split brain. Say this; it is a mature position.']
 ],
 cross:[
  ['What is your RPO with async replication?','Non-zero, equal to the replication lag at the moment of failure — typically seconds. If the business needs zero, async is off the table and you pay the latency.'],
  ['Both regions accept writes for the same user record. Then what?','Conflict. Last-write-wins loses data silently. Options: partition users to a home region so conflicts cannot occur, use CRDTs for mergeable data, or resolve in the application with business rules.'],
  ['The network between regions partitions. Both think they are primary.','Split brain. Prevented with a quorum across three locations (two regions plus a witness) so a minority cannot promote itself.'],
  ['How do you test the failover?','Scheduled game days that actually fail a region over in production. If you have never tested it, your RTO is a guess — say that plainly.'],
  ['GDPR says EU data stays in the EU. What changes?','Region becomes a partition key. Users have a home region; cross-region features either aggregate anonymously or do not exist. This is a product constraint, not just infrastructure.'],
  ['Cost of active-active?','Double the capacity, double the operational surface, plus conflict resolution engineering. Justify it with a requirement — latency or regulatory — not with "it is more resilient".'],
  ['A deploy takes down region A. Does failover help?','No — the bad code follows you. Regional failover protects against infrastructure failure, not bad releases. That is what canary and rollback are for. Making that distinction is a strong answer.']
 ],
 fail:[
  'Claiming zero RPO with async replication.',
  'Active-active with no conflict-resolution story.',
  'Never having considered that failover must be rehearsed.'
 ]},

{n:19, wk:19, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt. No preparation, no notes, 45 minutes, recorded.',
 asked:[
  'Design a ride-sharing service for airports only.',
  'Design a system to detect fraudulent transactions in real time.',
  'Design a collaborative document editor.',
  'Design a leaderboard for a game with 50M players.',
  'Design an ad-click aggregation pipeline.',
  'Design a distributed cron scheduler.'
 ],
 clarify:[
  'Restate the problem in your own words before anything else.',
  'Ask about scale in the first three minutes. Every time.',
  'Get agreement on the functional scope before drawing a single box.',
  'Say your assumptions out loud and write them down.'
 ],
 scale:'Follow the framework in order. The most common mock failure is jumping to boxes and arrows before establishing requirements and estimates.',
 terms:[],
 decisions:[
  ['Pick your own deep dive','','At minute 30, choose the interesting component and go deep before they ask. Choosing well is scored — it shows judgement about where the difficulty is.']
 ],
 cross:[
  ['Watch the recording and count these','Dead-air gaps over 20 seconds · times you drew before agreeing requirements · trade-offs you asserted without naming the alternative · follow-ups you fumbled.'],
  ['Did you state peak vs average?','If not, every capacity number you gave was ambiguous.'],
  ['Did you name the alternative you rejected?','"I would use Kafka" is weak. "Kafka over SQS because we need replay and per-key ordering" is the same sentence with the signal added.'],
  ['Would you hire you?','Be honest. Then write down the one thing you would fix and drill only that before the next mock.']
 ],
 fail:[
  'Drawing before agreeing on requirements.',
  'Waiting to be asked the follow-up instead of raising it yourself.',
  'Running out of time because you spent 20 minutes on the data model.'
 ]},

{n:20, wk:20, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt. Different domain from last week.',
 asked:[
  'Design a hotel booking system.',
  'Design a stock trading matching engine.',
  'Design a web crawler.',
  'Design an API gateway.',
  'Design a feature-flag service.',
  'Design a system for real-time analytics dashboards.'
 ],
 clarify:[
  'Same discipline. Restate, scope, scale, then design.',
  'For anything with money or inventory, raise idempotency and races unprompted.'
 ],
 scale:'By now the estimation should take under four minutes and feel automatic. If it does not, that is the thing to drill.',
 terms:[],
 decisions:[
  ['Deliberately practise the pushback','','Have the interviewer (or you, playing them) reject your first design choice. Practise defending it, then practise conceding gracefully and adapting. Both are scored.']
 ],
 cross:[
  ['Did you survive all six categories?','Failure · scale · consistency · cost · change · justify. Write the answers down afterwards for whichever you fumbled.'],
  ['Was your deep dive the interesting part?','If you deep-dived the part you found easy, you dodged. That is visible.']
 ],
 fail:[
  'Repeating the same architecture regardless of the problem.',
  'Not adapting when a requirement is added mid-round.'
 ]},

{n:21, wk:21, tier:'c', t:'Recorded mock ×2', anchor:'',
 who:'Unseen prompt, under fatigue — run these back-to-back with a 15-minute break.',
 asked:[
  'Design a multi-tenant SaaS billing system.',
  'Design a content moderation pipeline.',
  'Design a service that emails 50M users a daily digest.',
  'Design an online judge (like LeetCode) that runs untrusted code.',
  'Design a URL safety checker at browser scale.',
  'Design an event-sourced order system.'
 ],
 clarify:[
  'Same framework, tired. That is the point of this week.'
 ],
 scale:'Stamina test. Round 2 should be within 15% of round 1 in quality.',
 terms:[],
 decisions:[
  ['Second round is the real test','','Everyone is good in round 1. Compare the recordings and find what degrades — usually narration first, then edge cases, then complexity precision.']
 ],
 cross:[
  ['What degraded between round 1 and round 2?','Name it specifically. That is what to shore up before the real loop.']
 ],
 fail:[
  'Treating the second round as optional. It is the one that predicts your real onsite.'
 ]},

{n:22, wk:22, tier:'c', t:'Final mock + rebuild the vocabulary from memory', anchor:'',
 who:'You, alone, with a blank page.',
 asked:[
  'Reproduce the requirement→building-block table from memory.',
  'Reproduce the six cross-question categories and one example of each.',
  'Reproduce the latency numbers and the estimation anchors.',
  'One final recorded mock on an unseen prompt.'
 ],
 clarify:[
  'No notes. What you cannot reproduce is what you have not learned.'
 ],
 scale:'Target: 85% of the trigger table reproduced from memory.',
 terms:[],
 decisions:[
  ['What to do with the gaps','','Whatever you could not reproduce goes on a physical index card you carry and review daily until the loop. Do not try to re-learn it from scratch this late.']
 ],
 cross:[
  ['Can you name the building block for every requirement phrase?','If yes, you have the vocabulary. If no, drill only the misses — not the whole table.']
 ],
 fail:[
  'Learning something new on the last day. Consolidate; do not expand.'
 ]}

]);

/* ================================================================== LLD === */

/* ================================================================== LLD ===
   Three different rounds wear this name. Getting the flavour wrong is how
   people lose it before they write a line.

   Reference blocks first, then problems. Per problem:
     asked        how the interviewer poses it, and the variants
     who          who asks it
     clarify      what you pin down before drawing anything
     entities     [name, kind, note] - the class list you put on the board
     patterns     [pattern, exactly where it applies]
     code         [title, [lines], why it matters]
     concurrency  [the race, how you close it]  <- the Amazon differentiator
     extend       [the "now add X" follow-up, how you answer]
     cross        [the question, the answer spine]
     fail         what actually sinks candidates                            */


PLAN.sdRead = {
1:[['Latency numbers every programmer should know', 'https://gist.github.com/jboner/2841832', 1],
   ['GfG — CAP theorem', 'https://www.geeksforgeeks.org/cap-theorem-in-system-design/', 1],
   ['Daniel Abadi — PACELC, the honest extension of CAP', 'PACELC theorem Abadi consistency latency', 0],
   ['Google SRE Book — service level objectives', 'https://sre.google/sre-book/service-level-objectives/', 1]],

2:[['GfG — caching strategies and cache-aside', 'https://www.geeksforgeeks.org/caching-system-design-concept-for-beginners/', 1],
   ['Redis docs — eviction policies', 'https://redis.io/docs/latest/develop/reference/eviction/', 1],
   ['Facebook — Scaling Memcache at Facebook (leases, the stampede fix)', 'Scaling Memcache at Facebook NSDI paper leases', 0],
   ['Consistent hashing explained', 'https://www.geeksforgeeks.org/consistent-hashing/', 1]],

3:[['PostgreSQL docs — indexes', 'https://www.postgresql.org/docs/current/indexes.html', 1],
   ['Use The Index, Luke — how indexing actually works', 'https://use-the-index-luke.com/', 1],
   ['GfG — SQL vs NoSQL', 'https://www.geeksforgeeks.org/difference-between-sql-and-nosql/', 1],
   ['LSM-tree vs B-tree, and why write-heavy stores choose LSM', 'LSM tree vs B-tree write amplification comparison', 0]],

4:[['GfG — database sharding', 'https://www.geeksforgeeks.org/database-sharding-a-system-design-concept/', 1],
   ['Jepsen — what your database actually guarantees under partition', 'https://jepsen.io/analyses', 1],
   ['Discord — how they moved trillions of messages to ScyllaDB', 'Discord trillions of messages ScyllaDB blog', 0],
   ['Instagram — sharding IDs at scale', 'Instagram engineering sharding ids at scale', 0]],

5:[['Kafka documentation — design and delivery semantics', 'https://kafka.apache.org/documentation/#design', 1],
   ['microservices.io — transactional outbox', 'https://microservices.io/patterns/data/transactional-outbox.html', 1],
   ['GfG — message queues in system design', 'https://www.geeksforgeeks.org/message-queues-system-design/', 1],
   ['Stripe — idempotency keys in the API', 'https://docs.stripe.com/api/idempotent_requests', 1]],

6:[['Kubernetes — configure liveness, readiness and startup probes', 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/', 1],
   ['Kubernetes — managing resources for containers', 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/', 1],
   ['Kubernetes — zero-downtime rolling updates and pod termination', 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination', 1],
   ['Why Java pods get OOMKilled — container awareness and MaxRAMPercentage', 'JVM container aware MaxRAMPercentage OOMKilled kubernetes', 0]],

7:[['GfG — design a URL shortening service', 'https://www.geeksforgeeks.org/system-design-url-shortening-service/', 1],
   ['System Design Primer — Pastebin walkthrough', 'https://github.com/donnemartin/system-design-primer#design-pastebincom-or-bitly', 1],
   ['Instagram — generating unique ids without a central counter', 'Instagram sharding and ids snowflake style generation', 0]],

8:[['GfG — designing a rate limiter', 'https://www.geeksforgeeks.org/system-design-of-rate-limiter/', 1],
   ['Stripe — scaling your API with rate limiters', 'https://stripe.com/blog/rate-limiters', 1],
   ['Cloudflare — how they count requests at the edge', 'Cloudflare sliding window rate limiting blog', 0]],

9:[['System Design Primer — design Twitter timeline and search', 'https://github.com/donnemartin/system-design-primer#design-the-twitter-timeline-and-search', 1],
   ['GfG — design a news feed system', 'https://www.geeksforgeeks.org/design-a-news-feed-system/', 1],
   ['Twitter — the fan-out problem and celebrity accounts', 'Twitter timeline fanout celebrity problem engineering blog', 0]],

10:[['GfG — design a chat application like WhatsApp', 'https://www.geeksforgeeks.org/designing-whatsapp-messenger-system-design/', 1],
    ['Discord — storing billions of messages', 'Discord how we store billions of messages Cassandra', 0],
    ['WebSockets vs long polling vs SSE', 'https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/', 1]],

11:[['Martin Fowler — event sourcing and the audit log', 'https://martinfowler.com/eaaDev/EventSourcing.html', 1],
    ['Stripe — idempotent requests', 'https://docs.stripe.com/api/idempotent_requests', 1],
    ['Double-entry bookkeeping for engineers', 'double entry ledger design for software engineers immutable', 0],
    ['microservices.io — saga pattern', 'https://microservices.io/patterns/data/saga.html', 1]],

12:[['microservices.io — saga and compensating transactions', 'https://microservices.io/patterns/data/saga.html', 1],
    ['GfG — design an e-commerce system like Amazon', 'https://www.geeksforgeeks.org/design-amazon-system-design/', 1],
    ['Handling inventory reservations and oversell', 'inventory reservation TTL hold oversell design', 0]],

13:[['GfG — design a search autocomplete system', 'https://www.geeksforgeeks.org/design-a-typeahead-system/', 1],
    ['Elasticsearch — inverted index and relevance', 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 1],
    ['Designing a notification service with per-user preferences', 'notification service design fanout preferences dedup', 0]],

14:[['Uber H3 — the hexagonal geospatial index', 'https://h3geo.org/docs/', 1],
    ['Google S2 geometry', 'http://s2geometry.io/', 1],
    ['GfG — design Uber / ride-sharing', 'https://www.geeksforgeeks.org/system-design-of-uber-app-uber-system-architecture/', 1],
    ['Uber — real-time dispatch architecture', 'Uber engineering blog marketplace dispatch real time matching', 0]],

15:[['Prometheus — overview and data model', 'https://prometheus.io/docs/introduction/overview/', 1],
    ['Google SRE Book — monitoring distributed systems', 'https://sre.google/sre-book/monitoring-distributed-systems/', 1],
    ['Facebook Gorilla — in-memory time series compression', 'Gorilla fast scalable in-memory time series database paper', 0],
    ['OpenTelemetry — traces, metrics, logs', 'https://opentelemetry.io/docs/concepts/signals/', 1]],

16:[['Netflix Open Connect — the CDN they built themselves', 'https://openconnect.netflix.com/en/', 1],
    ['GfG — design a video streaming platform like YouTube', 'https://www.geeksforgeeks.org/system-design-netflix-a-complete-architecture/', 1],
    ['HLS and adaptive bitrate streaming explained', 'HTTP live streaming HLS adaptive bitrate segments manifest', 0]],

17:[['microservices.io — saga pattern', 'https://microservices.io/patterns/data/saga.html', 1],
    ['microservices.io — transactional outbox', 'https://microservices.io/patterns/data/transactional-outbox.html', 1],
    ['Martin Fowler — CQRS', 'https://martinfowler.com/bliki/CQRS.html', 1],
    ['Why two-phase commit is avoided in microservices', 'two phase commit vs saga availability coordinator failure', 0]],

18:[['AWS — disaster recovery strategies and RPO/RTO', 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html', 1],
    ['Jepsen — partition behaviour in real systems', 'https://jepsen.io/analyses', 1],
    ['GfG — multi-region architecture and data residency', 'https://www.geeksforgeeks.org/multi-region-architecture-system-design/', 1],
    ['Conflict-free replicated data types (CRDTs), gently', 'CRDT introduction conflict free replicated data types', 0]],

19:[['System Design Primer — the full problem list', 'https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions', 1],
    ['High Scalability — real architectures to steal from', 'http://highscalability.com/', 1]],

20:[['System Design Primer — the full problem list', 'https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions', 1],
    ['ByteByteGo — system design newsletter archive', 'https://blog.bytebytego.com/', 1]],

21:[['Google SRE Book — the whole thing is free online', 'https://sre.google/books/', 1]],

22:[['Martin Fowler — Patterns of Distributed Systems (for the final sweep)', 'https://martinfowler.com/articles/patterns-of-distributed-systems/', 1]]
};


PLAN.sdSolution = {};


PLAN.sdSolution[7] = {
 req:{
  functional:[
   'Shorten a long URL to a short code, and redirect on access.',
   'Optional custom alias.',
   'Optional expiry.',
   'Click analytics — count, and ideally referrer and geography.'
  ],
  nonFunctional:[
   'Redirect latency under 100ms at p99 — this is on the critical path of someone else page load.',
   'Extremely read-heavy, roughly 100:1.',
   'Short codes must never collide.',
   'Highly available. A broken redirect breaks every link ever shared.'
  ]
 },
 estimate:[
  ['New URLs','100M/month','÷ 2.6M sec/month ≈ 40 writes/sec. Peak maybe 3x = 120/sec. Trivial.'],
  ['Redirects','100:1 read ratio','≈ 4,000 reads/sec average, 12,000 peak. Also modest.'],
  ['Storage','100M × 500 bytes/month','50 GB/month, 3 TB over five years. Small — say this out loud.'],
  ['Code space','base62, 7 chars','62^7 ≈ 3.5 trillion. At 100M/month that is 2,900 years of codes.'],
  ['The conclusion','—','This dataset fits on one machine. Sharding is a scale-out STORY, not a day-one need. Saying that shows you did the arithmetic rather than reciting a template.']
 ],
 api:[
  ['POST /v1/urls','{ longUrl, customAlias?, expiresAt? }','201 { shortUrl, code, expiresAt }','409 if the alias is taken. Idempotency-Key header so a retry does not mint a second code.'],
  ['GET /{code}','—','302 + Location header','302 not 301 — see the trade-offs. 404 if unknown, 410 if expired.'],
  ['GET /v1/urls/{code}','—','200 { longUrl, createdAt, clicks }','Owner-only metadata.'],
  ['DELETE /v1/urls/{code}','—','204','Soft delete so the code is never reissued.']
 ],
 dataModel:[
  ['url','code PK (7 chars) · long_url · owner_id · created_at · expires_at NULL · deleted bool','Primary access is always by exact code, so a KV store fits perfectly. Code as PK means lookups never scan.'],
  ['custom_alias','alias PK · code FK','A UNIQUE constraint on alias is what makes the concurrent-claim race impossible. Do not check-then-insert.'],
  ['click_event (async)','code · ts · referrer · country · ua','Append-only, written from a stream, never on the redirect path. Partition by day.'],
  ['click_agg','code · day · count','Rolled up from the events. What the dashboard reads.']
 ],
 arch:[
  '                        ┌──────────────┐',
  '   create ─────────────▶│  API service │───┐',
  '                        └──────────────┘   │  counter range',
  '                                           ▼',
  '                                  ┌──────────────────┐',
  '                                  │ Counter / ID svc │  (range-allocated)',
  '                                  └──────────────────┘',
  '                                           │',
  '                                           ▼',
  '   ┌────────┐   ┌─────┐   ┌──────────────────────────┐',
  '   │ Client │──▶│ CDN │──▶│    Redirect service      │',
  '   └────────┘   └─────┘   │   (stateless, many)      │',
  '     GET /abc123   ▲      └────────┬─────────────────┘',
  '                   │               │ 1. cache lookup',
  '                   │               ▼',
  '                   │      ┌──────────────────┐',
  '                   │      │  Redis  (hot)    │  ~95% hit',
  '                   │      └────────┬─────────┘',
  '                   │               │ miss',
  '                   │               ▼',
  '                   │      ┌──────────────────┐',
  '                   │      │  KV store        │  code -> longUrl',
  '                   │      │  (sharded by     │',
  '                   │      │   code hash)     │',
  '                   │      └──────────────────┘',
  '                   │',
  '                   └──── 302 Location ────┘',
  '',
  '   redirect ──fire──▶ ┌────────┐ ──▶ ┌──────────┐ ──▶ ┌────────────┐',
  '   (async, never       │ Kafka  │     │ Analytics│     │ click_agg  │',
  '    on the path)       └────────┘     │ consumer │     └────────────┘',
  '                                      └──────────┘'
 ],
 flows:[
  ['Write — create a short URL',[
   '1. Auth, validate the URL, check it is not a redirect loop back to us.',
   '2. If a custom alias was requested: INSERT into custom_alias. The unique constraint decides the race — no check-then-insert.',
   '3. Otherwise take the next value from the app server pre-allocated counter RANGE (e.g. it owns 1,000,000–1,999,999) and base62-encode it.',
   '4. INSERT the url row.',
   '5. Return the short URL. Do NOT warm the cache — most created links are never clicked.'
  ]],
  ['Read — the redirect, the hot path',[
   '1. GET /{code} hits the nearest edge.',
   '2. Redirect service looks up Redis. ~95% hit.',
   '3. On miss, read the KV store and populate the cache with a TTL.',
   '4. Check expiry and deletion. 410 if expired, 404 if unknown.',
   '5. Return 302 with the Location header. THIS IS THE WHOLE LATENCY BUDGET — nothing else may happen synchronously.',
   '6. Fire a click event onto Kafka, fire-and-forget. If the analytics pipeline is down, redirects still work.'
  ]]
 ],
 deepDive:[
  ['Code generation, and why the counter wins',
   'Three options. HASH the URL and take the first 7 chars: same URL gives the same code (feature or bug — it leaks that someone else shortened it), and you must handle collisions with a retry loop. RANDOM plus a existence check: a read on every write, and it degrades as the space fills. COUNTER plus base62: no collisions by construction and no coordination on the hot path.\n\nThe counter objection is that it is a single point of failure and a bottleneck. Both are solved by RANGE ALLOCATION: each app server claims a block of a million values from the counter service and hands them out locally. The counter service is then touched once per million URLs, so a brief outage does not stop writes.\n\nThe remaining objection is real: sequential base62 codes are ENUMERABLE. Anyone can walk /aaaaaa, /aaaaab and harvest every link. If that matters, encrypt the counter with a format-preserving cipher before encoding, which keeps uniqueness while destroying the ordering. Say this unprompted — it is the security follow-up.'],
  ['Why the cache carries this design',
   'The read/write ratio is 100:1 and the working set is tiny: a small fraction of links get almost all the traffic, and link popularity decays fast. A few GB of Redis gets you well above 90% hit rate.\n\nWatch for the stampede: a link goes viral, its cache entry expires, and thousands of requests hit the store at once. Fix with jittered TTLs and single-flight recomputation. And plan for one link being genuinely hot — 50k requests/sec on one key will melt a single Redis node, so replicate the hot key or push it to the CDN with a short TTL.'],
  ['Analytics without touching the latency budget',
   'The redirect must never wait on an analytics write. Fire an event onto Kafka and return. A consumer writes raw events and a rollup job maintains per-day counts.\n\nThis also decouples failure: an analytics outage degrades reporting, not redirection. Being explicit that you accepted approximate click counts in exchange for redirect availability is exactly the kind of trade-off statement that scores.']
 ],
 scaling:[
  ['Redirect service CPU','Stateless — add instances behind the load balancer. This is the easy part.'],
  ['Cache node saturation on a viral link','Replicate the hot key across nodes with a suffix, or serve it from the CDN edge with a 60s TTL.'],
  ['KV store read volume','Read replicas, then shard by hash(code). Because every lookup is by exact key, sharding is clean — no cross-shard queries ever.'],
  ['Counter service','Range allocation means it is already off the hot path. If it still worries you, per-server prefixes remove the shared counter entirely.'],
  ['Analytics volume','This grows faster than anything else. Partition click events by day, roll up hourly, and expire raw events after 30 days.'],
  ['Storage growth','3 TB over five years is nothing. Expiry sweeps and soft deletes keep it flat.']
 ],
 tradeoffs:[
  ['Redirect status','302 Found','301 Permanent','301 is cached by the browser, so you never see the second click and your analytics silently die. 302 costs a request each time and keeps the data. If analytics do not matter, 301 is faster and cheaper — say which you picked and why.'],
  ['Code generation','Counter + base62 + range allocation','Hash, or random-with-check','No collision handling, no coordination per request. Accept enumerability, or encrypt the counter.'],
  ['Store','KV store','Relational','Access is always by exact key. Relational would work at this size; KV is the honest fit and shards trivially.'],
  ['Analytics','Async via a stream','Synchronous counter increment','Protects the latency budget and the availability of the redirect. Costs exact real-time counts.'],
  ['Custom alias collisions','Unique constraint','Check-then-insert','Check-then-insert is a race. The constraint is the only correct answer.']
 ],
 angle:[
  ['Amazon','Will push on the ANALYTICS pipeline and on failure: "the click stream is down, what happens?" and "how do you count clicks exactly once?" Have the at-least-once plus idempotent-rollup answer ready. Also expect "what if one link gets 50,000 requests a second?"'],
  ['Microsoft / Adobe','More likely to probe the code generation itself — collisions, enumerability, and what happens when you exhaust the space. Be able to do the 62^7 arithmetic aloud.'],
  ['Uber','Will ask about the latency budget explicitly and about multi-region: where does the cache live if users are global, and what happens on a cross-region cache miss.'],
  ['JPM / Amex','Least likely to ask this one. If they do, they will care about auditability — who created which link, retention, and whether you can prove a link was not tampered with.']
 ]
};


PLAN.sdSolution[8] = {
 req:{
  functional:[
   'Limit requests per identity (user, API key, or IP) over a time window.',
   'Different limits per endpoint and per customer tier.',
   'Return 429 with Retry-After when limited.',
   'Operators can raise a specific customer limit without a deploy.'
  ],
  nonFunctional:[
   'Adds under ~1ms to every request — it is on the hot path of everything.',
   'Must not become the reason your API is down. Availability of the limiter matters more than perfect enforcement.',
   'Approximate counting is acceptable; exact is usually not worth the cost.'
  ]
 },
 estimate:[
  ['Traffic','50,000 req/sec','Every one needs a limiter decision.'],
  ['Naive Redis round trip','~0.5–1ms each','50,000 extra Redis ops/sec. Feasible, but it is now a hard dependency on your hot path.'],
  ['Memory','1M active keys × ~100 bytes','100 MB. Trivial — memory is never the constraint here.'],
  ['The conclusion','—','The design pressure is LATENCY and AVAILABILITY, not storage. That reframing is the point of the estimate.']
 ],
 api:[
  ['Internal: allow(key, endpoint) → Decision','—','{ allowed, remaining, resetAt }','Called by the gateway before routing.'],
  ['Response headers','—','X-RateLimit-Limit / -Remaining / -Reset','Well-behaved clients back off correctly if you tell them.'],
  ['429 response','—','Retry-After: seconds','Without this, clients hammer you harder during an incident.'],
  ['Admin: PUT /limits/{customer}','{ endpoint, limit, window }','204','Config lookup, not a code change. Interviewers ask how you raise one customer limit at 2am.']
 ],
 dataModel:[
  ['Redis: rl:{key}:{window}','counter, TTL = window length','Fixed / sliding counter. TTL means no cleanup job.'],
  ['Redis: tb:{key}','HASH { tokens, lastRefillNanos }','Token bucket state. Updated atomically by a Lua script.'],
  ['Config store','tier → { endpoint, limit, window }','Cached in-process with a short TTL so a config read is not on the hot path.'],
  ['No durable storage','—','Rate limit state is disposable. Losing it means one window of over-permission, which is acceptable. Saying so is the right instinct.']
 ],
 arch:[
  '   ┌────────┐',
  '   │ Client │',
  '   └───┬────┘',
  '       │',
  '       ▼',
  '   ┌──────────────────────────────────────────┐',
  '   │            API Gateway                   │',
  '   │  ┌────────────────────────────────────┐  │',
  '   │  │  Rate limiter middleware           │  │',
  '   │  │   1. local token bucket (L1)       │  │  ◄── absorbs most decisions,',
  '   │  │   2. Redis Lua script (L2)         │  │      no network hop',
  '   │  │   3. fail-open on Redis error      │  │',
  '   │  └───────────────┬────────────────────┘  │',
  '   └──────────────────┼───────────────────────┘',
  '            allow │   │ deny',
  '                  │   └──────▶ 429 + Retry-After',
  '                  ▼',
  '        ┌──────────────────┐        ┌──────────────────┐',
  '        │  Your services   │        │  Redis cluster   │',
  '        └──────────────────┘        │  (sharded by key)│',
  '                                    └──────────────────┘',
  '                                             ▲',
  '                                    ┌────────┴─────────┐',
  '                                    │  Config service  │',
  '                                    │  tier -> limits  │',
  '                                    └──────────────────┘'
 ],
 flows:[
  ['The decision path',[
   '1. Gateway extracts the identity — API key, then user id, then IP as a fallback.',
   '2. Resolve the limit from cached config (tier + endpoint). No network call.',
   '3. L1: check the in-process token bucket for this key. If it is already clearly over, reject immediately without touching Redis.',
   '4. L2: run a Lua script on Redis that refills and takes atomically, returning remaining tokens.',
   '5. Allowed → forward, with rate-limit headers on the response.',
   '6. Denied → 429 with Retry-After computed from the refill rate.',
   '7. Redis error → FAIL OPEN, fall back to the L1 local limit only, and emit a metric.'
  ]]
 ],
 deepDive:[
  ['Why fixed window is wrong, and what to use instead',
   'Fixed window: count per clock minute. A 100/min limit permits 100 requests at 11:00:59 and 100 more at 11:01:00 — 200 in one second, all legal. That boundary burst is the reason the algorithm is a trap, and interviewers ask about it specifically.\n\nSliding window LOG stores every timestamp: exact, and memory grows with traffic. Sliding window COUNTER blends the previous and current window by elapsed fraction: nearly exact, constant memory, and usually the right answer for accuracy.\n\nTOKEN BUCKET refills at a fixed rate up to a capacity, which permits controlled bursts. That is what most user-facing APIs actually want, because legitimate clients are bursty. Pick token bucket for public APIs and say why: bursts are legitimate, and smoothing them punishes good clients.'],
  ['Making it atomic and distributed',
   'The naive distributed implementation reads the counter, decides, then writes — a race across gateway instances. Use a Lua script so refill-and-take is one atomic Redis operation. Lua on Redis is single-threaded per key, which is exactly the guarantee you need.\n\nThe two-tier design matters more than people expect. A purely central limiter puts a network round trip on every request and makes Redis a hard dependency. A local bucket per gateway instance absorbs the obvious cases with zero latency and degrades to approximate enforcement — you may allow up to N × limit in the worst case, where N is the instance count. State that number; it is the honest cost.'],
  ['Failure, which is the real question',
   '"What if Redis goes down?" FAIL OPEN, with the local L1 bucket as a conservative fallback. A limiter that takes your API down when it fails is worse than no limiter at all.\n\nThe counter-argument exists: for a limiter protecting a fragile downstream, or a paid-quota boundary, fail-closed may be correct. The right answer is that it depends on WHAT you are protecting — protecting your own capacity, fail open; enforcing a billing boundary, fail closed. Making that distinction is the senior answer.']
 ],
 scaling:[
  ['Redis round trip on every request','Two-tier: local bucket first, Redis only when the local view is uncertain.'],
  ['One Redis node saturating','Shard by rate-limit key. Keys are independent, so this shards perfectly.'],
  ['A hot key (one huge customer)','Give them their own shard, or split their bucket into N sub-buckets and pick one at random.'],
  ['Config lookups','Cache in-process with a 30s TTL. Never read config from the network per request.'],
  ['Multi-region','Per-region limits with the global limit divided, or accept N× over-permission globally. Cross-region synchronous counting is not worth the latency — say so.']
 ],
 tradeoffs:[
  ['Algorithm','Token bucket','Fixed window','Bursts are legitimate for real clients. Fixed window has the boundary-burst flaw.'],
  ['Placement','Gateway / edge','Per service','Rejects before any work is done. Per-service limiters remain useful as a second layer protecting specific dependencies.'],
  ['State','Central Redis + local L1','Purely local, or purely central','Local alone is too approximate; central alone is a latency tax and a hard dependency.'],
  ['Failure mode','Fail open','Fail closed','Availability of your API beats perfect enforcement — unless you are enforcing a paid quota.'],
  ['Accuracy','Approximate','Exact','Exactness costs a synchronous round trip per request. Almost nobody needs it.']
 ],
 angle:[
  ['Amazon','"What if Redis goes down?" is close to guaranteed. Also "how do you limit expensive endpoints differently?" — weighted permits, where a heavy call costs 10 tokens.'],
  ['Uber','Will push on latency: what does this add to p99, and how do you avoid the round trip. The two-tier answer is what they want.'],
  ['JPM / Amex','Will ask about fairness and about the paid-quota case, where fail-open is wrong. Also audit: can you prove a customer was throttled?'],
  ['Microsoft / Adobe','More likely to want the algorithm comparison in detail — draw the fixed-window boundary burst on the board.']
 ]
};


PLAN.sdSolution[11] = {
 req:{
  functional:[
   'Charge a customer for an order, and record it immutably.',
   'Refund fully or partially.',
   'Show a customer their balance and transaction history.',
   'Reconcile against the payment provider daily and explain every difference.',
   'Support multiple currencies with the rate captured at transaction time.'
  ],
  nonFunctional:[
   'A customer must NEVER be double-charged, including under client retries.',
   'Every number must be explainable: why is this balance what it is?',
   'Strong consistency within the ledger. Money is the canonical case for not being eventually consistent.',
   'Auditable and immutable — corrections are new entries, never updates.',
   'Minimise PCI scope: your services should never see a raw card number.'
  ]
 },
 estimate:[
  ['Transactions','1M/day','≈ 12 TPS average, maybe 50 TPS peak. LOW.'],
  ['Ledger rows','2 entries per transaction (double-entry)','2M rows/day, 730M/year. Large but ordinary.'],
  ['Storage','~500 bytes/entry','~1 GB/day, 365 GB/year. Retention is usually 7+ years by regulation.'],
  ['The conclusion','—','This is NOT a throughput problem. Say that in the first two minutes. It is a CORRECTNESS problem under partial failure, and reframing it that way changes the entire conversation in your favour.']
 ],
 api:[
  ['POST /v1/payments','Idempotency-Key hdr + { orderId, amount, currency, paymentMethodToken }','201 { paymentId, status }','The idempotency key is the single most important element of this API.'],
  ['GET /v1/payments/{id}','—','200 { status, amount, events[] }','Status is derived from the ledger, never a mutable field.'],
  ['POST /v1/payments/{id}/refunds','Idempotency-Key + { amount, reason }','201 { refundId, status }','Partial refunds allowed; sum of refunds must not exceed the capture.'],
  ['GET /v1/accounts/{id}/balance','—','200 { balance, asOf }','Derived from entries, cached as a snapshot.'],
  ['POST /webhooks/psp','provider payload','200','MUST be idempotent — providers retry, sometimes for days.']
 ],
 dataModel:[
  ['idempotency_key','key PK · request_hash · response_json · status · created_at · expires_at','UNIQUE on key. This table is what makes double-charging impossible. request_hash catches a client reusing a key with a different body.'],
  ['payment','id PK · order_id · customer_id · amount_minor · currency · status · psp_ref · created_at','amount in MINOR UNITS as an integer. Never a float, never a decimal string.'],
  ['ledger_entry','id PK · txn_id · account_id · direction (DR/CR) · amount_minor · currency · created_at','APPEND ONLY. No UPDATE, no DELETE, ever. Index (account_id, created_at).'],
  ['transaction','id PK · type · reference · created_at','Groups the entries. The invariant: SUM(debits) = SUM(credits) for every txn_id.'],
  ['balance_snapshot','account_id · as_of · balance_minor','A cache. Rebuildable by replaying entries — which is the point.'],
  ['fx_rate','from · to · rate · captured_at','Stored ON the transaction. Never recompute a historic amount at today rate.']
 ],
 arch:[
  '   ┌────────┐        ┌───────────────────┐',
  '   │ Client │───────▶│   Payment API     │',
  '   └────────┘        │  (idempotency     │',
  '                     │   check FIRST)    │',
  '                     └─────────┬─────────┘',
  '                               │',
  '        ┌──────────────────────┼──────────────────────┐',
  '        ▼                      ▼                      ▼',
  '  ┌───────────┐        ┌──────────────┐       ┌──────────────┐',
  '  │idempotency│        │   Ledger     │       │  PSP client  │',
  '  │  table    │        │ (append-only)│       │ (Stripe/…)   │',
  '  │ UNIQUE key│        │  DR   +  CR  │       └──────┬───────┘',
  '  └───────────┘        └──────┬───────┘              │',
  '                              │                      │ tokenised card',
  '                              │ outbox               │ (PCI stays outside)',
  '                              ▼                      ▼',
  '                     ┌─────────────────┐      ┌──────────────┐',
  '                     │  Outbox relay   │      │   Provider   │',
  '                     └────────┬────────┘      └──────┬───────┘',
  '                              ▼                      │ webhook',
  '                        ┌──────────┐                 │ (retried, must',
  '                        │  Kafka   │◄────────────────┘  be idempotent)',
  '                        └────┬─────┘',
  '          ┌──────────────────┼──────────────────┐',
  '          ▼                  ▼                  ▼',
  '   ┌────────────┐    ┌──────────────┐   ┌──────────────┐',
  '   │ Notifier   │    │ Balance      │   │ Reconciler   │',
  '   │            │    │ projector    │   │  (nightly)   │',
  '   └────────────┘    └──────────────┘   └──────────────┘'
 ],
 flows:[
  ['Charge — the happy path',[
   '1. Client sends POST /payments with an Idempotency-Key it generated.',
   '2. INSERT the key row. If the unique constraint fires, this is a retry: return the stored response. STOP HERE.',
   '3. Begin a transaction: write the payment row as PENDING, write the ledger entries, write an outbox row. One local transaction, all or nothing.',
   '4. Commit.',
   '5. Call the PSP with the SAME idempotency key, so their retry protection aligns with yours.',
   '6. On success: write a new transaction moving PENDING to CAPTURED, plus its ledger entries. Never UPDATE the old ones.',
   '7. Store the response against the idempotency key.',
   '8. The outbox relay publishes events; consumers notify, project balances, and feed reconciliation.'
  ]],
  ['The retry that would double-charge',[
   '1. Client times out waiting, does not know whether it succeeded, and retries with the SAME key.',
   '2. INSERT hits the unique constraint.',
   '3. Read the stored response and return it. The customer is charged exactly once.',
   '4. TWO CONCURRENT retries: one INSERT wins, the other blocks or fails. The loser reads the winner result, or returns 409 and the client retries once more. Either is correct; state which you chose.'
  ]],
  ['Refund',[
   '1. Idempotency-Key again — refunds are just as retryable.',
   '2. Validate: sum of existing refunds + this one must not exceed the captured amount.',
   '3. New transaction, REVERSING entries. The original entries stay untouched forever.',
   '4. Call the PSP refund API. Reconcile the result via webhook.'
  ]]
 ],
 deepDive:[
  ['Double-entry, and why the balance is not a column',
   'Every transaction writes at least two entries that sum to zero: debit one account, credit another. The invariant SUM(DR) = SUM(CR) per transaction is checkable by a query, which means corruption is detectable rather than silent.\n\nThe balance is DERIVED — SUM of entries for an account — and cached as a snapshot for speed. That is the whole argument: with a mutable balance column, when a customer says "my balance is wrong", you have nothing to investigate. With entries, you replay them and find the exact transaction that caused it.\n\nCorrections are new REVERSING entries, never updates. "How do you fix a mistake?" is asked in almost every payments interview and "I would update the row" is the wrong answer — it destroys the audit trail that is the reason the system exists.'],
  ['Idempotency, in detail',
   'The client generates a UUID per payment ATTEMPT — not per retry — and sends it as a header. The server inserts it under a unique constraint before doing anything else.\n\nThree subtleties interviewers probe. First, store the RESPONSE, not just the key, so the retry returns the same body rather than a bare 409. Second, hash the request body and compare — a client reusing a key with different content is a bug you should reject loudly, not silently return the old answer to. Third, TTL: keys cannot live forever, and 24 hours is typical; after that a retry becomes a new payment, which is a documented risk.\n\nAnd propagate the same key DOWN to the PSP. Stripe and Adyen both accept one. That way your retry protection and theirs are aligned rather than independent.'],
  ['The states you do not control',
   'The hard part of payments is that the PSP is a separate system and the network between you can fail at any point. Four bad cases:\n\n(a) You called, it succeeded, your process died before recording it. Reconciliation catches this — poll the PSP for every PENDING payment older than N minutes.\n(b) You called, it timed out, you do not know the outcome. Do NOT retry blindly; query by your idempotency key first.\n(c) The webhook arrives twice. Make webhook handling idempotent, keyed on the provider event id.\n(d) The webhook arrives before your own commit finishes. Handle out-of-order: the webhook handler must tolerate a payment it has not seen yet, usually by parking it briefly and retrying.\n\nHaving all four ready is what separates someone who has run a payment system from someone who has read about one.'],
  ['Sagas, because money crosses services',
   'Placing an order touches inventory, payment and fulfilment. Two-phase commit would hold locks across services for the duration of network calls, and its coordinator is a single point of failure — unacceptable for availability.\n\nUse a saga: reserve inventory, charge payment, confirm order, with a compensating action for each step. Compensations are business-level undos — a refund, not a rollback — and they must themselves be idempotent and retryable.\n\nOrder the steps so IRREVERSIBLE actions come last. Sending a confirmation email should be the final step, after everything reversible has already succeeded.']
 ],
 scaling:[
  ['Ledger write volume','Partition by account_id. Entries for one account stay together, which is also what the balance query needs.'],
  ['Balance queries','Snapshot per account per day; sum only the entries since the snapshot. Rebuildable by replay at any time.'],
  ['Idempotency table growth','TTL and archive. It only needs to cover the retry window.'],
  ['Reconciliation over 7 years of data','Run it incrementally over a daily window, never over the full history.'],
  ['Hot account (a marketplace platform account)','Sub-accounts that roll up, or accept contention on that one row and serialise it.'],
  ['Multi-region','Money usually does NOT go active-active. Pin an account to a home region and accept cross-region latency for the rare foreign access. Say this — casually distributing a ledger is a red flag.']
 ],
 tradeoffs:[
  ['Balance','Derived from entries + snapshot','A mutable balance column','Auditability. You can always answer "why is this number what it is".'],
  ['Consistency','Strong within the ledger','Eventual','Money is the canonical exception. Across services, saga with compensations.'],
  ['Distributed txn','Saga','Two-phase commit','2PC holds locks across network calls and its coordinator is a SPOF.'],
  ['Event publishing','Outbox','Publish after commit','The dual-write problem. If the publish fails post-commit, the systems silently diverge.'],
  ['Card data','Tokenised at the edge','Stored by us','Keeps almost your entire estate out of PCI scope. This alone is worth saying.'],
  ['Amount type','Integer minor units','Decimal or float','Floats cannot represent 0.1. Integers in cents remove a whole class of bug.']
 ],
 angle:[
  ['JP MORGAN / AMEX','This is their home turf and the depth will be real. Expect: "walk me through every way a customer could be double-charged", "how do you correct a mistaken transaction" (reversing entry, and if you say UPDATE you are done), "what is your reconciliation process", and multi-region DR with an explicit RPO. Failing to raise idempotency unprompted is close to disqualifying.'],
  ['Amazon','Will come at it through ORDERS — see session 12 — and push on the saga: what happens when payment succeeds but inventory reservation has expired. Also "how do you handle a partial refund with a marketplace fee?", which is really a business-rules question, and saying so is a good answer.'],
  ['Uber','Driver payouts rather than customer charges. Same ledger, different direction, plus scheduled batch payouts and the question of what happens when a payout fails.'],
  ['Microsoft / Adobe','Subscription billing flavour: proration, mid-cycle upgrades, dunning when a card fails. The ledger design is identical; the state machine is richer.']
 ]
};


PLAN.sdSolution[12] = {
 req:{
  functional:[
   'Add items to a cart and place an order.',
   'Reserve inventory so it cannot be sold twice.',
   'Take payment, then confirm and fulfil.',
   'Cancel and refund, including partial cancellation of one line.',
   'Show accurate-enough stock on the product page.'
  ],
  nonFunctional:[
   'NEVER oversell a physical item.',
   'Placing an order must be idempotent — a double-click must not create two orders.',
   'Survive a flash sale where one SKU takes enormous concurrent load.',
   'Order state transitions must be legal and auditable.'
  ]
 },
 estimate:[
  ['Orders','10M/day','≈ 115/sec average.'],
  ['Peak','Prime Day / flash sale','20–50x. Say 5,000 orders/sec, and on ONE SKU possibly 50,000 attempts/sec.'],
  ['The real number','—','That single-SKU figure is the whole design. Aggregate QPS is easy; one contended row is not. Lead with this.'],
  ['Storage','10M orders × 2 KB','20 GB/day of orders, plus the inventory table which is small and extremely hot.']
 ],
 api:[
  ['POST /v1/orders','Idempotency-Key + { cartId, addressId, paymentMethodId }','201 { orderId, status }','Idempotent. A double-click returns the same order.'],
  ['GET /v1/orders/{id}','—','200 { status, lines[], total, timeline[] }','Timeline is derived from the state-transition log.'],
  ['POST /v1/orders/{id}/cancel','Idempotency-Key + { lineIds? }','200','Legal only from certain states. Partial cancel needs line-level status.'],
  ['GET /v1/products/{sku}/availability','—','200 { available, asOf }','Explicitly allowed to be slightly stale. Say so in the contract.'],
  ['Internal: reserve(sku, qty, orderId, ttl)','—','{ reserved: bool }','The atomic operation everything hinges on.']
 ],
 dataModel:[
  ['inventory','sku PK · warehouse_id · available INT · reserved INT · version','The contended row. UPDATE ... WHERE available >= qty is the whole correctness story.'],
  ['reservation','id PK · sku · qty · order_id · expires_at · status','TTL-based. Index on expires_at for the sweeper.'],
  ['order','id PK · customer_id · status · total_minor · currency · idempotency_key UNIQUE · created_at','The unique key gives idempotent placement for free.'],
  ['order_line','id PK · order_id · sku · qty · unit_price_minor · status','Line-level status is what makes partial cancellation possible. Add it now, not later.'],
  ['order_event','id PK · order_id · from_status · to_status · reason · at','Append-only. This is the timeline and the audit trail.'],
  ['Note on price','—','Store unit_price AT ORDER TIME on the line. Never join to the current price — the customer paid what they paid.']
 ],
 arch:[
  '   ┌────────┐     ┌──────────────┐',
  '   │ Client │────▶│  Order API   │  (idempotency key)',
  '   └────────┘     └──────┬───────┘',
  '                         │',
  '                         ▼',
  '              ┌────────────────────────┐',
  '              │   Order orchestrator   │  ← the saga lives here',
  '              │   (state machine)      │',
  '              └───┬────────┬────────┬──┘',
  '     1. reserve   │        │        │  3. confirm',
  '                  ▼        │        ▼',
  '        ┌──────────────┐   │   ┌──────────────┐',
  '        │  Inventory   │   │   │ Fulfilment   │',
  '        │              │   │   └──────────────┘',
  '        │ UPDATE ...   │   │ 2. charge',
  '        │  WHERE       │   ▼',
  '        │  available   │  ┌──────────────┐',
  '        │  >= qty      │  │   Payment    │  (see session 11)',
  '        └──────┬───────┘  └──────────────┘',
  '               │',
  '               │ outbox',
  '               ▼',
  '         ┌──────────┐',
  '         │  Kafka   │──▶ availability projector ──▶ ┌─────────────┐',
  '         └──────────┘    (stale is FINE for         │ Read model  │',
  '                          the product page)         │  (cache)    │',
  '                                                    └─────────────┘',
  '',
  '   ┌────────────────────┐',
  '   │ Reservation sweeper│  every 30s: release expired holds',
  '   └────────────────────┘'
 ],
 flows:[
  ['Place an order — the saga',[
   '1. INSERT order with the idempotency key. Constraint violation means a retry: return the existing order.',
   '2. RESERVE inventory for every line: UPDATE inventory SET available = available - :qty WHERE sku = :sku AND available >= :qty. Require rowsAffected = 1.',
   '3. If any line fails, RELEASE everything already reserved and fail the order cleanly.',
   '4. CHARGE payment, passing the same idempotency key downstream.',
   '5. If payment fails: compensate by releasing the reservations, transition the order to CANCELLED.',
   '6. CONFIRM: reservation becomes a committed decrement, order moves to CONFIRMED.',
   '7. Emit OrderConfirmed via the outbox. Fulfilment, notification and analytics consume it.'
  ]],
  ['Read the product page',[
   '1. Read availability from the CACHED read model, not the inventory table.',
   '2. This is deliberately stale by up to a few seconds. "Only 3 left" being slightly wrong is acceptable; a wrong RESERVATION is not.',
   '3. Separating those two is the mature answer and interviewers listen for it.'
  ]]
 ],
 deepDive:[
  ['The oversell race — the reason this question exists',
   'The wrong version: read available, check it is greater than zero, write available minus one. Two threads both pass the check and you have sold the same item twice.\n\nThe right version is a single conditional statement:\n\n  UPDATE inventory SET available = available - :qty\n   WHERE sku = :sku AND available >= :qty\n\nThen require rowsAffected = 1. One caller succeeds, the other affects zero rows and gets a clean out-of-stock. There is no window between check and decrement because there is no separate check.\n\nIn memory, the same shape is a compareAndSet loop or an AtomicInteger. The point is identical: the check and the decrement must be one operation.'],
  ['The flash sale, which is a different problem',
   'Aggregate QPS is easy. 50,000 attempts per second on ONE ROW is not — that row becomes a serialisation point and everything queues behind its lock.\n\nThree real answers. SHARD THE STOCK: split 1,000 units into 10 buckets of 100 and have each request decrement a random bucket, falling back to scanning buckets when one is empty. Contention drops 10x, at the cost of slightly awkward "is anything left" logic. QUEUE IT: accept requests into a queue and process serially against the row — throughput is capped but nobody is oversold and latency becomes predictable. WAITING ROOM: admit users in batches, which is what ticketing sites do, and is as much a product decision as a technical one.\n\nSay which you would choose and why. There is no universally right answer, and knowing that is the signal.'],
  ['Reservations and the payment-failure window',
   'A reservation is inventory held with a TTL, typically 10–15 minutes. Two mechanisms, and you need both: a background SWEEPER releasing expired holds, and a LAZY check when someone tries to reserve — otherwise an abandoned hold blocks a live sale until the sweeper next runs.\n\nThe question everyone gets asked: what if the hold expires while the customer is on the payment page? You must have a stated policy. Either refuse the payment with a clear message, or extend the hold once when payment begins. Silently taking payment for released stock is the failure that actually ships to production, and saying that out loud demonstrates you have thought past the happy path.'],
  ['Multi-warehouse allocation',
   'Do NOT sum stock across three warehouses and then decrement one — that is the same race with extra steps.\n\nTwo correct shapes. One LOGICAL counter for the SKU, with warehouse allocation decided after the reservation succeeds. Or PER-WAREHOUSE reservation where the request names the warehouse, chosen by proximity before the atomic decrement.\n\nThe first is simpler and usually right for a customer-facing flow; the second matters when shipping cost or delivery promise depends on which warehouse serves it.']
 ],
 scaling:[
  ['One contended SKU row','Bucket the stock, or serialise through a queue. This bites long before anything else.'],
  ['Order write volume','Shard orders by customer_id. Orders are never queried across customers on the hot path.'],
  ['Product page reads','Cached read model fed by the event stream. Never read the inventory table for display.'],
  ['Reservation sweeper','Index on expires_at, process in batches, and keep the lazy check so the sweeper is not on the critical path.'],
  ['Order history queries','Separate read model. Do not run reporting queries against the transactional store.'],
  ['Peak traffic','Autoscale the stateless order API. The inventory row does not autoscale — that is the real ceiling and you should say so.']
 ],
 tradeoffs:[
  ['Concurrency control','Atomic conditional UPDATE','Read-then-write, or a lock','No window, no lock held across a network call. The correct default.'],
  ['Display availability','Eventually consistent read model','Read the live table','Protects the hot row and is honest about what "only 3 left" means.'],
  ['Reservation expiry','Lazy check + sweeper','Sweeper alone','A sweeper alone leaves a window where a dead hold blocks a real sale.'],
  ['Cross-service consistency','Saga with compensations','2PC','Availability, and no locks held across service calls.'],
  ['Order status','Explicit state machine','A status string','Illegal transitions become impossible. "Can a DELIVERED order be cancelled?" is asked constantly — the answer is that it becomes a RETURN, a different flow.'],
  ['Line-level status','Yes, from the start','Order-level only','Partial cancellation and partial shipment are always the follow-up. Retrofitting this is painful.']
 ],
 angle:[
  ['AMAZON','Their own domain, so expect precision. Guaranteed: "two customers buy the last item at the same instant — walk me through exactly what happens." Then the flash sale. Then "is eventual consistency ever OK for inventory?" — the answer is yes for display, never for reservation, and that distinction IS the question. Also expect the state machine probe about cancelling a delivered order.'],
  ['Flipkart / Expedia','Same machine, different nouns — seats, rooms, slots. Expedia will push on the hold TTL and what happens when a hotel changes availability underneath you.'],
  ['Uber','Closest analogue is surge capacity and driver allocation rather than stock, but the atomic-assignment argument transfers directly.'],
  ['JPM / Amex','Less likely to ask this design, but if they do they will focus on the money half: the saga, the compensations, and what happens when the refund itself fails.']
 ]
};



PLAN.sdSolution[9] = {
 req:{
  functional:[
   'Post content, and see a feed of posts from accounts you follow.',
   'Follow and unfollow.',
   'Paginate backwards through the feed.',
   'Ranked or chronological — confirm which, it changes the read path completely.'
  ],
  nonFunctional:[
   'Feed load under 200ms at p99. Nobody waits for a timeline.',
   'Read-heavy, roughly 100:1.',
   'Eventual consistency is fine — a post appearing a few seconds late is acceptable.',
   'Must survive an account with 100 million followers.'
  ]
 },
 estimate:[
  ['Users','300M DAU, 2 posts/day','600M posts/day ≈ 7,000 writes/sec.'],
  ['Reads','300M × 10 refreshes/day','3B reads/day ≈ 35,000 QPS, peak maybe 100,000.'],
  ['Fan-out on write','7,000 × 200 avg followers','1.4M feed-row writes/sec. THIS is the number that decides the design.'],
  ['Celebrity','one post, 100M followers','100M writes for a single action. Pure fan-out-on-write is impossible here — say so before they ask.'],
  ['Feed storage','300M users × 500 ids × 8 bytes','~1.2 TB in Redis if you cap feeds. Cap them; nobody scrolls 10,000 posts.']
 ],
 api:[
  ['POST /v1/posts','{ text, mediaIds[] }','201 { postId, createdAt }','Write once. Fan-out happens async.'],
  ['GET /v1/feed?cursor=&limit=20','—','200 { items[], nextCursor }','CURSOR, not offset. A feed is prepended constantly.'],
  ['POST /v1/follow','{ targetUserId }','204','Triggers an async backfill of that user recent posts.'],
  ['DELETE /v1/follow/{id}','—','204','Lazy removal — filter at read rather than rewriting every feed.'],
  ['GET /v1/users/{id}/posts','—','200 { items[], nextCursor }','The profile timeline. Simple, always a pull.']
 ],
 dataModel:[
  ['post','id (snowflake, time-sortable) PK · author_id · text · media[] · created_at','A time-sortable id means the feed sorts without a secondary index.'],
  ['follow','follower_id + followee_id PK · created_at','Two indexes: by follower (who do I follow) and by followee (fan-out audience).'],
  ['user_flags','user_id PK · follower_count · is_celebrity','is_celebrity is derived from follower_count crossing a threshold. It is the switch between push and pull.'],
  ['feed (Redis)','LIST or ZSET per user, capped at ~500 post IDs','IDs ONLY, never post bodies. Hydrated on read.'],
  ['post_cache (Redis)','post_id → serialized post','What hydration reads. One copy, so edits and deletes work.']
 ],
 arch:[
  '   write path',
  '   ┌────────┐   ┌──────────────┐   ┌───────────┐',
  '   │ Client │──▶│  Post service│──▶│ post store│',
  '   └────────┘   └──────┬───────┘   └───────────┘',
  '                       │ outbox',
  '                       ▼',
  '                 ┌──────────┐',
  '                 │  Kafka   │',
  '                 └────┬─────┘',
  '                      ▼',
  '            ┌─────────────────────┐',
  '            │  Fan-out workers    │',
  '            │  is_celebrity ?     │',
  '            └──────┬───────┬──────┘',
  '           no      │       │   yes',
  '        ┌──────────┘       └──────────┐',
  '        ▼                             ▼',
  '  ┌──────────────┐             ┌──────────────┐',
  '  │ push id into │             │ DO NOTHING   │  ◄── the celebrity answer',
  '  │ each follower│             │ (pull later) │',
  '  │ feed (Redis) │             └──────────────┘',
  '  └──────────────┘',
  '',
  '   read path',
  '   ┌────────┐   ┌────────────────────────────────────┐',
  '   │ Client │──▶│         Feed service               │',
  '   └────────┘   │  1. read precomputed feed (Redis)  │',
  '                │  2. pull recent posts from the few │',
  '                │     celebrities this user follows  │',
  '                │  3. merge by time, take top N      │',
  '                │  4. hydrate ids from post_cache    │',
  '                │  5. filter deleted / blocked       │',
  '                └────────────────────────────────────┘'
 ],
 flows:[
  ['Post — the write path',[
   '1. Write the post row with a snowflake id. Return immediately.',
   '2. Emit PostCreated via the outbox.',
   '3. Fan-out worker reads the author follower count.',
   '4. NOT a celebrity: push the post id onto each follower feed list, trimming to 500.',
   '5. IS a celebrity: do nothing. Their posts are pulled at read time.',
   '6. Prioritise ACTIVE followers. Someone who has not opened the app in a month does not need their feed updated in the next second — backfill them lazily on their next read.'
  ]],
  ['Read — the feed',[
   '1. Read the precomputed feed list from Redis (ids only).',
   '2. Fetch recent posts from the handful of celebrities this user follows — usually a few, never thousands.',
   '3. Merge both by timestamp, take the top N.',
   '4. Hydrate ids from the post cache in one batch call.',
   '5. Filter at read: deleted posts, blocked authors, unfollowed-since. This is why you store IDs, not copies.',
   '6. Return with a cursor of (timestamp, post_id).'
  ]]
 ],
 deepDive:[
  ['The celebrity problem, which is the whole question',
   'Pure fan-out on WRITE gives instant reads and dies on a 100M-follower account: one post becomes 100 million writes, the queue backs up for hours, and everyone else feed is delayed behind it.\n\nPure fan-out on READ is the mirror: writes are free, but a user following 2,000 accounts triggers 2,000 queries per refresh at 100k QPS.\n\nHYBRID is what every real system does. Push for normal accounts, pull for celebrities, merge at read. The threshold is a tunable — say 10,000 followers — and stating that it is tunable rather than a constant is part of the answer.\n\nThe merge is cheap because a user follows very few celebrities. Fetching 5 celebrity timelines and merging with a precomputed list is a small, bounded operation.'],
  ['Why the feed stores IDs and not posts',
   'Storing whole posts in every follower feed is enormous duplication — one post copied 200 times on average — and it makes edits and deletes impossible, because you would have to find and rewrite 200 million rows.\n\nWith IDs, deletion is a read-time filter: hydrate, find the post is gone, drop it. Edits are automatic because there is one copy. The cost is a hydration round trip, which is a single batched cache read.\n\nCap the feed at ~500 ids. Nobody scrolls past that, and older content falls back to a pull query against the accounts you follow.'],
  ['Cursor pagination, and why offset breaks',
   'A feed is prepended constantly. With OFFSET, by the time the user asks for page 2, five new posts have arrived and shifted everything — so page 2 repeats items from page 1 and skips others. Users see duplicates and gaps.\n\nA cursor of (created_at, post_id) is stable: "give me items strictly older than this exact point". New posts arriving above do not affect it. The post_id tiebreaker matters because two posts can share a timestamp.'],
  ['Ranking, without wrecking the latency budget',
   'If the feed is ranked rather than chronological, do NOT rank at retrieval. Retrieve a cheap candidate set — the precomputed feed plus celebrity pulls, a few hundred items — then score only those with a model at request time.\n\nRanking the whole corpus per request is the mistake. Candidate generation then re-ranking is the standard two-stage shape, and naming it that way signals you have seen a real ranking system.']
 ],
 scaling:[
  ['Fan-out worker throughput','Partition Kafka by author_id, scale consumers. Prioritise active followers; backfill inactive ones lazily.'],
  ['Redis feed storage','Shard by user_id. Feeds are per-user and never queried across users, so this shards perfectly.'],
  ['Hydration read volume','Batch the id → post lookups. One MGET, not N gets.'],
  ['A viral post','Hot key in the post cache. Replicate it, or serve from a local in-process cache with a short TTL.'],
  ['New user with an empty feed','Backfill asynchronously from the accounts they just followed; serve a pull-based feed until it completes.'],
  ['Follower-count skew','The is_celebrity flag IS the mitigation. Recompute it on a schedule, not per post.']
 ],
 tradeoffs:[
  ['Fan-out','Hybrid','Pure write, or pure read','Write dies on celebrities; read dies on users who follow thousands. Hybrid costs you a merge step.'],
  ['Feed contents','Post IDs','Full posts','Deletes and edits become possible, and storage drops by ~200x. Costs a hydration round trip.'],
  ['Pagination','Cursor','Offset','A prepended feed makes offset show duplicates and skip items.'],
  ['Consistency','Eventual','Strong','A post appearing two seconds late is invisible to users. Strong consistency here would cost enormously for no benefit.'],
  ['Feed length','Capped at ~500','Unbounded','Nobody scrolls further, and the cap bounds memory. Older content falls back to a pull.']
 ],
 angle:[
  ['Amazon','Will ask the celebrity question directly and expect you to raise it unprompted. Then "what happens when the fan-out workers fall behind?" — the answer is prioritise active users, backfill the rest. Also expect deletion: "you deleted a post already in 200M feeds."'],
  ['Microsoft / Adobe','More likely to focus on the pagination correctness and the data model. Be ready to draw why offset produces duplicates.'],
  ['Uber','Will push on the latency budget and on the ranking split — candidate generation versus scoring — and on what you cache where.'],
  ['Meta-style','If asked, expect much deeper ranking discussion. For your ladder, the hybrid fan-out plus cursor pagination is the depth that matters.']
 ]
};


PLAN.sdSolution[10] = {
 req:{
  functional:[
   'One-to-one and group messaging.',
   'Delivery states: sent, delivered, read.',
   'Message history, retrievable on a new device.',
   'Online / last-seen presence.',
   'Deliver to a recipient who is currently offline.'
  ],
  nonFunctional:[
   'Message delivery under 500ms when both parties are online.',
   'Ordered per conversation. Global ordering is neither needed nor achievable.',
   'No message ever silently lost.',
   'Millions of concurrent persistent connections.'
  ]
 },
 estimate:[
  ['Users','50M DAU, 40 messages/day','2B messages/day ≈ 23,000 writes/sec.'],
  ['Connections','10M concurrent WebSockets','At ~10k connections per gateway node that is ~1,000 nodes. Connections, not messages, are the real cost.'],
  ['Storage','2B × 300 bytes','~600 GB/day. Retention policy is a product decision worth asking about.'],
  ['Fan-out','a 1,000-member group','One write, 1,000 deliveries. Groups are a feed problem in miniature.']
 ],
 api:[
  ['WS connect','auth token','—','Registers (user, device) → gateway node in the connection registry.'],
  ['WS send','{ convId, clientMsgId, body }','ack { serverMsgId, seq }','clientMsgId makes send idempotent across reconnects.'],
  ['WS receive','—','{ convId, seq, from, body, sentAt }','Pushed by the server.'],
  ['POST /v1/conversations/{id}/read','{ upToSeq }','204','Read receipts are just another message type.'],
  ['GET /v1/conversations/{id}/messages?before=seq','—','200 { items[], prevCursor }','History fetch on a new device or a scroll-back.']
 ],
 dataModel:[
  ['conversation','id PK · type (dm/group) · created_at','A DM is a group of two. Modelling them the same avoids two code paths.'],
  ['participant','conv_id + user_id PK · joined_at · last_read_seq','last_read_seq is what powers unread counts and read receipts.'],
  ['message','conv_id + seq PK · sender_id · body · created_at','PARTITION BY conv_id, CLUSTER BY seq. A wide-column store is the natural fit — append-heavy with range reads inside one partition.'],
  ['conv_seq','conv_id PK · last_seq','Atomic increment gives a per-conversation monotonic sequence. Do NOT use wall-clock time for ordering.'],
  ['connection registry (Redis)','user:device → gateway_node, TTL','Refreshed by heartbeat. Expiry means offline.'],
  ['offline_queue','user_id + device_id → pending message ids','Drained on reconnect. Per DEVICE, not per user.']
 ],
 arch:[
  '   ┌──────────┐                              ┌──────────┐',
  '   │ Device A │                              │ Device B │',
  '   └────┬─────┘                              └────▲─────┘',
  '        │ WebSocket                               │ WebSocket',
  '        ▼                                         │',
  '   ┌─────────────┐                          ┌─────┴───────┐',
  '   │ Gateway N1  │                          │ Gateway N3  │',
  '   └──────┬──────┘                          └─────▲───────┘',
  '          │  2. lookup B in registry              │',
  '          │  ┌──────────────────────┐             │',
  '          ├─▶│ Connection registry  │             │',
  '          │  │ user:dev → node, TTL │             │',
  '          │  └──────────────────────┘             │',
  '          │  3. forward to N3 ────────────────────┘',
  '          │',
  '          │  1. persist FIRST',
  '          ▼',
  '   ┌──────────────┐      ┌───────────────────┐',
  '   │ Message svc  │─────▶│ conv_seq (atomic) │',
  '   └──────┬───────┘      └───────────────────┘',
  '          ▼',
  '   ┌──────────────────────────┐     ┌──────────────────┐',
  '   │ Wide-column store        │     │  Offline queue   │',
  '   │ part: conv_id  clus: seq │     │  (B not present) │',
  '   └──────────────────────────┘     └──────────────────┘'
 ],
 flows:[
  ['A sends to B, both online',[
   '1. A sends over its WebSocket with a clientMsgId.',
   '2. Gateway N1 calls the message service.',
   '3. Atomically increment conv_seq to get the next sequence number.',
   '4. PERSIST the message. Only then acknowledge to A — an ack before persistence is a lie.',
   '5. Look up B in the connection registry: found on gateway N3.',
   '6. Forward to N3 over an internal RPC; N3 pushes down B socket.',
   '7. B device sends a delivered receipt, which is itself a message.'
  ]],
  ['B is offline',[
   '1. Registry lookup misses, or the TTL has expired.',
   '2. Write the message id into B offline queue, per device.',
   '3. Optionally trigger a mobile push notification.',
   '4. On reconnect, B sends its last-seen seq; the server streams everything after it, in order.',
   '5. B dedups on serverMsgId in case of overlap.'
  ]],
  ['A group of 1,000',[
   '1. ONE message row, in the conversation partition. Never 1,000 copies of the body.',
   '2. Per-participant delivery state, which is cheap.',
   '3. Deliver to the members currently connected; queue for the rest.',
   '4. For very large groups, stop pushing entirely and let clients pull on open — the same hybrid argument as a news feed.'
  ]]
 ],
 deepDive:[
  ['Cross-node delivery, which is the actual question',
   'A is on gateway 1, B is on gateway 3. Neither node knows about the other connection. This is the problem the design exists to solve.\n\nThe answer is a CONNECTION REGISTRY: a Redis map from (user, device) to gateway node, written on connect, refreshed by heartbeat, expiring on disconnect. Sending means looking up the recipient node and forwarding over an internal RPC or a per-node pub/sub channel.\n\nThe naive alternative — broadcast every message to every gateway and let the right one deliver it — works at ten nodes and collapses at a thousand, because every node processes every message. Say why you rejected it.'],
  ['Ordering, and why timestamps are wrong',
   'Ordering matters PER CONVERSATION, not globally. Nobody cares whether your message to Alice preceded someone else message to Bob.\n\nUse a per-conversation monotonic SEQUENCE from an atomic increment. Wall-clock timestamps fail because gateway clocks drift by milliseconds and two messages can share one — you then have no deterministic order and different devices render the conversation differently.\n\nThe client buffers on a gap: if it holds seq 5 and 7, it waits briefly for 6 before rendering. That is what makes out-of-order network delivery invisible.'],
  ['Multi-device, which people forget',
   'A user has a phone, a laptop and a tablet. The registry key must be (user, DEVICE), not user — otherwise you deliver to one device and the others never see it.\n\nEach device tracks its own last-read sequence, so history sync on a new device is "give me everything after seq 0" and reconnect is "give me everything after seq N". Same mechanism, different starting point.\n\nRead receipts get interesting: if you read on your phone, is it read on your laptop? That is a product decision. Say so rather than assuming.'],
  ['Presence, the classic scaling trap',
   'Naive presence is a write per user per state change broadcast to every contact. At 50M users that is catastrophic and buys almost nothing.\n\nDo it with heartbeats: the client pings every ~30 seconds, the registry entry carries a TTL, and absence of a heartbeat means offline. Push presence changes ONLY to users currently viewing that contact, not to everyone who has ever messaged them.\n\nAnd accept staleness: last seen being 30 seconds out of date is invisible. Real-time global presence is the trap.']
 ],
 scaling:[
  ['Connection count','Horizontal gateway nodes, ~10k connections each. This is the dominant cost, not message volume.'],
  ['A gateway dying with 10k connections','Clients reconnect with jittered backoff — without jitter you get a thundering herd. The offline queue covers the gap.'],
  ['Message store writes','Wide-column, partitioned by conv_id. Append-heavy with range reads is the ideal LSM workload.'],
  ['Very large groups','Stop pushing past a threshold and let clients pull on open.'],
  ['Registry load','Shard by user id; it is a simple KV workload with TTLs.'],
  ['History reads','Bounded by partition and cursor. Never scan a conversation from the beginning.']
 ],
 tradeoffs:[
  ['Transport','WebSocket','Long polling','Bidirectional and low latency. Mention long polling as the fallback for hostile networks.'],
  ['Store','Wide-column','Relational','Partition by conversation, cluster by sequence. Append-heavy with in-partition range reads.'],
  ['Routing','Registry + direct forward','Broadcast to all gateways','Broadcast makes every node process every message.'],
  ['Ordering','Per-conversation sequence','Server timestamp','Clock skew across gateways gives no deterministic order.'],
  ['Presence','Heartbeat + TTL, scoped push','Real-time global broadcast','Global presence is enormously expensive for a feature nobody checks precisely.'],
  ['E2E encryption','Ask whether it is in scope','Assume it','It removes server-side search, spam filtering, and makes multi-device sync a key-management problem. Naming that trade-off is the point.']
 ],
 angle:[
  ['Amazon','"User A is on one server, user B on another — how does the message get there?" is close to guaranteed. Then the offline case, then multi-device.'],
  ['Microsoft','Teams-flavoured: large groups, threading, and history sync across devices. Expect a push on the group fan-out threshold.'],
  ['Uber','Rider–driver chat is bounded and short-lived, so they will care about connection lifecycle and what happens when a driver loses signal in a tunnel.'],
  ['Adobe','Less likely. If asked, expect focus on the data model and the ordering guarantee.']
 ]
};


PLAN.sdSolution[14] = {
 req:{
  functional:[
   'Rider requests a ride from A to B.',
   'Match a nearby available driver.',
   'Driver accepts or declines; on decline or timeout, offer the next.',
   'Track the trip through its lifecycle and price it.',
   'Drivers report location continuously.'
  ],
  nonFunctional:[
   'Matching within a few seconds.',
   'Two riders must NEVER be matched to the same driver.',
   'Handle enormous location write volume.',
   'Degrade sensibly when a whole city loses connectivity.'
  ]
 },
 estimate:[
  ['Active drivers','1M, reporting every 4 seconds','250,000 location writes/sec. THIS is the number that shapes the design.'],
  ['Ride requests','20M rides/day','≈ 230/sec average, several thousand at peak in a dense city.'],
  ['Nearby query','per request, ~2km radius','Must not scan 1M drivers. Geo index, always.'],
  ['Location durability','—','Do NOT persist every ping. It is high-churn, low-value, disposable data. Saying that early is a strong signal.']
 ],
 api:[
  ['POST /v1/rides','Idempotency-Key + { pickup, dropoff }','201 { rideId, status: SEARCHING }','Returns immediately; matching is async.'],
  ['GET /v1/rides/{id}','—','200 { status, driver?, eta? }','Client polls or holds a socket.'],
  ['POST /v1/drivers/location','{ lat, lng, heading }','204','Fire and forget. Never blocks on durability.'],
  ['POST /v1/offers/{id}/accept','—','200 { rideId }','Atomic. Exactly one driver can win an offer.'],
  ['POST /v1/offers/{id}/decline','—','204','Returns the driver to the pool and offers the next candidate.']
 ],
 dataModel:[
  ['driver_state (Redis)','driver_id → { status, cellId, lat, lng, updatedAt } TTL ~60s','In memory, TTL-expiring. A driver who stops reporting simply vanishes from matching, which is correct.'],
  ['geo_index (Redis)','cellId → SET of driver_ids','H3 or a grid cell. Query own cell plus neighbours, never a scan.'],
  ['ride','id PK · rider_id · driver_id NULL · status · pickup · dropoff · fare_minor · created_at','The durable record. Partition by ride id or city.'],
  ['offer','id PK · ride_id · driver_id · expires_at · status','Short-lived. The offer loop lives here.'],
  ['trip_event','ride_id + seq · type · at · location','Append-only lifecycle log. This is the audit trail and the source of disputes.'],
  ['Sampled location history','ride_id + ts → point, every ~5s during a trip','For the route map and disputes. A tiny fraction of the raw ping volume.']
 ],
 arch:[
  '   ┌────────┐                        ┌─────────┐',
  '   │ Rider  │                        │ Driver  │',
  '   └───┬────┘                        └────┬────┘',
  '       │ request                          │ location every 4s',
  '       ▼                                  ▼',
  '  ┌─────────────────┐            ┌────────────────────┐',
  '  │  Ride service   │            │ Location ingest    │',
  '  └────────┬────────┘            │ (fire and forget)  │',
  '           │                     └─────────┬──────────┘',
  '           │ 1. find candidates             │',
  '           ▼                                ▼',
  '  ┌──────────────────────────────────────────────────┐',
  '  │      Geo index  (Redis, H3 cells)                │',
  '  │      cell → {drivers}    driver → {status,pos}   │',
  '  │      TTL ~60s: stale drivers disappear           │',
  '  └────────────────────┬─────────────────────────────┘',
  '                       │ 2. nearest suitable',
  '                       ▼',
  '           ┌────────────────────────┐',
  '           │   Matching / offer     │',
  '           │   CAS driver status:   │  ◄── the correctness core',
  '           │   AVAILABLE → OFFERED  │',
  '           └───────┬────────────────┘',
  '            accept │        │ decline / 15s timeout',
  '                   ▼        └──────▶ next candidate',
  '           ┌────────────────┐',
  '           │  Trip service  │──▶ trip_event log ──▶ Kafka ──▶ pricing,',
  '           └────────────────┘                              analytics, payouts'
 ],
 flows:[
  ['Request a ride',[
   '1. POST /rides with an idempotency key. Persist the ride as SEARCHING, return immediately.',
   '2. Matching service queries the geo index: the pickup cell plus its neighbours.',
   '3. Filter to AVAILABLE drivers, rank by ETA (not straight-line distance — a river changes the answer).',
   '4. Take the top candidate and compareAndSet their status AVAILABLE → OFFERED. If it fails, someone else won: take the next.',
   '5. Push the offer to the driver with a 15-second expiry.',
   '6. Accept: CAS OFFERED → ON_TRIP, assign to the ride, notify the rider.',
   '7. Decline or timeout: CAS OFFERED → AVAILABLE and offer the next candidate. Track decline rate.',
   '8. Radius exhausted: widen it, then eventually tell the rider no cars are available.'
  ]],
  ['Location updates — the high-volume path',[
   '1. Driver posts location every 4 seconds.',
   '2. Ingest updates the in-memory driver record and moves them between geo cells if needed.',
   '3. Refresh the TTL. No durable write on this path at all.',
   '4. During an active trip only, sample every ~5 seconds into durable storage for the route map.'
  ]]
 ],
 deepDive:[
  ['Geo indexing, and why H3',
   'A bounding-box SQL query scans a million rows per request. Unusable.\n\nBucket drivers into CELLS and query the pickup cell plus its neighbours. Four options: GEOHASH is simple, string-prefix based, and has awkward boundary behaviour where adjacent cells share no prefix. QUADTREE adapts to density, which matters when a city centre is a thousand times denser than the suburbs. S2 uses Hilbert-curve ordering on a sphere. H3 is Uber own hexagonal grid.\n\nHexagons matter because all six neighbours are EQUIDISTANT. With squares you have four edge neighbours and four diagonal ones at 1.41x the distance, so "adjacent" is ambiguous and radius queries are lopsided. Naming H3 and that reason in an Uber interview is exactly the expected answer.\n\nAlways query neighbours too: the nearest driver is frequently just over a cell boundary.'],
  ['The double-assignment race',
   'Two riders request simultaneously and the same driver is nearest to both. If both offers go out, one driver gets two rides.\n\nThe fix is an atomic state transition on the DRIVER: compareAndSet AVAILABLE → OFFERED. Exactly one caller wins; the loser moves to the next candidate. In a database this is UPDATE driver SET status = OFFERED WHERE id = ? AND status = AVAILABLE, checking rows-affected.\n\nThis is the correctness core of the whole design. Raise it before being asked.'],
  ['Matching is an offer LOOP, not a decision',
   'The common mistake is modelling matching as one decision: find the nearest driver, assign, done. Real systems offer, wait, and move on.\n\nOffer with a timeout (~15s). On decline or expiry, return the driver to the pool and offer the next. Track decline rates, because a driver declining everything is a product problem.\n\nThe optimisation worth naming: BATCH matching. Instead of greedily matching each request as it arrives, collect requests over a few seconds and solve the assignment across the batch. It produces measurably better global matches than greedy — a rider slightly further away may free a driver who is much better for someone else.'],
  ['Location volume, and what you refuse to store',
   '250,000 writes per second of location data. The instinct to put it in the primary database is the failure.\n\nLocation is high-churn, low-value and disposable. It lives in memory with a TTL. A driver who stops reporting simply expires out of the index, which is exactly the behaviour you want — no separate liveness check needed.\n\nIf you need history, SAMPLE it: every fifth ping during an active trip, written asynchronously. That is a tiny fraction of the raw volume and it is enough for the route map and for disputes.\n\nAnd when a city loses connectivity, TTLs expire and drivers vanish from the index. That is correct, but riders then see no availability — so you need a degraded-mode message rather than an infinite spinner. Mentioning that unprompted lands well.']
 ],
 scaling:[
  ['250k location writes/sec','In-memory geo store, sharded by cell. No durable write on the hot path.'],
  ['Matching throughput','Shard by city or region. Matching is inherently local — a London request never touches Manchester data.'],
  ['Hot cell (a stadium emptying)','Cell subdivision, or cap candidates per query and rank a sample.'],
  ['Ride store','Partition by city and time. Historical rides are cold and can move to cheaper storage.'],
  ['Surge computation','Supply/demand ratio per cell on a rolling window, computed by a stream job, SMOOTHED — instant surge changes flap and riders revolt.'],
  ['Multi-region','Naturally partitioned by geography. This is one of the few designs where multi-region is easy — say so.']
 ],
 tradeoffs:[
  ['Geo index','H3 hexagons','Geohash, quadtree, S2','Uniform neighbour distance and no diagonal ambiguity. Geohash is acceptable if you name the boundary problem.'],
  ['Location storage','In-memory, TTL','Durable per ping','Disposable data. Durability here buys nothing and costs enormously.'],
  ['Matching','Offer loop with timeout','Single assignment','Drivers decline. A single assignment cannot model that.'],
  ['Ranking','ETA','Straight-line distance','A river or a motorway makes straight-line distance wrong. ETA needs the road graph.'],
  ['Optimisation','Batch matching','Greedy per request','Better global assignment. Costs a few seconds of added latency — a real trade-off worth stating.'],
  ['Driver assignment','CAS on driver status','Lock the driver row','Same guarantee, no lock held across a network call to the driver app.']
 ],
 angle:[
  ['UBER','Their own domain and they will go deep. Guaranteed: "how do you find nearby drivers without scanning" (H3, and say why hexagons), "two riders, one driver" (CAS), and "the driver does not respond" (offer loop with timeout). Batch matching as the optimisation is a strong extra. Expect surge and the smoothing question.'],
  ['Amazon','Delivery-partner assignment is the same machine — orders instead of riders, agents instead of drivers, plus CAPACITY: one agent carrying several orders turns matching into batching with constraints.'],
  ['Flipkart / Swiggy','Food delivery flavour. Adds pickup-time prediction and multi-order batching, which is the genuinely harder variant.'],
  ['Google','Unlikely to ask this as system design at L4. If it comes up it will be the geo-indexing algorithm rather than the architecture.']
 ]
};



PLAN.sdSolution[13] = {
 req:{
  functional:[
   'Search products or content by free text, with relevance ranking.',
   'Typeahead suggestions as the user types.',
   'Filters and facets — category, price, rating.',
   'Send notifications across email, push and SMS.',
   'Per-user notification preferences and quiet hours.'
  ],
  nonFunctional:[
   'Typeahead under 100ms or it feels broken — this is the hardest constraint here.',
   'Search under 300ms including ranking.',
   'Index freshness of minutes is acceptable; instant is not required.',
   'Notification delivery is at-least-once, so consumers must be idempotent.'
  ]
 },
 estimate:[
  ['Searches','10M/day','≈ 115/sec average, maybe 500 peak. Modest.'],
  ['Typeahead','10M searches × ~20 keystrokes','200M requests/day ≈ 2,300/sec average. 20x the search volume — debouncing on the client is not optional.'],
  ['Catalogue','50M products','Index maybe 200 GB. Fits comfortably on a small Elasticsearch cluster.'],
  ['Notifications','50M users × 2/day','100M/day ≈ 1,200/sec, spiky around campaigns.'],
  ['The conclusion','—','Typeahead volume dominates everything. Design the read path for it first and the rest follows.']
 ],
 api:[
  ['GET /v1/search?q=&filters=&cursor=','—','200 { items[], facets{}, nextCursor }','Cursor pagination; search results shift as the index updates.'],
  ['GET /v1/suggest?q=','—','200 { suggestions[] }','Must be under 100ms. No ranking at request time.'],
  ['POST /v1/notifications','{ userId, category, templateId, payload, priority }','202 { notificationId }','202 — accepted, not delivered. Be honest in the contract.'],
  ['GET /v1/preferences','—','200 { perCategory{}, quietHours, channels[] }','Read by the pre-send pipeline.'],
  ['PUT /v1/preferences','{ ... }','204','Unsubscribe path. A notification system without one is a product bug.']
 ],
 dataModel:[
  ['product (source of truth)','id PK · title · description · category · price · rating · updated_at','Relational. The index is DERIVED from this and will drift — plan the rebuild.'],
  ['search index (Elasticsearch)','inverted index: term → doc ids, plus stored fields for facets','Not a system of record. Rebuildable from the product table.'],
  ['suggest trie (in memory)','prefix node → precomputed top-k completions','The top-k is PRECOMPUTED. That is what buys the 100ms.'],
  ['notification','id PK · user_id · category · channel · status · dedupe_key · created_at','dedupe_key UNIQUE gives idempotent delivery.'],
  ['user_preferences','user_id PK · category → channels[] · quiet_hours · global_cap','Cached in-process; never a network read per notification.'],
  ['delivery_attempt','notification_id + attempt · channel · result · at','Append-only. Answers "did they actually get it?"']
 ],
 arch:[
  '   SEARCH',
  '   ┌────────┐   ┌───────────────┐   ┌──────────────────┐',
  '   │ Client │──▶│ Search service│──▶│  Elasticsearch   │',
  '   └───┬────┘   └───────────────┘   └────────▲─────────┘',
  '       │                                     │ near-real-time',
  '       │ /suggest (debounced 150ms)          │ indexer',
  '       ▼                                     │',
  '   ┌────────────────────┐            ┌───────┴────────┐',
  '   │ Suggest service    │            │  Kafka (CDC)   │',
  '   │ in-memory trie,    │            └───────▲────────┘',
  '   │ top-k PRECOMPUTED  │                    │',
  '   └────────────────────┘            ┌───────┴────────┐',
  '            ▲                        │ product store  │ ◄── source of truth',
  '            │ rebuilt every few min  └────────────────┘',
  '   ┌────────┴─────────┐',
  '   │  Batch trie build│',
  '   └──────────────────┘',
  '',
  '   NOTIFICATIONS',
  '   ┌────────────┐   ┌────────────────────────────────┐',
  '   │  Producer  │──▶│  Pre-send pipeline (chain)     │',
  '   └────────────┘   │  opt-out → quiet hours →       │',
  '                    │  rate limit → dedup            │',
  '                    └───────────────┬────────────────┘',
  '                                    ▼',
  '              ┌─────────────────────────────────────────┐',
  '              │  SEPARATE queue + pool PER CHANNEL       │ ◄── bulkhead',
  '              │  ┌────────┐ ┌────────┐ ┌──────────────┐ │',
  '              │  │ email  │ │  push  │ │     sms      │ │',
  '              │  └───┬────┘ └───┬────┘ └──────┬───────┘ │',
  '              └──────┼──────────┼─────────────┼─────────┘',
  '                     ▼          ▼             ▼',
  '                  provider   provider      provider',
  '                     │          │             │  failure',
  '                     └──────────┴─────────────┴────▶ DLQ'
 ],
 flows:[
  ['Typeahead — the 100ms path',[
   '1. Client DEBOUNCES ~150ms of no typing before firing. This alone removes most of the 2,300/sec.',
   '2. Request hits the edge cache — common prefixes repeat enormously across users.',
   '3. On miss, the suggest service walks the in-memory trie to the prefix node.',
   '4. Return the PRECOMPUTED top-k stored on that node. No ranking, no scoring, no database.',
   '5. Personalisation, if any, re-ranks only those ~20 results — never the retrieval.'
  ]],
  ['Search',[
   '1. Parse the query, apply filters as Elasticsearch filter clauses (cacheable, not scored).',
   '2. Retrieve a candidate set with BM25 relevance.',
   '3. Re-rank the top ~100 with business signals — popularity, margin, availability.',
   '4. Compute facet counts from the same query.',
   '5. Return with a cursor.'
  ]],
  ['Send a notification',[
   '1. Producer posts; return 202 immediately.',
   '2. Pre-send chain: opted out? in quiet hours (unless CRITICAL)? over the rate limit? a duplicate within the aggregation window?',
   '3. Any filter rejecting means SUPPRESSED, with the reason recorded — suppression is not failure and should be visible.',
   '4. Enqueue onto the channel-specific queue.',
   '5. Worker sends via the provider with a dedupe key.',
   '6. Retry with backoff on transient failure; DLQ after N attempts.'
  ]]
 ],
 deepDive:[
  ['How typeahead stays under 100ms',
   'The rule is that NO ranking happens at request time. A trie node stores its top-k completions already sorted, computed by a batch job from search logs and product popularity. A lookup is O(length of prefix) plus reading a small precomputed list.\n\nThe cost is freshness: a newly trending term does not suggest until the next rebuild. Say the number — "suggestions lag reality by about five minutes". If that is unacceptable, maintain a small real-time overlay index merged at query time, and be explicit that you are adding complexity to buy freshness.\n\nMemory is fine: a few million prefixes with top-10 each fits in a couple of GB, and the whole structure is read-only between rebuilds so it needs no locking.'],
  ['The index is derived, and it WILL drift',
   'Elasticsearch is not a system of record. The product table is. The index is fed by change data capture into Kafka, and consumers apply updates near-real-time.\n\nTwo things follow. You must own a REBUILD path — reindex from the source into a new index and swap an alias atomically — because drift is inevitable and eventually you will need to fix it wholesale. And you must accept lag: a price change takes seconds to appear in search. For a price that is usually fine; for stock availability it may not be, which is why the product page reads stock from a different source.'],
  ['Bulkheads in the notification pipeline',
   'One shared queue for all channels means a slow SMS provider stalls email too. Separate queue and thread pool per channel is the bulkhead pattern applied at the system level, and it is the specific failure interviewers probe.\n\nAdd a circuit breaker per provider: when SMS is failing consistently, stop trying, fail fast, and let the DLQ collect. Retrying into a dead provider consumes workers that email needs.\n\nAnd priority: an OTP must not queue behind a marketing campaign. Either a separate high-priority queue per channel, or a priority queue with strict ordering. Say which.'],
  ['Preventing notification spam, which is a product problem',
   '"A user gets 200 notifications in a minute" is a design failure, not a load problem. Four controls, all of them cheap.\n\nPER-USER RATE LIMIT across all producers — the global cap matters more than any single producer limit. AGGREGATION: buffer per user per category for a window and send one digest instead of fifty. QUIET HOURS with an explicit CRITICAL override, because an OTP at 2am is correct and a marketing push is not. And an UNSUBSCRIBE path that actually works.\n\nRaising the global cap unprompted is a strong signal, because it is the control that requires thinking across producers rather than within one.']
 ],
 scaling:[
  ['Typeahead QPS','Client debounce, then edge cache, then in-memory trie. Three layers before anything expensive.'],
  ['Search index size','Shard by document; Elasticsearch does this natively. Replicas for read throughput.'],
  ['Reindexing 50M products','Build into a new index, swap the alias atomically. Never reindex in place.'],
  ['Notification bursts','Queue absorbs them. Scale workers up to the partition count; beyond that, add partitions.'],
  ['A failing provider','Circuit breaker plus DLQ. Do not let it consume the worker pool.'],
  ['Preference lookups','In-process cache with a short TTL. Never a network read per notification.']
 ],
 tradeoffs:[
  ['Typeahead','Precomputed top-k trie','Rank at query time','100ms is unachievable with request-time ranking. Costs freshness.'],
  ['Index freshness','Near-real-time (minutes)','Synchronous indexing','Synchronous indexing couples the write path to the search cluster availability.'],
  ['Search store','Elasticsearch, derived','Relational full-text','Relevance ranking and faceting are what it is for. Accept it is not a system of record.'],
  ['Notification queues','One per channel','One shared','Bulkhead. A slow SMS provider must not stall email.'],
  ['Delivery guarantee','At-least-once + dedupe key','Exactly-once','Exactly-once across an external provider does not exist. Idempotency at the consumer does.'],
  ['Spam control','Global per-user cap','Per-producer limits only','Producers do not know about each other. Only a global cap actually protects the user.']
 ],
 angle:[
  ['Amazon','Search suggestions is a favourite — expect the 100ms budget and "how does a new product appear in suggestions?". On notifications: "a user got 200 in a minute, fix it", and the aggregation answer.'],
  ['Microsoft / Adobe','More likely to probe the index rebuild and the relevance model. Have the alias-swap answer.'],
  ['Uber','Notification flavour: trip updates with strict ordering and priority. "The push provider is down — does the rider still get told their driver arrived?"'],
  ['JPM / Amex','Would care about the audit trail: can you prove a customer was notified, and when.']
 ]
};


PLAN.sdSolution[15] = {
 req:{
  functional:[
   'Ingest metrics from thousands of hosts and services.',
   'Query them for dashboards and alerts.',
   'Alert when an SLO is at risk.',
   'Retain high resolution briefly and low resolution for a long time.',
   'Distributed tracing across services.'
  ],
  nonFunctional:[
   'Ingest must not lose data during a spike — that is exactly when you need it.',
   'Dashboard queries in a couple of seconds.',
   'The monitoring system must not depend on the systems it monitors.',
   'Cost-efficient: observability commonly costs more than the workload it watches.'
  ]
 },
 estimate:[
  ['Series','10,000 hosts × 1,000 metrics','10M active time series.'],
  ['Sample rate','every 10 seconds','1M samples/sec.'],
  ['Raw size','16 bytes/sample','16 MB/sec = 1.4 TB/day. Unaffordable at that rate.'],
  ['Compressed','Gorilla-style delta-of-delta ≈ 1.4 bytes','~120 GB/day. That compression is why time-series databases exist — say it.'],
  ['Cardinality','—','The real limit is not volume, it is DISTINCT SERIES. Add user_id as a label and 10M becomes 10 billion. This is the number that kills these systems.']
 ],
 api:[
  ['POST /api/v1/write','Prometheus remote-write protobuf','204','Or scraped rather than pushed — see the trade-off.'],
  ['GET /api/v1/query?query=&time=','PromQL','200 { result[] }','Instant query for a single point in time.'],
  ['GET /api/v1/query_range?query=&start=&end=&step=','PromQL','200 { matrix[] }','What a dashboard actually calls.'],
  ['POST /api/v1/alerts','{ expr, for, labels, annotations }','201','Alert rule definition, version-controlled alongside code.'],
  ['GET /api/v1/traces/{traceId}','—','200 { spans[] }','Trace lookup by id propagated in headers.']
 ],
 dataModel:[
  ['series','series_id PK · metric_name · labels (sorted, hashed)','The label set IS the identity. Sorting before hashing means the same set always yields the same id.'],
  ['samples','series_id + timestamp → value','Columnar, chunked by time window. Delta-of-delta on timestamps, XOR on values.'],
  ['index','label pair → posting list of series_ids','An inverted index over labels. This is what a PromQL selector queries.'],
  ['downsampled','series_id + bucket → { min, max, avg, count }','5m and 1h rollups. Dashboards over a month read these, never raw.'],
  ['spans','trace_id + span_id · parent · service · op · start · duration','Partition by trace_id so one trace is one partition read.'],
  ['Retention','raw 24h · 5m for 30d · 1h for 1y','State the tiers. Retention is a cost decision, not a technical one.']
 ],
 arch:[
  '   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐',
  '   │  Service A   │ │  Service B   │ │   Host N     │',
  '   │  /metrics    │ │  /metrics    │ │  exporter    │',
  '   └──────▲───────┘ └──────▲───────┘ └──────▲───────┘',
  '          │ scrape 10s     │                │',
  '          └────────────────┴────────────────┘',
  '                           │',
  '                  ┌────────┴─────────┐',
  '                  │  Collector /     │  (per region, sharded',
  '                  │  scraper fleet   │   by target hash)',
  '                  └────────┬─────────┘',
  '                           │ remote write',
  '                           ▼',
  '                  ┌──────────────────┐',
  '                  │  Ingest + WAL    │ ◄── WAL first, so a crash',
  '                  └────────┬─────────┘     loses nothing',
  '                           ▼',
  '        ┌──────────────────────────────────────┐',
  '        │  TSDB  ── head block (memory, 2h)    │',
  '        │        └▶ compacted blocks (disk)    │',
  '        │        └▶ downsampled 5m / 1h        │',
  '        │        └▶ object store (cold, 1y)    │',
  '        └───────────────┬──────────────────────┘',
  '                        │',
  '        ┌───────────────┼───────────────┐',
  '        ▼               ▼               ▼',
  '  ┌──────────┐   ┌────────────┐   ┌──────────────┐',
  '  │ Dashboard│   │ Alert eval │   │  Trace store │',
  '  └──────────┘   └─────┬──────┘   └──────────────┘',
  '                       ▼',
  '                 ┌────────────┐',
  '                 │  Pager     │ ◄── plus a DEAD MAN switch:',
  '                 └────────────┘     alert when the heartbeat STOPS'
 ],
 flows:[
  ['Ingest',[
   '1. Collector scrapes each target every 10 seconds (pull), or receives a push for short-lived jobs.',
   '2. Append to a write-ahead log FIRST — a crash must not lose the last two hours.',
   '3. Write into the in-memory head block, which holds the current 2-hour window.',
   '4. Every 2 hours, compact the head to an immutable on-disk block with the compressed encoding.',
   '5. A background job produces 5m and 1h rollups from compacted blocks.',
   '6. Blocks past the local retention move to object storage.'
  ]],
  ['Query a dashboard panel',[
   '1. Parse the PromQL selector.',
   '2. Resolve matching series from the label inverted index.',
   '3. Choose the resolution from the time range: last hour reads raw, last month reads the 1h rollup. Never scan raw for a month.',
   '4. Read the relevant chunks, decompress, apply the aggregation.',
   '5. Return the matrix.'
  ]],
  ['Alerting',[
   '1. Evaluate each rule on a schedule against the TSDB.',
   '2. A rule must be firing for its "for" duration before it alerts — this is what suppresses flapping.',
   '3. Group and deduplicate related alerts so one incident is one page, not forty.',
   '4. Route by severity; respect silences during known maintenance.',
   '5. Separately, a DEAD MAN switch alerts when the heartbeat stops — otherwise a dead monitoring system looks like perfect health.'
  ]]
 ],
 deepDive:[
  ['Cardinality, which is the defining failure of this domain',
   'A time series is identified by its metric name plus its full label set. Every distinct combination is a separate series with its own index entry and its own in-memory chunk.\n\nSo http_requests{method, status, endpoint} with 4 methods, 5 statuses and 100 endpoints is 2,000 series — fine. Add user_id and it becomes 2,000 × the number of users. Memory and the index explode and the system falls over.\n\nThe rule: labels must be LOW cardinality and BOUNDED. High-cardinality dimensions — user id, request id, trace id, full URL with parameters — belong in logs or traces, never in metrics.\n\nRaising this unprompted is the single strongest signal in this design. In practice you also enforce it: per-metric series limits, and rejecting writes that would breach them, so one bad deploy cannot take down monitoring for everyone.'],
  ['Why a purpose-built TSDB and not Postgres',
   'Time series have properties you can exploit. Timestamps arrive at regular intervals, so DELTA-OF-DELTA encoding stores almost nothing — the change in the interval, which is usually zero. Values change slowly, so XOR against the previous value leaves mostly zero bits. Together these take 16 bytes per sample down to roughly 1.4.\n\nThat is a 10x storage difference, and it is the whole reason these databases exist. A relational store gives you none of it, and its per-row index overhead on 1M inserts/sec is fatal.\n\nWrites are also append-only and almost always for "now", so the head block can live in memory and be compacted in bulk — no random writes at all.'],
  ['Alert on symptoms, not causes',
   '"CPU above 80%" is a bad alert. It is a cause, it is frequently fine, and it fires when nothing is wrong. Alerts that fire without user impact get ignored, and then the real one is ignored too.\n\nAlert on SLO burn rate: you have an error budget, and the alert asks how fast you are consuming it. Burning a month of budget in an hour is a page; burning it slowly over a week is a ticket. That framing gives you severity for free.\n\nAnd the dead man switch. If your monitoring dies, every metric looks healthy because none are arriving. An alert that fires when the heartbeat STOPS, monitored externally, is the only thing that catches it.'],
  ['Metrics, logs and traces are three different systems',
   'Metrics are cheap aggregates that answer IS IT BROKEN. Logs are expensive detailed events that answer WHAT EXACTLY HAPPENED. Traces are sampled causal paths that answer WHERE DID THE TIME GO.\n\nThe order of use matters and interviewers ask it: metrics to confirm and localise (which service, which endpoint, p99 versus p50), traces to find where the latency lives, logs last for the specific failing request. Cheapest to most expensive.\n\nFor traces, sampling is unavoidable at volume. HEAD-based sampling decides at the start and throws away the interesting ones. TAIL-based decides after seeing the whole trace, so you keep the slow and failed ones — far more useful, and more expensive because you must buffer. Name the trade-off.']
 ],
 scaling:[
  ['1M samples/sec ingest','Shard the collector fleet by target hash; each shard owns a disjoint set of series.'],
  ['Query over a month','Downsampled tiers. Reading raw for a month is the mistake that makes dashboards time out.'],
  ['Cardinality growth','Per-metric series limits, enforced at ingest. Reject rather than degrade.'],
  ['Long retention cost','Tier to object storage and drop raw after the high-resolution window.'],
  ['Alert evaluation load','Alerts are just queries. Stagger evaluation and cache subexpressions.'],
  ['Trace volume','Tail-based sampling with a keep-all rule for errors and slow traces.']
 ],
 tradeoffs:[
  ['Storage','Purpose-built TSDB','Relational','10x compression from delta-of-delta plus XOR, and no per-row index overhead.'],
  ['Collection','Pull (scrape)','Push','Pull gives you target liveness for free — a target that cannot be scraped is itself a signal. Push is needed for short-lived jobs, so support both.'],
  ['Retention','Tiered with downsampling','Uniform','Nobody needs 10-second resolution from six months ago. Tiering is the main cost lever.'],
  ['Trace sampling','Tail-based','Head-based','Keeps the slow and failed traces, which are the ones you want. Costs buffering.'],
  ['Alerting','SLO burn rate','Threshold on resources','Symptoms over causes. Threshold alerts train people to ignore alerts.'],
  ['Cardinality','Hard limits at ingest','Best-effort guidance','Guidance does not survive a bad deploy at 3am.']
 ],
 angle:[
  ['Uber / Apple','Most likely to ask this. Expect cardinality directly, and the metrics-vs-logs-vs-traces distinction.'],
  ['Amazon','Will frame it as "how would you know this design you just built is broken?" — which is really asking for SLOs, symptom alerts and the dead man switch.'],
  ['JPM / Amex','Care about audit and retention: how long, provable, and who can query it.'],
  ['Any interviewer','If you have run production, lead with a real alert that woke you and what you changed. Concrete beats architectural here.']
 ]
};


PLAN.sdSolution[16] = {
 req:{
  functional:[
   'Upload a video, possibly several GB.',
   'Transcode into multiple resolutions and bitrates.',
   'Stream with adaptive quality.',
   'Search and browse the catalogue.',
   'Resume an interrupted upload.'
  ],
  nonFunctional:[
   'Playback starts within about 2 seconds.',
   'No rebuffering on a variable connection.',
   'Uploads survive a dropped connection.',
   'Cost-controlled — video egress is usually the largest line item in the business.'
  ]
 },
 estimate:[
  ['Uploads','500 hours/minute (YouTube scale)','Pick your own scale and say it. At 1 hour ≈ 3 GB source, that is 1.5 TB/minute inbound.'],
  ['Transcoding','5 renditions per source','Roughly 5x the source in CPU, and ~15 GB stored per source hour. Transcoding, not storage, is the expensive part.'],
  ['Viewing','100M concurrent at 5 Mbps','500 Tbps aggregate. This CANNOT come from your origin — it is the reason the CDN exists.'],
  ['Cache hit ratio','95% at the edge','Origin then serves 5%. The economics of the whole system live in that number.']
 ],
 api:[
  ['POST /v1/uploads','{ filename, sizeBytes, contentType }','201 { uploadId, partUrls[] }','Returns PRESIGNED URLs. The bytes never touch your servers.'],
  ['PUT {presignedPartUrl}','part bytes','200 { etag }','Direct to object storage. Retry a single part on failure.'],
  ['POST /v1/uploads/{id}/complete','{ parts[] }','202 { videoId, status: PROCESSING }','202 — transcoding has not happened yet.'],
  ['GET /v1/videos/{id}/manifest.m3u8','—','200 HLS manifest','Lists renditions and segments. The client picks based on bandwidth.'],
  ['GET /v1/videos/{id}','—','200 { title, status, renditions[] }','status tells the client which qualities exist yet.']
 ],
 dataModel:[
  ['video','id PK · owner_id · title · status · duration · created_at','status: UPLOADING, PROCESSING, READY, FAILED.'],
  ['rendition','video_id + profile PK · bitrate · resolution · manifest_path · status','Rows appear as each transcode completes, which is what lets playback start early.'],
  ['segment (object store)','videos/{id}/{profile}/seg-00001.ts','Content-addressed paths so the CDN caches cleanly.'],
  ['upload_session','id PK · video_id · parts[] · expires_at','Tracks which parts landed, for resume.'],
  ['view_event (stream)','video_id · user · ts · position · quality','Async. Never on the playback path.'],
  ['Metadata store','relational','Small. The blobs are in object storage; separating the two is the core structural decision.']
 ],
 arch:[
  '   UPLOAD',
  '   ┌────────┐   1. request presigned URLs   ┌──────────────┐',
  '   │ Client │──────────────────────────────▶│  Upload API  │',
  '   └───┬────┘                               └──────────────┘',
  '       │ 2. PUT parts DIRECTLY (bytes never touch your servers)',
  '       ▼',
  '   ┌──────────────────┐',
  '   │  Object store    │',
  '   └────────┬─────────┘',
  '            │ 3. complete → event',
  '            ▼',
  '     ┌────────────┐      ┌──────────────────────────┐',
  '     │   Queue    │─────▶│  Transcoding workers     │',
  '     └────────────┘      │  (GPU/CPU, autoscaled)   │',
  '                         │  240p 480p 720p 1080p 4K │',
  '                         └────────────┬─────────────┘',
  '                                      │ segments + manifest',
  '                                      ▼',
  '                            ┌──────────────────┐',
  '                            │  Object store    │',
  '                            └────────┬─────────┘',
  '   PLAYBACK                          │ origin',
  '   ┌────────┐   ┌──────────┐   ┌─────▼──────┐',
  '   │ Viewer │──▶│   CDN    │──▶│  Origin    │',
  '   └───▲────┘   │  edge    │   │  shield    │ ◄── absorbs edge misses',
  '       │        └──────────┘   └────────────┘',
  '       │  adaptive bitrate: client measures bandwidth,',
  '       └─ switches rendition at the next segment boundary'
 ],
 flows:[
  ['Upload a 5 GB file',[
   '1. Client asks for an upload session; server returns presigned URLs for each ~10 MB part.',
   '2. Client PUTs parts directly to object storage, in parallel. Your servers never see the bytes.',
   '3. A part fails? Retry only that part. This is why a dropped connection at 90% does not restart the upload.',
   '4. Client calls complete with the part etags; storage assembles the object.',
   '5. Emit VideoUploaded onto the queue.'
  ]],
  ['Transcode',[
   '1. Worker picks up the job and probes the source.',
   '2. Transcode the LOWEST rendition first and publish it — playback can begin while higher qualities are still processing.',
   '3. Segment each rendition into ~4-6 second chunks and write an HLS manifest.',
   '4. Update the rendition row as each completes; the master manifest grows.',
   '5. Idempotency matters: at-least-once delivery means a job can run twice. Key output paths by (video, profile) so a rerun overwrites rather than duplicates.'
  ]],
  ['Playback',[
   '1. Client fetches the master manifest listing available renditions.',
   '2. Starts at a conservative bitrate for fast startup.',
   '3. Measures throughput while downloading each segment.',
   '4. Switches rendition at the next SEGMENT BOUNDARY — that is why segments are short.',
   '5. Segments come from the CDN edge; a miss goes to the origin shield, and only then to origin.',
   '6. Fire view events asynchronously. Playback never waits on analytics.'
  ]]
 ],
 deepDive:[
  ['Never proxy the bytes',
   'The single most important decision in this design: uploads and downloads must not pass through your application servers. A 5 GB upload through your API means holding a connection for minutes, buffering gigabytes, and scaling your fleet to bandwidth rather than to requests.\n\nPresigned URLs let the client talk directly to object storage with a time-limited, scope-limited credential. Your service does authorisation ONCE, when it issues the URL, and then gets out of the way.\n\nThe same applies to playback: the CDN serves segments, and your service only issues signed manifest URLs. If a candidate routes video bytes through their service, that is the thing to correct first.'],
  ['Chunked, resumable uploads',
   'A single PUT of 5 GB fails at 90% and the user starts over. They will not try twice.\n\nSplit into parts of roughly 10 MB, upload them independently and in parallel, and track which have landed. A failure retries ONE part. A closed laptop resumes from the parts already stored.\n\nThe session needs an expiry and a cleanup job, or abandoned multipart uploads accumulate and cost real money — a detail worth mentioning because it is the kind of thing that shows operational experience.'],
  ['Adaptive bitrate, and why segments are short',
   'The video is encoded at several bitrates and each is cut into 4-6 second segments. The manifest lists them. The client measures its own throughput and picks the next segment from whichever rendition it can sustain.\n\nSegment length is the trade-off. Short segments mean the client can adapt quickly and startup is fast, but there are more requests and more per-request overhead. Long segments are efficient and adapt sluggishly, so a bandwidth drop causes a visible stall. Four to six seconds is the usual compromise, and being able to explain WHY is the point.\n\nStarting at a low bitrate and stepping up gives fast startup — users tolerate a moment of soft video far better than three seconds of spinner.'],
  ['The CDN economics, and the cold viral video',
   'At 500 Tbps aggregate, origin cannot serve viewers. A 95% edge hit ratio means origin handles 5%, and that ratio is the difference between a viable business and an impossible one. Netflix went further and put caches inside ISP networks — that is what Open Connect is.\n\nThe failure case: a video goes viral and is in NO edge cache. Every request misses through to origin simultaneously — a stampede at CDN scale. Mitigations: ORIGIN SHIELDING, a mid-tier cache that absorbs misses from many edges so origin sees one request instead of hundreds; and pre-warming for predictable launches.\n\nAnd authorisation: the CDN does not check permissions. Signed URLs with short expiry are the permission. Signing only the manifest is not enough if the segments are publicly addressable — sign the segments too, or an unauthorised viewer just reads the manifest and fetches them directly.']
 ],
 scaling:[
  ['Upload bandwidth','Direct to object storage. Your fleet scales with requests, not bytes.'],
  ['Transcoding cost','The dominant compute cost. Autoscale workers on queue depth, use spot capacity, and transcode lazily for content nobody watches.'],
  ['Playback egress','CDN, then ISP-embedded caches at extreme scale. This is the largest cost line.'],
  ['Cold viral content','Origin shielding plus pre-warming.'],
  ['Storage growth','Tier old renditions to colder storage; delete the highest bitrates for content nobody watches.'],
  ['Metadata queries','Small relational store with a cache. Never the bottleneck.']
 ],
 tradeoffs:[
  ['Upload path','Presigned direct-to-storage','Through your service','Your servers would scale with bandwidth rather than requests.'],
  ['Upload shape','Chunked, resumable','Single PUT','A 5 GB upload failing at 90% is a lost user.'],
  ['Transcoding','Async, lowest rendition first','Synchronous','Playback can start in minutes rather than after every rendition completes.'],
  ['Delivery','CDN with origin shield','Direct from origin','Origin cannot serve the aggregate bandwidth. The shield handles the stampede.'],
  ['Segment length','4–6 seconds','1s or 30s','Balances adaptation speed against request overhead.'],
  ['Authorisation','Signed URLs, manifest AND segments','Check at delivery','The CDN never checks permissions — the signature IS the permission.']
 ],
 angle:[
  ['Amazon','Prime Video flavour. Expect the upload path first, then "how does playback start before transcoding finishes", then DRM if they go deep.'],
  ['Adobe','Media is their domain — expect real depth on the transcoding pipeline, codecs and rendition ladders.'],
  ['Uber / Apple','Less likely, but the CDN and cold-cache-stampede discussion transfers to any large static asset.'],
  ['If you got this and it went quiet','This is the design where a non-interactive interviewer is common — there is a lot of expected surface and candidates recite it. Differentiate on the WRITE path under load, the transcoding cost, and the cold viral case, which most people skip.']
 ]
};



export default PLAN;
