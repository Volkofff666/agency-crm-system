from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    title = Column(String, nullable=False)
    number = Column(String, nullable=True)  # Номер КП
    status = Column(String, default="draft")  # draft, sent, accepted, rejected
    
    # Сроки
    valid_until = Column(Date, nullable=True)  # Действительно до
    
    # Описание
    description = Column(Text, nullable=True)
    terms = Column(Text, nullable=True)  # Условия работы
    notes = Column(Text, nullable=True)  # Примечания
    
    # Суммы
    subtotal = Column(Float, default=0)  # Сумма без НДС
    discount = Column(Float, default=0)  # Скидка в процентах
    total = Column(Float, default=0)  # Итого
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="proposals")
    items = relationship("ProposalItem", back_populates="proposal", cascade="all, delete-orphan")

class ProposalItem(Base):
    __tablename__ = "proposal_items"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    
    name = Column(String, nullable=False)  # Название услуги
    description = Column(Text, nullable=True)  # Описание
    quantity = Column(Float, default=1)  # Количество
    unit = Column(String, default="шт")  # Единица измерения
    price = Column(Float, nullable=False)  # Цена за единицу
    total = Column(Float, nullable=False)  # Итого (quantity * price)
    
    # Relationships
    proposal = relationship("Proposal", back_populates="items")
