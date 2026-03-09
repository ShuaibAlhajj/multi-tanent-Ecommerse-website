import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Authentication</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Login</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </MainLayout>
  );
}
