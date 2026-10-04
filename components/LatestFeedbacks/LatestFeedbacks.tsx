'use client';

import { useEffect, useState } from 'react';

import type { Feedback } from '@/types/feedback';
import { getLatestFeedbacks } from '@/lib/api/getLatestFeedbacks';
import FeedbackSlider from '@/components/FeedbackSlider/FeedbackSlider';

import css from './LatestFeedbacks.module.css';

export default function LatestFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getLatestFeedbacks(6);
        setFeedbacks(data);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
      }
    };

    loadFeedbacks();
  }, []);

  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Останні відгуки</h2>
        <FeedbackSlider feedbacks={feedbacks} />
      </div>
    </section>
  );
}
