'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LocationForm } from '@/components/LocationForm/LocationForm';
import type { LocationFormValues } from '@/components/LocationForm/LocationForm';
import { createLocation } from '@/lib/api/createLocation';
import styles from './page.module.css';

export default function NewLocationPage() {
  const router = useRouter();

  const handleSubmit = async (values: LocationFormValues) => {
    try {
      const formData = new FormData();

      formData.append('name', values.name.trim());
      formData.append('locationType', values.locationType);
      formData.append('region', values.region);
      formData.append('description', values.description.trim());

      if (values.image) {
        formData.append('image', values.image);
      }

      const location = await createLocation(formData);

      toast.success('Локацію успішно створено!');

      router.push(`/locations/${location._id}`);
    } catch (error) {
      console.error('Помилка при створенні локації:', error);
      toast.error('Не вдалося створити локацію. Спробуйте ще раз.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Додавання нового місця</h1>
        <LocationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
