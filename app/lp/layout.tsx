import LpNav from '@/components/views/LpNav';

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LpNav />
      <main id="pane">{children}</main>
    </>
  );
}
