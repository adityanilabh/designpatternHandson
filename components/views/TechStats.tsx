'use client';

import { useStore } from '@/lib/store';

export default function TechStats({
  modId, qaCount, codeCount, trapCount,
}: { modId: string; qaCount: number; codeCount?: number; trapCount?: number }) {
  const hydrated = useStore((s) => s.hydrated);
  const problems = useStore((s) => s.problems);

  const done = hydrated
    ? Array.from({ length: qaCount }).filter((_, i) => problems[`tq-${modId}-${i}`]?.done).length
    : 0;

  return (
    <div className="pane-stats">
      <span><b>{done}</b>/{qaCount} answered cold</span>
      {codeCount ? <span><b>{codeCount}</b> code patterns</span> : null}
      {trapCount ? <span><b>{trapCount}</b> traps</span> : null}
    </div>
  );
}
