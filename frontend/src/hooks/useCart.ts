import useSWR from 'swr';

import { addToCart, fetchCartItems, removeCartItem, updateCartItem } from '@/services/cart';
import { getAccessToken } from '@/services/api';
import { CartItem } from '@/types';

export function useCart() {
  const hasToken = typeof window !== 'undefined' && Boolean(getAccessToken());

  const { data, error, isLoading, mutate } = useSWR<CartItem[]>(hasToken ? 'cart:items' : null, fetchCartItems, {
    revalidateOnFocus: false,
  });

  const items = data || [];

  const add = async (productId: number, quantity = 1) => {
    await addToCart(productId, quantity);
    await mutate();
  };

  const update = async (id: number, quantity: number) => {
    await updateCartItem(id, quantity);
    await mutate();
  };

  const remove = async (id: number) => {
    await removeCartItem(id);
    await mutate();
  };

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items,
    count,
    isLoading,
    error,
    add,
    update,
    remove,
    refresh: mutate,
  };
}
