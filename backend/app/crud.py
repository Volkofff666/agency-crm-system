from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app import models, schemas

# Client CRUD
def get_clients(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None
) -> List[models.Client]:
    query = db.query(models.Client)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Client.name.ilike(search_filter)) |
            (models.Client.contact_person.ilike(search_filter))
        )
    
    if status and status != "all":
        query = query.filter(models.Client.status == status)
    
    return query.offset(skip).limit(limit).all()

def get_client(db: Session, client_id: int) -> Optional[models.Client]:
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def create_client(db: Session, client: schemas.ClientCreate) -> models.Client:
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(
    db: Session,
    client_id: int,
    client: schemas.ClientUpdate
) -> Optional[models.Client]:
    db_client = get_client(db, client_id)
    if not db_client:
        return None
    
    update_data = client.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client

def delete_client(db: Session, client_id: int) -> bool:
    db_client = get_client(db, client_id)
    if not db_client:
        return False
    
    db.delete(db_client)
    db.commit()
    return True

# Contact CRUD
def create_contact(db: Session, client_id: int, contact: schemas.ContactCreate) -> models.Contact:
    db_contact = models.Contact(**contact.model_dump(), client_id=client_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: int) -> bool:
    db_contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not db_contact:
        return False
    
    db.delete(db_contact)
    db.commit()
    return True

# Project CRUD
def create_project(db: Session, client_id: int, project: schemas.ProjectCreate) -> models.Project:
    db_project = models.Project(**project.model_dump(), client_id=client_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project
