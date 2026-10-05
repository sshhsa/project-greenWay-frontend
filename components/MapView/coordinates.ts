import type { Coordinates } from '@/types/geocode';

export const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (typeof value !== 'object' || value === null) return false;
  const { lat, lon } = value as Record<string, unknown>;
  return (
    typeof lat === 'number' &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lon === 'number' &&
    Number.isFinite(lon) &&
    lon >= -180 &&
    lon <= 180
  );
};
