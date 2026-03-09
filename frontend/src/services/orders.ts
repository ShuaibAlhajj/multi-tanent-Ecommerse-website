import { Order, PaginatedResponse } from '@/types';

import { apiRequest, extractResults } from './api';

interface CheckoutItem {
  product_id: number;
  quantity: number;
}

interface CheckoutPayload {
  items: CheckoutItem[];
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
}

export async function fetchOrders(): Promise<Order[]> {
  const payload = await apiRequest<PaginatedResponse<Order>>('/orders/');
  return extractResults(payload);
}

export async function placeOrder(payload: CheckoutPayload): Promise<Order> {
  return apiRequest<Order>('/orders/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
