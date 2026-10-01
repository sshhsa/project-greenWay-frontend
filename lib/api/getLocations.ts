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
