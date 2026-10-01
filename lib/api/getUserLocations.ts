import type { PaginatedResponse } from '@/types/api';
import type { Location } from '@/types/location';

export const getUserLocations = async (
  _userId: string,
  _page = 1,
  _limit = 6,
): Promise<PaginatedResponse<Location>> => {
  throw new Error('TODO: getUserLocations');
};
