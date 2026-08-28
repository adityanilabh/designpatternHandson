'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { overdueCount } from '@/lib/reviews';

/* href is the route root; a tab is active when the path starts with it, so
   /dsa/graphs still highlights DSA. */
const TABS: { href: string; label: string }[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/weekly', label: 'Weekly Goal' },
  { href: '/method', label: 'The Method' },
  { href: '/dsa', label: 'DSA' },
  { href: '/sd', label: 'System design' },
  { href: '/lld', label: 'LLD' },
  { href: '/tech', label: 'Tech' },
  { href: '/lp', label: 'Companies LP' },
  { href: '/revision', label: 'Revision' },
  { href: '/ladder', label: 'Ladder' },
  { href: '/reference', label: 'Reference' },
  { href: '/log', label: 'Log' },
  { href: '/strategy', label: 'Strategy' },
];

export default function Tabs() {
  const pathname = usePathname();
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  const due = hydrated ? overdueCount(state) : 0;

  /* The sign-in page is outside the app: showing tabs there advertises
     destinations that all bounce straight back to /login. */
  if (pathname.startsWith('/login') || pathname.startsWith('/auth')) return null;

  return (
    <nav className="tabs">
      {TABS.map((t) => {
        const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={`tab${active ? ' active' : ''}`}>
            {t.label}
            {t.href === '/revision' && <span className="pill">{due}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
