import useSWR from 'swr';

import { login, logout as logoutService, me, register } from '@/services/auth';
import { getAccessToken } from '@/services/api';
import { AuthUser } from '@/types';

interface RegisterInput {
  store_id: number;
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
  phone?: string;
}

export function useAuth() {
  const hasToken = typeof window !== 'undefined' && Boolean(getAccessToken());

  const { data, error, isLoading, mutate } = useSWR<AuthUser>(hasToken ? 'auth:me' : null, me, {
    revalidateOnFocus: false,
  });

  const signIn = async (email: string, password: string) => {
    const user = await login(email, password);
    await mutate(user, false);
    return user;
  };

  const signUp = async (input: RegisterInput) => {
    return register(input);
  };

  const signOut = async () => {
    logoutService();
    await mutate(undefined, false);
  };

  return {
    user: data,
    isAuthenticated: Boolean(data),
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
  };
}
