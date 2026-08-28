import { redirect } from 'next/navigation';
import PLAN from '@/content/tech';

export default function TechIndex() {
  redirect(`/tech/${PLAN.tech[0].id}`);
}
