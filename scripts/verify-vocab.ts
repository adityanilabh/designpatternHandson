/* Every term on the source checklist reaches the vocabulary page.

   The list this page was built from had ~250 entries, but many were repeats
   across sections — Idempotency appears under APIs and again under the deep
   dives, CQRS under both Messaging and Architecture, and so on. Folding those
   is right (one definition, one place to revise it), but it means the term
   count no longer matches the source, so this asserts coverage directly rather
   than by counting.

   Run:  npx tsx scripts/verify-vocab.ts                                       */

import GROUPS, { MUST_KNOW } from '../content/sdvocab';

/* The source checklist, verbatim, section by section. */
const SOURCE: [string, string[]][] = [
  ['Concurrency & Consistency', [
    'Optimistic Locking', 'Pessimistic Locking', 'MVCC', 'Serializable Isolation',
    'Repeatable Read', 'Read Committed', 'Read Uncommitted', 'Dirty Read',
    'Non-Repeatable Read', 'Phantom Read', 'Compare-And-Swap', 'Distributed Locking',
    'Lease-Based Locking', 'Deadlock', 'Race Condition', 'Critical Section',
    'Lost Update Problem',
  ]],
  ['Distributed Transactions', [
    'Distributed Transactions', 'Two-Phase Commit', 'Three-Phase Commit', 'Saga Pattern',
    'Compensation Transaction', 'Try-Confirm-Cancel', 'XA Transactions',
    'Atomic Commit Protocol',
  ]],
  ['Consistency & Distributed Systems', [
    'CAP Theorem', 'PACELC Theorem', 'Strong Consistency', 'Eventual Consistency',
    'Causal Consistency', 'Linearizability', 'Sequential Consistency', 'Quorum Reads',
    'Quorum Writes', 'Read Repair', 'Anti-Entropy', 'Split Brain', 'Network Partition',
    'Consensus',
  ]],
  ['Consensus Algorithms', [
    'Paxos', 'Raft', 'Zab', 'Leader Election', 'Log Replication', 'Majority Consensus',
    'Heartbeats', 'Follower', 'Candidate', 'Leader',
  ]],
  ['Reliability & Fault Tolerance', [
    'Retry Pattern', 'Exponential Backoff', 'Circuit Breaker', 'Bulkhead Pattern',
    'Failover', 'Fallback', 'Graceful Degradation', 'Health Checks', 'Heartbeats',
    'Dead Letter Queue', 'Poison Message', 'Redundancy', 'High Availability',
    'Disaster Recovery',
  ]],
  ['APIs & Service Design', [
    'Idempotency', 'Idempotency Key', 'REST', 'RPC', 'gRPC', 'GraphQL', 'API Gateway',
    'Rate Limiting', 'Throttling', 'Pagination', 'Cursor Pagination', 'Offset Pagination',
    'Webhooks', 'Long Polling', 'Server Sent Events', 'WebSockets', 'API Versioning',
    'Request Deduplication',
  ]],
  ['Caching', [
    'Cache Aside', 'Write Through', 'Write Back', 'Write Around', 'Read Through',
    'Cache Invalidation', 'Cache Eviction', 'TTL', 'LRU', 'LFU', 'Cache Stampede',
    'Cache Avalanche', 'Cache Penetration', 'Hot Keys', 'Distributed Cache',
  ]],
  ['Messaging & Event Driven Systems', [
    'Message Queue', 'Pub/Sub', 'Event Sourcing', 'CQRS', 'Eventual Consistency',
    'Message Ordering', 'Exactly Once Processing', 'At Least Once Delivery',
    'At Most Once Delivery', 'Consumer Groups', 'Partitioning', 'Replay',
    'Event Streaming', 'Outbox Pattern', 'Inbox Pattern',
  ]],
  ['Databases', [
    'Sharding', 'Partitioning', 'Replication', 'Primary-Replica', 'Multi-Master',
    'Read Replica', 'Vertical Scaling', 'Horizontal Scaling', 'Indexing',
    'Composite Index', 'Covering Index', 'B+ Tree', 'Hash Index', 'Full Text Index',
    'Materialized View', 'Denormalization', 'Normalization',
  ]],
  ['Storage & Distributed Databases', [
    'Consistent Hashing', 'Virtual Nodes', 'Data Locality', 'Rebalancing',
    'Data Replication', 'Hot Partition', 'Write Amplification', 'Read Amplification',
    'Bloom Filter', 'Merkle Tree', 'LSM Tree', 'SSTable',
  ]],
  ['Scalability', [
    'Load Balancer', 'Reverse Proxy', 'Service Discovery', 'Sticky Sessions',
    'Stateless Services', 'Stateful Services', 'Horizontal Scaling', 'Vertical Scaling',
    'Autoscaling', 'Backpressure',
  ]],
  ['Microservices', [
    'Service Registry', 'API Gateway', 'Sidecar Pattern', 'Service Mesh',
    'Distributed Tracing', 'Correlation ID', 'Saga', 'Choreography', 'Orchestration',
    'BFF',
  ]],
  ['Security', [
    'Authentication', 'Authorization', 'OAuth2', 'OpenID Connect', 'JWT',
    'Session Management', 'RBAC', 'ABAC', 'API Keys', 'CSRF', 'CORS', 'Rate Limiting',
    'Encryption at Rest', 'Encryption in Transit',
  ]],
  ['Observability', [
    'Logging', 'Structured Logging', 'Metrics', 'Tracing', 'Distributed Tracing',
    'OpenTelemetry', 'SLI', 'SLO', 'SLA', 'Alerting', 'Correlation ID',
  ]],
  ['Architecture Patterns', [
    'Monolith', 'Microservices', 'Event Driven Architecture', 'Hexagonal Architecture',
    'Clean Architecture', 'Layered Architecture', 'CQRS', 'Event Sourcing',
    'Strangler Pattern', 'Domain Driven Design',
  ]],
  ['Interview-Favorite Deep Dives', [
    'CAP Theorem', 'PACELC', 'Consistent Hashing', 'Quorum Read/Write', 'Raft',
    'Leader Election', 'Saga Pattern', '2PC vs Saga', 'Idempotency',
    'Optimistic vs Pessimistic Locking', 'MVCC', 'Isolation Levels', 'Cache Stampede',
    'Cache Invalidation', 'Event Sourcing', 'CQRS', 'Outbox Pattern',
    'Exactly Once vs At Least Once', 'Sharding', 'Replication', 'Distributed Locks',
    'Rate Limiting Algorithms', 'Bloom Filters', 'LSM Trees',
    'Load Balancing Algorithms',
  ]],
];

