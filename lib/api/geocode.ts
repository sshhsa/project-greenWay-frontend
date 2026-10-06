// Власник: Вікторія (extra, див. docs/FRONTEND_TASKS.md)
// Запити до /api/geocode через nextServer (baseURL уже '/api').
import { nextServer } from './client';
import type { GeoPlace } from '@/types/geocode';

export const searchPlaces = async (query: string): Promise<GeoPlace[]> => {
  if (!query.trim()) return [];

  try {
    const { data } = await nextServer.get<{ data: GeoPlace[] }>('/geocode/search', {
      params: { q: query.trim() },
    });
    return data.data;
  } catch {
    throw new Error('Не вдалося знайти місце. Спробуйте пізніше.');
  }
};

export const reversePlace = async (lat: number, lon: number): Promise<GeoPlace> => {
  try {
    const { data } = await nextServer.get<{ data: GeoPlace }>('/geocode/reverse', {
      params: { lat, lon },
    });
    return data.data;
  } catch {
    throw new Error('Не вдалося визначити адресу за координатами.');
  }
};
