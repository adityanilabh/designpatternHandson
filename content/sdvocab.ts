/* System design vocabulary — the checklist, not the dictionary.

   WHY THIS IS SEPARATE FROM PLAN. content/index.ts recomposes the original
   sheet, and scripts/verify-content.ts asserts that recomposition is deep-equal
   to legacy/data.js with no keys invented. This is new material, so it exports
   on its own and app/sd/vocabulary imports it directly. Nothing here feeds the
   progress store either: it is a reference page, not 250 more checkboxes.

   THE SHAPE OF EACH ENTRY is deliberate. A definition you can recite is worth
   very little in a design round — the interviewer is listening for whether you
   know WHEN it applies. So every term carries two things beyond its name:

     plain  — what it actually is, in words you would use to a colleague who
              does not work on this. No jargon defined with more jargon.
     when   — the example that makes it stick: a real system that does this, or
              the concrete moment where you would reach for it.

   Links live in content/sdvocab-links.ts, generated and checked separately, so
   a rotted URL never silently becomes a wrong definition here.                */

/* [term, plain, when] */
export type Term = [string, string, string];

export interface Diagram {
  title: string;
  lines: string[];
  why?: string;
}

export interface Group {
  id: string;
  name: string;
  blurb: string;
  terms: Term[];
  diagrams?: Diagram[];
  table?: { title: string; heads: string[]; rows: string[][] };
}

