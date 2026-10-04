'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { getLocationById } from '@/lib/api/getLocationById';
import { getCategories } from '@/lib/api/getCategories';
import StarRating from '../StarRating/StarRating';
import LocationMap from '../LocationMap/LocationMap';
import Loader from '../ui/Loader/Loader';

import css from './LocationDetails.module.css';

type Props = { locationId: string };

export default function LocationDetails({ locationId }: Props) {
  const { data, isError } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocationById(locationId),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (!data) {
    return isError ? <p>Не вдалося завантажити локацію</p> : <Loader />;
  }

  const owner = typeof data.ownerId === 'object' ? data.ownerId : null;
  const regionName =
    categories?.regions.find((r) => r.slug === data.region)?.region ?? data.region;
  const typeName =
    categories?.locationTypes.find((t) => t.slug === data.locationType)?.type ??
    data.locationType;

  return (
    <div className={css.locationDetails}>
      <div className={css.container}>
        <Image
          className={css.image}
          src={data.image}
          alt={data.name}
          width={755}
          height={502}
        />

        <div className={css.info}>
          <div className={css.rate}>
            <StarRating value={data.rate} />
            <span className={css.rateValue}>{data.rate}</span>
          </div>
          <h1 className={css.title}>{data.name}</h1>
          <ul className={css.list}>
            <li className={css.item}>
              <span className={css.label}>Регіон:</span> {regionName}
            </li>
            <li className={css.item}>
              <span className={css.label}>Тип локації:</span> {typeName}
            </li>
            {owner && (
              <li className={css.item}>
                <span className={css.label}>Автор статті:</span>
                <Link className={css.link} href={`/users/${owner._id}`}>
                  {owner.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <p className={css.description}>{data.description}</p>
      <LocationMap coordinates={data.coordinates} />
    </div>
  );
}
