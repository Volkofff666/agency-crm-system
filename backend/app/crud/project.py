from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import Project
from app import schemas

def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100, client_id: Optional[int] = None) -> List[Project]:
    query = db.query(Project)
    if client_id:
        query = query.filter(Project.client_id == client_id)
    return query.offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate) -> Project:
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project: schemas.ProjectUpdate) -> Optional[Project]:
    db_project = get_project(db, project_id)
    if db_project:
        for key, value in project.dict(exclude_unset=True).items():
            setattr(db_project, key, value)
        db_project.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int) -> bool:
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False
