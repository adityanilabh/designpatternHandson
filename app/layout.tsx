import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Tabs from '@/components/Tabs';
import ThemeScript from '@/components/ThemeScript';
import Drawer from '@/components/Drawer';
import SyncProvider from '@/components/SyncProvider';
import UploadPrompt from '@/components/UploadPrompt';

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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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
