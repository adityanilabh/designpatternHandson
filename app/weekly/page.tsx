'use client';

import { useStore } from '@/lib/store';
import { currentWeek } from '@/lib/weeks';
import Weekly from '@/components/views/Weekly';

/* /weekly is "the week I am on". Which week that is depends on saved progress,
   so it can only be known on the client.

   This renders the week directly rather than redirecting. The redirect version
   showed an empty pane until hydration finished and then swapped the URL,
   which read as a broken page. Week 1 renders server-side and is replaced in
   place once the store knows better. */
export default function WeeklyIndex() {
  const hydrated = useStore((s) => s.hydrated);
  const state = useStore();
  return <Weekly n={hydrated ? currentWeek(state) : 1} />;
}
