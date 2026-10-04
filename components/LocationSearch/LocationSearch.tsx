'use client';
// Власник: Вікторія (extra, див. docs/FRONTEND_TASKS.md)
// Пошук місця за назвою: інпут «Введіть назву місця» + кнопка «Пошук» + список результатів.
// Вибір результату → onSelect(place). Запити — searchPlaces з lib/api/geocode.ts. Без власної карти.
// TODO: верстка за макетом (фрейм «Додавання нового місця»), стани: завантаження, «нічого не знайдено», помилка (toast)

import type { GeoPlace } from '@/types/geocode';

import css from './LocationSearch.module.css';

type Props = {
  onSelect: (place: GeoPlace) => void;
};

export default function LocationSearch({ onSelect: _onSelect }: Props) {
  return <div className={css.locationSearch}>LocationSearch</div>;
}
