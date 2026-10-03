import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { Location } from '@/types/location';

export const getPopularLocations = async (limit = 6): Promise<Location[]> => {
  const { data } = await nextServer.get<SingleResponse<Location[]>>(
    '/locations/popular',
    {
      params: { limit },
    },
  );

  return data.data;
};