/* A few source entries are answered by an entry under a clearer name, or are one
   facet of a single entry. Each is listed with what covers it, so the mapping is
   reviewable rather than hidden inside a fuzzy matcher. */
const COVERED_BY: Record<string, string> = {
  'quorum reads': 'Quorum reads / writes',
  'quorum writes': 'Quorum reads / writes',
  'quorum read/write': 'Quorum reads / writes',
  'follower': 'Follower / candidate / leader',
  'candidate': 'Follower / candidate / leader',
  'leader': 'Follower / candidate / leader',
  'compensation transaction': 'Compensating transaction',
  'pub/sub': 'Publish/subscribe',
  'hot keys': 'Hot key',
  'bloom filters': 'Bloom filter',
  'lsm trees': 'LSM tree',
  'distributed locks': 'Distributed locking',
  'isolation levels': 'Serializable isolation',
  'data replication': 'Replication',
  'partitioning': 'Partitioning (tables)',
  'bff': 'Backend for Frontend (BFF)',
  'oauth2': 'OAuth 2.0',
  'strangler pattern': 'Strangler fig pattern',
  'domain driven design': 'Domain-driven design (DDD)',
  'event driven architecture': 'Event-driven architecture',
  'server sent events': 'Server-sent events (SSE)',
  'compare-and-swap': 'Compare-and-swap (CAS)',
  'mvcc': 'MVCC (multi-version concurrency control)',
  'two-phase commit': 'Two-phase commit (2PC)',
  'three-phase commit': 'Three-phase commit (3PC)',
  'try-confirm-cancel': 'Try-Confirm-Cancel (TCC)',
  'distributed transactions': 'Distributed transaction',
  'dead letter queue': 'Dead letter queue (DLQ)',
  'high availability': 'High availability (HA)',
  'consumer groups': 'Consumer group',
  'sticky sessions': 'Sticky sessions',
  'stateless services': 'Stateless service',
  'stateful services': 'Stateful service',
  'cache aside': 'Cache-aside (lazy loading)',
  'write through': 'Write-through',
  'write back': 'Write-back (write-behind)',
  'write around': 'Write-around',
  'read through': 'Read-through',
  'ttl': 'TTL (time to live)',
  'lru': 'LRU (least recently used)',
  'lfu': 'LFU (least frequently used)',
  'cache stampede': 'Cache stampede (dog-piling)',
  'exactly once processing': 'Exactly-once processing',
  'at least once delivery': 'At-least-once delivery',
  'at most once delivery': 'At-most-once delivery',
  'hexagonal architecture': 'Hexagonal architecture (ports & adapters)',
  'jwt': 'JWT',
  'sla': 'SLA',
  'slo': 'SLO',
  'sli': 'SLI',
  'rbac': 'RBAC',
  'abac': 'ABAC',
  'csrf': 'CSRF',
  'cors': 'CORS',
  'rest': 'REST',
  'rpc': 'RPC',
  'grpc': 'gRPC',
  'graphql': 'GraphQL',
  'cqrs': 'CQRS',
  'raft': 'Raft',
  'paxos': 'Paxos',
  'zab': 'Zab',
  '2pc vs saga': 'Saga pattern',
  'optimistic vs pessimistic locking': 'Optimistic locking',
  'exactly once vs at least once': 'Exactly-once processing',
  'rate limiting algorithms': 'Rate limiting',
  'load balancing algorithms': 'Load balancer',
  'saga': 'Saga pattern',
  'pacelc': 'PACELC theorem',
  'exponential backoff': 'Exponential backoff',
};

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+/ ]/g, ' ').replace(/\s+/g, ' ').trim();

