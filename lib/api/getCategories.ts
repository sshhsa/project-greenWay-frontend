// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Функція запиту з браузера до нашого Route Handler (див. lib/api/auth.ts як приклад).
// GET /api/categories → { regions, locationTypes }
import type { Categories } from '@/types/category';
import type { SingleResponse } from '@/types/api';
import { nextServer } from './client';

export const getCategories = async (): Promise<Categories> => {
  const { data } = await nextServer.get<SingleResponse<Categories>>('/categories');
  return data.data;
};
