import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { Location } from '@/types/location';

export const updateLocation = async (
  locationId: string,
  formData: FormData,
): Promise<Location> => {
  const { data } = await nextServer.patch<SingleResponse<Location>>(
    `/locations/${locationId}`,
    formData,
  );

  return data.data;
};