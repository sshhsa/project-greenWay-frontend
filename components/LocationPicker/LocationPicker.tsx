'use client';
// Власник: Анна (extra, див. docs/FRONTEND_TASKS.md)
// Блок «Місце розташування» у LocationForm і EditLocationForm:
// LocationSearch (вибір результату) + MapView з onPick (клік по карті → reversePlace).
// value/onChange — координати; форма додає їх у FormData як JSON-рядок: coordinates={"lat":..,"lon":..}

import type { Coordinates } from '@/types/geocode';

import css from './LocationPicker.module.css';

type Props = {
  value?: Coordinates | null;
  onChange: (coordinates: Coordinates) => void;
};

export default function LocationPicker(_props: Props) {
  return <div className={css.locationPicker}>LocationPicker</div>;
}
