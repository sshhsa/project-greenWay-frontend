// Власник: Христина (див. docs/FRONTEND_TASKS.md)
// Заголовок, «Залишити відгук», Swiper відгуків локації
// TODO: верстка за макетом у 3 брейкпоінтах; 'use client' додай, якщо потрібні хуки/події
'use client'

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
    queryFn: ()=> getLocationById(locationId)
  })

  if (!location) {
    return isError ? <p>;
    </p> : <Loader/>
  }

  const feedback = location.feedbacksId as Feedback[];


  return (
    <div className={css.locationFeedbacks}>
      <div className={css.titleButtonBlock}>
      <h2 className={css.title}>Відгуки</h2>
      <Button className={css.btn}>Залишити відгук</Button> </div>
     <FeedbackSlider feedbacks={feedback} />
  </div>)
}
