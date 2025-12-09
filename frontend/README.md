# NOCTO CRM Frontend

Frontend для CRM системы рекламного агентства NOCTO.

## Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стили
- **Axios** - HTTP клиент

## Дизайн

Используется комбинация стилей:
- **Brutalism** - грубые рамки, тени, моношрифт
- **Glassmorphism** - прозрачные карточки с размытием

## Установка

### 1. Установите зависимости

```bash
cd frontend
npm install
```

### 2. Создайте `.env`

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Запустите разработку

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

## Авторизация

Система использует JWT аутентификацию:

1. **Вход** - `/login`
2. **Dashboard** - `/dashboard` (защищенно)

Токен хранится в `localStorage` и автоматически добавляется к запросам.

## Структура

```
frontend/
├── src/
│   ├── app/
│   │   ├── login/         # Страница входа
│   │   ├── dashboard/     # Главная страница
│   │   ├── globals.css    # Глобальные стили
│   │   └── layout.tsx
│   └── lib/
│       └── api.ts         # API клиент
├── package.json
└── tailwind.config.js
```

## Разработка

### Dev сервер
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Запуск production
```bash
npm run start
```

## Стили

### Brutalism классы:
- `.brutal-box` - контейнер с рамкой и тенью
- `.brutal-button` - кнопка
- `.brutal-input` - поле ввода

### Glassmorphism:
- `.glass-card` - прозрачная карточка

## API

Все запросы к API проходят через `src/lib/api.ts`.

Автоматически добавляется:
- `Authorization` заголовок с JWT токеном
- Перенаправление на `/login` при 401 ошибке
