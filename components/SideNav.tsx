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

/* The reading-pane sidebar. Search filters across label and sub, so "celebrity"
   finds the news-feed session without knowing its number. */
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
        placeholder={placeholder || 'Search…'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Filter this section"
      />
      {filtered.map((grp) => (
        <div key={grp.g} className="nav-group">
          {grp.g && <div className="nav-g">{grp.g}</div>}
          {grp.items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`nav-i${pathname === it.href ? ' on' : ''}`}
            >
              {it.n && <span className="nav-n">{it.n}</span>}
              <span className="nav-l">
                {it.label}
                {it.sub && <span className="nav-s">{it.sub}</span>}
              </span>
            </Link>
          ))}
        </div>
      ))}
      {!filtered.length && <p className="dim" style={{ padding: '10px 12px' }}>Nothing matches that.</p>}
    </aside>
  );
}
