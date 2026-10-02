import { nextServer } from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Feedback } from '@/types/feedback';

export const getLatestFeedbacks = async (limit = 6): Promise<Feedback[]> => {
  const { data } = await nextServer.get<PaginatedResponse<Feedback>>('/feedbacks', {
    params: { limit },
  });

  return data.items;
};
