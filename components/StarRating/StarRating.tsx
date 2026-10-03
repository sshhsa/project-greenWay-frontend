'use client';

import css from './StarRating.module.css';

type Props = {
  value: number;
  onChange?: (value: number) => void;
};

export default function StarRating({ value, onChange }: Props) {
  const isSelectable = typeof onChange === 'function';

  return (
    <div
      className={css.starRating}
      role={isSelectable ? 'group' : 'img'}
      aria-label={isSelectable ? 'Оберіть оцінку' : `Оцінка: ${value} з 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        const iconName = isSelectable
          ? value >= starValue
            ? 'icon-star-filled'
            : 'icon-star-empty'
          : value >= starValue
            ? 'icon-star-filled'
            : value >= starValue - 0.5
              ? 'icon-star-half'
              : 'icon-star-empty';

        const icon = (
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <use href={`/sprite.svg#${iconName}`} />
          </svg>
        );

        if (!isSelectable) {
          return <span key={starValue}>{icon}</span>;
        }

        return (
          <button
            key={starValue}
            type="button"
            aria-label={`${starValue} з 5`}
            aria-pressed={value === starValue}
            onClick={() => onChange(starValue)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
