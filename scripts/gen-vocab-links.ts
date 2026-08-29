/* Source links for the design vocabulary page.

   WHY NOT SEARCH. The earlier resolver for the tech questions learned this the
   hard way: Wikipedia's search matches titles perfectly and subjects terribly.
   "Circuit breaker" is an electrical switch, "Bulkhead" is part of a ship,
   "Outbox" is an email folder. So nothing here is searched for. Each candidate
   below is an EXACT article title chosen by hand, and the script's only job is
   to throw out the ones that turn out not to exist, to be a disambiguation
   page, or not to be about computing.

   Terms with no good canonical article are simply absent — the page renders
   fine without a link, and a wrong link is worse than none.

   Run:  npx tsx scripts/gen-vocab-links.ts                                    */

import { writeFileSync } from 'node:fs';
import GROUPS from '../content/sdvocab';

const OUT = 'content/sdvocab-links.ts';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TargetLadder-linkcheck/1.0';

/* term on the page -> exact Wikipedia article title */
const CANDIDATES: Record<string, string> = {
  /* concurrency */
  'MVCC (multi-version concurrency control)': 'Multiversion concurrency control',
  'Serializable isolation': 'Isolation (database systems)',
  'Compare-and-swap (CAS)': 'Compare-and-swap',
  'Deadlock': 'Deadlock (computer science)',
  'Race condition': 'Race condition',
  'Critical section': 'Critical section',
  'Optimistic locking': 'Optimistic concurrency control',
  'Pessimistic locking': 'Record locking',

  /* distributed transactions */
  'Distributed transaction': 'Distributed transaction',
  'Two-phase commit (2PC)': 'Two-phase commit protocol',
  'Three-phase commit (3PC)': 'Three-phase commit protocol',
  'XA transactions': 'X/Open XA',
  'Atomic commit protocol': 'Atomic commit',
  'Compensating transaction': 'Compensating transaction',

  /* consistency */
  'CAP theorem': 'CAP theorem',
  'PACELC theorem': 'PACELC design principle',
  'Strong consistency': 'Strong consistency',
  'Eventual consistency': 'Eventual consistency',
  'Causal consistency': 'Causal consistency',
  'Linearizability': 'Linearizability',
  'Sequential consistency': 'Sequential consistency',
  'Quorum reads / writes': 'Quorum (distributed computing)',
  'Split brain': 'Split-brain (computing)',
  'Network partition': 'Network partition',
  'Consensus': 'Consensus (computer science)',

  /* consensus */
  'Paxos': 'Paxos (computer science)',
  'Raft': 'Raft (algorithm)',
  'Leader election': 'Leader election',
  'Majority consensus': 'Quorum (distributed computing)',
  'Heartbeats': 'Heartbeat (computing)',

  /* reliability */
  'Exponential backoff': 'Exponential backoff',
  'Dead letter queue (DLQ)': 'Dead letter queue',
  'High availability (HA)': 'High availability',
  'Disaster recovery': 'Disaster recovery',
  'Redundancy': 'Redundancy (engineering)',
  'Failover': 'Failover',

  /* api */
  'Idempotency': 'Idempotence',
  'REST': 'REST',
  'RPC': 'Remote procedure call',
  'gRPC': 'gRPC',
  'GraphQL': 'GraphQL',
  'API gateway': 'API management',
  'Rate limiting': 'Rate limiting',
  'WebSockets': 'WebSocket',
  'Server-sent events (SSE)': 'Server-sent events',
  'API versioning': 'Software versioning',
  'Webhooks': 'Webhook',

  /* caching */
  'Cache-aside (lazy loading)': 'Cache (computing)',
  'Cache invalidation': 'Cache invalidation',
  'Cache eviction': 'Cache replacement policies',
  'LRU (least recently used)': 'Cache replacement policies',
  'LFU (least frequently used)': 'Least frequently used',
  'Cache stampede (dog-piling)': 'Cache stampede',
  'Distributed cache': 'Distributed cache',
  'TTL (time to live)': 'Time to live',

  /* messaging */
  'Message queue': 'Message queue',
  'Publish/subscribe': 'Publish–subscribe pattern',
  'Event sourcing': 'Event store',
  'Message ordering': 'Total order broadcast',
  'Event streaming': 'Event stream processing',

  /* databases */
  'Sharding': 'Shard (database architecture)',
  'Partitioning (tables)': 'Partition (database)',
  'Replication': 'Replication (computing)',
  'Indexing': 'Database index',
  'B+ tree': 'B+ tree',
  'Hash index': 'Hash table',
  'Full-text index': 'Full-text search',
  'Materialized view': 'Materialized view',
  'Normalization': 'Database normalization',
  'Denormalization': 'Denormalization',
  'Vertical scaling': 'Scalability',
  'Horizontal scaling': 'Scalability',

  /* storage */
  'Consistent hashing': 'Consistent hashing',
  'Bloom filter': 'Bloom filter',
  'Merkle tree': 'Merkle tree',
  'LSM tree': 'Log-structured merge-tree',
  'Write amplification': 'Write amplification',

  /* scalability */
  'Load balancer': 'Load balancing (computing)',
  'Reverse proxy': 'Reverse proxy',
  'Service discovery': 'Service discovery',
  'Autoscaling': 'Autoscaling',

  /* microservices */
  'Service mesh': 'Service mesh',
  'Sidecar pattern': 'Sidecar pattern',
  'Distributed tracing': 'Tracing (software)',

  /* security */
  'Authentication': 'Authentication',
  'Authorization': 'Authorization',
  'OAuth 2.0': 'OAuth',
  'OpenID Connect': 'OpenID Connect',
  'JWT': 'JSON Web Token',
  'RBAC': 'Role-based access control',
  'ABAC': 'Attribute-based access control',
  'CSRF': 'Cross-site request forgery',
  'CORS': 'Cross-origin resource sharing',
  'API keys': 'Application programming interface key',
  'Session management': 'Session (computer science)',

  /* observability */
  'OpenTelemetry': 'OpenTelemetry',
  'Tracing': 'Tracing (software)',
  'SLA': 'Service-level agreement',
  'SLO': 'Service-level objective',
  'SLI': 'Service level indicator',
  'Structured logging': 'Logging (computing)',

  /* architecture */
  'Monolith': 'Monolithic application',
  'Microservices': 'Microservices',
  'Event-driven architecture': 'Event-driven architecture',
  'Layered architecture': 'Multitier architecture',
  'Hexagonal architecture (ports & adapters)': 'Hexagonal architecture (software)',
  'Domain-driven design (DDD)': 'Domain-driven design',
  'CQRS': 'Command Query Responsibility Segregation',
};

