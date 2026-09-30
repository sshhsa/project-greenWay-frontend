'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getCategories } from '@/lib/api/getCategories';
import { LOCATION_SORT_OPTIONS } from '@/lib/locationSort';
import css from './FiltersPanel.module.css';

type FilterKey = 'search' | 'region' | 'type' | 'sort';

export default function FiltersPanel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(currentSearch);
  const { data: categories, isPending, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (search.trim() === currentSearch) return;

    const timer = window.setTimeout(() => {
      updateParam('search', search.trim());
    }, 350);
    return () => window.clearTimeout(timer);
    // URL updates should follow typing, not re-run when another filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, currentSearch]);

  function updateParam(key: FilterKey, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');

    const nextQuery = params.toString();
    window.history.replaceState(null, '', `${pathname}${nextQuery ? `?${nextQuery}` : ''}`);
  }

  return (
    <div className={css.filtersPanel}>
      <div className={css.topRow}>
        <label className={css.field}>
          <span className="visually-hidden">Пошук місць</span>
          {/* TODO: Замінити поле пошуку на спільний UI-компонент Input після його реалізації. */}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Пошук"
            maxLength={96}
          />
        </label>

        <label className={`${css.field} ${css.selectField} ${isPending ? css.loadingField : ''}`}>
          <span className="visually-hidden">Регіон</span>
          {/* TODO: Замінити вибір регіону на спільний UI-компонент Select після його реалізації. */}
          <select
            value={categories ? searchParams.get('region') ?? '' : ''}
            onChange={(event) => updateParam('region', event.target.value)}
            disabled={isPending || isError}
            aria-busy={isPending}
          >
            <option value="">Регіон</option>
            {categories?.regions.map((region) => (
              <option key={region._id} value={region.slug}>
                {region.region}
              </option>
            ))}
          </select>
        </label>

        <label className={`${css.field} ${css.selectField} ${css.typeField} ${isPending ? css.loadingField : ''}`}>
          <span className="visually-hidden">Тип локації</span>
          {/* TODO: Замінити вибір типу локації на спільний UI-компонент Select після його реалізації. */}
          <select
            value={categories ? searchParams.get('type') ?? '' : ''}
            onChange={(event) => updateParam('type', event.target.value)}
            disabled={isPending || isError}
            aria-busy={isPending}
          >
            <option value="">Тип локації</option>
            {categories?.locationTypes.map((type) => (
              <option key={type._id} value={type.slug}>
                {type.type}
              </option>
            ))}
          </select>
        </label>

        <label className={`${css.field} ${css.selectField} ${css.sortField}`}>
          <span className="visually-hidden">Сортування</span>
          {/* TODO: Замінити вибір сортування на спільний UI-компонент Select після його реалізації. */}
          <select
            value={searchParams.get('sort') ?? ''}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            <option value="">Сортування</option>
            {LOCATION_SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {isError && <p className={css.error} role="alert">Не вдалося завантажити фільтри.</p>}
    </div>
  );
}
