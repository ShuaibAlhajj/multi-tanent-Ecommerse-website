import { Category, PaginatedResponse, Product } from '@/types';

import { apiRequest, extractResults } from './api';

export async function fetchProducts(category?: number): Promise<Product[]> {
  const query = new URLSearchParams();
  query.set('active', 'true');
  if (category) {
    query.set('category', String(category));
  }
  const payload = await apiRequest<PaginatedResponse<Product>>(`/products/?${query.toString()}`, {
    method: 'GET',
    skipAuth: true,
  });
  return extractResults(payload);
}

export async function fetchCategories(): Promise<Category[]> {
  const payload = await apiRequest<PaginatedResponse<Category>>('/categories/', {
    method: 'GET',
    skipAuth: true,
  });
  return extractResults(payload);
}
