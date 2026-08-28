'use client';

import { useEffect } from 'react';
import { useStore, STORE_KEY } from '@/lib/store';

/* Reads the persisted theme and stamps data-theme BEFORE first paint, so the
   page never flashes the wrong palette. It runs inline rather than in an
   effect because an effect fires after paint, which is exactly the flash.

   Kept deliberately tiny and wrapped in try/catch: a browser with site data
   blocked throws on localStorage access, and a failed theme read must not
   take the whole page down. */
const INLINE = `
(function(){
  try {
    var raw = localStorage.getItem('${STORE_KEY}');
    var t = raw ? (JSON.parse(raw).state || {}).ui : null;
    document.documentElement.setAttribute('data-theme',
      t && t.theme === 'light' ? 'light' : 'dark');
  } catch (e) {}
})();`;

export default function ThemeScript() {
  const theme = useStore((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  return <script dangerouslySetInnerHTML={{ __html: INLINE }} />;
}
