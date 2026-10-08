'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinates } from '@/types/geocode';
import { isSameCoordinates, isValidCoordinates } from './coordinates';
import css from './MapView.module.css';

type Props = {
  coordinates?: Coordinates | null;
  onPick?: (coordinates: Coordinates) => void;
};

const markerIcon = L.icon({
  // статичні файли з public/leaflet: імпорт png з node_modules у прод-збірці дає undefined у .src
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const defaultCenter: Coordinates = { lat: 50.4501, lon: 30.5234 };
const defaultZoom = 6;
const selectedZoom = 12;

function MapEvents({
  position,
  onPick,
}: {
  position: Coordinates | null;
  onPick?: Props['onPick'];
}) {
  const map = useMap();
  // остання точка, обрана кліком: її повернення через props не має рухати карту під курсором
  const lastPick = useRef<Coordinates | null>(null);

  useMapEvents({
    click(event) {
      if (!onPick) return;
      const point = event.latlng.wrap();
      const coordinates = { lat: point.lat, lon: point.lng };
      if (!isValidCoordinates(coordinates)) return;
      lastPick.current = coordinates;
      onPick(coordinates);
    },
  });

  const lat = position?.lat;
  const lon = position?.lon;

  useEffect(() => {
    if (lat === undefined || lon === undefined) {
      lastPick.current = null;
      map.setView([defaultCenter.lat, defaultCenter.lon], map.getZoom());
      return;
    }
    if (isSameCoordinates(lastPick.current, { lat, lon })) return;
    // координати прийшли ззовні (пошук, дані локації): центруємо й наближаємо до точки
    map.setView([lat, lon], Math.max(map.getZoom(), selectedZoom));
  }, [map, lat, lon]);

  return null;
}

export default function LeafletMap({ coordinates, onPick }: Props) {
  const [picked, setPicked] = useState<{
    source: Props['coordinates'];
    coordinates: Coordinates;
  } | null>(null);
  const selected =
    onPick && picked && picked.source === coordinates ? picked.coordinates : coordinates;
  const position = isValidCoordinates(selected) ? selected : null;
  const center = position ?? defaultCenter;

  return (
    <MapContainer
      className={css.container}
      center={[center.lat, center.lon]}
      zoom={position ? selectedZoom : defaultZoom}
      zoomControl={Boolean(onPick)}
      keyboard={Boolean(onPick)}
      dragging={Boolean(onPick)}
      touchZoom={Boolean(onPick)}
      scrollWheelZoom={false}
      doubleClickZoom={Boolean(onPick)}
      boxZoom={Boolean(onPick)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents
        position={position}
        onPick={
          onPick
            ? (point) => {
                setPicked({ source: coordinates, coordinates: point });
                onPick(point);
              }
            : undefined
        }
      />
      {position && (
        <Marker
          position={[position.lat, position.lon]}
          icon={markerIcon}
          interactive={false}
          keyboard={false}
        />
      )}
    </MapContainer>
  );
}
