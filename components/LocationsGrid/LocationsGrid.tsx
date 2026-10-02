'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import LocationCard from '@/components/LocationCard/LocationCard';
import Loader from '@/components/ui/Loader/Loader';
import { getCategories } from '@/lib/api/getCategories';
import { getLocations } from '@/lib/api/getLocations';
import { isLocationSort } from '@/lib/locationSort';
import type { LocationsQuery } from '@/types/location';

import css from './LocationsGrid.module.css';

const SMALL_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;

function readQuery(
  params: URLSearchParams,
  limit: number,
): Omit<LocationsQuery, 'page'> {
  const sort = params.get('sort');

  return {
    limit,
    region: params.get('region') || undefined,
    type: params.get('type') || undefined,
    search: params.get('search') || undefined,
    sort: isLocationSort(sort) ? sort : undefined,
  };
}

export default function LocationsGrid() {
  const searchParams = useSearchParams();

  const [pageSize, setPageSize] = useState<number | null>(null);

  const query = readQuery(
    new URLSearchParams(searchParams.toString()),
    pageSize ?? SMALL_PAGE_SIZE,
  );

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const newPageStart = useRef<number | null>(null);
  const firstNewItem = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)');

    const updatePageSize = () => {
      newPageStart.current = null;

      setPageSize(
        desktop.matches ? DESKTOP_PAGE_SIZE : SMALL_PAGE_SIZE,
      );
    };

    updatePageSize();

    desktop.addEventListener('change', updatePageSize);

    return () => {
      desktop.removeEventListener('change', updatePageSize);
    };
  }, []);

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
    queryKey: ['locations', query],
    enabled: pageSize !== null,
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getLocations({
        ...query,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const typeNames = new Map(
    categories?.locationTypes.map((type) => [
      type.slug,
      type.type,
    ]) ?? [],
  );

  useEffect(() => {
    if (
      newPageStart.current !== null &&
      items.length > newPageStart.current
    ) {
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
      <div className={css.status} role="alert">
        <p>Не вдалося завантажити місця.</p>

        <button
          className={css.retryButton}
          type="button"
          onClick={() => void refetch()}
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={css.status}>
        <h2>Нічого не знайдено</h2>

        <p>Спробуйте змінити пошук або фільтри.</p>
      </div>
    );
  }

  return (
    <section
      className={css.locationsGrid}
      aria-label="Результати пошуку"
      aria-busy={isFetching}
    >
      <ul className={css.grid}>
        {items.map((location, index) => (
          <li
            key={location._id}
            ref={
              index === newPageStart.current
                ? firstNewItem
                : undefined
            }
          >
            <LocationCard
              location={{
                ...location,
                locationType:
                  typeNames.get(location.locationType) ??
                  location.locationType,
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
            {isFetchingNextPage
              ? 'Завантажуємо…'
              : 'Показати ще'}
          </button>
        </div>
      )}

      {error && (
        <p className={css.error} role="alert">
          Не вдалося завантажити наступні місця.
        </p>
      )}

      {isFetching && !isFetchingNextPage && (
        <p className={css.updating} role="status">
          Оновлюємо результати…
        </p>
      )}
    </section>
  );
}