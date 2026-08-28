import WeeklyNav from '@/components/views/WeeklyNav';

export default function WeeklyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WeeklyNav />
      <main id="pane">{children}</main>
    </>
  );
}
