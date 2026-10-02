"use client";

import { LocationForm } from '@/components/LocationForm/LocationForm';
import styles from './page.module.css';

type NewLocationFormValues = Record<string, unknown>;

export default function NewLocationPage() {
  const handleSubmit = async (values: NewLocationFormValues) => {
    console.log(values);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Додавання нового місця</h1>
        <LocationForm 
          regions={[]} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
