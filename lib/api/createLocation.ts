import type { Location } from '@/types/location';
import { nextServer } from './client';

export const createLocation = async (formData: FormData): Promise<Location> => {
  const response = await nextServer.post<Location>('/locations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

