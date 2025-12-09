from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    client_id: int
    status: str = "active"
    our_budget: Optional[float] = None
    ad_budget: Optional[float] = None
    budget_currency: str = "RUB"
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    our_budget: Optional[float] = None
    ad_budget: Optional[float] = None
    budget_currency: Optional[str] = None
    description: Optional[str] = None

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
