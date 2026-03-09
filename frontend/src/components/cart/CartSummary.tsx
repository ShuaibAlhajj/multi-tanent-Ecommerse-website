import { CartItem } from '@/types';

interface CartSummaryProps {
  items: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.unit_price) * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <aside className="surface rounded-3xl p-6">
      <h3 className="font-display text-2xl text-ink">Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax (10%)</span>
          <strong>${tax.toFixed(2)}</strong>
        </div>
        <div className="h-px bg-slate-200" />
        <div className="flex items-center justify-between text-base text-ink">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>
    </aside>
  );
}
