import { Product } from '@/types';

import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: number) => Promise<void>;
}

const FALLBACK_IMAGES = [
  '/images/products/product-1.svg',
  '/images/products/product-2.svg',
  '/images/products/product-3.svg',
  '/images/products/product-4.svg',
  '/images/products/product-5.svg',
  '/images/products/product-6.svg',
];

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="surface rounded-3xl p-10 text-center text-slate-600">
        No products found for this store.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          fallbackImage={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
