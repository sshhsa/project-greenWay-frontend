import type { Feedback } from '@/types/feedback';

export type CreateFeedbackRequest = {
  locationId: string;
  rate: number;
  description: string;
};

export const createFeedback = async (_body: CreateFeedbackRequest): Promise<Feedback> => {
  throw new Error('TODO: createFeedback');
};
