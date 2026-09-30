'use client';

import css from './StarRating.module.css';

type Props = {
  value: number;
  onChange?: (value: number) => void;
};

export default function StarRating({ value, onChange }: Props) {
  return (
    <div className={css.starRating} role="group" aria-label="Оцінка">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isSelected = value >= starValue;

        return (
          <button
            key={starValue}
            type="button"
            aria-label={`${starValue} з 5`}
            aria-pressed={value === starValue}
            onClick={() => onChange?.(starValue)}
          >
            <span aria-hidden="true">{isSelected ? '★' : '☆'}</span>
          </button>
        );
      })}
    </div>
  );
}