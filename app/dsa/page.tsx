import { redirect } from 'next/navigation';
import PLAN from '@/content/dsa';

export default function DsaIndex() {
  redirect(`/dsa/${PLAN.sections[0].id}`);
}
