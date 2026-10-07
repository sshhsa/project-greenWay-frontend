'use client';

import { Suspense, useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getUserLocations } from '@/lib/api/getUserLocations';
import { getCategories } from '@/lib/api/getCategories';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/components/ui/Loader/Loader';
import Pagination from '@/components/ui/Pagination/Pagination';
import { m } from 'motion/react';
import { staggerItem, staggerList } from '@/lib/motion';
import LocationCard from '@/components/LocationCard/LocationCard';
import EmptyLocations from '../EmptyLocations/EmptyLocations';

import css from './UserLocations.module.css';

type Props = { userId?: string; isOwnProfile?: boolean };

const SMALL_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 6;

function UserLocationsContent({ userId, isOwnProfile }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState<number | null>(null);

  const currentUserId = useAuthStore((state) => state.user?._id);
  const targetUserId = isOwnProfile ? currentUserId : userId;
  const limit = pageSize ?? SMALL_PAGE_SIZE;

  const pageFromUrl = Number(searchParams.get('page'));
  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)');
    const updatePageSize = () =>
      setPageSize(desktop.matches ? DESKTOP_PAGE_SIZE : SMALL_PAGE_SIZE);

    updatePageSize();
    desktop.addEventListener('change', updatePageSize);
    return () => desktop.removeEventListener('change', updatePageSize);
  }, []);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data, error, isPending, isFetching, refetch } = useQuery({
    queryKey: ['userLocations', targetUserId, page, limit],
    queryFn: () => getUserLocations(targetUserId as string, page, limit),
    enabled: pageSize !== null && Boolean(targetUserId),
    placeholderData: keepPreviousData,
    retry: (failureCount, err) =>
      !(isAxiosError(err) && err.response?.status === 404) && failureCount < 2,
  });

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    document
      .getElementById('user-locations')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasNoLocations = data?.totalItems === 0;
  const hasEmptyRequestedPage = Boolean(data) && items.length === 0 && !hasNoLocations;
  const userIsNotFound = isAxiosError(error) && error.response?.status === 404;
  const typeNames = new Map(
    categories?.locationTypes.map((type) => [type.slug, type.type]) ?? [],
  );

  if (isPending) {
    return (
      <section className={css.userLocations}>
        <Loader />
      </section>
    );
  }

  if (userIsNotFound) {
    return (
      <section className={css.userLocations}>
        <EmptyLocations
          title="Користувача не знайдено"
          linkText="Назад до локацій"
          link="/locations"
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className={css.userLocations}>
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
      </section>
    );
  }

  if (hasNoLocations) {
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

  if (hasEmptyRequestedPage) {
    return (
      <section className={css.userLocations}>
        <EmptyLocations
          title="На цій сторінці локацій немає"
          linkText="Перейти на першу сторінку"
          link={`${pathname}?page=1`}
        />
      </section>
    );
  }

  return (
    <section
      id="user-locations"
      className={css.userLocations}
      aria-label="Локації користувача"
      aria-busy={isFetching}
    >
      <m.ul className={css.grid} variants={staggerList} initial="hidden" animate="show">
        {items.map((location) => (
          <m.li variants={staggerItem} key={location._id}>
            <LocationCard
              showEdit={isOwnProfile}
              location={{
                ...location,
                locationType:
                  typeNames.get(location.locationType) ?? location.locationType,
              }}
            />
          </m.li>
        ))}
      </m.ul>

      <div className={css.paginationWrap}>
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </section>
  );
}

export default function UserLocations(props: Props) {
  return (
    <Suspense
      fallback={
        <section className={css.userLocations}>
          <Loader />
        </section>
      }
    >
      <UserLocationsContent {...props} />
    </Suspense>
  );
}
