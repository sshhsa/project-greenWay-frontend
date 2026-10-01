import Image from 'next/image';
import Link from 'next/link';

import type { Location } from '@/types/location';
import StarRating from './StarRating';
import css from './LocationCard.module.css';

type Props = { location: Location; showEdit?: boolean; typeLabel?: string };

// TODO: Видалити цей тимчасовий компонент після готовності спільного LocationCard
// і повернути імпорт спільного компонента в LocationsGrid.
export default function LocationCard({ location, showEdit = false, typeLabel }: Props) {
  const href = `/locations/${location._id}`;

  return (
    <article className={css.locationCard}>
      <Link className={css.imageLink} href={href} aria-label={`Переглянути ${location.name}`}>
        <Image
          src={location.image}
          alt={location.name}
          fill
          sizes="(min-width: 1440px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
      </Link>
      <div className={css.body}>
        <span className={css.type}>{typeLabel ?? location.locationType}</span>
        <StarRating value={location.rate} />
        <h2 className={css.title}>{location.name}</h2>
        <Link className={css.action} href={showEdit ? `${href}/edit` : href}>
          {showEdit ? 'Редагувати локацію' : 'Переглянути локацію'}
        </Link>
      </div>
    </article>
  );
}
