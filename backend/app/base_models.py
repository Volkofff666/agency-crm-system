from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    contact_person = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    telegram = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    status = Column(String, default="lead")  # lead, active, archive
    inn = Column(String, nullable=True)
    address = Column(String, nullable=True)
    website = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_contact = Column(DateTime, default=datetime.utcnow)

    # Relationships
    contacts = relationship("Contact", back_populates="client", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="client", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="client", cascade="all, delete-orphan")
    proposals = relationship("Proposal", back_populates="client", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String, nullable=False)
    position = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    telegram = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="contacts")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="active")  # active, completed, paused
    
    # Финансы
    our_budget = Column(Float, nullable=True)
    ad_budget = Column(Float, nullable=True)
    budget_currency = Column(String, default="RUB")
    
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Связи
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    
    # Статус и приоритет
    status = Column(String, default="new")  # new, in_progress, completed, cancelled
    priority = Column(String, default="medium")  # low, medium, high, critical
    
    # Даты
    due_date = Column(Date, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Ответственный
    assignee = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="tasks")
    client = relationship("Client", back_populates="tasks")

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
