import Link from 'next/link';
import css from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.footerContent}>
          <div className={css.logoWrapper}>
            <Link className={css.logo} href="/" aria-label="Relax Map — головна">
              <svg className={css.logoIcon} aria-hidden="true" width={24} height={24}>
                <use href="/sprite.svg#icon-map" />
              </svg>
              Relax Map
            </Link>
          </div>
          <ul className={css.socialList}>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg className={css.socialIcon} aria-hidden="true" width={24} height={24}>
                  <use href="/sprite.svg#icon-facebook" />
                </svg>
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg className={css.socialIcon} aria-hidden="true" width={24} height={24}>
                  <use href="/sprite.svg#icon-instagram" />
                </svg>
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <svg className={css.socialIcon} aria-hidden="true" width={24} height={24}>
                  <use href="/sprite.svg#icon-x" />
                </svg>
              </a>
            </li>
            <li className={css.socialItem}>
              <a
                className={css.socialLink}
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube"
              >
                <svg className={css.socialIcon} aria-hidden="true" width={24} height={24}>
                  <use href="/sprite.svg#icon-youtube" />
                </svg>
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
        <p className={css.copyright}>© {currentYear} Природні Мандри. Усі права захищені.</p>
      </div>
    </footer>
  );
}
