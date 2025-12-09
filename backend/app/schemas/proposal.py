from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

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

class ProposalBase(BaseModel):
    title: str
    client_id: int
    number: Optional[str] = None
    status: str = "draft"
    valid_until: Optional[date] = None
    description: Optional[str] = None
    terms: Optional[str] = None
    notes: Optional[str] = None
    discount: float = 0

class ProposalCreate(ProposalBase):
    items: List[ProposalItemCreate]

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    valid_until: Optional[date] = None
    description: Optional[str] = None
    terms: Optional[str] = None
    notes: Optional[str] = None
    discount: Optional[float] = None
    items: Optional[List[ProposalItemCreate]] = None

class Proposal(ProposalBase):
    id: int
    subtotal: float
    total: float
    created_at: datetime
    updated_at: datetime
    items: List[ProposalItem] = []

    class Config:
        from_attributes = True
