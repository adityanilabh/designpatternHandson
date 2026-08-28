'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  href: string;
  n?: string;      /* the small leading number/tag */
  label: string;
  sub?: string;
}
export interface NavGroup {
  g: string;
  items: NavItem[];
}

/* The reading-pane sidebar. Markup matches what globals.css expects: the group
   label is a SIBLING .nav-group div, not a wrapper, and each row is .nav-item
   with .nav-n and .nav-lbl inside.

   These are real <Link>s rather than the legacy tracker's <button>s, so
   middle-click, ctrl-click and "copy link" all work on a section. */
export default function SideNav({ groups, placeholder }: { groups: NavGroup[]; placeholder?: string }) {
  const pathname = usePathname();
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();

  const filtered = groups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter(
        (it) => !needle || `${it.n || ''} ${it.label} ${it.sub || ''}`.toLowerCase().includes(needle)
      ),
    }))
    .filter((grp) => grp.items.length > 0);

  return (
    <aside className="sidenav">
      <input
        className="nav-search"
        placeholder={placeholder || 'Filter…'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Filter this section"
      />
      {filtered.map((grp) => (
        <div key={grp.g} className="nav-sect">
          <div className="nav-group">{grp.g}</div>
          {grp.items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`nav-item${pathname === it.href ? ' on' : ''}`}
              aria-current={pathname === it.href ? 'page' : undefined}
            >
              {it.n && <span className="nav-n">{it.n}</span>}
              <span className="nav-lbl">
                {it.label}
                {it.sub && <span>{it.sub}</span>}
              </span>
            </Link>
          ))}
        </div>
      ))}
      {!filtered.length && <p className="dim" style={{ padding: '14px 16px' }}>No match.</p>}
    </aside>
  );
}
