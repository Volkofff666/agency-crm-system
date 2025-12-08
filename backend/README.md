# NOCTO CRM Backend

FastAPI бэкенд для корпоративной CRM системы NOCTO.

## Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **PostgreSQL** / **SQLite** - база данных
- **Pydantic** - валидация данных

## Установка

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

## Настройка

### Вариант 1: SQLite (быстрый старт)

```bash
cp .env.example .env
```

В `.env` оставь:
```
DATABASE_URL=sqlite:///./nocto_crm.db
```

### Вариант 2: PostgreSQL (production)

1. Установи PostgreSQL
2. Создай базу данных:
```sql
CREATE DATABASE nocto_crm;
```

3. В `.env` укажи:
```
DATABASE_URL=postgresql://user:password@localhost:5432/nocto_crm
```

## Запуск

```bash
uvicorn main:app --reload --port 8000
```

API будет доступен:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Клиенты

- `GET /api/clients` - список клиентов
  - Query параметры: `search`, `status`, `skip`, `limit`
- `GET /api/clients/{id}` - детали клиента
- `POST /api/clients` - создать клиента
- `PUT /api/clients/{id}` - обновить клиента
- `DELETE /api/clients/{id}` - удалить клиента

### Контакты

- `POST /api/clients/{id}/contacts` - добавить контакт
- `DELETE /api/clients/contacts/{id}` - удалить контакт

### Проекты

- `POST /api/clients/{id}/projects` - добавить проект

## Структура БД

### Таблица `clients`
- id, name, contact_person, email, phone
- status (lead, active, archive)
- inn, address, website, notes
- revenue, created_at, updated_at, last_contact

### Таблица `contacts`
- id, client_id, name, position
- phone, email, created_at

### Таблица `projects`
- id, client_id, name, status
- budget, created_at, updated_at

## Миграции

Таблицы создаются автоматически при первом запуске.
Для production рекомендуется использовать Alembic.
