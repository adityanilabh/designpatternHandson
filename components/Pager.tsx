import Link from 'next/link';

/* prev / next footer inside the reading pane, so a section can be read straight
   through without going back to the sidebar. Uses .pager + .btn, which is what
   globals.css styles. */
export default function Pager({
  prev, next, position,
}: {
  prev?: { href: string; label: string } | null;
  next?: { href: string; label: string } | null;
  position?: { i: number; of: number };
}) {
  if (!prev && !next) return null;
  return (
    <nav className="pager" aria-label="Section navigation">
      {prev
        ? <Link className="btn" href={prev.href}>‹ {prev.label}</Link>
        : <span />}
      {position && <span className="pager-mid dim">{position.i} of {position.of}</span>}
      {next
        ? <Link className="btn" href={next.href}>{next.label} ›</Link>
        : <span />}
    </nav>
  );
}
