/* Shared presentational primitives, ported from the helper functions in
   legacy/app.js. All server components — they render authored content and
   touch no state. */

export function BulletList({ items, cls }: { items?: string[]; cls?: string }) {
  if (!items || !items.length) return null;
  return (
    <ul className={`sd-list ${cls || ''}`}>
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

export function AsciiBlock({ lines, title }: { lines?: string[]; title?: string }) {
  if (!lines || !lines.length) return null;
  return (
    <div className="codeblock diagram">
      {title && <div className="code-t">{title}</div>}
      <pre><code>{lines.join('\n')}</code></pre>
    </div>
  );
}

export function CodeBlock({ lines, title, why, lang = 'java' }: {
  lines?: string[]; title?: string; why?: string; lang?: string;
}) {
  if (!lines || !lines.length) return null;
  return (
    <div className="codeblock">
      {title && <div className="code-t">{title}</div>}
      <pre><code className={`language-${lang}`}>{lines.join('\n')}</code></pre>
      {why && <div className="code-why">{why}</div>}
    </div>
  );
}

/* Rows are [label, urlOrTerm, isDirectLink]. Rows without a stable URL open a
   search instead of a dead link. */
export function ReadingList({ rows, heading }: { rows?: any[]; heading?: string }) {
  if (!rows || !rows.length) return null;
  return (
    <>
      <h2 className="pane-h2">
        {heading || 'Read more'} <span className="h2-count">{rows.length}</span>
      </h2>
      <ul className="readlist">
        {rows.map((r, i) => (
          <li key={i}>
            <a
              href={r[2] ? r[1] : `https://www.google.com/search?q=${encodeURIComponent(r[1])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lnk"
            >
              {r[0]}
            </a>
            {!r[2] && <span className="read-find">search</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Table({ heads, rows, cls }: { heads: string[]; rows: any[][]; cls?: string }) {
  if (!rows || !rows.length) return null;
  return (
    <div className="tbl-wrap">
      <table className={cls}>
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c as React.ReactNode}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* A question with its answer spine underneath — cover the answer, say it out
   loud. Used by SD cross-questions, tech Q&A and the per-company angles. */
export function Qa({ q, a }: { q: string; a: string }) {
  return (
    <div className="qa static">
      <div className="qa-body">
        <b className="qa-q">{q}</b>
        <span className="qa-f">{a}</span>
      </div>
    </div>
  );
}

/* Deep-dive prose arrives as one string with blank-line paragraph breaks. */
export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {String(text).split('\n\n').map((p, i) => (
        <p className="pane-p" key={i}>{p}</p>
      ))}
    </>
  );
}