const HAVE = new Map<string, string>();
for (const g of GROUPS) for (const [t] of g.terms) HAVE.set(norm(t), g.id);

function covered(entry: string): string | null {
  const n = norm(entry);
  if (HAVE.has(n)) return HAVE.get(n)!;
  const alias = COVERED_BY[n];
  if (alias && HAVE.has(norm(alias))) return HAVE.get(norm(alias))!;
  /* last resort: an entry whose words are all present in one term */
  for (const [have, gid] of HAVE) {
    if (have.startsWith(n + ' ') || have === n) return gid;
  }
  return null;
}

let missing = 0;
let total = 0;
const seen = new Set<string>();

console.log('');
for (const [section, entries] of SOURCE) {
  const gaps: string[] = [];
  for (const e of entries) {
    total++;
    const dup = seen.has(norm(e));
    seen.add(norm(e));
    if (covered(e)) continue;
    if (!dup) gaps.push(e);
    missing++;
  }
  const mark = gaps.length ? 'MISSING' : 'ok     ';
  console.log(`  ${mark} ${section.padEnd(38)} ${entries.length - gaps.length}/${entries.length}` +
    (gaps.length ? `   -> ${gaps.join(', ')}` : ''));
}

const uniqueSource = seen.size;
const termCount = GROUPS.reduce((n, g) => n + g.terms.length, 0);

console.log('');
console.log(`  source entries          ${total} (${uniqueSource} unique after folding repeats)`);
console.log(`  terms on the page       ${termCount} across ${GROUPS.length} groups`);
console.log(`  diagrams                ${GROUPS.reduce((n, g) => n + (g.diagrams?.length || 0), 0)}`);
console.log(`  deep-dive shortlist     ${MUST_KNOW.length}`);

const badRef = MUST_KNOW.filter((m) => !GROUPS.some((g) => g.id === m[1]));
if (badRef.length) {
  console.log(`\n  ${badRef.length} deep-dive rows point at a group that does not exist.\n`);
  process.exit(1);
}

if (missing) {
  console.log(`\n${missing} source entries are not covered.\n`);
  process.exit(1);
}
console.log('\nEvery entry on the source checklist reaches the page.\n');
