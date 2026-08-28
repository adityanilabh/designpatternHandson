import SideNav from '@/components/SideNav';
import META from '@/content/meta';

export default function ReferenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav
        placeholder="Search reference…"
        groups={[{ g: 'Reference', items: [
          { href: '/reference/templates', label: 'Template library', sub: `${META.templates.length} templates` },
          { href: '/reference/triggers', label: 'All triggers', sub: 'one searchable index' },
          { href: '/reference/pool', label: 'Blind hard pool', sub: `${META.hardPool.length} problems` },
          { href: '/reference/reading', label: 'Reading list', sub: 'primers and references' },
        ]}]}
      />
      <main id="pane">{children}</main>
    </>
  );
}
