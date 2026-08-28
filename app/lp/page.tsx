import { redirect } from 'next/navigation';
import LP from '@/content/lp';

export default function LpIndex() {
  redirect(`/lp/${LP.lp.co[0].id}/overview`);
}
