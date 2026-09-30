'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import css from './AuthNav.module.css';

const TABS = [
  { href: '/sign-up', label: 'Реєстрація' },
  { href: '/sign-in', label: 'Вхід' },
];

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <nav className={css.authNav} aria-label="Авторизація">
      {TABS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${css.tab} ${pathname === href ? css.active : ''}`}
          aria-current={pathname === href ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}