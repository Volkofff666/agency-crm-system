# NOCTO CRM Backend

Backend API для CRM системы рекламного агентства NOCTO.

## Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **SQLite/PostgreSQL** - база данных

## Структура

```
backend/
├── app/
│   ├── models/          # Модели SQLAlchemy
│   │   ├── client.py
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── proposal.py
│   │   └── invoice.py
│   ├── schemas/         # Pydantic схемы
│   │   ├── client.py
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── proposal.py
│   │   └── invoice.py
│   ├── routers/         # API роутеры
│   │   ├── clients.py
│   │   ├── projects.py
│   │   ├── tasks.py
│   │   ├── proposals.py
│   │   └── invoices.py
│   ├── crud.py          # CRUD операции
│   ├── database.py      # Настройка БД
│   └── main.py          # Точка входа
├── requirements.txt     # Зависимости
└── .env.example         # Пример конфигурации
```

## Установка

### 1. Установите зависимости

```bash
cd backend
pip install -r requirements.txt
```

### 2. Создайте файл `.env`

```bash
cp .env.example .env
```

Редактируйте `.env` при необходимости.

### 3. Запустите сервер

```bash
uvicorn app.main:app --reload
```

Сервер запустится на: `http://127.0.0.1:8000`

### 4. Откройте документацию API

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Эндпоинты

### Клиенты
- `GET /api/clients` - Список клиентов
- `GET /api/clients/{id}` - Получить клиента
- `POST /api/clients` - Создать клиента
- `PUT /api/clients/{id}` - Обновить клиента
- `DELETE /api/clients/{id}` - Удалить клиента

### Проекты
- `GET /api/projects` - Список проектов
- `GET /api/projects/{id}` - Получить проект
- `POST /api/projects` - Создать проект
- `PUT /api/projects/{id}` - Обновить проект
- `DELETE /api/projects/{id}` - Удалить проект

### Задачи
- `GET /api/tasks` - Список задач
- `GET /api/tasks/{id}` - Получить задачу
- `POST /api/tasks` - Создать задачу
- `PUT /api/tasks/{id}` - Обновить задачу
- `DELETE /api/tasks/{id}` - Удалить задачу

### Коммерческие предложения
- `GET /api/proposals` - Список КП
- `GET /api/proposals/{id}` - Получить КП
- `POST /api/proposals` - Создать КП
- `PUT /api/proposals/{id}` - Обновить КП
- `DELETE /api/proposals/{id}` - Удалить КП

### Счета
- `GET /api/invoices` - Список счетов
- `GET /api/invoices/{id}` - Получить счет
- `POST /api/invoices` - Создать счет
- `PUT /api/invoices/{id}` - Обновить счет
- `DELETE /api/invoices/{id}` - Удалить счет

## База данных

### SQLite (по умолчанию)
База данных создается автоматически при первом запуске в файле `nocto_crm.db`.

### PostgreSQL (для production)
В `.env` укажите:
```
DATABASE_URL=postgresql://user:password@localhost:5432/nocto_crm
```

## Разработка

### Автоперезагрузка
```bash
uvicorn app.main:app --reload
```

### Проверка кода
```bash
pylint app/
```

## Тестирование

Проверьте API через Swagger UI или используйте curl:

```bash
# Health check
curl http://localhost:8000/health

# Получить всех клиентов
curl http://localhost:8000/api/clients
```
