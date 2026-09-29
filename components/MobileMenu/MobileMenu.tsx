'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import UserBar from '@/components/UserBar/UserBar';
import type { User } from '@/types/user';

import css from './MobileMenu.module.css';

type Props = {
  id: string;
  isAuthenticated: boolean;
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
};

export default function MobileMenu({ id, isAuthenticated, user, onClose, onLogout, onEditProfile }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const desktopQuery = window.matchMedia('(min-width: 1440px)');
    if (desktopQuery.matches) onClose();
    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
    };
  }, [onClose]);

  return (
    <div className={css.mobileMenu} id={id}>
      <div className={css.topRow}>
        <Link className={css.logo} href="/" onClick={onClose}>Relax Map</Link>
        <button ref={closeButtonRef} className={css.closeButton} type="button" onClick={onClose} aria-label="Закрити меню">×</button>
      </div>

      <nav className={css.nav} aria-label="Мобільна навігація">
        {!isAuthenticated && <Link className={css.navLink} href="/" onClick={onClose}>Головна</Link>}
        <Link className={css.navLink} href="/locations" onClick={onClose}>Місця відпочинку</Link>
        {isAuthenticated && (
          <>
            <Link className={css.navLink} href="/profile" onClick={onClose}>Мій профіль</Link>
            <Link className={css.shareLink} href="/locations/new" onClick={onClose}>Поділитись локацією</Link>
          </>
        )}
      </nav>

      <div className={css.actions}>
        {isAuthenticated && user ? (
          <UserBar user={user} onLogout={onLogout} onEditProfile={onEditProfile} />
        ) : (
          <>
            <Link className={css.loginLink} href="/sign-in" onClick={onClose}>Вхід</Link>
            <Link className={css.registerLink} href="/sign-up" onClick={onClose}>Реєстрація</Link>
          </>
        )}
      </div>
    </div>
  );
}
