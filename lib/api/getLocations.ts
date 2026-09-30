// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Функція запиту з браузера до нашого Route Handler (див. lib/api/auth.ts як приклад).
// GET /api/locations?page&limit&region&type&search&sort → PaginatedResponse<Location>
import { nextServer } from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Location, LocationsQuery } from '@/types/location';

export const getLocations = async (
  query: LocationsQuery,
): Promise<PaginatedResponse<Location>> => {
  const { data } = await nextServer.get<PaginatedResponse<Location>>('/locations', {
    params: query,
  });
  return data;
};
