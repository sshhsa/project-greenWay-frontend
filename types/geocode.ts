// EXTRA: відповідь GET /api/geocode/search і /reverse
export type Coordinates = { lat: number; lon: number };

export type GeoPlace = Coordinates & { name: string };
