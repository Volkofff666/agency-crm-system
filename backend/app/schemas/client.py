from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Contact Schemas
class ContactBase(BaseModel):
    name: str
    position: Optional[str] = None
    phone: str
    email: Optional[str] = None
    telegram: Optional[str] = None
    whatsapp: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Client Schemas
class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: Optional[str] = None
    phone: str
    telegram: Optional[str] = None
    whatsapp: Optional[str] = None
    status: str = "lead"
    inn: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None
    whatsapp: Optional[str] = None
    status: Optional[str] = None
    inn: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_contact: datetime
    contacts: List[Contact] = []

    class Config:
        from_attributes = True
