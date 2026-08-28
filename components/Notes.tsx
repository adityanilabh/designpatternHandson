'use client';

import { useStore } from '@/lib/store';

/* The free-text field at the foot of a section, session or module. Both the
   markdown sheet and this exist to be written in — a weekend that produced
   nothing you can re-read did not happen. */
export default function Notes({
  noteKey, label, placeholder,
}: { noteKey: string; label: string; placeholder?: string }) {
  const value = useStore((s) => s.notes[noteKey] || '');
  const setNote = useStore((s) => s.setNote);

  return (
    <div className="field pane-notes">
      <label htmlFor={`note-${noteKey}`}>{label}</label>
      <textarea
        id={`note-${noteKey}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setNote(noteKey, e.target.value)}
      />
    </div>
  );
}
