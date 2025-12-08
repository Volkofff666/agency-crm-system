from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    title = Column(String)
    description = Column(Text, nullable=True)
    
    # Даты
    issue_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    paid_date = Column(DateTime, nullable=True)
    
    # Финансы
    subtotal = Column(Float, default=0)
    tax_rate = Column(Float, default=0)  # НДС в процентах
    tax_amount = Column(Float, default=0)
    discount = Column(Float, default=0)  # Скидка в процентах
    total = Column(Float, default=0)
    
    # Статус и оплата
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    payment_method = Column(String, nullable=True)
    
    # Заметки
    notes = Column(Text, nullable=True)
    terms = Column(Text, nullable=True)  # Условия оплаты
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="invoices")
    project = relationship("Project", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    
    name = Column(String)
    description = Column(Text, nullable=True)
    quantity = Column(Float, default=1)
    unit = Column(String, default="шт")
    price = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    invoice = relationship("Invoice", back_populates="items")
