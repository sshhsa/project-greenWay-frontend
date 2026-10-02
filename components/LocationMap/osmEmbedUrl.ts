// Власник: Валерій (див. docs/FRONTEND_TASKS.md)
// Чисті хелпери для LocationMap: валідація координат і побудова URL вбудованої мапи OpenStreetMap

export type Coordinates = {
  lat: number;
  lon: number;
};

const OSM_EMBED_URL = 'https://www.openstreetmap.org/export/embed.html';

// Половина розміру видимої області навколо точки (у градусах) — масштаб на рівні населеного пункту
const LAT_SPAN = 0.01;
const LON_SPAN = 0.02;

const isInRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

// Дані з API вважаємо неперевіреними: приймаємо тільки скінченні числа у допустимих межах
export const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (typeof value !== 'object' || value === null) return false;
  const { lat, lon } = value as Record<string, unknown>;
  return isInRange(lat, -90, 90) && isInRange(lon, -180, 180);
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Фіксована точність без експоненційного запису (1e-7) і без "-0"
const formatDegrees = (value: number) => {
  const formatted = value.toFixed(7).replace(/\.?0+$/, '');
  return formatted === '-0' ? '0' : formatted;
};

export const buildOsmEmbedUrl = (coordinates: unknown): string | null => {
  if (!isValidCoordinates(coordinates)) return null;

  const { lat, lon } = coordinates;
  const bbox = [
    clamp(lon - LON_SPAN, -180, 180),
    clamp(lat - LAT_SPAN, -90, 90),
    clamp(lon + LON_SPAN, -180, 180),
    clamp(lat + LAT_SPAN, -90, 90),
  ]
    .map(formatDegrees)
    .join(',');

  const params = new URLSearchParams({
    bbox,
    layer: 'mapnik',
    marker: `${formatDegrees(lat)},${formatDegrees(lon)}`,
  });

  return `${OSM_EMBED_URL}?${params.toString()}`;
};
