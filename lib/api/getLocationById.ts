import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { Location } from '@/types/location';

export const getLocationById = async (locationId: string): Promise<Location> => {
  const { data } = await nextServer.get<SingleResponse<Location>>(`/locations/${locationId}`);
  return data.data;
};