from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import schemas, models
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[dict])
def list_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список всех задач с фильтрами
    """
    query = db.query(models.Task)
    
    if status and status != "all":
        query = query.filter(models.Task.status == status)
    
    if priority and priority != "all":
        query = query.filter(models.Task.priority == priority)
    
    if assignee:
        query = query.filter(models.Task.assignee == assignee)
    
    # Сортировка: сначала по приоритету, потом по дедлайну
    query = query.order_by(
        models.Task.due_date.asc().nullslast(),
        models.Task.created_at.desc()
    )
    
    tasks = query.offset(skip).limit(limit).all()
    
    # Добавляем информацию о проекте и клиенте
    result = []
    for task in tasks:
        task_dict = schemas.Task.model_validate(task).model_dump()
        
        if task.project:
            task_dict['project_name'] = task.project.name
        
        if task.client:
            task_dict['client_name'] = task.client.name
        
        result.append(task_dict)
    
    return result

@router.post("", response_model=schemas.Task)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новую задачу
    """
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/{task_id}", response_model=dict)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о задаче
    """
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_dict = schemas.Task.model_validate(task).model_dump()
    
    if task.project:
        task_dict['project'] = schemas.Project.model_validate(task.project).model_dump()
    
    if task.client:
        task_dict['client'] = schemas.Client.model_validate(task.client).model_dump()
    
    return task_dict

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить задачу
    """
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    
    # Если статус меняется на completed, ставим дату завершения
    if 'status' in update_data and update_data['status'] == 'completed':
        task.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить задачу
    """
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
