import type { Feedback } from '@/types/feedback';
import StarRating from '@/components/StarRating/StarRating';

import css from './FeedbackCard.module.css';

type Props = {
  feedback: Feedback;
};

export default function FeedbackCard({ feedback }: Props) {
  const locationName =
    typeof feedback.locationId === 'object' ? feedback.locationId.name : undefined;

  return (
    <div className={css.card}>
      <StarRating value={feedback.rate} />

      <p className={css.description}>{feedback.description}</p>

      <div className={css.author}>
        <p className={css.userName}>{feedback.userName}</p>

        <p
          className={`${css.locationName} ${!locationName ? css.locationNameHidden : ''}`}
        >
          {locationName || 'placeholder'}
        </p>
      </div>
    </div>
  );
}
