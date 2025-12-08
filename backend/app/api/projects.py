from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, schemas, models
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[dict])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список всех проектов
    """
    query = db.query(models.Project)
    
    if status and status != "all":
        query = query.filter(models.Project.status == status)
    
    projects = query.offset(skip).limit(limit).all()
    
    # Добавляем информацию о клиенте
    result = []
    for project in projects:
        project_dict = schemas.Project.model_validate(project).model_dump()
        if project.client:
            project_dict['client_name'] = project.client.name
            project_dict['client_id'] = project.client.id
        result.append(project_dict)
    
    return result

@router.get("/{project_id}", response_model=dict)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о проекте
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_dict = schemas.Project.model_validate(project).model_dump()
    if project.client:
        project_dict['client'] = schemas.Client.model_validate(project.client).model_dump()
    
    return project_dict

@router.put("/{project_id}/status")
def update_project_status(
    project_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """
    Обновить статус проекта
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.status = status
    db.commit()
    db.refresh(project)
    
    return schemas.Project.model_validate(project).model_dump()

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить проект
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
