'use client';

import { useQuery } from '@tanstack/react-query';

import FeedbackSlider from '../FeedbackSlider/FeedbackSlider';
import css from './LocationFeedbacks.module.css';
import { getLocationById } from '@/lib/api/getLocationById';
import Loader from '../ui/Loader/Loader';
import { Feedback } from '@/types/feedback';
import { Button } from '../ui/Button/Button';

type Props = { locationId: string };

export default function LocationFeedbacks({ locationId }: Props) {
  const { data: location, isError } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocationById(locationId),
  });

  if (!location) {
    return isError ? <p>Не вдалося завантажити відгуки</p> : <Loader />;
  }

  const feedback = location.feedbacksId as Feedback[];

  return (
    <div className={css.locationFeedbacks}>
      <div className={css.titleButtonBlock}>
        <h2 className={css.title}>Відгуки</h2>
        <Button className={css.btn} href={`/locations/${locationId}/feedback`}>
          Залишити відгук
        </Button>{' '}
      </div>
      <FeedbackSlider feedbacks={feedback} />
    </div>
  );
}
