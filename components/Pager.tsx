import Link from 'next/link';

/* prev / next footer inside the reading pane, so a section can be read
   straight through without going back to the sidebar. */
export default function Pager({
  prev, next,
}: {
  prev?: { href: string; label: string } | null;
  next?: { href: string; label: string } | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="pager">
      {prev ? (
        <Link className="pager-btn" href={prev.href}>
          <span className="pager-dir">← previous</span>
          <span className="pager-lbl">{prev.label}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link className="pager-btn next" href={next.href}>
          <span className="pager-dir">next →</span>
          <span className="pager-lbl">{next.label}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}
