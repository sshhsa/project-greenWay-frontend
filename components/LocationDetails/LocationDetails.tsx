// Власник: Христина (див. docs/FRONTEND_TASKS.md)
// Рейтинг, назва, регіон, тип, автор-посилання, фото, опис
// TODO: верстка за макетом у 3 брейкпоінтах; 'use client' додай, якщо потрібні хуки/події
'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { getLocationById } from '@/lib/api/getLocationById';
import css from './LocationDetails.module.css';
import StarRating from '../StarRating/StarRating';

type Props = { locationId: string };

export default function LocationDetails({ locationId }: Props) {
  const { data, isError } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocationById(locationId),
  });

  if (!data) {
     return isError ? <p>error</p> : <p>.....</p>; /*=== додати компоненти ===*/
  }
  const owner = typeof data?.ownerId === 'object' ? data.ownerId : null;
  
  return (
    <div className={css.locationDetails}>
      <div className={css.container}>
       <Image className={css.image} src={data.image} alt={data.name} width={755} height={502} />

      <div className={css.info}>
      <div className={css.rate}>
      <StarRating value={data.rate} />
        <span className={css.rateValue}>{data.rate}</span>
          </div>
      <h1 className={css.title}>{data.name}</h1>
      <ul className={css.list}>
        <li className={css.item}><span className={css.label}>Регіон:</span>
 {data.region}
        </li>
        <li className={css.item}> <span className={css.label}>Тип локації:</span>
           {data.locationType}
            </li>
            {owner &&
              (<li className={css.item}><span className={css.label}>Автор статті:</span>
                <Link className={css.link} href={`/profile/${owner._id}`}>{owner.name}</Link>
              </li>)}
            </ul>
            
    </div>
     </div>
      <p className={css.description}>{ data.description}</p>
  </div>)
}