/* An article has to be about computing to be a useful link from this page.
   This is exactly the gate that caught "Idempotency of entailment". */
const DOMAIN = new RegExp([
  'comput', 'software', 'programm', 'data ?base', 'algorithm', 'network',
  'distributed', 'concurren', 'thread', 'internet', ' web ', 'server',
  'application', 'protocol', 'cach', 'storage', 'processor', 'memory',
  'operating system', 'information technology', 'cryptograph', 'authenticat',
  'authoris', 'authoriz',
  /* the words those articles actually use: the first pass was too narrow and
     threw away "B+ tree" and "Denormalization", neither of which ever says
     "computing" - they just get on with it */
  'tree', 'node', 'index', 'record', 'table', 'query', 'transaction', 'queue',
  'message', 'replica', 'cluster', 'disk', 'file system', 'token', 'client',
  'request', 'latency', 'throughput', 'schema', 'relational', 'microservice',
].join('|'), 'i')

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Hit = [string, string, string];   /* [publisher, url, article title] */

class RateLimited extends Error {}

async function check(title: string): Promise<Hit | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      /* the summary endpoint rate-limits hard; back off rather than lose a term */
      if (res.status === 429 || res.status >= 500) { await sleep(3000 * (attempt + 1)); continue; }
      if (!res.ok) return null;
      const j = (await res.json()) as {
        type?: string; extract?: string; title?: string;
        content_urls?: { desktop?: { page?: string } };
      };
      if (j.type !== 'standard') return null;                 /* disambiguation, redirect stub */
      if (!DOMAIN.test(j.extract || '')) return null;         /* right title, wrong field */
      const page = j.content_urls?.desktop?.page;
      if (!page) return null;
      return ['Wikipedia', page, j.title || title];
    } catch {
      await sleep(1500);
    }
  }
  /* Four attempts and still throttled: say so rather than silently reporting
     the article does not exist, which is how two runs of this script produced
     two different files. */
  throw new RateLimited(title);
}

