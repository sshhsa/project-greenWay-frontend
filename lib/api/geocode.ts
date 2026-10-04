// Власник: Вікторія (extra, див. docs/FRONTEND_TASKS.md)
// Запити до /api/geocode через nextServer. Бекенд відповідає { data: GeoPlace[] } і { data: GeoPlace }.
// TODO: реалізувати обидві функції (nextServer.get + params), прибрати заглушки

import type { GeoPlace } from '@/types/geocode';

export const searchPlaces = async (_query: string): Promise<GeoPlace[]> => {
  return [];
};

export const reversePlace = async (lat: number, lon: number): Promise<GeoPlace> => {
  return { name: '', lat, lon };
};
