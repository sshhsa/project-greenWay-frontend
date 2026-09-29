import { isAxiosError } from 'axios';

const MESSAGES: Record<number, string> = {
  400: 'Перевірте правильність заповнення полів',
  401: 'Невірний email або пароль',
  409: 'Користувач з таким email вже існує',
};

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && MESSAGES[status]) return MESSAGES[status];
    if (!error.response) return 'Сервер недоступний, спробуйте пізніше';
  }
  return 'Щось пішло не так, спробуйте ще раз';
};