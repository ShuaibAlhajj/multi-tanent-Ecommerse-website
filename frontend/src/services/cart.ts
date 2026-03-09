import { CartItem, PaginatedResponse } from '@/types';

import { apiRequest, extractResults } from './api';

export async function fetchCartItems(): Promise<CartItem[]> {
  const payload = await apiRequest<PaginatedResponse<CartItem>>('/cart/');
  return extractResults(payload);
}

export async function addToCart(productId: number, quantity = 1): Promise<CartItem> {
  return apiRequest<CartItem>('/cart/', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export async function updateCartItem(id: number, quantity: number): Promise<CartItem> {
  return apiRequest<CartItem>(`/cart/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(id: number): Promise<void> {
  await apiRequest<void>(`/cart/${id}/`, {
    method: 'DELETE',
  });
}
