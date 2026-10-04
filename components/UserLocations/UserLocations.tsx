'use client';

import css from './UserLocations.module.css';
import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getUserLocations } from '@/lib/api/getUserLocations';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/components/ui/Loader/Loader';
import LocationCard from '@/components/LocationCard/LocationCard';
import { getCategories } from '@/lib/api/getCategories';
import EmptyLocations from '../EmptyLocations/EmptyLocations';

type Props = { userId?: string; isOwnProfile?: boolean };

const SMALL_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;

export default function UserLocations({ userId, isOwnProfile }: Props) {
  const [pageSize, setPageSize] = useState<number | null>(null);
  const newPageStart = useRef<number | null>(null);
  const firstNewItem = useRef<HTMLLIElement | null>(null);

  const currentUserId = useAuthStore((state) => state.user?._id);

  const targetUserId = isOwnProfile ? currentUserId : userId;
  const limit = pageSize ?? SMALL_PAGE_SIZE;

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)');

    const updatePageSize = () => {
      newPageStart.current = null;

      setPageSize(desktop.matches ? DESKTOP_PAGE_SIZE : SMALL_PAGE_SIZE);
    };

    updatePageSize();

    desktop.addEventListener('change', updatePageSize);

    return () => {
      desktop.removeEventListener('change', updatePageSize);
    };
  }, []);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['userLocations', targetUserId, limit],
    enabled: pageSize !== null && Boolean(targetUserId),
    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      if (!targetUserId) {
        throw new Error('User id is required');
      }

      return getUserLocations(targetUserId, pageParam, limit);
    },

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const typeNames = new Map(
    categories?.locationTypes.map((type) => [type.slug, type.type]) ?? [],
  );

  useEffect(() => {
    if (newPageStart.current !== null && items.length > newPageStart.current) {
      firstNewItem.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      newPageStart.current = null;
    }
  }, [items.length]);

  function showMore() {
    newPageStart.current = items.length;
    void fetchNextPage();
  }

  if (isPending) {
    return <Loader />;
  }

  if (error && items.length === 0) {
    return (
      <section className={css.userLocations}>
        <div className={css.status} role="alert">
          <p>Не вдалося завантажити місця.</p>
          <button className={css.retryButton} type="button" onClick={() => void refetch()}>
            Спробувати ще раз
          </button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={css.userLocations}>
        <EmptyLocations
          title={
            isOwnProfile
              ? 'Ви ще нічого не публікували, поділіться своєю першою локацією!'
              : 'Цей користувач ще не ділився локаціями'
          }
          linkText={isOwnProfile ? 'Поділитись локацією' : 'Назад до локацій'}
          link={isOwnProfile ? '/locations/new' : '/locations'}
        />
      </section>
    );
  }

  return (
    <section
      className={css.userLocations}
      aria-label="Локації користувача"
      aria-busy={isFetching}
    >
      <ul className={css.grid}>
        {items.map((location, index) => (
          <li
            key={location._id}
            ref={index === newPageStart.current ? firstNewItem : undefined}
          >
            <LocationCard
              showEdit={isOwnProfile}
              location={{
                ...location,
                locationType:
                  typeNames.get(location.locationType) ?? location.locationType,
              }}
            />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className={css.moreWrap}>
          <button
            className={css.moreButton}
            type="button"
            onClick={showMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Завантажуємо…' : 'Показати ще'}
          </button>
        </div>
      )}

      {error && (
        <section className={css.userLocations}>
          <p className={css.error} role="alert">
            Не вдалося завантажити наступні місця.
          </p>
        </section>
      )}

      {isFetching && !isFetchingNextPage && (
        <section className={css.userLocations}>
          <p className={css.updating} role="status">
            Оновлюємо результати…
          </p>
        </section>
      )}
    </section>
  );
}
