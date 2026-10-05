'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Coordinates } from '@/types/geocode';
import { isValidCoordinates } from './coordinates';
import css from './MapView.module.css';

type Props = {
  coordinates?: Coordinates | null;
  onPick?: (coordinates: Coordinates) => void;
};

const markerIcon = L.icon({
  iconUrl: markerImage.src,
  iconRetinaUrl: markerRetinaImage.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const defaultCenter: Coordinates = { lat: 50.4501, lon: 30.5234 };

function MapEvents({
  center,
  onPick,
}: {
  center: Coordinates;
  onPick?: Props['onPick'];
}) {
  const map = useMap();
  useMapEvents({
    click(event) {
      if (!onPick) return;
      const point = event.latlng.wrap();
      const coordinates = { lat: point.lat, lon: point.lng };
      if (isValidCoordinates(coordinates)) onPick(coordinates);
    },
  });

  useEffect(() => {
    map.setView([center.lat, center.lon], map.getZoom());
  }, [map, center.lat, center.lon]);

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
      zoom={position ? 12 : 6}
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
        center={center}
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
