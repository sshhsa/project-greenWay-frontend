// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Форма локації (фото з прев'ю, назва, тип, регіон, опис). Одна для створення і редагування
// TODO: верстка за макетом у 3 брейкпоінтах; 'use client' додай, якщо потрібні хуки/події

import type { Location } from '@/types/location';
import css from './LocationForm.module.css';

type Props = {
  initialValues?: Partial<Location>;
  onSubmit?: (formData: FormData) => Promise<void>;
};

export default function LocationForm({ initialValues, onSubmit }: Props) {
  return <div className={css.locationForm}>LocationForm — TODO</div>;
}