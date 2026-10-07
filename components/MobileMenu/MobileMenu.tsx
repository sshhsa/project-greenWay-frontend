'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { m } from 'motion/react';

import UserBar from '@/components/UserBar/UserBar';
import type { User } from '@/types/user';

import { menuMotion, staggerItem, staggerList } from '@/lib/motion';

import css from './MobileMenu.module.css';

type Props = {
  id: string;
  isAuthenticated: boolean;
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
};

export default function MobileMenu({
  id,
  isAuthenticated,
  user,
  onClose,
  onLogout,
  onEditProfile,
}: Props) {
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
    <m.div {...menuMotion} className={css.mobileMenu} id={id}>
      <div className={css.topRow}>
        <Link className={css.logo} href="/" onClick={onClose}>
          Relax Map
        </Link>

        <div className={css.topActions}>
          {/* tablet: дії у верхньому рядку, як у хедері; mobile — внизу меню */}
          {isAuthenticated ? (
            <Link
              className={`${css.shareLink} ${css.tabletOnly}`}
              href="/locations/new"
              onClick={onClose}
            >
              Опублікувати статтю
            </Link>
          ) : (
            <>
              <Link
                className={`${css.loginLink} ${css.tabletOnly}`}
                href="/sign-in"
                onClick={onClose}
              >
                Вхід
              </Link>
              <Link
                className={`${css.registerLink} ${css.tabletOnly}`}
                href="/sign-up"
                onClick={onClose}
              >
                Реєстрація
              </Link>
            </>
          )}
          <button
            ref={closeButtonRef}
            className={css.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Закрити меню"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>

      <m.nav
        className={css.nav}
        aria-label="Мобільна навігація"
        variants={staggerList}
        initial="hidden"
        animate="show"
      >
        <m.div variants={staggerItem}>
          <Link className={css.navLink} href="/" onClick={onClose}>
            Головна
          </Link>
        </m.div>
        <m.div variants={staggerItem}>
          <Link className={css.navLink} href="/locations" onClick={onClose}>
            Місця відпочинку
          </Link>
        </m.div>
        {isAuthenticated && (
          <m.div variants={staggerItem}>
            <Link className={css.navLink} href="/profile" onClick={onClose}>
              Мій профіль
            </Link>
          </m.div>
        )}
      </m.nav>

      <div className={css.actions}>
        {isAuthenticated && user ? (
          <>
            <Link
              className={`${css.shareLink} ${css.mobileOnly}`}
              href="/locations/new"
              onClick={onClose}
            >
              Опублікувати статтю
            </Link>
            <UserBar user={user} onLogout={onLogout} onEditProfile={onEditProfile} />
          </>
        ) : (
          <>
            <Link
              className={`${css.loginLink} ${css.mobileOnly}`}
              href="/sign-in"
              onClick={onClose}
            >
              Вхід
            </Link>
            <Link
              className={`${css.registerLink} ${css.mobileOnly}`}
              href="/sign-up"
              onClick={onClose}
            >
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </m.div>
  );
}
