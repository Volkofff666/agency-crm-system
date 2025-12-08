from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

# Импорт из переименованного файла
from app.base_models import Client, Contact
from app import base_schemas as schemas

# Client CRUD
def get_client(
    db: Session,
    client_id: int
) -> Optional[Client]:
    return db.query(Client).filter(Client.id == client_id).first()

def get_clients(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Client]:
    return db.query(Client).offset(skip).limit(limit).all()

def create_client(
    db: Session,
    client: schemas.ClientCreate
) -> Client:
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(
    db: Session,
    client_id: int,
    client: schemas.ClientUpdate
) -> Optional[Client]:
    db_client = get_client(db, client_id)
    if db_client:
        for key, value in client.dict(exclude_unset=True).items():
            setattr(db_client, key, value)
        db_client.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_client)
    return db_client

def delete_client(
    db: Session,
    client_id: int
) -> bool:
    db_client = get_client(db, client_id)
    if db_client:
        db.delete(db_client)
        db.commit()
        return True
    return False

# Contact CRUD
def create_contact(
    db: Session,
    client_id: int,
    contact: schemas.ContactCreate
) -> Contact:
    db_contact = Contact(**contact.dict(), client_id=client_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_client_contacts(
    db: Session,
    client_id: int
) -> List[Contact]:
    return db.query(Contact).filter(Contact.client_id == client_id).all()
