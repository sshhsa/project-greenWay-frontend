'use client';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import type { Feedback } from '@/types/feedback';
import FeedbackCard from '@/components/FeedbackCard/FeedbackCard';

import css from './FeedbackSlider.module.css';

type Props = {
  feedbacks: Feedback[];
};

export default function FeedbackSlider({ feedbacks }: Props) {
  return (
    <>
      <Swiper
        className={css.swiper}
        wrapperTag="ul"
        modules={[Navigation]}
        navigation={{
          prevEl: `.${css.prevButton}`,
          nextEl: `.${css.nextButton}`,
        }}
        slidesPerView="auto"
        spaceBetween={16}
        breakpoints={{
          768: {
            spaceBetween: 24,
          },
          1440: {
            spaceBetween: 24,
          },
        }}
      >
        {feedbacks.map((feedback) => (
          <SwiperSlide key={feedback._id} tag="li" className={css.slide}>
            <FeedbackCard feedback={feedback} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.controls}>
        <button className={css.prevButton} type="button" aria-label="Попередній відгук">
          <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
            <use href="/sprite.svg#icon-arrow-left" />
          </svg>
        </button>

        <button className={css.nextButton} type="button" aria-label="Наступний відгук">
          <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
            <use href="/sprite.svg#icon-arrow-right" />
          </svg>
        </button>
      </div>
    </>
  );
}
