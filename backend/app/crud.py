from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

# Import from main models file (not models package)
import app.models as old_models
from app import schemas

# Client CRUD
def get_client(
    db: Session,
    client_id: int
) -> Optional[old_models.Client]:
    return db.query(old_models.Client).filter(old_models.Client.id == client_id).first()

def get_clients(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[old_models.Client]:
    return db.query(old_models.Client).offset(skip).limit(limit).all()

def create_client(
    db: Session,
    client: schemas.ClientCreate
) -> old_models.Client:
    db_client = old_models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(
    db: Session,
    client_id: int,
    client: schemas.ClientUpdate
) -> Optional[old_models.Client]:
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
) -> old_models.Contact:
    db_contact = old_models.Contact(**contact.dict(), client_id=client_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_client_contacts(
    db: Session,
    client_id: int
) -> List[old_models.Contact]:
    return db.query(old_models.Contact).filter(old_models.Contact.client_id == client_id).all()
