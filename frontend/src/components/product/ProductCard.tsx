import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { resolveMediaUrl } from '@/services/api';

interface ProductCardProps {
  product: Product;
  fallbackImage: string;
  onAddToCart?: (productId: number) => Promise<void>;
}

export function ProductCard({ product, fallbackImage, onAddToCart }: ProductCardProps) {
  const imageSrc = resolveMediaUrl(product.image) || fallbackImage;

  return (
    <article className="surface mesh-mask relative overflow-hidden rounded-3xl p-4 transition hover:-translate-y-1.5 hover:shadow-card">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-white">
        <Image src={imageSrc} alt={product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{product.category_name || 'General'}</p>
        <h3 className="font-display text-xl leading-tight text-ink">{product.name}</h3>
        <p className="text-sm text-slate-600">{product.description || 'Premium quality item for modern commerce.'}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xl font-semibold text-ink">
          {product.currency} {product.price}
        </p>
        <Button variant="secondary" onClick={() => onAddToCart?.(product.id)} disabled={!onAddToCart}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