async function main() {
  const known = new Set<string>();
  for (const g of GROUPS) for (const [t] of g.terms) known.add(t);

  const entries = Object.entries(CANDIDATES);
  const stale = entries.filter(([term]) => !known.has(term)).map(([t]) => t);
  if (stale.length) {
    console.log(`\n${stale.length} candidate(s) name a term that is not on the page:`);
    for (const t of stale) console.log(`  ${t}`);
    console.log('');
  }

  const out: Record<string, Hit> = {};
  let n = 0, kept = 0, dropped = 0;
  const rejected: string[] = [];
  const unresolved: [string, string][] = [];

  for (const [term, title] of entries) {
    n++;
    if (!known.has(term)) continue;
    let hit: Hit | null = null;
    let throttled = false;
    try {
      hit = await check(title);
    } catch {
      throttled = true;
      unresolved.push([term, title]);
    }
    if (hit) { out[term] = hit; kept++; }
    else if (!throttled) { dropped++; rejected.push(`${term}  ->  ${title}`); }
    console.log(`[${n}/${entries.length}] ${throttled ? 'wait' : hit ? 'keep' : 'DROP'}  ${term}`);
    await sleep(700);
  }

  /* second pass, slower, for anything the rate limiter swallowed */
  for (const [term, title] of unresolved) {
    await sleep(4000);
    try {
      const hit = await check(title);
      if (hit) { out[term] = hit; kept++; console.log(`retry keep  ${term}`); }
      else { dropped++; rejected.push(`${term}  ->  ${title}`); console.log(`retry DROP  ${term}`); }
    } catch {
      dropped++;
      rejected.push(`${term}  ->  ${title}   (still rate-limited - re-run to settle)`);
      console.log(`retry WAIT  ${term}`);
    }
  }

  const body = Object.keys(out).sort()
    .map((k) => {
      const [p, u, t] = out[k];
      const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `  '${esc(k)}': ['${esc(p)}', '${esc(u)}', '${esc(t)}'],`;
    })
    .join('\n');

  writeFileSync(OUT, [
    '/* GENERATED by scripts/gen-vocab-links.ts — do not hand-edit.',
    '',
    '   One source link per vocabulary term, for the terms that have a canonical',
    '   article. Titles are hand-picked, never searched for; the script only',
    '   verifies that each one exists, is a real article rather than a',
    '   disambiguation page, and is actually about computing. Terms absent from',
    '   this map render without a link, which is the correct outcome when no',
    '   canonical article exists — a wrong link is worse than none.',
    '',
    `   ${kept} of ${entries.length} candidates kept.  */`,
    '',
    'const LINKS: Record<string, [string, string, string]> = {',
    body,
    '};',
    '',
    'export default LINKS;',
    '',
  ].join('\n'));

  console.log(`\nkept ${kept}, dropped ${dropped}`);
  if (rejected.length) {
    console.log('\nrejected (no article, disambiguation, or not a computing subject):');
    for (const r of rejected) console.log(`  ${r}`);
  }
  console.log(`\nwrote ${OUT}\n`);
}

main();
