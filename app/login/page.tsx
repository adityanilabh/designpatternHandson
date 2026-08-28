import { Suspense } from 'react';
import LoginForm from '@/components/views/LoginForm';

export const metadata = { title: 'Sign in — Target Ladder' };

export default function LoginPage() {
  return (
    <main id="pane">
      <Suspense fallback={<p className="dim">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
