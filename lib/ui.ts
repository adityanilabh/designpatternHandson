'use client';

/* Transient UI state that is never persisted and never synced: which item the
   drawer is showing, and whether the spoiler inside it is open. Kept separate
   from the progress store so opening a drawer does not write to localStorage. */
import { create } from 'zustand';

interface UiStore {
  drawerKey: string | null;
  drawerReadOnly: boolean;
  spoilerOpen: Record<string, boolean>;
  openDrawer: (key: string, readOnly?: boolean) => void;
  closeDrawer: () => void;
  toggleSpoiler: (key: string) => void;
}

export const useUi = create<UiStore>((set) => ({
  drawerKey: null,
  drawerReadOnly: false,
  spoilerOpen: {},
  openDrawer: (drawerKey, drawerReadOnly = false) => set({ drawerKey, drawerReadOnly }),
  closeDrawer: () => set({ drawerKey: null }),
  toggleSpoiler: (key) =>
    set((s) => ({ spoilerOpen: { ...s.spoilerOpen, [key]: !s.spoilerOpen[key] } })),
}));
