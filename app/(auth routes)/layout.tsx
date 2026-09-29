import css from './AuthLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={css.wrapper}>{children}</div>;
}