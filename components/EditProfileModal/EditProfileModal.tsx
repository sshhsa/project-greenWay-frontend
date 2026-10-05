'use client';
// Власник: Маркіян · extra-доробка за макетом: Олександр (див. docs/FRONTEND_TASKS.md)
// Модалка редагування профілю (додаткове завдання): аватар + ім'я → PATCH /api/users/me.
// Відкривається кліком по аватару/імені в Header. Закривається: хрестик, «Відмінити», backdrop, Escape.

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

import { updateMe } from '@/lib/api/updateMe';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

import css from './EditProfileModal.module.css';

const MAX_AVATAR_SIZE = 1024 * 1024; // бекенд: jpg/png < 1MB
const AVATAR_TYPES = ['image/jpeg', 'image/png'];

type FormValues = { name: string; avatar: File | null };

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Імʼя має містити щонайменше 2 символи')
    .max(32, 'Імʼя має містити не більше 32 символів')
    .required('Введіть імʼя'),
  avatar: Yup.mixed<File>()
    .nullable()
    .test('fileType', 'Оберіть зображення у форматі JPG або PNG', (file) =>
      file ? AVATAR_TYPES.includes(file.type) : true,
    )
    .test('fileSize', 'Розмір фото має бути меншим за 1 МБ', (file) =>
      file ? file.size < MAX_AVATAR_SIZE : true,
    ),
});

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Сесія завершилась. Увійдіть знову';
    if (!error.response) return 'Сервер недоступний, спробуйте пізніше';
    if (error.response.data?.message) return error.response.data.message;
  }
  return 'Не вдалося оновити профіль. Спробуйте ще раз';
};

type Props = { user: User; onClose: () => void };

export default function EditProfileModal({ user, onClose }: Props) {
  const titleId = useId();
  const nameId = useId();
  const avatarId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      // оновлюємо дані профілю, які могли вже бути в кеші / на серверних сторінках
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey.some((key) =>
            ['me', 'user', 'users', 'profile'].includes(String(key)),
          ),
      });
      router.refresh();
      toast.success('Профіль оновлено');
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const requestClose = () => {
    if (!isPending) onClose();
  };
  const closeRef = useRef(requestClose);
  closeRef.current = requestClose;

  // Escape, блок скролу сторінки, фокус у модалці та повернення фокусу після закриття
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nameInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  // прев'ю вибраного фото
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleSubmit = (values: FormValues) => {
    const formData = new FormData();
    const name = values.name.trim();
    if (name !== user.name) formData.append('name', name);
    if (values.avatar) formData.append('avatar', values.avatar);
    mutate(formData);
  };

  const avatarSrc = preview ?? (user.avatarUrl || null);

  return createPortal(
    <div className={css.backdrop} role="presentation" onMouseDown={requestClose}>
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className={css.closeButton}
          type="button"
          onClick={requestClose}
          disabled={isPending}
          aria-label="Закрити вікно редагування профілю"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <h2 className={css.title} id={titleId}>
          Редагувати профіль
        </h2>

        <Formik<FormValues>
          initialValues={{ name: user.name, avatar: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
            const hasChanges = values.avatar !== null || values.name.trim() !== user.name;

            return (
              <Form className={css.form} noValidate>
                <div className={css.field}>
                  <span className={css.label}>Аватар</span>
                  <div className={css.upload}>
                    {avatarSrc ? (
                      <Image
                        className={css.avatar}
                        src={avatarSrc}
                        alt={`Аватар ${user.name}`}
                        width={117}
                        height={117}
                        unoptimized={Boolean(preview)}
                      />
                    ) : (
                      <span
                        className={`${css.avatar} ${css.avatarFallback}`}
                        aria-hidden="true"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}

                    <input
                      className={`visually-hidden ${css.fileInput}`}
                      id={avatarId}
                      type="file"
                      name="avatar"
                      accept="image/jpeg,image/png"
                      disabled={isPending}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0] ?? null;
                        event.currentTarget.value = ''; // дозволяє вибрати той самий файл ще раз
                        setFieldTouched('avatar', true, false);
                        setFieldValue('avatar', file, true);
                        const isValid =
                          file &&
                          AVATAR_TYPES.includes(file.type) &&
                          file.size < MAX_AVATAR_SIZE;
                        setPreview(isValid ? URL.createObjectURL(file) : null);
                      }}
                    />
                    <label className={css.uploadButton} htmlFor={avatarId}>
                      Завантажити фото
                    </label>
                  </div>
                  {touched.avatar && errors.avatar && (
                    <p className={css.error} role="alert">
                      {errors.avatar}
                    </p>
                  )}
                </div>

                <div className={css.field}>
                  <label className={css.label} htmlFor={nameId}>
                    Імʼя
                  </label>
                  <Field
                    innerRef={nameInputRef}
                    className={`${css.input} ${touched.name && errors.name ? css.inputError : ''}`}
                    id={nameId}
                    name="name"
                    type="text"
                    placeholder="Введіть нове імʼя"
                    autoComplete="name"
                    maxLength={64}
                    disabled={isPending}
                    aria-invalid={Boolean(touched.name && errors.name)}
                  />
                  <ErrorMessage name="name">
                    {(message) => (
                      <p className={css.error} role="alert">
                        {message}
                      </p>
                    )}
                  </ErrorMessage>
                </div>

                <div className={css.actions}>
                  <button
                    className={css.cancelButton}
                    type="button"
                    onClick={requestClose}
                    disabled={isPending}
                  >
                    Відмінити
                  </button>
                  <button
                    className={css.submitButton}
                    type="submit"
                    disabled={isPending || !hasChanges}
                    aria-busy={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className={css.spinner} aria-hidden="true" />
                        Збереження…
                      </>
                    ) : (
                      'Зберегти'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>,
    document.body,
  );
}
