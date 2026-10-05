'use client';
// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Модалка для гостя: дія потребує авторизації → «Увійти» (/sign-in) / «Зареєструватись» (/sign-up).
// Рендериться умовно батьком: {isAuthPromptOpen && <AuthPromptModal onClose={...} />}.
// Закривається: хрестик, backdrop, Escape. Посилання onClose не викликають: перехід сам розмонтовує модалку,
// а onClose в intercepted-роуті (/locations/:id/feedback) = router.back() і перебиває навігацію.

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

import css from './AuthPromptModal.module.css';

const DEFAULT_MESSAGE =
  'Щоб виконати цю дію, будь ласка, увійдіть у свій акаунт або зареєструйтесь.';

type Props = {
  onClose: () => void;
  // пояснення під конкретну дію, напр. «Щоб залишити відгук, будь ласка, увійдіть…»
  message?: string;
};

export default function AuthPromptModal({ onClose, message = DEFAULT_MESSAGE }: Props) {
  const titleId = useId();
  const messageId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Escape, утримання Tab у модалці, блок скролу сторінки, фокус і його повернення після закриття
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    signInRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>('a[href], button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <div className={css.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        ref={modalRef}
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className={css.closeButton}
          type="button"
          onClick={onClose}
          aria-label="Закрити вікно авторизації"
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
          Потрібна авторизація
        </h2>
        <p className={css.text} id={messageId}>
          {message}
        </p>

        <div className={css.actions}>
          <Link ref={signInRef} className={css.signIn} href="/sign-in">
            Увійти
          </Link>
          <Link className={css.signUp} href="/sign-up">
            Зареєструватись
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
