'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

import MobileMenu from '@/components/MobileMenu/MobileMenu';
import UserBar from '@/components/UserBar/UserBar';
import ConfirmLogoutModal from '@/components/ConfirmLogoutModal/ConfirmLogoutModal';
import EditProfileModal from '@/components/EditProfileModal/EditProfileModal';
import { useAuthStore } from '@/lib/store/authStore';

import css from './Header.module.css';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    requestAnimationFrame(() => {
      if (menuButtonRef.current?.getClientRects().length) menuButtonRef.current.focus();
    });
  }, []);

  const openLogout = () => {
    setIsMenuOpen(false);
    setIsLogoutOpen(true);
  };

  const openEditProfile = () => {
    setIsMenuOpen(false);
    setIsEditProfileOpen(true);
  };

  return (
    <>
      <header className={css.header}>
        <div className={`container ${css.inner}`}>
          <Link className={css.logo} href="/" aria-label="Relax Map — головна">
            Relax Map
          </Link>

          <nav className={css.desktopNav} aria-label="Головна навігація">
            {!isAuthenticated && <Link className={css.navLink} href="/">Головна</Link>}
            <Link className={css.navLink} href="/locations">Місця відпочинку</Link>
            {isAuthenticated && (
              <>
                <Link className={css.navLink} href="/profile">Мій профіль</Link>
                <Link className={css.shareLink} href="/locations/new">Поділитись локацією</Link>
              </>
            )}
          </nav>

          <div className={css.desktopActions}>
            {isAuthenticated && user ? (
              <UserBar user={user} onLogout={openLogout} onEditProfile={openEditProfile} />
            ) : (
              <>
                <Link className={css.loginLink} href="/sign-in">Вхід</Link>
                <Link className={css.registerLink} href="/sign-up">Реєстрація</Link>
              </>
            )}
          </div>

          <button
            ref={menuButtonRef}
            className={css.menuButton}
            type="button"
            aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <MobileMenu
          id="mobile-navigation"
          isAuthenticated={isAuthenticated}
          user={user}
          onClose={closeMenu}
          onLogout={openLogout}
          onEditProfile={openEditProfile}
        />
      )}

      {isEditProfileOpen && user && (
        <EditProfileModal user={user} onClose={() => setIsEditProfileOpen(false)} />
      )}

      {isLogoutOpen && (
        <div className={css.logoutBackdrop} role="presentation" onMouseDown={() => setIsLogoutOpen(false)}>
          <div className={css.logoutDialog} role="dialog" aria-modal="true" aria-label="Підтвердження виходу" onMouseDown={(event) => event.stopPropagation()}>
            <button className={css.dialogClose} type="button" aria-label="Закрити підтвердження виходу" onClick={() => setIsLogoutOpen(false)}>×</button>
            <ConfirmLogoutModal onClose={() => setIsLogoutOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
