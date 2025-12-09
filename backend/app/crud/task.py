from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import Task
from app import schemas

def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100, project_id: Optional[int] = None, client_id: Optional[int] = None, status: Optional[str] = None) -> List[Task]:
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if client_id:
        query = query.filter(Task.client_id == client_id)
    if status:
        query = query.filter(Task.status == status)
    return query.offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate) -> Task:
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskUpdate) -> Optional[Task]:
    db_task = get_task(db, task_id)
    if db_task:
        for key, value in task.dict(exclude_unset=True).items():
            setattr(db_task, key, value)
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int) -> bool:
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False

def complete_task(db: Session, task_id: int) -> Optional[Task]:
    db_task = get_task(db, task_id)
    if db_task:
        db_task.status = "completed"
        db_task.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
    return db_task
