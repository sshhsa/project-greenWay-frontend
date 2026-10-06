'use client';
import type { Coordinates, GeoPlace } from '@/types/geocode';

import LocationSearch from '../LocationSearch/LocationSearch';
import MapView from '../MapView/MapView';
import css from './LocationPicker.module.css';

type Props = {
  value?: Coordinates | null;
  onChange: (coordinates: Coordinates) => void;
};

export default function LocationPicker({ value, onChange }: Props) {
  const handleSelect = (place: GeoPlace) => {
    onChange({ lat: place.lat, lon: place.lon });
  };

  return (
    <div className={css.locationPicker}>
      <LocationSearch onSelect={handleSelect} />
      <MapView coordinates={value} onPick={onChange} />
    </div>
  );
}
