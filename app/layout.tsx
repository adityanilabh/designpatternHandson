import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import TopBar from '@/components/TopBar';
import Tabs from '@/components/Tabs';
import ThemeScript from '@/components/ThemeScript';
import Drawer from '@/components/Drawer';
import SyncProvider from '@/components/SyncProvider';
import UploadPrompt from '@/components/UploadPrompt';

/* One family, two members, drawn to sit together. Plex is a technical face —
   it was made for documentation and code — which is what this sheet is; and
   the sans/mono pair means the LeetCode numbers, section refs and code blocks
   share the letterforms of the prose instead of colliding with it.
   next/font self-hosts the files, so there is no third-party request at
   runtime and no swap flash. */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Target Ladder — 154 days',
  description:
    '154-day interview-preparation plan and tracker. JP Morgan · Amex · Expedia → ' +
    'Amazon · Microsoft · Adobe → Google · Uber.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* data-theme is set by ThemeScript before paint; dark is the default so a
       reader with no stored preference never gets a white flash. */
    <html
      lang="en"
      data-theme="dark"
      className={`${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      {/* has-nav switches globals.css into reading mode — larger table cells,
          Q&A and prose. The legacy tracker toggled it per tab; here every tab
          is a full page, so it is always on. */}
      <body className="has-nav">
        <ThemeScript />
        <SyncProvider>
          <TopBar />
          <Tabs />
          <div className="shell">{children}</div>
          <Drawer />
          <UploadPrompt />
        </SyncProvider>
      </body>
    </html>
  );
}
