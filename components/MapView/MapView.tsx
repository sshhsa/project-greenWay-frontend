'use client';
// Власник: Валерій (extra, див. docs/FRONTEND_TASKS.md)
// Спільна інтерактивна карта (leaflet + react-leaflet): маркер у coordinates,
// якщо передано onPick — клік по карті ставить маркер і повертає координати.
// Використання: LocationMap (сторінка деталей, тільки перегляд), LocationPicker (форма, з onPick).
// TODO: react-leaflet через next/dynamic з ssr: false, імпорт 'leaflet/dist/leaflet.css',
//       іконка маркера (дефолтна в next ламається — свій L.icon), центр за замовчуванням — Київ, zoom 6–12

import type { Coordinates } from '@/types/geocode';

import css from './MapView.module.css';

type Props = {
  coordinates?: Coordinates | null;
  onPick?: (coordinates: Coordinates) => void;
  className?: string;
};

export default function MapView({ className }: Props) {
  return <div className={className ? `${css.mapView} ${className}` : css.mapView} />;
}
