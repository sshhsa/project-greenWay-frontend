'use client';

import css from './Pagination.module.css';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'dots-start' | 'dots-end';

const getPageItems = (page: number, total: number): PageItem[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 'dots-end', total];
  if (page >= total - 2) return [1, 'dots-start', total - 2, total - 1, total];
  return [1, 'dots-start', page - 1, page, page + 1, 'dots-end', total];
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const goTo = (target: number) => {
    if (target >= 1 && target <= totalPages && target !== page) onPageChange(target);
  };

  return (
    <nav className={css.pagination} aria-label="Пагінація">
      <button
        type="button"
        className={css.arrow}
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Попередня сторінка"
      >
        <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
          <use href="/sprite.svg#icon-arrow-left" />
        </svg>
      </button>

      <ul className={css.list}>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={
                  item === page ? `${css.pageButton} ${css.active}` : css.pageButton
                }
                onClick={() => goTo(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Сторінка ${item}`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className={css.dots} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={css.arrow}
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Наступна сторінка"
      >
        <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
          <use href="/sprite.svg#icon-arrow-right" />
        </svg>
      </button>
    </nav>
  );
}
