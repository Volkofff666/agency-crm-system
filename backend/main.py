from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import clients, projects, tasks, proposals
from app.routers import invoices

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NOCTO CRM API",
    description="API для корпоративной CRM системы NOCTO",
    version="0.2.0"
)

# CORS для локальной разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["proposals"])
app.include_router(invoices.router, tags=["invoices"])

@app.get("/")
def root():
    return {"message": "NOCTO CRM API is running", "version": "0.2.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
