import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { User } from '@/types/user';

export const getUserById = async (userId: string): Promise<User> => {
const { data } = await nextServer.get<SingleResponse<User>>(
'/users/' + userId
);

return data.data;
};