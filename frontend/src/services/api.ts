import { PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
export const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://127.0.0.1:8000';

const ACCESS_KEY = 'mte_access_token';
const REFRESH_KEY = 'mte_refresh_token';
const STORE_KEY = 'mte_store_id';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(ACCESS_KEY);
};

export const setTokens = (access: string, refresh: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const getStoreId = (): number => {
  if (typeof window === 'undefined') {
    return Number(process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || 1);
  }
  const value = localStorage.getItem(STORE_KEY) || process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || '1';
  return Number(value);
};

export const setStoreId = (storeId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORE_KEY, String(storeId));
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  const bodyIsFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!bodyIsFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('X-Store-ID', String(getStoreId()));

  if (token && !options.skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const extractResults = <T,>(payload: T[] | PaginatedResponse<T>): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.results;
};

export const resolveMediaUrl = (path?: string): string | undefined => {
  if (!path) {
    return undefined;
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${BACKEND_ORIGIN}${path}`;
};
