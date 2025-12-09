from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

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
