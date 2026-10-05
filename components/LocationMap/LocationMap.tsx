// Власник: Валерій (див. docs/FRONTEND_TASKS.md)

import type { Coordinates } from '@/types/geocode';
import MapView from '@/components/MapView/MapView';
import { isValidCoordinates } from '@/components/MapView/coordinates';
import css from './LocationMap.module.css';

type Props = {
  coordinates?: Coordinates | null;
  title?: string;
  className?: string;
};

export default function LocationMap({
  coordinates,
  title = 'Мапа розташування локації',
  className,
}: Props) {
  const wrapperClassName = className
    ? `${css.locationMap} ${className}`
    : css.locationMap;

  if (!isValidCoordinates(coordinates)) {
    return (
      <div
        className={`${wrapperClassName} ${css.fallback}`}
        role="note"
        aria-label={title}
      >
        <p className={css.fallbackText}>Координати локації недоступні.</p>
      </div>
    );
  }

  return (
    <div className={wrapperClassName} role="region" aria-label={title}>
      <MapView coordinates={coordinates} className={css.map} />
    </div>
  );
}
