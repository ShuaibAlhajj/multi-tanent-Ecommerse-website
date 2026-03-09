import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MainLayout } from '@/layouts/MainLayout';
import { useCart } from '@/hooks/useCart';
import { placeOrder } from '@/services/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
  });

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0), [items]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await placeOrder({
        items: items.map((item) => ({
          product_id: item.product,
          quantity: item.quantity,
        })),
        shipping_address: {
          full_name: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
        },
        billing_address: {
          full_name: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
        },
      });

      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment</p>
        <h1 className="font-display text-4xl text-ink">Checkout</h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="surface rounded-3xl p-6" onSubmit={onSubmit}>
          <h2 className="mb-5 font-display text-2xl text-ink">Shipping Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="fullName"
              required
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Address"
              name="address"
              required
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            />
            <Input
              label="City"
              name="city"
              required
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Country"
              name="country"
              required
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            />
          </div>

          {error ? <p className="mt-4 text-sm text-coral">{error}</p> : null}
          <Button variant="secondary" type="submit" className="mt-6 w-full py-3 text-base" disabled={loading || !items.length}>
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </form>

        <aside className="surface rounded-3xl p-6">
          <h2 className="font-display text-2xl text-ink">Order Snapshot</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.product_name} x {item.quantity}
                </span>
                <strong>${(Number(item.unit_price) * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="mt-4 h-px bg-slate-200" />
          <div className="mt-4 flex items-center justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}
