import { nextServer } from './client';
import { isAxiosError } from 'axios';
import type { SingleResponse } from '@/types/api';
import type { LoginRequest, RegisterRequest, User } from '@/types/user';

export const register = async (body: RegisterRequest) => {
  const { data } = await nextServer.post<SingleResponse<User>>('/auth/register', body);
  return data.data;
};

export const login = async (body: LoginRequest) => {
  const { data } = await nextServer.post<SingleResponse<User>>('/auth/login', body);
  return data.data;
};

export const logout = async () => {
  try {
    await nextServer.post('/auth/logout');
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      await nextServer.post('auth/refresh');
      await nextServer.post('auth/logout');
    }
    throw error;
  }
};

// null — гість або сесія протухла (route handler відповідає 200 { data: null })
export const getMe = async (): Promise<User | null> => {
  const { data } = await nextServer.get<SingleResponse<User | null>>('/users/me');
  return data.data;
};
