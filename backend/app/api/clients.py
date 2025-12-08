from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud
from app import base_schemas as schemas
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[schemas.Client])
def list_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Получить список всех клиентов
    """
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients

@router.get("/{client_id}", response_model=schemas.Client)
def get_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о клиенте
    """
    client = crud.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.post("", response_model=schemas.Client)
def create_client(
    client: schemas.ClientCreate,
    db: Session = Depends(get_db)
):
    """
    Создать нового клиента
    """
    return crud.create_client(db, client)

@router.put("/{client_id}", response_model=schemas.Client)
def update_client(
    client_id: int,
    client: schemas.ClientUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить информацию о клиенте
    """
    updated_client = crud.update_client(db, client_id, client)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return updated_client

@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить клиента
    """
    success = crud.delete_client(db, client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}

@router.post("/{client_id}/contacts", response_model=schemas.Contact)
def add_contact(
    client_id: int,
    contact: schemas.ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Добавить контакт к клиенту
    """
    client = crud.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.create_contact(db, client_id, contact)
