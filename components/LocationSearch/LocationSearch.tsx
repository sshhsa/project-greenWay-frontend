'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { searchPlaces } from '@/lib/api/geocode';
import type { GeoPlace } from '@/types/geocode';

import css from './LocationSearch.module.css';

type Props = {
  onSelect: (place: GeoPlace) => void;
};

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await searchPlaces(query);
      setResults(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Сталася помилка при пошуку';
      toast.error(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlace = (place: GeoPlace) => {
    onSelect(place);
    setQuery(place.name);
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className={css.locationSearch}>
      <form onSubmit={handleSearch} className={css.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть назву місця..."
          className={css.searchInput}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={css.searchButton}
        >
          {isLoading ? '...' : 'Пошук'}
        </button>
      </form>

      {(isLoading || hasSearched) && (
        <div className={css.resultsDropdown}>
          
          {isLoading && (
            <div className={css.statusMessage}>
              Завантаження...
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className={css.statusMessage}>
              Нічого не знайдено
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className={css.resultsList}>
              {results.map((place, index) => (
                <li key={`${place.lat}-${place.lon}-${index}`} className={css.resultItem}>
                  <button
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className={css.resultButton}
                  >
                    <span className={css.placeName}>{place.name}</span>
                    <span className={css.placeCoordinates}>
                      {place.lat.toFixed(5)}, {place.lon.toFixed(5)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
