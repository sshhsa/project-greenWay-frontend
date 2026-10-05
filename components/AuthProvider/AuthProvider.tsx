'use client';
// Власник: Олександр (TL). Після перезавантаження сторінки підтягує користувача (TECH: сесія зберігається).
// Сесія невалідна на приватній сторінці → редірект на /sign-in (замість вічного лоадера).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getMe } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

const isPrivate = (pathname: string) =>
  pathname.startsWith('/profile') ||
  pathname === '/locations/new' ||
  /^\/locations\/[^/]+\/edit$/.test(pathname);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user) return setUser(user);
        clearIsAuthenticated();
        if (isPrivate(window.location.pathname)) router.replace('/sign-in');
      })
      .catch(() => clearIsAuthenticated());
    // перевіряємо сесію один раз при завантаженні застосунку
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
