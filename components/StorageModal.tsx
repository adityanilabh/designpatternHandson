'use client';

import { useRef, useState } from 'react';
import { useStore, snapshot } from '@/lib/store';
import { today } from '@/lib/calendar';
import type { AppState } from '@/lib/types';

/* Export / import / reset. The linked-file layer from the legacy tracker is
   deliberately not ported: Stage 4 replaces it with account-backed sync, which
   is strictly better than a File System Access handle that needs re-granting
   on every browser restart. Export stays, because a manual snapshot works
   everywhere and is the only backup that survives a bad migration. */
export default function StorageModal({ onClose }: { onClose: () => void }) {
  const replaceAll = useStore((s) => s.replaceAll);
  const reset = useStore((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  function doExport() {
    const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `target-ladder-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function doImport(file: File) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(String(r.result)) as AppState;
        if (!s || typeof s !== 'object' || !s.problems) throw new Error('bad shape');
        replaceAll(s);
        setMsg('Imported.');
      } catch {
        setMsg('That file did not parse as a Target Ladder export.');
      }
    };
    r.readAsText(file);
  }

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <h2>Storage &amp; backup</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p className="dim">
            Progress is saved in this browser automatically, on every click. Export a dated
            snapshot every Sunday — browser storage is one &quot;clear browsing data&quot; away
            from gone.
          </p>

          <div className="stlayer">
            <b>1 · Browser storage</b>
            <span>Automatic, on every change.</span>
            <span className="ok-txt">Active</span>
          </div>

          <div className="stlayer">
            <b>2 · Export / import</b>
            <span>Manual JSON snapshot. Works everywhere.</span>
            <span>
              <button className="btn sm" onClick={doExport}>Export</button>{' '}
              <button className="btn sm" onClick={() => fileRef.current?.click()}>Import</button>
            </span>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); }}
          />

          {msg && <p className="dim" style={{ marginTop: 10 }}>{msg}</p>}

          <div className="warnbox" style={{ marginTop: 18 }}>
            <b>Progress keys are content-addressed</b> — <code>ds-&lt;section&gt;-&lt;block&gt;-&lt;index&gt;</code>.
            Appending to the end of any list in <code>content/</code> is always safe; reordering
            within a list remaps that list&apos;s progress.
          </div>

          <div className="btnrow" style={{ marginTop: 18 }}>
            <button
              className="btn bad"
              onClick={() => {
                if (confirm('Delete all progress, notes and logs? This cannot be undone.')) {
                  reset(); onClose();
                }
              }}
            >
              Reset everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
