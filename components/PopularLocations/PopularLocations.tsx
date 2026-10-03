'use client';

import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import type { Location } from '@/types/location';
import { getPopularLocations } from '@/lib/api/getPopularLocations';
import LocationCard from '@/components/LocationCard/LocationCard';
import { Button } from '@/components/ui/Button/Button';

import css from './PopularLocations.module.css';

export default function PopularLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadPopularLocations = async () => {
      try {
        const data = await getPopularLocations(6);
        setLocations(data);
      } catch (error) {
        console.error('Failed to load popular locations:', error);
      }
    };

    loadPopularLocations();
  }, []);

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні локації</h2>

          <Button href="/locations" variant="primary" className={css.allLocationsButton}>
            Всі локації
          </Button>
        </div>

        <Swiper
          className={css.swiper}
          wrapperTag="ul"
          modules={[Navigation]}
          loop
          navigation={{
            prevEl: `.${css.prevButton}`,
            nextEl: `.${css.nextButton}`,
          }}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={16}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
        >
          {locations.map((location) => (
            <SwiperSlide key={location._id} tag="li" className={css.slide}>
              <LocationCard location={location} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={css.controls}>
          <button className={css.prevButton} type="button" aria-label="Попередня локація">
            <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
              <use href="/sprite.svg#icon-arrow-left" />
            </svg>
          </button>

          <button className={css.nextButton} type="button" aria-label="Наступна локація">
            <svg className={css.arrowIcon} width="24" height="24" aria-hidden="true">
              <use href="/sprite.svg#icon-arrow-right" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
