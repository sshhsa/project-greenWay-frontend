import type { LocationsQuery } from '@/types/location';

export const LOCATION_SORT_OPTIONS = [
  { value: 'name', label: 'За назвою: А–Я' },
  { value: '-name', label: 'За назвою: Я–А' },
  { value: '-rating', label: 'За рейтингом ↓' },
  { value: 'rating', label: 'За рейтингом ↑' },
] as const satisfies ReadonlyArray<{
  value: NonNullable<LocationsQuery['sort']>;
  label: string;
}>;

export function isLocationSort(value: string | null): value is NonNullable<LocationsQuery['sort']> {
  return LOCATION_SORT_OPTIONS.some((option) => option.value === value);
}
