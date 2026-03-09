import useSWR from 'swr';

import { MainLayout } from '@/layouts/MainLayout';
import { fetchOrders } from '@/services/orders';
import { getAccessToken } from '@/services/api';
import { Order } from '@/types';

export default function OrdersPage() {
  const hasToken = typeof window !== 'undefined' && Boolean(getAccessToken());
  const { data, error, isLoading } = useSWR<Order[]>(hasToken ? 'orders:list' : null, fetchOrders);

  return (
    <MainLayout>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account</p>
        <h1 className="font-display text-4xl text-ink">My Orders</h1>
      </section>

      {!hasToken ? <div className="surface rounded-3xl p-8 text-slate-600">Please login to view your orders.</div> : null}
      {isLoading ? <div className="surface rounded-3xl p-8 text-slate-600">Loading orders...</div> : null}
      {error ? <div className="rounded-2xl border border-coral/30 bg-orange-50 p-4 text-coral">Failed to load orders.</div> : null}

      <div className="space-y-4">
        {data?.map((order) => (
          <article key={order.id} className="surface rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ink">Order #{order.id}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Placed on {new Date(order.created_at).toLocaleString()}</p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <strong>${item.line_total}</strong>
                </li>
              ))}
            </ul>

            <div className="mt-4 h-px bg-slate-200" />
            <div className="mt-4 flex items-center justify-between font-semibold text-ink">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </article>
        ))}
      </div>
    </MainLayout>
  );
}
