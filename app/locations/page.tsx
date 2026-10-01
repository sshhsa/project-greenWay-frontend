import { Suspense } from 'react';

import FiltersPanel from '@/components/FiltersPanel/FiltersPanel';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import Loader from '@/components/ui/Loader/Loader';
import css from './page.module.css';

export default function LocationsPage() {
  return (
    <section className={`container ${css.locationsPage}`}>
      <h1 className={css.title}>Усі місця відпочинку</h1>
      {/* Suspense потрібен, бо FiltersPanel і LocationsGrid читають useSearchParams */}
      <Suspense fallback={<Loader />}>
        <FiltersPanel />
        <LocationsGrid />
      </Suspense>
    </section>
  );
}
