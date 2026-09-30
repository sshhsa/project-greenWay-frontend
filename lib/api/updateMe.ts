// Власник: Маркіян
// PATCH /api/users/me, multipart/form-data (name, avatar) → User
import { nextServer } from './client';
import type { SingleResponse } from '@/types/api';
import type { User } from '@/types/user';

export const updateMe = async (formData: FormData) => {
  const { data } = await nextServer.patch<SingleResponse<User>>('/users/me', formData);
  return data.data;
};
