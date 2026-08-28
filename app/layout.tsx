import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Tabs from '@/components/Tabs';
import ThemeScript from '@/components/ThemeScript';
import Drawer from '@/components/Drawer';

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
      <body>
        <ThemeScript />
        <TopBar />
        <Tabs />
        <div className="shell">{children}</div>
        <Drawer />
      </body>
    </html>
  );
}
