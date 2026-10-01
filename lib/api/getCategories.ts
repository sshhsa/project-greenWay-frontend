import type { Categories } from '@/types/category';
import type { SingleResponse } from '@/types/api';
import { nextServer } from './client';

export const getCategories = async (): Promise<Categories> => {
  const { data } = await nextServer.get<SingleResponse<Categories>>('/categories');
  return data.data;
};
