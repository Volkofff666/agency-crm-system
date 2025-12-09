# NOCTO CRM Backend

Backend API для CRM системы рекламного агентства NOCTO.

## Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **JWT** - аутентификация
- **SQLite/PostgreSQL** - база данных

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

### 3. Запустите сервер

```bash
uvicorn app.main:app --reload
```

Сервер запустится на: `http://127.0.0.1:8000`

### 4. Создайте первого администратора

Запустите скрипт:

```bash
python create_admin.py
```

Введите данные админа:
- Email
- Username
- Полное имя
- Пароль (мин. 6 символов)

### 5. Откройте документацию API

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Аутентификация

### Роли пользователей:

- **admin** - полный доступ, может создавать пользователей
- **manager** - менеджер, работа с клиентами и проектами
- **employee** - сотрудник, работа с задачами

### Вход в систему:

```bash
curl -X POST "http://127.0.0.1:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

Ответ:
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "token_type": "bearer"
}
```

### Использование токена:

Добавьте заголовок к каждому запросу:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Пример:
```bash
curl -X GET "http://127.0.0.1:8000/api/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1..."
```

### Создание нового пользователя (только admin):

```bash
curl -X POST "http://127.0.0.1:8000/api/auth/register" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@nocto.ru",
    "username": "manager1",
    "full_name": "Иван Иванов",
    "password": "secure_password",
    "role": "manager"
  }'
```

## API Эндпоинты

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация (только admin)
- `GET /api/auth/me` - Текущий пользователь

### Пользователи (только admin)
- `GET /api/users` - Список пользователей
- `GET /api/users/{id}` - Получить пользователя
- `PUT /api/users/{id}` - Обновить пользователя
- `DELETE /api/users/{id}` - Удалить пользователя

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
