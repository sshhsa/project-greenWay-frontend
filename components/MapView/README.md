# MapView

Спільна карта для перегляду та вибору координат.

Контракт: `coordinates?: Coordinates | null`, `onPick?: (coordinates: Coordinates) => void`,
`className?: string`. Тип `Coordinates` із `types/geocode.ts` має поля `{ lat: number, lon: number }`.

Без `onPick` карта показує нерухомий маркер без керування масштабом та вибору точки.
З `onPick` натискання переміщує маркер і повертає `{ lat, lon }`; карта при цьому не зсувається
під курсором. Зміна вхідних координат ззовні (пошук, дані локації) оновлює маркер, центрує карту
й наближає щонайменше до масштабу 12. Некоректні координати не створюють маркер; початковий центр — Київ.
LocationMap зберігає повідомлення про недоступні координати та свій попередній контракт.

LeafletMap завантажується через `next/dynamic` із `ssr: false`. CSS Leaflet імпортується лише
в цьому модулі. Іконка та її тінь лежать у `public/leaflet` і передаються явно в `L.icon`.

LocationPicker підключає карту як `<MapView coordinates={value} onPick={onChange} />`.

Перевірка валідації та порівняння координат: `node --test components/MapView/coordinates.test.mjs`.
