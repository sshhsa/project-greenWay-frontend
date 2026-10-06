'use client';
// Власник: Вікторія (extra, див. docs/FRONTEND_TASKS.md)
// Пошук місця за назвою: інпут + «Пошук» + список результатів, вибір → onSelect(place).
// Без <form>: компонент стоїть усередині форми локації, вкладена форма відправляла б зовнішню.

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
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

  const handleSearch = async () => {
    if (query.trim().length < 2 || isLoading) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      setResults(await searchPlaces(query));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Сталася помилка під час пошуку');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault(); // не відправляти форму локації
    void handleSearch();
  };

  const handleSelectPlace = (place: GeoPlace) => {
    onSelect(place);
    setQuery(place.name);
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className={css.locationSearch}>
      <div className={css.searchRow}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введіть назву місця"
          aria-label="Назва місця для пошуку"
          className={css.searchInput}
        />
        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={isLoading || query.trim().length < 2}
          className={css.searchButton}
        >
          {isLoading ? 'Пошук…' : 'Пошук'}
        </button>
      </div>

      {hasSearched && !isLoading && (
        <div className={css.resultsDropdown}>
          {results.length === 0 ? (
            <p className={css.statusMessage}>Нічого не знайдено</p>
          ) : (
            <ul className={css.resultsList}>
              {results.map((place) => (
                <li key={`${place.lat}-${place.lon}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className={css.resultButton}
                  >
                    {place.name}
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
