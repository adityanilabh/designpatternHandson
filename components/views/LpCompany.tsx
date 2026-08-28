import Link from 'next/link';
import { BulletList, Table, Qa } from '@/components/content';
import LP from '@/content/lp';

function Head({ eyebrow, title, sub }: { eyebrow: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="pane-head">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {sub && <p className="pane-sub">{sub}</p>}
    </div>
  );
}

/* One company page. `page` is '' for the overview, otherwise the sub-page id. */
export default function LpCompany({ co, page }: { co: any; page: string }) {
  if (page === '') {
    return (
      <>
        <Head eyebrow={`${co.rung} · ${co.label}`} title={co.name} sub={co.oneLine} />
        <div className="learn"><b>What it is worth.</b> {co.weight}</div>
        <h2 className="pane-h2">The rubric, in one table</h2>
        <Table heads={['', 'Value', 'Freq', 'What it actually means']}
          rows={co.values.map((v: any) => [
            <span className="canon">{v.n}</span>,
            <Link className="lnk" href={`/lp/${co.id}/v-${v.id}`}>{v.name}</Link>,
            <span className={`chip freq-${v.freq}`}>{v.freq}</span>,
            <span className="trig">{v.means}</span>,
          ])} />
        <h2 className="pane-h2">How this room differs from the others</h2>
        <div className="exit">{co.contrast}</div>
        <h2 className="pane-h2">How much of this is published</h2>
        <div className="sd-who"><i>source and confidence</i>{co.source}</div>
      </>
    );
  }

  if (page === 'scoring') {
    return (
      <>
        <Head eyebrow={co.name} title="How it is scored" sub={co.scoring.intro} />
        <h2 className="pane-h2">Where it happens</h2>
        <Table heads={['Round', 'Time', 'What happens']}
          rows={co.scoring.rounds.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
        <h2 className="pane-h2">What they are actually scoring</h2>
        <Table heads={['', 'Why it matters']}
          rows={co.scoring.rubric.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
          ])} />
        <h2 className="pane-h2">Things nobody tells you</h2>
        <BulletList items={co.scoring.reality} cls="fail" />
      </>
    );
  }

  if (page === 'framework') {
    const F = co.framework;
    return (
      <>
        <Head eyebrow={co.name} title="The story format" sub={F.intro} />
        <Table heads={['Part', 'Budget', 'What goes in it']}
          rows={F.parts.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="canon">{r[1]}</span>,
            <span className="trig">{r[2]}</span>,
          ])} />
        <div className="learn"><b>Timing.</b> {F.timing}</div>
        <h2 className="pane-h2">Rules for this room</h2>
        <ol className="rules">{F.rules.map((r: string, i: number) => <li key={i}>{r}</li>)}</ol>
      </>
    );
  }

  if (page === 'probes') {
    return (
      <>
        <Head eyebrow={co.name} title="The follow-up probes" sub={co.probes.intro} />
        {co.probes.groups.map((g: any, i: number) => (
          <div key={i}>
            <h2 className="pane-h2">{g[0]}</h2>
            <BulletList items={g[1]} cls="asked" />
          </div>
        ))}
        <h2 className="pane-h2">How to handle them</h2>
        <Table heads={['Situation', 'What to do']}
          rows={co.probes.tactics.map((r: any) => [
            <span className="fire">{r[0]}</span>, <span className="trig">{r[1]}</span>,
          ])} />
      </>
    );
  }

  if (page === 'anti') {
    return (
      <>
        <Head eyebrow={co.name} title="Anti-patterns"
          sub={`${co.anti.length} ways candidates lose this round. They are not the same ${co.anti.length} at the next company.`} />
        {co.anti.map((r: any, i: number) => (
          <div key={i}>
            <h2 className="pane-h2">{i + 1}. {r[0]}</h2>
            <p className="pane-p">{r[1]}</p>
            <div className="exit">{r[2]}</div>
          </div>
        ))}
      </>
    );
  }

  if (page === 'worked') {
    const w = co.worked;
    return (
      <>
        <Head eyebrow={co.name} title="A worked story"
          sub="One complete answer, cut for this room. The right column is why each part is shaped that way." />
        <div className="learn">
          <b>Question.</b> {w.question}<br /><b>Scoring against.</b> {w.principle}
        </div>
        {w.story.map((s: any, i: number) => (
          <div key={i}>
            <h2 className="pane-h2">{s[0]}</h2>
            <div className="lp-said">{s[1]}</div>
            <div className="lp-why"><i>why it is shaped this way</i>{s[2]}</div>
          </div>
        ))}
        <h2 className="pane-h2">The probes, and how they are answered</h2>
        {w.probesAndAnswers.map((r: any, i: number) => <Qa key={i} q={r[0]} a={r[1]} />)}
        <h2 className="pane-h2">Why this one works here</h2>
        <div className="exit">{w.why}</div>
      </>
    );
  }

  if (page === 'coverage') {
    return (
      <>
        <Head eyebrow={co.name} title="Coverage matrix"
          sub="Interviewers compare notes at debrief. A value with no story is a visible gap; four stories for one value is one data point." />
        <Table heads={[co.label, 'Freq', 'Slots that can cover it']}
          rows={co.values.map((v: any) => {
            const needle = v.name.toLowerCase().replace(/^we /, '');
            const hits: number[] = [];
            LP.lp.slots.forEach((s: any, i: number) => {
              if (`${s[0]} ${s[1]} ${s[2]}`.toLowerCase().includes(needle)) hits.push(i + 1);
            });
            return [
              <span className="fire">{v.name}</span>,
              <span className={`chip freq-${v.freq}`}>{v.freq}</span>,
              <span className={hits.length ? 'trig' : 'canon'}>
                {hits.length ? `slots ${hits.join(', ')}` : '— recut an existing story, or write one'}
              </span>,
            ];
          })} />
        <div className="exit">
          <b>The target.</b> Every high-frequency value covered by at least two different stories,
          and no single story doing more than three. Where a slot is blank, start from{' '}
          <Link className="lnk" href="/lp/shared/u-shapes">the ten shapes</Link> rather than from a
          new event.
        </div>
      </>
    );
  }

  return (
    <>
      <Head eyebrow={co.name} title="The schedule"
        sub="What to do for this room, and when. The shared writing cadence is under Your stories." />
      <Table heads={['When', 'What', 'Note']}
        rows={co.prep.map((r: any) => [
          <span className="canon">{r[0]}</span>, <span className="fire">{r[1]}</span>,
          <span className="trig">{r[2]}</span>,
        ])} />
    </>
  );
}

