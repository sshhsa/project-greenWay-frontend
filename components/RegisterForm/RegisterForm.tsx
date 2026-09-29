'use client';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { register } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/getErrorMessage';
import { useAuthStore } from '@/lib/store/authStore';
import type { RegisterRequest } from '@/types/user';

import css from '../LoginForm/LoginForm.module.css';

const schema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(32, 'Максимум 32 символи')
    .required("Обов'язкове поле"),
  email: Yup.string()
    .trim()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
    .required("Обов'язкове поле"),
});

const initialValues: RegisterRequest = { name: '', email: '', password: '' };

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      const user = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
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
          <h1 className={css.title}>Реєстрація</h1>

          <div className={css.field}>
            <label className={css.label} htmlFor="register-name">
              Ім&apos;я*
            </label>
            <Field
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Ваше ім'я"
              className={css.input}
              aria-invalid={Boolean(touched.name && errors.name)}
            />
            <ErrorMessage name="name" component="span" className={css.error} />
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="register-email">
              Пошта*
            </label>
            <Field
              id="register-email"
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
            <label className={css.label} htmlFor="register-password">
              Пароль*
            </label>
            <Field
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              className={css.input}
              aria-invalid={Boolean(touched.password && errors.password)}
            />
            <ErrorMessage name="password" component="span" className={css.error} />
          </div>

          <button className={css.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Реєстрація...' : 'Зареєструватись'}
          </button>
        </Form>
      )}
    </Formik>
  );
}