from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud
from app.schemas import Client, ClientCreate, ClientUpdate, Contact, ContactCreate
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[Client])
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

@router.get("/{client_id}", response_model=Client)
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

@router.post("", response_model=Client)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db)
):
    """
    Создать нового клиента
    """
    return crud.create_client(db, client)

@router.put("/{client_id}", response_model=Client)
def update_client(
    client_id: int,
    client: ClientUpdate,
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

@router.post("/{client_id}/contacts", response_model=Contact)
def add_contact(
    client_id: int,
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Добавить контакт к клиенту
    """
    client = crud.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.create_contact(db, client_id, contact)
