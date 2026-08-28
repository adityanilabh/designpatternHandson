'use client';

import { useSync } from './SyncProvider';
import { useStore } from '@/lib/store';

/* Asked once, the first time you sign in on a browser that already holds
   progress. Merging someone's work into an account without asking is not a
   decision software should make on their behalf — and getting it wrong is
   unrecoverable, because the local copy is the only copy. */
export default function UploadPrompt() {
  const { offerUpload, acceptUpload, declineUpload } = useSync();
  const problems = useStore((s) => s.problems);
  const notes = useStore((s) => s.notes);

  if (!offerUpload) return null;

  const doneCount = Object.values(problems).filter((p) => p.done).length;
  const noteCount = Object.values(notes).filter((n) => n && n.trim()).length;

  return (
    <div className="modal-scrim">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="up-t">
        <div className="drawer-head">
          <h2 id="up-t">Upload the progress in this browser?</h2>
        </div>
        <div className="modal-body">
          <p className="dim">
            This browser has work saved locally that is not yet attached to your account:
          </p>
          <div className="statrow" style={{ margin: '14px 0' }}>
            <div className="stat">
              <span className="stat-v">{doneCount}</span>
              <span className="stat-l">items done</span>
            </div>
            <div className="stat">
              <span className="stat-v">{noteCount}</span>
              <span className="stat-l">notes written</span>
            </div>
          </div>
          <p className="dim">
            Uploading attaches it to your account so it follows you to other devices. Where the
            same item exists in both, <b>this browser&apos;s version wins</b>.
          </p>

          <div className="btnrow" style={{ marginTop: 20 }}>
            <button className="btn primary" onClick={acceptUpload}>
              Upload it to my account
            </button>
            <button className="btn ghost" onClick={declineUpload}>
              Not now
            </button>
          </div>

          <p className="dim" style={{ marginTop: 14, fontSize: 12.5 }}>
            <b>Nothing is deleted either way.</b> Declining leaves this browser&apos;s copy exactly
            as it is — you will just be working locally rather than against your account. You can
            upload later from Storage.
          </p>
        </div>
      </div>
    </div>
  );
}
