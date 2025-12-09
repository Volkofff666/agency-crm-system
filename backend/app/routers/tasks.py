from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud
from app.schemas import Task, TaskCreate, TaskUpdate
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[Task])
def list_tasks(
    skip: int = 0,
    limit: int = 100,
    project_id: Optional[int] = None,
    client_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Получить список задач
    """
    tasks = crud.get_tasks(
        db, 
        skip=skip, 
        limit=limit, 
        project_id=project_id,
        client_id=client_id,
        status=status
    )
    return tasks

@router.get("/{task_id}", response_model=Task)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о задаче
    """
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("", response_model=Task)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новую задачу
    """
    return crud.create_task(db, task)

@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить информацию о задаче
    """
    updated_task = crud.update_task(db, task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить задачу
    """
    success = crud.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/complete", response_model=Task)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Отметить задачу как выполненную
    """
    task = crud.complete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
