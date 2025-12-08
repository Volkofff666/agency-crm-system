from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.invoice import InvoiceStatus


class InvoiceItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: float = 1
    unit: str = "шт"
    price: float


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItem(InvoiceItemBase):
    id: int
    invoice_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class InvoiceBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_id: int
    project_id: Optional[int] = None
    due_date: datetime
    tax_rate: float = 0
    discount: float = 0
    notes: Optional[str] = None
    terms: Optional[str] = None


class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]


class InvoiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[InvoiceStatus] = None
    tax_rate: Optional[float] = None
    discount: Optional[float] = None
    notes: Optional[str] = None
    terms: Optional[str] = None
    payment_method: Optional[str] = None
    paid_date: Optional[datetime] = None
    items: Optional[List[InvoiceItemCreate]] = None


class Invoice(InvoiceBase):
    id: int
    invoice_number: str
    issue_date: datetime
    paid_date: Optional[datetime] = None
    subtotal: float
    tax_amount: float
    total: float
    status: InvoiceStatus
    payment_method: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItem] = []

    class Config:
        from_attributes = True
