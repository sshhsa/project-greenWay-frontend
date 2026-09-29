// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Лого, соцмережі (нова вкладка), навігація, © з динамічним роком
// TODO: верстка за макетом у 3 брейкпоінтах; 'use client' додай, якщо потрібні хуки/події

import Link from 'next/link';
import css from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.footerContent}>
          <Link className={css.logo} href="/locations" aria-label="Relax Map — головна">
            Relax Map
          </Link>
          <ul className={css.socialList}>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                F
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                I
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
              >
                T
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                Y
              </a>
            </li>
          </ul>
          <ul className={css.navList}>
            <li className={css.navItem}>
              <Link className={css.navLink} href="/">
                Головна
              </Link>
            </li>
            <li className={css.navItem}>
              <Link className={css.navLink} href="/">
                Місця відпочинку
              </Link>
            </li>
          </ul>
        </div>
        <span className={css.divider} />
        <p className={css.copyright}>
          © {currentYear} Природні Мандри. Усі права захищені.
        </p>
      </div>
    </footer>
  );
}