export function LpValue({ co, v }: { co: any; v: any }) {
  return (
    <>
      <Head
        eyebrow={
          <>
            {co.name} · {co.label} {v.n} of {co.values.length} ·{' '}
            <span className={`chip freq-${v.freq}`}>{v.freq} frequency</span>
          </>
        }
        title={v.name}
        sub={v.means}
      />
      <div className="lp-official"><i>how {co.name} words it</i>{v.official}</div>
      <h2 className="pane-h2">What they are actually testing</h2>
      <div className="learn">{v.signal}</div>
      <h2 className="pane-h2">How it is asked</h2>
      <BulletList items={v.asked} cls="asked" />
      <h2 className="pane-h2">The probes that follow</h2>
      <BulletList items={v.probes} />
      <h2 className="pane-h2">Strong vs weak</h2>
      <div className="learn"><b>Strong.</b> {v.strong}</div>
      <div className="lp-weak"><b>Weak.</b> {v.weak}</div>
      <h2 className="pane-h2">Usually pairs with</h2>
      <div className="exit">{v.pairs}</div>
      {v.yourAngle && (
        <>
          <h2 className="pane-h2">Your angle</h2>
          <div className="sd-who"><i>from your own work</i>{v.yourAngle}</div>
        </>
      )}
    </>
  );
}
