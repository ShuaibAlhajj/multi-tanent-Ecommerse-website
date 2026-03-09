import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    storeId: '1',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUp({
        store_id: Number(form.storeId),
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account Setup</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Create an account</h1>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <Input
            label="Store ID"
            value={form.storeId}
            onChange={(e) => setForm((prev) => ({ ...prev, storeId: e.target.value }))}
            required
          />
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          {error ? <p className="sm:col-span-2 text-sm text-coral">{error}</p> : null}

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </MainLayout>
  );
}
