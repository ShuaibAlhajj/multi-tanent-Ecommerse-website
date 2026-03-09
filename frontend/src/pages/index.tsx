import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { useCart } from '@/hooks/useCart';
import { fetchProducts } from '@/services/catalog';
import { getAccessToken } from '@/services/api';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        const list = await fetchProducts();
        setProducts(list.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!getAccessToken()) {
      window.location.href = '/login';
      return;
    }

    await add(productId, 1);
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-10 shadow-card sm:px-10 lg:px-12">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-100 blur-3xl" />
        <div className="absolute -bottom-20 left-4 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6 animate-floatIn">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Scalable Multi-Tenant Ecommerce</p>
            <h1 className="font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
              One platform. Many stores. A premium buying experience.
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Launch with a single tenant today while keeping your architecture ready for tomorrow. Manage products, carts,
              checkout, and orders with clean store-level data boundaries.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button variant="secondary" className="px-6 py-3">Browse Products</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="px-6 py-3">Create Account</Button>
              </Link>
            </div>
          </div>

          <div className="animate-floatIn" style={{ animationDelay: '80ms' }}>
            <Image
              src="/images/hero-visual.svg"
              alt="Platform visual"
              width={1200}
              height={760}
              priority
              className="w-full rounded-3xl border border-slate-200 bg-white"
            />
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Curated Picks</p>
            <h2 className="font-display text-3xl text-ink">Featured Products</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-accent hover:underline">
            View all
          </Link>
        </div>

        {loading ? <div className="surface rounded-3xl p-10 text-slate-500">Loading products...</div> : null}
        {error ? <div className="rounded-2xl border border-coral/30 bg-orange-50 p-4 text-coral">{error}</div> : null}
        {!loading && !error ? <ProductGrid products={products} onAddToCart={handleAddToCart} /> : null}
      </section>
    </MainLayout>
  );
}