export const GROUPS: Group[] = [

/* ------------------------------------------------ concurrency & isolation -- */
{
  id: 'conc',
  name: 'Concurrency & consistency',
  blurb:
    'Everything here is one question wearing different clothes: two things touched the same ' +
    'data at the same time — who wins, and does anybody notice? Know which anomaly each ' +
    'isolation level still permits; that is the follow-up that actually gets asked.',
  terms: [
    ['Optimistic locking',
     'Read the row along with its version number, do your work, then write "only if the version is still 7". If someone beat you to it the write fails and you retry.',
     'JPA @Version, and DynamoDB conditional writes. Right when conflicts are rare — two people editing different orders — because you pay nothing in the common case.'],
    ['Pessimistic locking',
     'Take the lock before you read, so nobody else can touch the row until you commit. SELECT … FOR UPDATE.',
     'Seat selection at checkout. Conflicts are not rare there — everyone wants seat 14A — so retrying optimistically would just thrash.'],
    ['MVCC (multi-version concurrency control)',
     'The database keeps several versions of each row, so a reader is shown the snapshot that existed when its transaction started. Readers never block writers and writers never block readers.',
     'PostgreSQL, Oracle and InnoDB all work this way. It is why a long analytics query in Postgres does not freeze your writes — and why long transactions bloat the table with old versions.'],
    ['Serializable isolation',
     'The strongest level: the result is guaranteed to match SOME order of running the transactions one after another.',
     'Postgres SERIALIZABLE detects the conflict and aborts one transaction with a serialization failure — so using it means your code must be ready to retry.'],
    ['Repeatable read',
     'Read the same ROW twice inside one transaction and you get the same value both times.',
     'MySQL InnoDB\'s default. Stops dirty and non-repeatable reads; in the textbook it still allows phantoms.'],
    ['Read committed',
     'You only ever see data that has been committed — but a value can change between two reads in the same transaction.',
     'PostgreSQL\'s default, and the right default for most services. Cheap, and the anomalies it allows rarely matter for OLTP.'],
    ['Read uncommitted',
     'You can see another transaction\'s changes before it commits — changes that may be rolled back and never have existed.',
     'Effectively never used deliberately. Worth knowing only so you can say why it is unusable.'],
    ['Dirty read',
     'You read a value another transaction wrote and has not committed. It rolls back; you acted on a number that never existed.',
     'A balance check that sees a transfer mid-flight, then the transfer fails. Only read-uncommitted permits it.'],
    ['Non-repeatable read',
     'Same row, read twice in one transaction, two different values — because somebody committed an UPDATE in between.',
     'You read a price to validate it, then read it again to charge, and it changed. Read-committed permits this; repeatable-read does not.'],
    ['Phantom read',
     'Same QUERY, run twice, returns a different set of rows — because somebody committed an INSERT that matches your WHERE clause.',
     '"Count the bookings for this room" returns 3, then 4. This is the one that breaks booking systems; stopping it needs serializable or a range lock.'],
    ['Compare-and-swap (CAS)',
     'A single atomic hardware instruction: "if the value is still X, make it Y — otherwise tell me it changed".',
     'AtomicInteger.compareAndSet, and the retry loop underneath every lock-free data structure. Optimistic locking is this idea at database scale.'],
    ['Distributed locking',
     'A lock that lives in a service every node can see, so only one node in the whole cluster does the thing.',
     'Redis SET NX PX, ZooKeeper ephemeral nodes, etcd leases. The honest caveat: a lock over a network can be lost without you knowing, so a lock alone is not a correctness guarantee.'],
    ['Lease-based locking',
     'A distributed lock with an expiry. Hold it, and keep renewing it; stop renewing and it is somebody else\'s.',
     'How a leader keeps its title in etcd or ZooKeeper. Without the expiry, one crashed node blocks the cluster forever.'],
    ['Deadlock',
     'A holds what B needs, B holds what A needs, and neither will let go. Nothing moves.',
     'Two transactions updating the same two rows in opposite order. The standard fix is not detection but discipline: always take locks in the same order.'],
    ['Race condition',
     'The answer depends on which thread happened to get there first — so it is right in testing and wrong in production.',
     'Check-then-act: "if not exists, insert". Two requests both check, both find nothing, both insert.'],
    ['Critical section',
     'The stretch of code only one thread may be inside at a time.',
     'The smaller you make it, the more throughput you get — which is why you compute outside the lock and only assign inside it.'],
    ['Lost update problem',
     'Two people read 100, one adds 10, the other adds 20, and the last write wins. One update vanished with no error anywhere.',
     'The canonical argument for optimistic locking. It is also why "read, modify, write" from application code is a bug and UPDATE … SET n = n + 1 is not.'],
  ],
  table: {
    title: 'What each isolation level still lets through',
    heads: ['Level', 'Dirty read', 'Non-repeatable read', 'Phantom read'],
    rows: [
      ['Read uncommitted', 'possible', 'possible', 'possible'],
      ['Read committed', 'prevented', 'possible', 'possible'],
      ['Repeatable read', 'prevented', 'prevented', 'possible *'],
      ['Serializable', 'prevented', 'prevented', 'prevented'],
    ],
  },
  diagrams: [
    {
      title: 'Lost update — and the two ways out',
      lines: [
        'LOST UPDATE                 OPTIMISTIC                  PESSIMISTIC',
        '',
        'A: read  n=100              A: read  n=100,v=7          A: SELECT..FOR UPDATE',
        'B: read  n=100              B: read  n=100,v=7          B: blocks',
        'A: write n=110              A: write n=110 if v=7  OK   A: write n=110, COMMIT',
        'B: write n=120              B: write n=120 if v=7  FAIL B: unblocks, reads 110',
        '                               -> B re-reads, retries    B: write n=130, COMMIT',
        'final 120  (A lost)         final 130                   final 130',
      ],
      why:
        'Both fixes are correct. Optimistic pays only when there IS a conflict; pessimistic ' +
        'pays on every access but never has to retry. Which is cheaper is entirely a question ' +
        'of how often two writers collide.',
    },
  ],
},

/* ------------------------------------------------- distributed transactions -- */
{
  id: 'txn',
  name: 'Distributed transactions',
  blurb:
    'One database gives you ACID for free. Two databases, or two services, and you have to ' +
    'build it — or, far more often, decide you do not need it. The senior answer is almost ' +
    'never 2PC; it is a saga plus idempotency, and knowing why.',
  terms: [
    ['Distributed transaction',
     'One logical unit of work spanning more than one database or service, where either all of it happens or none of it does.',
     '"Charge the card AND reserve the inventory." The moment those live in two services, the single COMMIT you relied on is gone.'],
    ['Two-phase commit (2PC)',
     'A coordinator asks every participant "can you commit?", waits for all to say yes, then tells them all to commit.',
     'XA across two databases in one datacentre. The flaw is the middle: if the coordinator dies after everyone voted yes, every participant sits holding locks, unable to decide. This is why 2PC is rare in internet-scale systems.'],
    ['Three-phase commit (3PC)',
     '2PC with an extra "prepare to commit" round so participants can make progress if the coordinator dies.',
     'Almost entirely a textbook answer — it assumes bounded network delay, which real networks do not offer. Know it so you can say why nobody ships it.'],
    ['Saga pattern',
     'Break the distributed transaction into a sequence of local transactions, each with a compensating action that undoes it. No global lock, no coordinator holding everyone hostage.',
     'Book flight → book hotel → charge card. If the charge fails, run cancel-hotel then cancel-flight. This is the answer expected for "how do you do checkout across services".'],
    ['Compensating transaction',
     'The business-level undo for a step that already committed. Not a rollback — the original really happened and may have been visible.',
     'You cannot un-send an email, so the compensation is a follow-up correction. This is the honest limit of sagas and worth saying out loud.'],
    ['Try-Confirm-Cancel (TCC)',
     'A saga where every step first RESERVES the resource, and a later confirm or cancel settles it. The reservation is the thing that makes the undo clean.',
     'Hold the seat for 10 minutes, then confirm on payment or let the hold expire. Avoids the "already visible to customers" problem plain compensation has.'],
    ['XA transactions',
     'The standard interface implementing 2PC across resource managers — databases, message brokers.',
     'A JTA transaction spanning a database and a JMS queue. Correct, and slow enough that most teams replace it with an outbox.'],
    ['Atomic commit protocol',
     'The general name for any protocol that gets a set of participants to agree unanimously to commit or abort.',
     '2PC and 3PC are the two you name. Consensus (Raft/Paxos) solves a related but different problem: agreeing on a VALUE, not committing a transaction.'],
  ],
  diagrams: [
    {
      title: '2PC holds locks across the network; a saga does not',
      lines: [
        '2PC                                     SAGA',
        '',
        'coordinator                             order svc',
        '   |-- prepare -->  payment  (locked)      |-- charge ------> payment  COMMIT',
        '   |-- prepare -->  inventory(locked)      |-- reserve -----> inventory FAILS',
        '   |<- yes -------  both                   |-- refund ------> payment  COMMIT',
        '   |-- commit --->  both                   |',
        '                                           (no global lock ever held)',
        'coordinator dies here  =>  both            each step is a local txn;',
        'participants block, holding locks          failure runs compensations',
      ],
      why:
        'The trade is stated plainly in an interview: 2PC gives you atomicity and buys it with ' +
        'availability — a stuck coordinator freezes participants. A saga gives up atomicity, ' +
        'accepts that intermediate states are visible, and stays available.',
    },
  ],
},

/* -------------------------------------------------- consistency & CAP -- */
{
  id: 'consistency',
  name: 'Consistency & distributed systems',
  blurb:
    'The part of the round where hand-waving is most visible. "Eventually consistent" is not ' +
    'an answer on its own — the question is always which reader can see which write, and what ' +
    'a client does during the window before they agree.',
  terms: [
    ['CAP theorem',
     'When the network partitions you must choose: keep answering with possibly stale data (AP), or refuse to answer to stay correct (CP). You do not get to have both during a partition.',
     'The usual misuse is "we picked AP" as a general property. CAP only says anything DURING a partition — the rest of the time you can have both, which is exactly why PACELC exists.'],
    ['PACELC theorem',
     'The honest extension: if Partitioned, trade Availability against Consistency; Else, trade Latency against Consistency.',
     'DynamoDB and Cassandra are PA/EL — available under partition, and fast rather than strict the rest of the time. Spanner is PC/EC: it makes you wait in order to stay correct.'],
    ['Strong consistency',
     'Once a write returns, every later read sees it. No reader ever gets the old value.',
     'An account balance after a transfer. Costs a round trip to a leader or a quorum, so you are paying latency for it on every read.'],
    ['Eventual consistency',
     'Replicas converge if writes stop. Until then, different readers can legitimately see different values.',
     'A like count, a follower count, a DNS record. Fine when nobody can tell — dangerous the moment a user makes a decision based on the stale value.'],
    ['Causal consistency',
     'If A happened before B, everyone sees them in that order. Unrelated writes may be seen in any order.',
     'A reply must never appear before the comment it answers. Much cheaper than total ordering, and usually what "eventually consistent" actually needs to be upgraded to.'],
    ['Linearizability',
     'The system behaves as if there were one copy of the data and every operation took effect at a single instant between its call and its return.',
     'The strongest single-object guarantee, and what compare-and-swap needs in order to mean anything. etcd and ZooKeeper provide it; caches and read replicas do not.'],
    ['Sequential consistency',
     'Everyone sees the same order of operations, but that order need not match real time.',
     'Weaker than linearizable: two clients agree on the story, but a write can appear to take effect later than it really did. Name it mainly to show you know linearizability is the stronger claim.'],
    ['Quorum reads / writes',
     'Write to W replicas and read from R, out of N. If R + W > N the read set and the write set must overlap, so every read touches at least one up-to-date replica.',
     'Cassandra and Dynamo. N=3, W=2, R=2 is the common setting: survives one node down and still overlaps.'],
    ['Read repair',
     'On a read the coordinator notices a replica returned a stale value and writes the fresh one back to it.',
     'Cassandra does this inline. It only fixes what somebody actually read, which is why cold data stays stale — and why anti-entropy exists.'],
    ['Anti-entropy',
     'A background process that compares replicas and repairs differences whether or not anyone read them.',
     'Cassandra repair, usually driven by Merkle trees so two nodes can compare terabytes by exchanging a handful of hashes.'],
    ['Split brain',
     'A partition leaves two halves of a cluster each believing it is in charge, both accepting writes.',
     'The reason quorums exist: require a majority to act and only one side of any partition can possibly have one.'],
    ['Network partition',
     'Nodes are alive but cannot reach each other. Worse than a crash, because each side thinks the other one died.',
     'The event CAP is about. Assume it will happen; the design question is what your system does for the minutes it lasts.'],
    ['Consensus',
     'Getting a group of nodes to agree on one value, and to keep agreeing as some of them fail.',
     'Who is the leader; what is entry 47 of the log. It sits underneath every "we use etcd or ZooKeeper for that".'],
  ],
  diagrams: [
    {
      title: 'Quorum: why R + W > N is the whole trick',
      lines: [
        'N = 3 replicas       W = 2         R = 2        R + W = 4 > 3',
        '',
        '   write v2  ->  [A v2] [B v2] [C v1]       (2 acks, write returns)',
        '                    \\      \\      /',
        '   read      ->  any 2 of:  {A,B}  {A,C}  {B,C}',
        '                              ^      ^      ^',
        '                 every possible choice contains at least one v2',
        '',
        '   W=1, R=1  (sum 2, not > 3):  write lands on A, read hits C',
        '                                -> stale, silently, no error anywhere',
      ],
      why:
        'Say the inequality, then say what it costs: W=2 means the write fails when two nodes ' +
        'are down. Raising consistency lowered availability. That sentence is CAP made concrete.',
    },
  ],
},

/* ------------------------------------------------------------- consensus -- */
{
  id: 'consensus',
  name: 'Consensus algorithms',
  blurb:
    'Nobody will ask you to implement Raft. They will ask what happens when the leader dies ' +
    'half way through a write, and the answer has to be a mechanism rather than a shrug.',
  terms: [
    ['Paxos',
     'The original consensus algorithm. Correct, proven, and famously hard to describe — which is the honest thing to say about it.',
     'Google Chubby. Cite it as the ancestor and reach for Raft whenever you actually have to explain something.'],
    ['Raft',
     'Consensus designed to be teachable. One leader takes every write, appends it to a log, replicates to followers, and commits once a majority has stored it.',
     'etcd, Consul, CockroachDB, TiKV. This is the one to draw on the whiteboard.'],
    ['Zab',
     'ZooKeeper’s protocol. Similar in shape to Raft, with a stronger emphasis on delivering updates in exactly the order the leader broadcast them.',
     'Say "ZooKeeper uses Zab, which is Paxos-like with total-order broadcast" and move on — nobody wants the details.'],
    ['Leader election',
     'The cluster picks one node to be in charge; everyone else defers to it until it stops proving it is alive.',
     'In Raft a follower stops hearing heartbeats, becomes a candidate, and asks for votes. A majority is required, so two leaders cannot both be elected.'],
    ['Log replication',
     'The leader appends each command to an ordered log and ships it to followers. Same log, same order, same resulting state everywhere.',
     'Why the log matters more than the state: replay it and you can rebuild any replica from scratch. Event sourcing makes the same argument for application data.'],
    ['Majority consensus',
     'A decision needs more than half the nodes. Any two majorities overlap, so two conflicting decisions can never both succeed.',
     'Why clusters are sized 3, 5, 7. A 4-node cluster tolerates exactly the same single failure as 3 and costs more to run.'],
    ['Heartbeats',
     'Periodic "I am alive" messages; silence for long enough is treated as failure.',
     'Raft randomises the election timeout on purpose — otherwise every follower times out at the same instant, they all stand, and the vote splits.'],
    ['Follower / candidate / leader',
     'The three Raft roles. Followers accept entries; one that stops hearing from the leader becomes a candidate and stands for election; the winner leads.',
     'Walking that state machine — and saying what happens to an uncommitted entry when the leader dies — is what the question is really testing.'],
  ],
  diagrams: [
    {
      title: 'Raft: the leader dies mid-write',
      lines: [
        'BEFORE                    LEADER DIES               AFTER ELECTION',
        '',
        'L1 [1][2][3]              L1  x                     L1 rejoins as follower',
        'F2 [1][2][3]              F2 [1][2][3]  timeout ->  F2 LEADER  [1][2][3]',
        'F3 [1][2]                 F3 [1][2]     votes F2    F3 [1][2][3]  <- back-filled',
        '',
        'entry 3 is on 2 of 3      an election needs a       F2 had the longest log, so',
        '=> majority => COMMITTED  majority: F2 + F3         a committed entry survives',
      ],
      why:
        'The safety rule is one sentence: a node only votes for a candidate whose log is at ' +
        'least as up to date as its own. So anything already committed on a majority is present ' +
        'on every possible winner. That answers "how do you not lose the write?".',
    },
  ],
},

/* --------------------------------------------------- reliability & faults -- */
{
  id: 'reliability',
  name: 'Reliability & fault tolerance',
  blurb:
    'Almost every item here addresses the same failure: a dependency got slow, and your service ' +
    'kept sending traffic at it until it ran out of threads. Retries make that worse. The rest ' +
    'of the list is how you stop making it worse.',
  terms: [
    ['Retry pattern',
     'On failure, try again — but only for errors that could plausibly succeed next time.',
     'Retry a timeout or a 503; never a 400. And never retry a non-idempotent write without an idempotency key, or you will charge somebody twice.'],
    ['Exponential backoff',
     'Wait longer after each failure — 1s, 2s, 4s — instead of hammering at a fixed interval.',
     'Bound it. Unbounded backoff plus unbounded retries is how a five-second blip becomes a twenty-minute outage.'],
    ['Jitter',
     'Randomise each backoff so all your clients do not retry in the same instant.',
     'The part candidates skip. Without jitter a blip becomes a synchronised retry storm that keeps the dependency down — AWS published this as the standard fix.'],
    ['Circuit breaker',
     'Count failures; past a threshold stop calling the dependency at all and fail instantly. Occasionally let one request through to see whether it recovered.',
     'It protects you (threads not stuck waiting) and it protects the dependency (not hammered while it restarts).'],
    ['Bulkhead pattern',
     'Give each dependency its own limited pool of threads or connections so one slow dependency cannot consume all of them.',
     'Named after ship compartments: one flooded section does not sink the vessel. Without it a slow recommendations call takes down checkout.'],
    ['Failover',
     'Traffic moves to a standby when the primary is unhealthy.',
     'Automatic is fast and can flap; manual is slow and deliberate. Say which you chose and why — that choice is the interesting part.'],
    ['Fallback',
     'A degraded but useful answer when the real one is unavailable.',
     'Serve last-known-good recommendations, or a generic best-sellers list, rather than an error page.'],
    ['Graceful degradation',
     'Shed the optional parts to keep the core working under stress.',
     'Amazon still lets you check out when recommendations are down. The design skill is deciding in advance which features are optional.'],
    ['Health checks',
     'An endpoint the platform polls to decide whether to send you traffic or restart you.',
     'Liveness ("restart me") and readiness ("do not route to me") answer different questions. Making liveness check the database is a classic self-inflicted outage: the DB blips and every healthy pod gets restarted.'],
    ['Dead letter queue (DLQ)',
     'A side queue for messages that failed repeatedly, so the main queue keeps moving.',
     'Without one a single bad message blocks its partition forever. A DLQ needs an owner and an alert, or it is just where bugs go to be forgotten.'],
    ['Poison message',
     'A message that will never process successfully however often you retry.',
     'A malformed payload, or a record pointing at a deleted row. Bound the retries, then move it aside.'],
    ['Redundancy',
     'More than one of everything that matters, so no single failure is fatal.',
     'N+1 for capacity, 2N for a full spare. It only counts if the copies fail independently — two instances in one rack are one failure.'],
    ['High availability (HA)',
     'Designing so the service keeps serving through expected failures. Measured in nines.',
     'Three nines is about 43 minutes of downtime a month; five nines is about 26 seconds. Quote the budget, not the adjective.'],
    ['Disaster recovery',
     'Getting back after something that takes out a whole region or destroys data. Measured as RPO (how much data you can lose) and RTO (how long you can be down).',
     'HA covers a dead instance; DR covers a dead region or a bad migration that deleted rows. Different budgets, different designs.'],
  ],
  diagrams: [
    {
      title: 'Circuit breaker states',
      lines: [
        '                 failures > threshold',
        '      CLOSED  ----------------------->  OPEN',
        '        ^                                 |',
        '        |                                 | cool-down elapses',
        '        | probe succeeds                  v',
        '        +-----------------------  HALF-OPEN',
        '                                          |',
        '                        probe fails       |',
        '                        <-----------------+  straight back to OPEN',
        '',
        '   CLOSED     calls pass through, failures counted',
        '   OPEN       calls fail instantly, dependency left alone to recover',
        '   HALF-OPEN  one trial call decides which way it goes',
      ],
      why:
        'Half-open is the whole point and the state people forget. Without a trial request the ' +
        'breaker either never reopens, or reopens blindly into a service that is still broken.',
    },
  ],
},

/* ------------------------------------------------------ APIs & interfaces -- */
{
  id: 'api',
  name: 'APIs & service design',
  blurb:
    'The bucket that has grown the most in real interviews: instead of "design BookMyShow" you ' +
    'get "design the booking API". Idempotency is the single highest-yield idea in here — it is ' +
    'the answer to "the client retried, now what?", which is asked in almost every round.',
  terms: [
    ['Idempotency',
     'Doing the same operation twice has the same effect as doing it once.',
     'GET, PUT and DELETE are naturally idempotent; POST is not. Every retry, every at-least-once queue and every flaky mobile network makes this a correctness requirement, not a nicety.'],
    ['Idempotency key',
     'A client-supplied unique id for an operation. The server records it with the result, so a repeat of the same key returns the original result instead of doing the work again.',
     'Stripe requires one on payment creation. Store the key and the response in the same transaction as the effect, or a crash between them reintroduces the double charge.'],
    ['REST',
     'Resources at URLs, operated on with HTTP verbs, with the status code carrying the outcome.',
     'The default, and correct for CRUD-shaped domains. Where it strains is actions that are not nouns — "refund this payment" is not obviously a resource.'],
    ['RPC',
     'Call a function on another machine as if it were local.',
     'Simpler for action-shaped operations. The risk is that it hides the network: a local call cannot time out or half-succeed, and a remote one always can.'],
    ['gRPC',
     'RPC over HTTP/2 with schemas defined in protobuf: binary, streaming, code-generated clients.',
     'The usual choice for service-to-service inside a cluster. The schema is the real benefit — the compiler catches a breaking change that JSON would only reveal in production.'],
    ['GraphQL',
     'The client sends a query describing exactly the fields it wants and gets back that shape.',
     'Fixes over-fetching for rich clients with many screens. Buys you a new problem: one innocent query can fan out into hundreds of database calls, so you need depth limits and batching.'],
    ['API gateway',
     'A single entry point in front of many services doing the cross-cutting work: auth, rate limiting, routing, TLS termination.',
     'Keeps every service from reimplementing authentication. It is also a single point of failure and a deployment bottleneck, which is the trade to name.'],
    ['Rate limiting',
     'Cap how many requests a client may make in a window, and reject the rest with 429.',
     'Token bucket allows bursts and is what most APIs actually use; fixed window is trivial and lets double the limit through at the boundary; sliding window log is exact and expensive.'],
    ['Throttling',
     'Slowing or shedding traffic to protect the system, rather than enforcing a per-client contract.',
     'Rate limiting is a promise to the client; throttling is self-defence under load. Related enough to be confused, different enough to be worth separating out loud.'],
    ['Pagination',
     'Return results in pages rather than all at once.',
     'The unglamorous question that catches people: "what happens if a row is inserted while the user is on page 3?"'],
    ['Offset pagination',
     'LIMIT 20 OFFSET 400. Simple, and lets you jump to any page.',
     'Two real problems: the database still walks the 400 skipped rows, so deep pages get slow; and an insert shifts everything, so page 3 repeats a row page 2 already showed.'],
    ['Cursor pagination',
     'Return an opaque pointer to the last row seen — "give me 20 after this id" — instead of a page number.',
     'Stable under inserts and fast at any depth, because the index seeks straight to the cursor. The cost is you cannot jump to page 47. This is what Twitter, Slack and Stripe use.'],
    ['Webhooks',
     'You register a URL; the provider POSTs to it when something happens.',
     'Inverts the polling relationship. Now you owe them a fast 2xx, and they owe you retries — which means your handler must be idempotent, because you will get duplicates.'],
    ['Long polling',
     'The client requests, and the server holds the connection open until it has something to say or a timeout expires.',
     'The compatibility fallback before WebSockets. Works through anything, at the cost of a held connection per waiting client.'],
    ['Server-sent events (SSE)',
     'A single long-lived HTTP connection the server pushes messages down. One direction only.',
     'The right answer for a live feed, a notification stream or a progress bar. Simpler than WebSockets and it reconnects on its own.'],
    ['WebSockets',
     'A persistent two-way connection after an HTTP upgrade.',
     'Chat, multiplayer, live collaboration. The cost is statefulness: a connection is pinned to one server, so now you need sticky routing and a pub/sub fabric behind it.'],
    ['API versioning',
     'Letting old clients keep working while the API moves on.',
     'URL versions (/v2/) are visible and blunt; header versions are cleaner and easier to get wrong. The real skill is additive change so you rarely need a v2 at all.'],
    ['Request deduplication',
     'Recognising that a request you already handled has arrived again, and not doing the work twice.',
     'The mechanism behind idempotency keys, and the same idea as exactly-once processing in a queue. Needs a store of seen ids with a retention window.'],
  ],
  diagrams: [
    {
      title: 'Offset vs cursor pagination, with a concurrent insert',
      lines: [
        'OFFSET                                CURSOR',
        '',
        'page 1: LIMIT 3 OFFSET 0              page 1: WHERE id > 0 LIMIT 3',
        '   [10][9][8]                            [10][9][8]     next=8',
        '',
        '   <- someone inserts id 11 ->           <- someone inserts id 11 ->',
        '',
        'page 2: LIMIT 3 OFFSET 3              page 2: WHERE id < 8 LIMIT 3',
        '   [8][7][6]                              [7][6][5]',
        '    ^ 8 shown twice, 5 skipped            no duplicate, no skip',
        '',
        'deep page: OFFSET 100000              deep page: index seek to cursor',
        '   scans and discards 100k rows          O(log n), same cost at any depth',
      ],
      why:
        'Both failures come from the same cause: OFFSET is a position in a result set that is ' +
        'still changing, while a cursor is a position in the data itself.',
    },
  ],
},

/* ---------------------------------------------------------------- caching -- */
{
  id: 'cache',
  name: 'Caching',
  blurb:
    'Adding a cache is easy and is never the interesting part. Everything that is asked about ' +
    'caches is really about the moment they are wrong, cold, or all expire at once.',
  terms: [
    ['Cache-aside (lazy loading)',
     'The application checks the cache; on a miss it reads the database, puts the value in the cache, and returns it.',
     'The default, and what most people mean by "we added Redis". Only requested data is ever cached, and a stale entry lives until its TTL or an explicit delete.'],
    ['Read-through',
     'The application talks only to the cache; the cache itself loads from the database on a miss.',
     'Same behaviour as cache-aside, moved into the cache library. Cleaner application code, less control over what happens on a miss.'],
    ['Write-through',
     'Every write goes to the cache and the database together, synchronously.',
     'The cache is never stale. You pay the database latency on every write, and you cache things nobody ever reads.'],
    ['Write-back (write-behind)',
     'Write to the cache and acknowledge; flush to the database asynchronously.',
     'Fastest writes available, and the only one that can lose data — if the cache dies before the flush, those writes are gone. Metrics counters, yes; payments, no.'],
    ['Write-around',
     'Writes go straight to the database and skip the cache entirely; the cache fills on later reads.',
     'Right for write-heavy data that is rarely read back, so a flood of writes cannot evict the hot read set.'],
    ['Cache invalidation',
     'Removing or updating an entry when the underlying data changes.',
     'The hard one. Deleting on write is simpler and safer than updating on write, because two concurrent updates can leave the cache holding the loser.'],
    ['Cache eviction',
     'Deciding what to drop when the cache is full.',
     'Distinct from invalidation: eviction is about space, invalidation is about correctness. Interviewers do conflate them, so define both.'],
    ['TTL (time to live)',
     'An expiry on each entry so staleness is bounded even if invalidation is missed.',
     'Your backstop for every invalidation bug. Add a random spread to TTLs, or everything written in the same minute expires in the same minute.'],
    ['LRU (least recently used)',
     'Evict the entry untouched for the longest.',
     'The default in Redis and most caches. Cheap with a hash map plus a doubly linked list — and a favourite LLD question in its own right.'],
    ['LFU (least frequently used)',
     'Evict the entry accessed the fewest times.',
     'Better when popularity is stable, because LRU can throw out a genuinely hot key after one quiet stretch. Needs ageing, or yesterday’s hit stays cached forever.'],
    ['Cache stampede (dog-piling)',
     'A hot key expires and every concurrent request misses at once, so a thousand identical queries hit the database together.',
     'Fixes: a lock so one request refreshes while others serve stale, or refresh-ahead before expiry. This is the highest-yield cache question there is.'],
    ['Cache avalanche',
     'A large set of keys expires simultaneously — or the cache restarts empty — and the whole load lands on the database.',
     'Stampede is one key; avalanche is the whole cache. Jittered TTLs prevent the first case, warming prevents the second.'],
    ['Cache penetration',
     'Requests for keys that do not exist anywhere, so they miss the cache every time and always reach the database.',
     'The classic attack: request random ids in a loop. Cache the negative result, or put a Bloom filter in front to answer "definitely not here" without a lookup.'],
    ['Hot key',
     'One key taking a disproportionate share of traffic, overloading the single shard that owns it.',
     'A celebrity user, a flash-sale product. Fixes are replication of that key across nodes, or a small local in-process cache in front of the shared one.'],
    ['Distributed cache',
     'A cache spread across many nodes, sharded by key, shared by all application instances.',
     'Redis or Memcached. Consistent hashing decides which node owns a key so that adding a node moves a fraction of them rather than all.'],
  ],
  diagrams: [
    {
      title: 'Cache stampede, and the lock that fixes it',
      lines: [
        'WITHOUT                              WITH A REFRESH LOCK',
        '',
        'key expires at t=0                   key expires at t=0',
        '                                     ',
        'req1 miss -> DB                      req1 miss -> wins lock -> DB -> set',
        'req2 miss -> DB   1000 identical     req2 miss -> lock held -> serves stale',
        'req3 miss -> DB   queries in the     req3 miss -> lock held -> serves stale',
        '...              same millisecond    ...',
        'req1000 miss -> DB                   exactly one query reaches the database',
        '',
        'database saturates, latency          one refresh, everyone else served',
        'spikes, more requests pile in        from the slightly stale value',
      ],
      why:
        'Serving a value a few hundred milliseconds out of date is almost always better than ' +
        'serving a timeout. Saying that trade out loud is the answer they are listening for.',
    },
  ],
},

/* ------------------------------------------------------ messaging & events -- */
{
  id: 'messaging',
  name: 'Messaging & event-driven systems',
  blurb:
    'A queue turns a synchronous failure into a retry, which is why it appears in nearly every ' +
    'design. What it does not do is make delivery exact. Every serious question here is about ' +
    'duplicates and ordering.',
  terms: [
    ['Message queue',
     'A durable buffer between producer and consumer, so the producer does not wait and a slow consumer does not drop work.',
     'SQS, RabbitMQ. It absorbs bursts and decouples deploys — and it hides backlog, so queue depth needs an alarm.'],
    ['Publish/subscribe',
     'A producer publishes to a topic and every interested subscriber gets its own copy.',
     'A queue is work distribution — one message, one consumer. Pub/sub is fan-out — one event, many consumers. Mixing them up is a common slip.'],
    ['Event sourcing',
     'Store the sequence of events rather than the current state; the current state is a fold over the events.',
     'A ledger: you never edit a balance, you append entries. Gives perfect audit and time travel; costs you schema evolution on old events and snapshotting for read performance.'],
    ['CQRS',
     'Separate the write model from the read model, each shaped for its own job, kept in sync asynchronously.',
     'Writes normalised for correctness, reads denormalised for speed. Often paired with event sourcing, but genuinely independent of it — and it makes reads eventually consistent, which the UI has to handle.'],
    ['Message ordering',
     'Whether consumers see messages in the order they were sent.',
     'Kafka guarantees order within a partition, not across a topic. So you key by entity — all events for order 42 land on one partition — and get ordering where it actually matters.'],
    ['At-most-once delivery',
     'Every message is delivered zero or one times. Never duplicated, sometimes lost.',
     'Acknowledge before processing. Acceptable for a metrics sample; never for a payment.'],
    ['At-least-once delivery',
     'Every message is delivered one or more times. Never lost, sometimes duplicated.',
     'Acknowledge after processing. The default nearly everywhere, and the reason your consumer must be idempotent.'],
    ['Exactly-once processing',
     'Each message affects the system exactly once.',
     'Exactly-once *delivery* over a network is impossible; exactly-once *processing* is achievable by pairing at-least-once delivery with idempotent consumers or transactional writes. Saying it that precisely is the point of the question.'],
    ['Consumer group',
     'A set of consumers sharing a subscription, with each partition assigned to exactly one of them.',
     'How Kafka scales out: more consumers means more parallelism, up to the partition count. Beyond that, extra consumers sit idle.'],
    ['Partitioning (Kafka topics)',
     'Splitting a topic into independent ordered logs so throughput scales past one machine.',
     'The partition key is a design decision: it decides both ordering and hot spots. Key by user and one very busy user becomes a hot partition.'],
    ['Replay',
     'Re-reading the log from an earlier offset to rebuild state or reprocess after a bug.',
     'The superpower of a log over a queue: fix the consumer, reset the offset, reprocess a month. It only works if consumers are idempotent.'],
    ['Event streaming',
     'A durable, ordered, replayable log that many consumers read at their own pace.',
     'Kafka, Pulsar, Kinesis. A queue forgets a message once consumed; a log keeps it for the retention period, which is what makes replay and late-joining consumers possible.'],
    ['Outbox pattern',
     'Write the business row and the event to be published into the same database transaction; a separate relay reads the outbox table and publishes.',
     'The fix for the dual-write problem — "saved the order but crashed before publishing OrderCreated". This is the expected answer whenever a design has both a database and a broker.'],
    ['Inbox pattern',
     'The consumer side: record every processed message id in a table, and skip anything already recorded.',
     'How you make at-least-once delivery safe without a distributed transaction. The inbox table is the dedup store.'],
  ],
  diagrams: [
    {
      title: 'The dual-write problem, and the outbox',
      lines: [
        'DUAL WRITE (broken)                  OUTBOX (correct)',
        '',
        'BEGIN                                BEGIN',
        '  insert order                         insert order',
        'COMMIT            <- ok                insert outbox row (OrderCreated)',
        '                                     COMMIT       <- both or neither',
        'publish OrderCreated',
        '        x  process crashes           relay: read outbox -> publish -> mark sent',
        '',
        'order exists, event never sent.      the event cannot be lost: it is committed',
        'inventory never reserved. silent.    with the order. it may be sent TWICE, which',
        '                                     is fine because consumers are idempotent.',
      ],
      why:
        'The insight worth stating: you cannot make a database commit and a broker publish ' +
        'atomic without 2PC, so instead you make the event part of the database transaction and ' +
        'accept duplicate publishes. You have traded an impossible problem for a solved one.',
    },
  ],
},

/* -------------------------------------------------------------- databases -- */
{
  id: 'db',
  name: 'Databases',
  blurb:
    'Scaling reads is easy and scaling writes is not — that asymmetry drives every answer here. ' +
    'Know the difference between a replica and a shard, because candidates reach for sharding ' +
    'when a read replica and an index would have done.',
  terms: [
    ['Sharding',
     'Splitting rows across independent databases, each holding a subset, so writes scale past one machine.',
     'The last resort, because it costs you cross-shard joins, cross-shard transactions and a resharding project later. Exhaust indexes, replicas and caching first.'],
    ['Partitioning (tables)',
     'Splitting one table into pieces. Horizontal is by row (same columns, fewer rows); vertical is by column.',
     'Postgres declarative partitioning by month: old partitions detach and archive as a metadata operation instead of a giant DELETE. Sharding is partitioning across machines.'],
    ['Replication',
     'Keeping copies of the same data on more than one node.',
     'Buys read scale and failure survival. Synchronous replication costs write latency; asynchronous risks losing recent writes on failover. Name which you chose.'],
    ['Primary-replica',
     'One node accepts writes and streams changes to read-only replicas.',
     'The standard topology. Its defining hazard is replication lag: write, immediately read from a replica, and see your own change missing.'],
    ['Multi-master',
     'More than one node accepts writes.',
     'Removes the write bottleneck and hands you conflict resolution instead. Only reach for it when you truly need multi-region writes, and then say how conflicts resolve.'],
    ['Read replica',
     'A replica serving read traffic only.',
     'The first thing to try when reads are the bottleneck — far cheaper than sharding. Route reads that tolerate lag; keep read-after-write on the primary.'],
    ['Vertical scaling',
     'A bigger machine.',
     'Underrated. Modern hardware goes a very long way, and it costs no engineering. It ends at one machine and does nothing for availability.'],
    ['Horizontal scaling',
     'More machines.',
     'Unbounded in principle, and it makes everything else in this glossary your problem. Say why the vertical option ran out before you reach for it.'],
    ['Indexing',
     'A separate ordered structure that lets the database find rows without scanning the table.',
     'Every index makes writes slower and takes space. "Add an index" is a real answer, but say which columns and in which order.'],
    ['Composite index',
     'One index over several columns, in a specific order.',
     'Leftmost-prefix rule: an index on (a, b, c) helps a query on a, or a+b, but not one on b alone. This is the most commonly missed indexing question.'],
    ['Covering index',
     'An index containing every column a query needs, so the database answers from the index and never touches the table.',
     'Turns two lookups into one. Postgres calls it an index-only scan; watch it appear in EXPLAIN.'],
    ['B+ tree',
     'The balanced tree behind almost every relational index: sorted, with all values in the leaves, leaves linked together.',
     'Why it wins: O(log n) lookup AND efficient range scans, because the linked leaves let you walk a range in order. Hash indexes cannot do the second.'],
    ['Hash index',
     'A hash table from value to row location.',
     'Faster than a B+ tree for exact equality and useless for ranges or ordering. Which is why it is rarely the default.'],
    ['Full-text index',
     'An inverted index from each term to the documents containing it, built after tokenising and stemming.',
     'How Elasticsearch and Postgres tsvector work. Reach for it the moment somebody says "search", because LIKE \'%term%\' cannot use a normal index at all.'],
    ['Materialized view',
     'The stored result of a query, refreshed periodically, rather than recomputed on every read.',
     'A daily leaderboard or a rollup dashboard. It is a cache that lives in the database, with the same staleness question attached.'],
    ['Normalization',
     'Storing each fact exactly once and joining to assemble answers.',
     'Correct by construction: nothing can disagree with itself. Costs joins on the read path.'],
    ['Denormalization',
     'Duplicating data so reads need no joins.',
     'The deliberate trade for read speed: now the same fact lives in several places and you own keeping them in agreement. Which is CQRS in miniature.'],
  ],
},

/* ------------------------------------------------- storage & distributed DBs -- */
{
  id: 'storage',
  name: 'Storage & distributed databases',
  blurb:
    'The internals that turn up as follow-ups: how does the ring rebalance, how does the store ' +
    'absorb writes that fast, how do two nodes compare a terabyte cheaply.',
  terms: [
    ['Consistent hashing',
     'Map both keys and nodes onto a ring; a key belongs to the first node clockwise. Adding or removing a node moves only the keys in one arc, not all of them.',
     'Naive hash(key) % N remaps nearly everything when N changes — every cache miss at once. This is the fix, and one of the most-asked topics on the list.'],
    ['Virtual nodes (vnodes)',
     'Give each physical node many positions on the ring instead of one.',
     'Without them the ring is lumpy and a node inherits an unfair arc; with a few hundred vnodes each, load evens out and a departing node spreads its keys over all the others.'],
    ['Data locality',
     'Keeping data that is read together physically close together.',
     'Cassandra clustering keys put one partition’s rows adjacent on disk, so a range read is one sequential scan rather than scattered seeks.'],
    ['Rebalancing',
     'Moving data when nodes join or leave so the load stays even.',
     'The operationally dangerous moment: rebalancing competes with live traffic for disk and network, so it is throttled and slow.'],
    ['Hot partition',
     'One partition taking far more traffic than the others, so one node is saturated while the cluster looks idle.',
     'Caused by a bad partition key — timestamp keys send everything to today’s partition. Fix by salting the key or choosing a higher-cardinality one.'],
    ['Write amplification',
     'One logical write causing several physical writes.',
     'LSM compaction rewrites the same data repeatedly; SSD erase blocks add more. It is why a write-heavy workload can saturate disk far below the throughput you predicted.'],
    ['Read amplification',
     'One logical read causing several physical reads.',
     'An LSM read may check the memtable and several SSTables. Bloom filters exist precisely to cut this down.'],
    ['Bloom filter',
     'A small probabilistic bitmap that answers "definitely not present" or "possibly present". False positives, never false negatives.',
     'Kilobytes can stand in for gigabytes. Used in every LSM store to skip SSTables, and in front of a cache to defeat penetration attacks.'],
    ['Merkle tree',
     'A tree of hashes where each parent hashes its children, so two replicas can find their differences by comparing a few nodes.',
     'Cassandra anti-entropy repair, and Git, and blockchains. Compare the roots: equal means the whole subtree matches and you can skip it.'],
    ['LSM tree',
     'Buffer writes in memory, flush to sorted immutable files, and merge those files in the background. Writes are sequential appends, never in-place updates.',
     'RocksDB, Cassandra, LevelDB. Fast writes and cheap deletes at the cost of read amplification and compaction load — the mirror image of a B+ tree.'],
    ['SSTable',
     'Sorted String Table: an immutable file of key-value pairs in key order, with an index and usually a Bloom filter.',
     'The on-disk unit an LSM flushes to. Immutability is what makes compaction and snapshots simple.'],
  ],
  diagrams: [
    {
      title: 'Consistent hashing: adding a node moves one arc, not everything',
      lines: [
        'modulo hashing                     consistent hashing ring',
        '                                   ',
        'N=3  key k -> hash(k) % 3 = 1              0 ---- A ---- 90',
        'N=4  key k -> hash(k) % 4 = 2              |              |',
        '     ~ every key moves                     |              |',
        '                                          C ------------ B',
        '                                         270            180',
        '',
        '                                   add D at 45:  only keys in (0,45]',
        '                                   move from A to D. B and C untouched.',
        '',
        '                                   vnodes: A appears at 12 places, not one,',
        '                                   so departures spread across every node',
      ],
      why:
        'The number worth stating: with N nodes, adding one moves about 1/(N+1) of the keys ' +
        'rather than nearly all of them. That is the entire reason the ring exists.',
    },
  ],
},

/* ------------------------------------------------------------- scalability -- */
{
  id: 'scale',
  name: 'Scalability',
  blurb:
    'The front half of the diagram. Most of it is uncontroversial — the two ideas that separate ' +
    'candidates are statelessness (why it is what makes horizontal scaling possible at all) and ' +
    'backpressure (what to do when you cannot scale fast enough).',
  terms: [
    ['Load balancer',
     'Spreads requests across healthy instances and stops sending traffic to unhealthy ones.',
     'L4 routes on IP and port and is fast; L7 reads the request and can route by path or header. Round-robin, least-connections and consistent-hash are the algorithms to be able to name.'],
    ['Reverse proxy',
     'Sits in front of servers doing TLS termination, compression, static caching and routing.',
     'Every load balancer is a reverse proxy; not every reverse proxy balances load. nginx as a single-origin front door is the everyday case.'],
    ['Service discovery',
     'How a service finds the current addresses of another when instances come and go constantly.',
     'Consul, etcd, Kubernetes DNS. Hard-coded hosts stop working the moment you autoscale.'],
    ['Sticky sessions',
     'Pinning a client to the instance that served it before.',
     'A workaround for state held in process memory. It defeats even load distribution and loses the session when that instance dies — which is the argument for moving session state out.'],
    ['Stateless service',
     'Holds no per-client state between requests; any instance can serve any request.',
     'The property that makes horizontal scaling, rolling deploys and instant failover possible. State goes to Redis or the database instead.'],
    ['Stateful service',
     'Keeps data locally that matters and cannot simply be replaced.',
     'Databases, Kafka brokers, game servers. Scaling one means moving data, which is why StatefulSets exist and why you keep the count of these small.'],
    ['Autoscaling',
     'Adding and removing instances automatically from a signal.',
     'Scale out on queue depth or p99 latency rather than CPU — CPU is a lagging indicator. Watch the start-up time: if a pod takes 90 seconds to warm, the spike is over before it helps.'],
    ['Backpressure',
     'Telling the producer to slow down instead of accepting work you cannot handle.',
     'Bounded queues, 429s, TCP window. An unbounded queue is not resilience — it converts a load problem into an out-of-memory crash plus a latency spike nobody can see the end of.'],
  ],
},

/* ----------------------------------------------------------- microservices -- */
{
  id: 'micro',
  name: 'Microservices',
  blurb:
    'Be ready to argue the other side. "Start with a modular monolith and split when a boundary ' +
    'proves itself" is a stronger senior answer than reciting the benefits, and the patterns ' +
    'below are the tax you pay once you do split.',
  terms: [
    ['Service registry',
     'The directory of which instances of which service are currently alive and where.',
     'The store behind service discovery — Consul, Eureka, etcd. Registration on start-up, deregistration on shutdown, health checks to catch the ones that just vanished.'],
    ['Sidecar pattern',
     'A helper process deployed alongside each service instance handling cross-cutting concerns.',
     'Envoy next to your app doing mTLS, retries and metrics, so that behaviour is identical whatever language the service is written in.'],
    ['Service mesh',
     'All those sidecars plus a control plane, moving retries, timeouts, mTLS and traffic shifting out of application code entirely.',
     'Istio, Linkerd. Real power, real operational weight — do not put one in a three-service design without being asked.'],
    ['Distributed tracing',
     'Following one request across every service it touches, with timing for each hop.',
     'The only practical way to answer "why was this request slow" once there are more than three services. Jaeger, Zipkin, Tempo.'],
    ['Correlation ID',
     'A single id generated at the edge and propagated through every downstream call and log line.',
     'The cheapest possible observability win: one grep reconstructs an entire request. Add it before you add a tracing backend.'],
    ['Choreography',
     'Services react to each other’s events with no central coordinator.',
     'Loosely coupled and easy to extend; nobody owns the overall flow, so understanding "what happens when an order is placed" means reading five services.'],
    ['Orchestration',
     'A coordinator explicitly drives each step of the workflow.',
     'The flow is in one readable place and can be monitored; the orchestrator becomes a dependency and, if you are careless, a distributed monolith. Temporal and Step Functions are the usual tools.'],
    ['Backend for Frontend (BFF)',
     'A per-client API layer that aggregates and shapes downstream calls for one kind of consumer.',
     'The mobile app needs three fields; the web app needs thirty. A BFF each lets both evolve without a shared lowest common denominator.'],
  ],
},

/* --------------------------------------------------------------- security -- */
{
  id: 'security',
  name: 'Security',
  blurb:
    'Rarely the subject of the round, reliably a follow-up in it. The two that get people are ' +
    'authentication versus authorization, and what a JWT actually costs you when you need to ' +
    'revoke one.',
  terms: [
    ['Authentication',
     'Proving who you are.',
     'Password, token, certificate, passkey. The question "who is this" — and nothing about what they may do.'],
    ['Authorization',
     'Deciding what you are allowed to do.',
     'Comes after authentication and is the one that actually gets breached, usually as an object-level check somebody forgot: authenticated as user 7, requesting order 9.'],
    ['OAuth 2.0',
     'A delegation framework: let an application act on a resource owner’s behalf without ever seeing their password.',
     '"Sign in with Google" — Google authenticates, your app receives a scoped token. Authorization Code with PKCE is the flow to name; implicit is deprecated.'],
    ['OpenID Connect',
     'An identity layer on top of OAuth 2.0, adding an ID token that says who the user is.',
     'OAuth alone authorises access to a resource; it never actually told you the user’s identity. OIDC is the part that does — the distinction is a genuine interview question.'],
    ['JWT',
     'A signed, self-contained token carrying claims. The server verifies the signature instead of looking anything up.',
     'Stateless and fast, and hard to revoke: a stolen token stays valid until it expires. Short lifetimes plus refresh tokens, or a deny-list — which reintroduces the state you were avoiding.'],
    ['Session management',
     'Server-side sessions: the client holds an opaque id and the server holds the state.',
     'The opposite trade to JWT — revocation is instant because you delete a row, at the cost of a session lookup on every request. Both are correct; say which problem you optimised for.'],
    ['RBAC',
     'Permissions attach to roles; users get roles.',
     'Admin, editor, viewer. Simple and auditable, and it explodes combinatorially the moment rules involve anything about the specific object.'],
    ['ABAC',
     'Decisions computed from attributes of user, resource, action and context.',
     '"A manager may approve expenses under 10k in their own department." Expressive and much harder to reason about; reach for it only when roles genuinely cannot express the rule.'],
    ['API keys',
     'A long-lived shared secret identifying a calling application.',
     'Fine for server-to-server. Never in a browser or a mobile binary, where anyone can read it out.'],
    ['CSRF',
     'A malicious site causes the victim’s browser to send an authenticated request to yours, riding on cookies the browser attaches automatically.',
     'Only affects cookie-based auth. SameSite cookies plus an anti-forgery token. A bearer token in a header is not vulnerable, because nothing attaches it automatically.'],
    ['CORS',
     'A browser rule about which origins may read a cross-origin response.',
     'A protection for the user, not for your server — curl ignores it entirely. Widely misunderstood as a security control on the API.'],
    ['Encryption in transit',
     'Data encrypted on the wire.',
     'TLS everywhere, including between internal services — a flat trusted network is exactly how one compromised pod becomes a breach. mTLS is what a service mesh gives you for free.'],
    ['Encryption at rest',
     'Data encrypted on disk.',
     'Protects against a stolen disk or a leaked backup. It does not protect against an application bug, because your app decrypts on read. Say what the threat model actually is.'],
  ],
},

/* ---------------------------------------------------------- observability -- */
{
  id: 'obs',
  name: 'Observability',
  blurb:
    'Design questions end with "how would you know it broke?". Logs, metrics and traces answer ' +
    'different questions and are not substitutes — and an SLO is what turns "it feels slow" ' +
    'into a decision.',
  terms: [
    ['Logging',
     'A record of discrete events.',
     'Best for one specific thing that happened. Worst for aggregate questions — counting log lines to derive a rate is a metric wearing a disguise, and an expensive one.'],
    ['Structured logging',
     'Logs as key-value records rather than prose.',
     'The difference between grepping a sentence and querying a field. Emit JSON with the correlation id and the user id as fields.'],
    ['Metrics',
     'Numeric time series, aggregated.',
     'Cheap and always on: rate, errors, duration. Cardinality is the trap — a label containing user id creates millions of series and takes the metrics backend down.'],
    ['Tracing',
     'The path and timing of one request through the system.',
     'Answers "where did the 900ms go". Usually sampled, because tracing every request costs more than serving them.'],
    ['OpenTelemetry',
     'The vendor-neutral standard for producing traces, metrics and logs.',
     'Instrument once against OTel and change backend later. The safe thing to name rather than a specific vendor.'],
    ['SLI',
     'The measurement itself: the number you actually collect.',
     '"Proportion of requests served under 300ms." Concrete and unambiguous.'],
    ['SLO',
     'The target for that measurement.',
     '"99.9% of requests under 300ms over 30 days." It is what makes the error budget real: miss it and feature work stops in favour of reliability work.'],
    ['SLA',
     'The contractual promise, with consequences.',
     'Always looser than the SLO, deliberately — you want to be alerted before you owe a customer money. Ordering them SLI → SLO → SLA and saying why they differ is the whole question.'],
    ['Alerting',
     'Deciding what wakes a human up.',
     'Alert on symptoms the user feels, not on causes. "CPU is 90%" is not an incident; "checkout error rate is 5%" is.'],
  ],
},

/* --------------------------------------------------- architecture patterns -- */
{
  id: 'arch',
  name: 'Architecture patterns',
  blurb:
    'Vocabulary for the shape of the whole thing. Being able to argue FOR the monolith is worth ' +
    'more here than being able to list the benefits of microservices, because everyone can do ' +
    'the second one.',
  terms: [
    ['Monolith',
     'One deployable unit containing the whole application.',
     'Simplest to build, test, deploy and debug — one transaction, one log, one deploy. It becomes painful when one team’s change forces everyone’s release.'],
    ['Modular monolith',
     'A monolith with enforced internal boundaries: separate modules, no reaching across, but one deployment.',
     'The answer worth giving. You get the boundaries without the network between them — and if a module really needs its own lifecycle, it is already shaped to be extracted.'],
    ['Microservices',
     'Independently deployable services owning their own data, communicating over the network.',
     'Buys independent deploys and scaling. Costs distributed transactions, eventual consistency, tracing and a platform team. Worth it when teams block each other on release, not when the codebase is merely large.'],
    ['Event-driven architecture',
     'Components react to events rather than calling each other directly.',
     'Excellent decoupling and easy extension. The cost is that no single place describes the flow, so debugging means following events across services.'],
    ['Layered architecture',
     'Controller → service → repository, each layer depending only on the one beneath.',
     'The default in most Spring codebases. Familiar to everyone, and it leaks: business rules drift into controllers and SQL details into services.'],
    ['Hexagonal architecture (ports & adapters)',
     'Domain logic in the middle with no knowledge of the outside; everything external — HTTP, database, broker — plugs in through an interface the domain defines.',
     'The test is the payoff: the domain can be exercised with no database and no HTTP at all, because those are adapters.'],
    ['Clean architecture',
     'The same idea in concentric circles, with the dependency rule that source dependencies only ever point inwards.',
     'Hexagonal and Clean are close relatives; do not pretend they are unrelated. The shared rule is the one that matters: the domain depends on nothing.'],
    ['Strangler fig pattern',
     'Put a facade in front of the legacy system and move one route at a time to the new one, until nothing is left of the old.',
     'The credible migration answer. "Rewrite it and cut over" is the one that gets challenged, because the big-bang cutover has no way back.'],
    ['Domain-driven design (DDD)',
     'Model the software on the business domain, using the language the business already uses, with explicit bounded contexts.',
     'Bounded contexts are the practical payoff: they tell you where the service boundaries are. "Customer" means different things to billing and to support, and pretending otherwise creates the shared model everyone fights over.'],
  ],
},
];

