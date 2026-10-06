'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import { getCategories } from '@/lib/api/getCategories';
import { LOCATION_SORT_OPTIONS } from '@/lib/locationSort';
import css from './FiltersPanel.module.css';

type FilterKey = 'search' | 'region' | 'type' | 'sort';

export default function FiltersPanel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(currentSearch);
  const [selectVersions, setSelectVersions] = useState({ region: 0, type: 0, sort: 0 });
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

  function closeOtherSelects(active: Exclude<FilterKey, 'search'>) {
    // Спільний Select зберігає відкриття всередині: скидаємо лише інші селекти.
    setSelectVersions((previous) => ({
      region: previous.region + Number(active !== 'region'),
      type: previous.type + Number(active !== 'type'),
      sort: previous.sort + Number(active !== 'sort'),
    }));
  }

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
          <Input
            className={css.searchInput}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Пошук"
            maxLength={96}
          />
        </label>

        <div
          className={`${css.field} ${css.selectField} ${isPending ? css.loadingField : ''}`}
          role="group"
          aria-label="Регіон"
          aria-busy={isPending}
          onClickCapture={() => closeOtherSelects('region')}
        >
          <Select
            key={selectVersions.region}
            placeholder="Регіон"
            value={categories ? searchParams.get('region') ?? '' : ''}
            onChange={(value) => updateParam('region', value)}
            disabled={isPending || isError}
            options={[
              { value: '', label: 'Регіон' },
              ...(categories?.regions.map((region) => ({
                value: region.slug,
                label: region.region,
              })) ?? []),
            ]}
          />
        </div>

        <div
          className={`${css.field} ${css.selectField} ${css.typeField} ${isPending ? css.loadingField : ''}`}
          role="group"
          aria-label="Тип локації"
          aria-busy={isPending}
          onClickCapture={() => closeOtherSelects('type')}
        >
          <Select
            key={selectVersions.type}
            placeholder="Тип локації"
            value={categories ? searchParams.get('type') ?? '' : ''}
            onChange={(value) => updateParam('type', value)}
            disabled={isPending || isError}
            options={[
              { value: '', label: 'Тип локації' },
              ...(categories?.locationTypes.map((type) => ({
                value: type.slug,
                label: type.type,
              })) ?? []),
            ]}
          />
        </div>

        <div
          className={`${css.field} ${css.selectField} ${css.sortField}`}
          role="group"
          aria-label="Сортування"
          onClickCapture={() => closeOtherSelects('sort')}
        >
          <Select
            key={selectVersions.sort}
            placeholder="Сортування"
            value={searchParams.get('sort') ?? ''}
            onChange={(value) => updateParam('sort', value)}
            options={[
              { value: '', label: 'Сортування' },
              ...LOCATION_SORT_OPTIONS.map(({ value, label }) => ({
                value,
                label: label.replace(/\s+([↑↓])$/, '\u00a0$1'),
              })),
            ]}
          />
        </div>
      </div>

      {isError && <p className={css.error} role="alert">Не вдалося завантажити фільтри.</p>}
    </div>
  );
}
