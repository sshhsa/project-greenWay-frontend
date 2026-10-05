// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Спільна картка: фото, тип, зірки, назва, «Переглянути локацію», опційно «Редагувати». Тільки пропси, без запитів
// TODO: верстка за макетом у 3 брейкпоінтах; 'use client' додай, якщо потрібні хуки/події

import Image from 'next/image';
import Link from 'next/link';

import StarRating from '@/components/StarRating/StarRating';
import type { Location } from '@/types/location';

import css from './LocationCard.module.css';

type Props = {
  location: Location;
  showEdit?: boolean;
};

export default function LocationCard({ location, showEdit = false }: Props) {
  return (
    <article className={css.locationCard}>
      <div className={css.imageWrapper}>
        <Image
          src={location.image}
          alt={location.name}
          fill
          className={css.image}
          sizes="(min-width: 1440px) 394px, (min-width: 768px) 342px, 100vw"
        />
      </div>

      <div className={css.content}>
        <div className={css.info}>
          <p className={css.locationType}>{location.locationType}</p>

          <div className={css.rating}>
            <StarRating value={location.rate} />
          </div>
        </div>

        <h3 className={css.title} title={location.name}>
          {location.name}
        </h3>

        <div className={css.actions}>
          <Link href={`/locations/${location._id}`} className={css.viewLink}>
            Переглянути локацію
          </Link>

          {showEdit && (
            <Link
              href={`/locations/${location._id}/edit`}
              className={css.editLink}
              aria-label={`Редагувати ${location.name}`}
            >
              <svg className={css.editIcon} width="24" height="24" aria-hidden="true">
                <use href="/sprite.svg#icon-edit" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
