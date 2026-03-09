import Image from 'next/image';
import Link from 'next/link';

import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { useCart } from '@/hooks/useCart';
import { resolveMediaUrl } from '@/services/api';

export default function CartPage() {
  const { items, isLoading, update, remove } = useCart();

  return (
    <MainLayout>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Checkout Flow</p>
        <h1 className="font-display text-4xl text-ink">Your Cart</h1>
      </section>

      {isLoading ? <div className="surface rounded-3xl p-8">Loading cart...</div> : null}

      {!isLoading && !items.length ? (
        <div className="surface rounded-3xl p-10 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : null}

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="surface flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={resolveMediaUrl(item.product_image) || '/images/products/product-1.svg'}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-ink">{item.product_name}</h3>
                    <p className="text-sm text-slate-600">${item.unit_price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => update(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                  <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button variant="outline" onClick={() => update(item.id, item.quantity + 1)}>+</Button>
                  <Button variant="danger" onClick={() => remove(item.id)}>Remove</Button>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            <CartSummary items={items} />
            <Link href="/checkout">
              <Button variant="secondary" className="w-full py-3 text-base">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}
