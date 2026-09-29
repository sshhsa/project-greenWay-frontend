'use client';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { login } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/getErrorMessage';
import { useAuthStore } from '@/lib/store/authStore';
import type { LoginRequest } from '@/types/user';

import css from './LoginForm.module.css';

const schema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required("Обов'язкове поле"),
  password: Yup.string().required("Обов'язкове поле"),
});

const initialValues: LoginRequest = { email: '', password: '' };

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: LoginRequest) => {
    try {
      const user = await login({ ...values, email: values.email.trim() });
      setUser(user);
      router.push('/profile');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form} noValidate>
          <h1 className={css.title}>Вхід</h1>

          <div className={css.field}>
            <label className={css.label} htmlFor="login-email">
              Пошта*
            </label>
            <Field
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="hello@relaxmap.ua"
              className={css.input}
              aria-invalid={Boolean(touched.email && errors.email)}
            />
            <ErrorMessage name="email" component="span" className={css.error} />
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="login-password">
              Пароль*
            </label>
            <Field
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              className={css.input}
              aria-invalid={Boolean(touched.password && errors.password)}
            />
            <ErrorMessage name="password" component="span" className={css.error} />
          </div>

          <button className={css.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Вхід...' : 'Увійти'}
          </button>
        </Form>
      )}
    </Formik>
  );
}