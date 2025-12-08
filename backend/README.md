# NOCTO CRM - Backend

## Запуск сервера

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск на порту 8080
uvicorn main:app --reload --port 8080
```

## API будет доступен на:
- http://localhost:8080
- Документация Swagger: http://localhost:8080/docs
- Документация ReDoc: http://localhost:8080/redoc

## База данных

Система использует SQLite. База создается автоматически при первом запуске.

## Структура

- `app/models.py` - Основные модели (Client, Project, Task, Proposal)
- `app/models/` - Дополнительные модели (Invoice)
- `app/api/` - API роутеры для основных сущностей
- `app/routers/` - Дополнительные роутеры (invoices)
- `app/schemas.py` - Pydantic схемы для валидации
- `app/database.py` - Настройка подключения к БД
