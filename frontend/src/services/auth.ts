import { AuthUser } from '@/types';

import { apiRequest, clearTokens, setStoreId, setTokens } from './api';

interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

interface RegisterPayload {
  store_id: number;
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
  phone?: string;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const result = await apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  setTokens(result.access, result.refresh);
  setStoreId(result.user.store_id);
  return result.user;
}

export async function me(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me/');
}

export function logout(): void {
  clearTokens();
}
