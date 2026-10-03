'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import Modal from '../Modal/Modal';
import StarRating from '../StarRating/StarRating';
import css from './AddFeedbackModal.module.css';

type Props = {
  locationId: string;
  onClose: () => void;
};

export default function AddFeedbackModal({ locationId, onClose }: Props) {
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Оберіть оцінку від 1 до 5 зірок.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId,
          rate: rating,
          description: description.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Не вдалося надіслати відгук.');
      }

      toast.success('Відгук відправлено', {
        style: {
          background: 'var(--color-accent)',
          color: 'var(--color-white)',
        },
      });

      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Сталася помилка. Спробуйте ще раз.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <section
        className={css.addFeedbackModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <h2 id="feedback-modal-title">Залишити відгук</h2>

        <form className={css.form} onSubmit={handleSubmit}>
          <label className={css.label} htmlFor="feedback-description">
            Ваш відгук
          </label>

          <textarea
            className={css.textarea}
            id="feedback-description"
            placeholder="Напишіть ваш відгук"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={200}
            required
          />

          <StarRating value={rating} onChange={setRating} />

          {error && (
            <p className={css.error} role="alert">
              {error}
            </p>
          )}

          <div className={css.actions}>
            <button
              className={css.cancelButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Відмінити
            </button>

            <button className={css.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Надсилання…' : 'Надіслати'}
            </button>
          </div>
        </form>
      </section>
    </Modal>
  );
}
