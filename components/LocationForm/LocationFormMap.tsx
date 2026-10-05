'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import css from './LocationForm.module.css';

const DEFAULT_CENTER: [number, number] = [50.4501, 30.5234]; 

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ChangeMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onClick]);

  return null;
}

type InteractiveMapProps = {
  addressValue: string;
  latitudeValue?: number | null;
  longitudeValue?: number | null;
  onLocationChange: (address: string, lat: number, lon: number) => void;
  inputError?: boolean;
};

export default function InteractiveLocationMap({
  addressValue,
  latitudeValue,
  longitudeValue,
  onLocationChange,
  inputError,
}: InteractiveMapProps) {
  const initialCenter: [number, number] =
    latitudeValue !== null && latitudeValue !== undefined && longitudeValue !== null && longitudeValue !== undefined
      ? [latitudeValue, longitudeValue]
      : DEFAULT_CENTER;

  const [position, setPosition] = useState<[number, number]>(initialCenter);
  const [searchQuery, setSearchQuery] = useState(addressValue);

  useEffect(() => {
    setSearchQuery(addressValue);
    if (
      latitudeValue !== null &&
      latitudeValue !== undefined &&
      longitudeValue !== null &&
      longitudeValue !== undefined
    ) {
      setPosition([latitudeValue, longitudeValue]);
    }
  }, [addressValue, latitudeValue, longitudeValue]);

  const handlePositionUpdate = async (lat: number, lon: number) => {
    setPosition([lat, lon]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=uk`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setSearchQuery(data.display_name);
        onLocationChange(data.display_name, lat, lon);
      } else {
        onLocationChange(`Мітка: ${lat.toFixed(5)}, ${lon.toFixed(5)}`, lat, lon);
      }
    } catch (error) {
      console.error(error);
      onLocationChange(`Мітка: ${lat.toFixed(5)}, ${lon.toFixed(5)}`, lat, lon);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&accept-language=uk&limit=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const displayName = data[0].display_name;

        setPosition([lat, lon]);
        setSearchQuery(displayName);
        onLocationChange(displayName, lat, lon);
      } else {
        alert('Місце не знайдено. Спробуйте уточнити запит пошуку.');
      }
    } catch (error) {
      console.error('Помилка пошуку локації:', error);
      alert('Не вдалося виконати пошук. Перевірте з’єднання з інтернетом.');
    }
  };

  return (
    <div className={css.mapWrapper}>
      <label className={css.label} htmlFor="map-search-input">
        Оберіть розташування
      </label>
      
      <div className={css.mapSearchColumnLayout}>
        <input
          id="map-search-input"
          type="text"
          className={`${css.mapSearchInput} ${inputError ? css.mapInputError : ''}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введіть назву місця або адресу"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSearch();
            }
          }}
        />
        <button type="button" className={css.mapSearchBtnBlock} onClick={handleSearch}>
          Пошук
        </button>
      </div>

      <div className={css.mapContainer}>
        <MapContainer 
          center={position} 
          zoom={12} 
          zoomControl={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            icon={defaultIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const markerTarget = e.target;
                const newPos = markerTarget.getLatLng();
                void handlePositionUpdate(newPos.lat, newPos.lng);
              },
            }}
          />
          <ChangeMapCenter center={position} />
          <MapClickHandler onClick={handlePositionUpdate} />
        </MapContainer>
      </div>
    </div>
  );
}
