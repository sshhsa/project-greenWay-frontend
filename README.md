# Природні Мандри — Frontend

Каталог природних місць для відпочинку в Україні: пошук і фільтрація локацій, сторінки місць із відгуками,
профілі мандрівників, додавання й редагування власних локацій.

## Технології

Next.js 15 (App Router) · Montserrat · TypeScript · CSS Modules · modern-normalize · TanStack Query · Zustand ·
Formik + Yup · Axios · Swiper · Leaflet (react-leaflet) · react-hot-toast

## Запуск

```bash
npm install
cp .env.template .env.local     # BACKEND_API_URL — адреса бекенду з /api
npm run dev                     # http://localhost:3000
```

## Структура

```
app/                 сторінки (App Router), app/api — Route Handlers (проксі до бекенду)
components/          компонент = папка: Name.tsx + Name.module.css; components/ui — UI kit
lib/api/             client.ts (axios → /api), proxy.ts (Route Handler → бекенд), функції запитів
lib/store/           Zustand: authStore, categoriesStore
types/               типи за API-контрактом
middleware.ts        приватні маршрути + оновлення сесії
```

Бекенд: https://github.com/sshhsa/project-greenWay-backend · Задачі: [docs/FRONTEND_TASKS.md](docs/FRONTEND_TASKS.md)

## Команда

| Учасник | Роль | Бекенд | Фронтенд |
|---|---|---|---|
| Олександр ([@sshhsa](https://github.com/sshhsa)) | Team Lead | каркас, auth (register/login/logout/refresh), сесії, seed, geocode, swagger (auth, users), деплой | каркас, auth-сторінки, middleware, проксі `app/api`, модалка «Редагувати профіль», фікси та рев'ю |
| Анастасія ([@Anastasiia-S100306](https://github.com/Anastasiia-S100306)) | Scrum Master | GET /users/:userId | Advantages, ProfileInfo |
| Валерій ([@ValeriySolod](https://github.com/ValeriySolod)) | Developer | GET /users/me, останні відгуки, координати локацій | AuthPromptModal, MapView (Leaflet), LocationMap |
| Катерина ([@kateryna-motylova](https://github.com/kateryna-motylova)) | Developer | GET /locations (фільтри, пагінація), Swagger UI | каталог локацій |
| Мирослава ([@Myroslava-Morhental](https://github.com/Myroslava-Morhental)) | Developer | GET /locations/popular, swagger locations | PopularLocations, LatestFeedbacks, FeedbackSlider |
| Крістіна ([@krystyna-arsenych](https://github.com/krystyna-arsenych)) | Developer | GET /locations/:locationId | LocationDetails, LocationFeedbacks |
| Вікторія ([@victoriatarasenko1993-max](https://github.com/victoriatarasenko1993-max)) | Developer | POST /locations, Cloudinary, swagger feedbacks/categories | Hero, LocationForm, LocationSearch |
| Артем ([@homichartem03-rgb](https://github.com/homichartem03-rgb)) | Developer | PATCH /locations/:locationId | LocationCard, редагування локації |
| Геннадій ([@GennadiyTsekhmistro](https://github.com/GennadiyTsekhmistro)) | Developer | GET /categories, swagger geocode | UI kit, Modal, Pagination |
| Анна ([@PavelkoAnna](https://github.com/PavelkoAnna)) | Developer | POST /feedbacks | StarRating, AddFeedbackModal, LocationPicker |
| Назарій ([@Nazar-Lysak](https://github.com/Nazar-Lysak)) | Developer | GET /users/:userId/locations | UserLocations, пагінація профілю |
| Маркіян ([@eture4ka](https://github.com/eture4ka)) | Developer | PATCH /users/me | EditProfileModal |

## Деплой

- Фронтенд (Vercel): https://project-greenway-frontend.vercel.app
- Бекенд (Render): https://project-greenway-backend.onrender.com/api
- Swagger: https://project-greenway-backend.onrender.com/docs/
- Репозиторії: [frontend](https://github.com/sshhsa/project-greenWay-frontend) · [backend](https://github.com/sshhsa/project-greenWay-backend)
