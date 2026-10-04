import type { PaginatedResponse } from '@/types/api';
import type { Location } from '@/types/location';
import { nextServer } from './client';

export const getUserLocations = async (
  userId: string,
  page = 1,
  limit = 6,
): Promise<PaginatedResponse<Location>> => {
  const { data } = await nextServer.get<PaginatedResponse<Location>>(`/users/${userId}/locations`, {
    params: {
      page,
      limit,
    },
  });
  return data;
};
