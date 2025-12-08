from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Contact schemas
class ContactBase(BaseModel):
    name: str
    position: Optional[str] = None
    phone: str
    email: EmailStr

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    status: str = "active"
    budget: float = 0.0

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    client_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Client schemas
class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: EmailStr
    phone: str
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
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    inn: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class Client(ClientBase):
    id: int
    revenue: float
    created_at: datetime
    updated_at: datetime
    last_contact: datetime

    class Config:
        from_attributes = True

class ClientDetail(Client):
    contacts: List[Contact] = []
    projects: List[Project] = []
    projects_count: int = 0

    class Config:
        from_attributes = True
