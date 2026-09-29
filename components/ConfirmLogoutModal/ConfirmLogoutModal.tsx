'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { logout } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

import css from './ConfirmLogoutModal.module.css';

type Props = { onClose: () => void };

export default function ConfirmLogoutModal({ onClose }: Props) {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch {
    } finally {
      clearIsAuthenticated();
      onClose();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className={css.confirmLogoutModal}>
      <h2 className={css.title}>Ви точно хочете вийти?</h2>
      <p className={css.text}>Ми будемо сумувати за вами!</p>
      <div className={css.actions}>
        <button className={css.cancel} type="button" onClick={onClose} disabled={isLoading}>
          Відмінити
        </button>
        <button className={css.confirm} type="button" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? 'Вихід...' : 'Вийти'}
        </button>
      </div>
    </div>
  );
}