export default GROUPS;

/* The short list. Everything above is worth recognising; this is the subset you
   should be able to hold a five-minute conversation about, unprompted, with a
   trade-off named. [term, group id, why this one keeps coming up] */
export type MustKnow = [string, string, string];

export const MUST_KNOW: MustKnow[] = [
  ['CAP theorem', 'consistency', 'The opener. Most candidates recite it and then misuse it outside a partition.'],
  ['PACELC', 'consistency', 'Shows you know CAP is only about the partition, and that latency is the everyday trade.'],
  ['Consistent hashing', 'storage', 'Asked directly, and needed the moment you say "distributed cache" or "sharding".'],
  ['Quorum read/write', 'consistency', 'R + W > N is one line and it makes the consistency/availability trade concrete.'],
  ['Raft', 'consensus', 'The follow-up to "who is the leader" and "what if the leader dies mid-write".'],
  ['Leader election', 'consensus', 'Comes up in any design with a coordinator, a scheduler or a primary.'],
  ['Saga pattern', 'txn', 'The expected answer for a checkout spanning services.'],
  ['2PC vs Saga', 'txn', 'A direct comparison question: atomicity-and-blocking against availability-and-compensation.'],
  ['Idempotency', 'api', 'The highest-frequency idea in the whole list. Every retry path depends on it.'],
  ['Optimistic vs pessimistic locking', 'conc', 'Asked whenever two users can touch one row — seats, inventory, balances.'],
  ['MVCC', 'conc', 'The follow-up to "why do readers not block writers in Postgres?".'],
  ['Isolation levels', 'conc', 'Name the level AND the anomaly it still allows; the anomaly is the real question.'],
  ['Cache stampede', 'cache', 'The standard "what happens when the hot key expires" trap.'],
  ['Cache invalidation', 'cache', 'Delete-on-write versus update-on-write, and why the second one races.'],
  ['Event sourcing', 'messaging', 'Comes up for ledgers, audit trails and anything needing history.'],
  ['CQRS', 'messaging', 'Paired with event sourcing, and the reason your reads became eventually consistent.'],
  ['Outbox pattern', 'messaging', 'The answer whenever a design writes to a database and publishes an event.'],
  ['Exactly once vs at least once', 'messaging', 'Tests whether you know exactly-once delivery is impossible and processing is not.'],
  ['Sharding', 'db', 'And, more importantly, why you did the cheaper things first.'],
  ['Replication', 'db', 'Sync versus async, and what replication lag does to read-after-write.'],
  ['Distributed locks', 'conc', 'Asked with the sharp follow-up: what if the lock holder pauses and the lease expires?'],
  ['Rate limiting algorithms', 'api', 'Token bucket, leaky bucket, fixed and sliding window — and where each one is wrong.'],
  ['Bloom filters', 'storage', 'The cheap answer to "how do you avoid a lookup for something that is not there".'],
  ['LSM trees', 'storage', 'Why write-heavy stores are built differently from B+ tree databases.'],
  ['Load balancing algorithms', 'scale', 'Round robin, least connections, consistent hash — and when each one matters.'],
];
