import type { Metadata } from 'next';
import Link from 'next/link';
import GROUPS, { MUST_KNOW } from '@/content/sdvocab';
import LINKS from '@/content/sdvocab-links';
import { AsciiBlock, Table } from '@/components/content';
import Notes from '@/components/Notes';

export const metadata: Metadata = {
  title: 'Design vocabulary — Target Ladder',
  description:
    'The system design vocabulary checklist: what each term means in plain words, and the ' +
    'example that makes it stick.',
};

/* A static segment sits alongside app/sd/[session] and wins the match, so this
   is /sd/vocabulary and the session route never sees it.

   Deliberately a server component with no filter box. 182 terms is a lot to
   scan, but the page is prerendered and the browser's own find-in-page already
   does the job — shipping the whole glossary to the client to reimplement
   Ctrl-F would be a poor trade. */
export default function VocabularyPage() {
  const termCount = GROUPS.reduce((n, g) => n + g.terms.length, 0);
  const diagramCount = GROUPS.reduce((n, g) => n + (g.diagrams?.length || 0), 0);
  const groupName = (id: string) => GROUPS.find((g) => g.id === id)?.name || id;

  return (
    <>
      <div className="pane-head">
        <div className="eyebrow">System design · reference</div>
        <h1>Design vocabulary</h1>
        <p className="pane-sub">
          A checklist, not a dictionary. Recognising a term is worth very little in a design
          round — what gets tested is whether you know <i>when</i> it applies and what it costs.
          So each entry carries the plain-words meaning and the example that makes it stick.
        </p>
        <div className="pane-stats">
          <span><b>{termCount}</b> terms</span>
          <span><b>{GROUPS.length}</b> groups</span>
          <span><b>{diagramCount}</b> diagrams</span>
          <span><b>{MUST_KNOW.length}</b> deep dives</span>
        </div>
      </div>

      <div className="learn">
        <b>How to use this.</b> Read a group, then close it and say each term out loud with its
        trade-off attached — &ldquo;quorum: R plus W greater than N, and it costs me availability
        because W equals 2 fails when two nodes are down.&rdquo; A term you can only define is a
        term you will hand-wave under pressure.
      </div>

      {/* ---------------------------------------------------- the short list -- */}
      <h2 className="pane-h2">
        Start here — the deep dives <span className="h2-count">{MUST_KNOW.length}</span>
      </h2>
      <p className="pane-p">
        Everything below is worth recognising. These are the ones to be able to hold a
        five-minute conversation about, unprompted, with a trade-off named.
      </p>
      <Table
        heads={['Topic', 'Group', 'Why it keeps coming up']}
        rows={MUST_KNOW.map(([term, gid, why]) => [
          <span className="fire" key="t">{term}</span>,
          <a className="lnk" href={`#${gid}`} key="g">{groupName(gid)}</a>,
          <span className="trig" key="w">{why}</span>,
        ])}
      />

      {/* --------------------------------------------------------- the groups -- */}
      {GROUPS.map((g) => (
        <section key={g.id}>
          <h2 className="pane-h2" id={g.id}>
            {g.name} <span className="h2-count">{g.terms.length}</span>
          </h2>
          <p className="pane-p">{g.blurb}</p>

          <Table
            heads={['Term', 'In plain words', 'Where it shows up']}
            rows={g.terms.map(([term, plain, when]) => [
              <span className="fire" key="t">
                {term}
                {LINKS[term] && (
                  <>
                    {' '}
                    <a
                      className="vocab-src"
                      href={LINKS[term][1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${LINKS[term][0]} — ${LINKS[term][2]}`}
                    >
                      {LINKS[term][0]} ↗
                    </a>
                  </>
                )}
              </span>,
              <span className="canon" key="p">{plain}</span>,
              <span className="trig" key="w">{when}</span>,
            ])}
          />

          {g.table && (
            <>
              <h3 className="vocab-h3">{g.table.title}</h3>
              <Table heads={g.table.heads} rows={g.table.rows} />
              <p className="dim" style={{ fontSize: 13, marginTop: -6 }}>
                * MySQL InnoDB&rsquo;s repeatable read blocks most phantoms in practice via
                next-key locking. The table above is the standard SQL definition, which is what
                gets asked.
              </p>
            </>
          )}

          {g.diagrams?.map((d) => (
            <div key={d.title}>
              <AsciiBlock title={d.title} lines={d.lines} />
              {d.why && <div className="code-why vocab-why">{d.why}</div>}
            </div>
          ))}
        </section>
      ))}

      <h2 className="pane-h2">Where this connects</h2>
      <p className="pane-p">
        This page is vocabulary. The place to spend it is the 22 design sessions, which take the
        same ideas and make you build something with them — and the tech modules, where the
        database and messaging halves are asked as direct questions.
      </p>
      <ul className="readlist">
        <li><Link className="lnk" href="/sd/1">Session 1 — Fundamentals &amp; estimation</Link></li>
        <li><Link className="lnk" href="/tech/pg">Tech · PostgreSQL — isolation, indexing, locking</Link></li>
        <li><Link className="lnk" href="/tech/kafka">Tech · Kafka — ordering, delivery, consumer groups</Link></li>
        <li><Link className="lnk" href="/tech/micro">Tech · Microservices &amp; resilience</Link></li>
      </ul>

      <Notes
        noteKey="sd-vocab"
        label="Terms you could not explain out loud"
        placeholder="Write the ones that came out mushy. Those are the follow-ups you will get."
      />
    </>
  );
}
