'use client';

import css from './StarRating.module.css';

type Props = { value: number; onChange?: (value: number) => void };

const MAX_RATING = 5;
const ratingOptions = Array.from({ length: MAX_RATING }, (_, index) => index + 1);
const numberFormat = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 2,
});

// TODO: Видалити цей тимчасовий компонент після готовності спільного StarRating
// і повернути його імпорт у локальному LocationCard.
export default function StarRating({ value, onChange }: Props) {
  const rating = Number.isFinite(value)
    ? Math.min(MAX_RATING, Math.max(0, value))
    : 0;

  if (onChange) {
    return (
      <div className={css.interactive} role="group" aria-label="Оберіть рейтинг">
        {ratingOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={option <= rating ? css.activeStar : css.starButton}
            aria-label={`${option} з ${MAX_RATING} зірок`}
            aria-pressed={option === rating}
            onClick={() => onChange(option)}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  return (
    <span
      className={css.starRating}
      role="img"
      aria-label={`Рейтинг ${numberFormat.format(rating)} з ${MAX_RATING}`}
    >
      <span className={css.stars} aria-hidden="true">
        {ratingOptions.map((option) => (
          <span className={css.star} key={option}>
            ☆
            <span
              className={css.filledStar}
              style={{ width: `${Math.min(1, Math.max(0, rating - option + 1)) * 100}%` }}
            >
              ★
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
