import { useEffect, useState } from 'react';

import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { useCart } from '@/hooks/useCart';
import { fetchCategories, fetchProducts } from '@/services/catalog';
import { getAccessToken } from '@/services/api';
import { Category, Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        const [categoryList, productList] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(categoryList);
        setProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catalog.');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    if (selectedCategory === undefined) {
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        const result = await fetchProducts(selectedCategory);
        setProducts(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to filter products.');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [selectedCategory]);

  const handleAddToCart = async (productId: number) => {
    if (!getAccessToken()) {
      window.location.href = '/login';
      return;
    }
    await add(productId, 1);
  };

  return (
    <MainLayout>
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Catalog</p>
          <h1 className="font-display text-4xl text-ink">Store Products</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? 'primary' : 'outline'}
            onClick={() => {
              setSelectedCategory(undefined);
              void fetchProducts().then(setProducts);
            }}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      {loading ? <div className="surface rounded-3xl p-10 text-slate-500">Loading...</div> : null}
      {error ? <div className="rounded-2xl border border-coral/30 bg-orange-50 p-4 text-coral">{error}</div> : null}
      {!loading && !error ? <ProductGrid products={products} onAddToCart={handleAddToCart} /> : null}
    </MainLayout>
  );
}
