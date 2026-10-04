'use client';
// Власник: Геннадій (extra, див. docs/FRONTEND_TASKS.md)
// Нумерована пагінація за макетом профілю: ‹ 1 2 3 … 5 ›. Тільки пропси, без запитів і без роутера.
// TODO: верстка, активна сторінка, «…» для довгих списків, disabled стрілки на краях, aria-label/aria-current

import css from './Pagination.module.css';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages }: Props) {
  if (totalPages <= 1) return null;
  return <nav className={css.pagination} aria-label="Пагінація" />;
}
