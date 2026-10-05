'use client';
// Власник: Валерій (extra, див. docs/FRONTEND_TASKS.md)

import dynamic from 'next/dynamic';
import type { Coordinates } from '@/types/geocode';
import css from './MapView.module.css';

type Props = {
  coordinates?: Coordinates | null;
  onPick?: (coordinates: Coordinates) => void;
  className?: string;
};

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function MapView({ coordinates, onPick, className }: Props) {
  return (
    <div className={className ? `${css.mapView} ${className}` : css.mapView}>
      <LeafletMap coordinates={coordinates} onPick={onPick} />
    </div>
  );
}
