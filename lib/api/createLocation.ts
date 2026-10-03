import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { Location } from '@/types/location';

export const createLocation = async (formData: FormData): Promise<Location> => {
  const { data } = await nextServer.post<SingleResponse<Location>>(
    '/locations',
    formData,
  );
  return data.data;
};
