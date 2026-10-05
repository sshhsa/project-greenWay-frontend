# MapView

Спільна карта для перегляду та вибору координат.

Контракт: `coordinates?: Coordinates | null`, `onPick?: (coordinates: Coordinates) => void`,
`className?: string`. Тип `Coordinates` із `types/geocode.ts` має поля `{ lat: number, lon: number }`.

Без `onPick` карта показує нерухомий маркер без керування масштабом та вибору точки.
З `onPick` натискання переміщує маркер і повертає `{ lat, lon }`. Зміна вхідних координат
оновлює маркер і центр. Некоректні координати не створюють маркер; початковий центр — Київ.
LocationMap зберігає повідомлення про недоступні координати та свій попередній контракт.

LeafletMap завантажується через `next/dynamic` із `ssr: false`. CSS Leaflet імпортується лише
в цьому модулі. Іконка та її тінь імпортуються з установленого пакета Leaflet і передаються
явно в `L.icon`, тому Next.js включає їх у статичні ресурси збірки.

LocationPicker наразі є заглушкою. Для підключення використовуйте
`<MapView coordinates={value} onPick={onChange} />` у компоненті його власника.

Перевірка валідації: `node --test components/MapView/coordinates.test.mjs`.
