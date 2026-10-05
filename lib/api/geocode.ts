import { nextServer } from './client';
import type { GeoPlace } from '@/types/geocode';

export const searchPlaces = async (query: string): Promise<GeoPlace[]> => {
  if (!query.trim()) return [];

  try {
    const response = await nextServer.get<{ data: GeoPlace[] }>('/api/geocode/search', {
      params: { q: query },
    });
    
    return response.data.data;
  } catch {
    throw new Error('Не вдалося знайти місце. Спробуйте пізніше.');
  }
};

export const reversePlace = async (lat: number, lon: number): Promise<GeoPlace> => {
  try {
    const response = await nextServer.get<{ data: GeoPlace }>('/api/geocode/reverse', {
      params: { lat, lon },
    });

    return response.data.data;
  } catch {
    throw new Error('Не вдалося визначити адресу за координатами.');
  }
};

