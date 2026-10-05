'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import LocationCard from '@/components/LocationCard/LocationCard';
import { Button } from '@/components/ui/Button/Button';
import { getCategories } from '@/lib/api/getCategories';
import { getPopularLocations } from '@/lib/api/getPopularLocations';
import type { Location } from '@/types/location';

import css from './PopularLocations.module.css';

export default function PopularLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const typeNames = new Map(
    categories?.locationTypes.map((type) => [type.slug, type.type]) ?? [],
  );

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

          <Button href="/locations" className={css.allLocationsButton}>
            Всі локації
          </Button>
        </div>

        {locations.length > 0 && (
          <Swiper
            className={css.swiper}
            wrapperTag="ul"
            modules={[Navigation]}
            loop={locations.length > 3}
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
                <LocationCard
                  location={{
                    ...location,
                    locationType:
                      typeNames.get(location.locationType) ?? location.locationType,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

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
