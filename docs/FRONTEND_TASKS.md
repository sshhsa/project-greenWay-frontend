# Фронтенд: хто що робить

## Головне правило: кожен редагує ТІЛЬКИ свої файли

Тімлід уже створив сторінки (`app/**/page.tsx`), провайдери, API-шар, middleware і заготовки
всіх компонентів, Route Handlers та функцій запитів. Кожен файл підписаний: `// Власник: Ім'я`.
Замінюєш вміст **своїх** файлів. Сторінки, `layout.tsx`, `globals.css`, `variables.css`, `middleware.ts`,
`lib/api/client.ts`, `lib/api/proxy.ts`, `package.json` — не чіпаєш (потрібна зміна → пиши тімліду).

Кольори, шрифти, відступи — тільки змінні з `app/variables.css`. Бракує змінної → пиши тімліду.
Спільні компоненти (UI kit, Modal, StarRating, LocationCard) — тільки імпортуєш, не копіюєш.

_Розподіл задач додасть тімлід (дошка GreenWay project + ця таблиця)._

## Додаткове завдання (лейбл `extra`, макет — фрейм «Додаткове завдання»)

Бекенд уже готовий: `GET /api/geocode/search?q=` і `/reverse?lat=&lon=`, `coordinates` у POST/PATCH локації,
`PATCH /api/users/me`, пагінація `/users/:userId/locations`. Заготовки нижче підписані `// Власник`.
Перед стартом: `git pull && npm install` (додано leaflet, react-leaflet).

| Хто | Що | Файли |
|---|---|---|
| **Олександр** | блок «Місце розташування» у формах створення/редагування | `components/LocationPicker/*`, підключення в `LocationForm`, `EditLocationForm` |
| **Валерій** | спільна карта на leaflet + заміна iframe на сторінці деталей | `components/MapView/*`, `components/LocationMap/*` |
| **Назарій** | профіль: нумерована пагінація з `?page=`, 6 карток desktop / 4 tablet і mobile, кнопка «Редагувати профіль» | `components/UserLocations/*`, кнопка в `ProfileInfo` |
| **Крістіна** | модалка «Редагувати профіль» за макетом, відкриття з профілю | `components/EditProfileModal/*` |
| **Мирослава** | картка у своєму профілі за макетом (олівець), головна: «Всі локації», swiper loop | `components/PopularLocations/*`, `FeedbackSlider`, стилі `editLink` у `LocationCard` |
| **Вікторія** | запити geocode + пошук місця | `lib/api/geocode.ts`, `components/LocationSearch/*` |
| **Геннадій** | UI-компонент пагінації | `components/ui/Pagination/*` |

Залежності: Олександр чекає `MapView` (Валерій) і `LocationSearch` (Вікторія), Назарій — `Pagination` (Геннадій).
Поки чекаєш — працюй із заглушкою, пропси вже зафіксовані.
