// Власник: Маркіян
// Сторінка 404: показується для неіснуючих маршрутів і при notFound() у сторінках
import type { Metadata } from 'next';
import Link from 'next/link';

import css from './NotFound.module.css';

export const metadata: Metadata = {
  title: 'Сторінку не знайдено — Природні Мандри',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={css.section}>
      <div className={`container ${css.inner}`}>
        <div className={css.card}>
          <p className={css.code} aria-hidden="true">
            404
          </p>
          <h1 className={css.title}>Сторінку не знайдено</h1>
          <p className={css.text}>
            Схоже, ця стежка нікуди не веде. Можливо, посилання застаріло або сторінку
            перенесли. Поверніться на головну, щоб продовжити мандрівку.
          </p>
          <div className={css.actions}>
            <Link className={css.primaryLink} href="/">
              На головну
            </Link>
            <Link className={css.secondaryLink} href="/locations">
              Місця відпочинку
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
