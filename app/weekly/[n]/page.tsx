import { notFound } from 'next/navigation';
import Weekly from '@/components/views/Weekly';
import { WEEKS } from '@/lib/weeks';

export function generateStaticParams() {
  return Array.from({ length: WEEKS }, (_, i) => ({ n: String(i + 1) }));
}

export default async function WeeklyPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const week = parseInt(n, 10);
  if (!Number.isInteger(week) || week < 1 || week > WEEKS) notFound();
  return <Weekly n={week} />;
}
