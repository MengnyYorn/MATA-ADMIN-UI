'use client';

import { useSession } from 'next-auth/react';

/** Returns the backend JWT for admin API calls, or null if not signed in. */
export function useAdminSession() {
  const { data: session, status } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken ?? null;
  return { session, token, status, isAdmin: !!token };
}
