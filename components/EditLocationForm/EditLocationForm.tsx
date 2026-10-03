'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  LocationForm,
  type LocationFormValues,
} from '@/components/LocationForm/LocationForm';
import { getLocationById } from '@/lib/api/getLocationById';
import { updateLocation } from '@/lib/api/updateLocation';
import type { Location } from '@/types/location';

import css from './EditLocationForm.module.css';

type Props = {
  locationId: string;
};

export default function EditLocationForm({ locationId }: Props) {
  const router = useRouter();

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getLocationById(locationId);

        if (isMounted) {
          setLocation(data);
        }
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : 'Не вдалося завантажити локацію.';

        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLocation();

    return () => {
      isMounted = false;
    };
  }, [locationId]);

  const handleSubmit = async (values: LocationFormValues) => {
    const formData = new FormData();

    formData.append('name', values.name.trim());
    formData.append('locationType', values.locationType);
    formData.append('region', values.region);
    formData.append('description', values.description.trim());

    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      await updateLocation(locationId, formData);

      toast.success('Локацію успішно оновлено.');

      router.push(`/locations/${locationId}`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не вдалося оновити локацію.';

      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className={css.editLocationForm}>
        <p>Завантаження...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className={css.editLocationForm}>
        <p>{error ?? 'Локацію не знайдено.'}</p>
      </div>
    );
  }

  return (
    <div className={css.editLocationForm}>
      <LocationForm
        initialValues={{
          name: location.name,
          locationType: location.locationType,
          region: location.region,
          description: location.description,
        }}
        initialImageUrl={location.image}
        onSubmit={handleSubmit}
      />
    </div>
  );
}