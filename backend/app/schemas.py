from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# Contact schemas
class ContactBase(BaseModel):
    name: str
    position: Optional[str] = None
    phone: str
    email: Optional[EmailStr] = None
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

# ProposalItem schemas
class ProposalItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: float = 1
    unit: str = "шт"
    price: float

class ProposalItemCreate(ProposalItemBase):
    pass

class ProposalItem(ProposalItemBase):
    id: int
    proposal_id: int
    total: float

    class Config:
        from_attributes = True

# Proposal schemas
class ProposalBase(BaseModel):
    title: str
    number: Optional[str] = None
    status: str = "draft"
    valid_until: Optional[date] = None
    description: Optional[str] = None
    terms: Optional[str] = None
    notes: Optional[str] = None
    discount: float = 0

class ProposalCreate(ProposalBase):
    client_id: int
    items: List[ProposalItemCreate]

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    number: Optional[str] = None
    status: Optional[str] = None
    valid_until: Optional[date] = None
    description: Optional[str] = None
    terms: Optional[str] = None
    notes: Optional[str] = None
    discount: Optional[float] = None
    items: Optional[List[ProposalItemCreate]] = None

class Proposal(ProposalBase):
    id: int
    client_id: int
    subtotal: float
    total: float
    created_at: datetime
    updated_at: datetime
    items: List[ProposalItem] = []

    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[int] = None
    client_id: Optional[int] = None
    status: str = "new"
    priority: str = "medium"
    due_date: Optional[date] = None
    assignee: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    assignee: Optional[str] = None

class Task(TaskBase):
    id: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    status: str = "active"
    our_budget: Optional[float] = None
    ad_budget: Optional[float] = None
    budget_currency: str = "RUB"
    description: Optional[str] = None

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
    email: Optional[EmailStr] = None
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
    email: Optional[EmailStr] = None
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

    class Config:
        from_attributes = True

class ClientDetail(Client):
    contacts: List[Contact] = []
    projects: List[Project] = []
    projects_count: int = 0

    class Config:
        from_attributes = True
