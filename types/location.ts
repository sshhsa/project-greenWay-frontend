import type { Feedback } from './feedback';
import type { User } from './user';

export type Location = {
  _id: string;
  name: string;
  image: string;
  locationType: string; // slug типу, напр. 'more'
  region: string; // slug регіону, напр. 'odeshchyna'
  description: string;
  rate: number;
  ownerId: string | Pick<User, '_id' | 'name' | 'avatarUrl'>;
  feedbacksId: string[] | Feedback[];
};

export type LocationsQuery = {
  page?: number;
  limit?: number;
  region?: string;
  type?: string;
  search?: string;
  sort?: 'name' | '-name' | 'rating' | '-rating';
};
