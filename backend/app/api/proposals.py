from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[dict])
def list_proposals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Получить список всех КП
    """
    proposals = db.query(models.Proposal).offset(skip).limit(limit).all()
    
    # Добавляем информацию о клиенте
    result = []
    for proposal in proposals:
        proposal_dict = schemas.Proposal.model_validate(proposal).model_dump()
        if proposal.client:
            proposal_dict['client_name'] = proposal.client.name
        result.append(proposal_dict)
    
    return result

@router.post("", response_model=schemas.Proposal)
def create_proposal(
    proposal: schemas.ProposalCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новое КП
    """
    # Создаем КП
    proposal_data = proposal.model_dump(exclude={'items'})
    db_proposal = models.Proposal(**proposal_data)
    
    # Добавляем позиции
    subtotal = 0
    for item_data in proposal.items:
        item = models.ProposalItem(
            **item_data.model_dump(),
            total=item_data.quantity * item_data.price
        )
        subtotal += item.total
        db_proposal.items.append(item)
    
    # Считаем итого с учетом скидки
    db_proposal.subtotal = subtotal
    discount_amount = subtotal * (proposal.discount / 100)
    db_proposal.total = subtotal - discount_amount
    
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

@router.get("/{proposal_id}", response_model=dict)
def get_proposal(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о КП
    """
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    proposal_dict = schemas.Proposal.model_validate(proposal).model_dump()
    
    if proposal.client:
        proposal_dict['client'] = schemas.Client.model_validate(proposal.client).model_dump()
    
    return proposal_dict

@router.put("/{proposal_id}", response_model=schemas.Proposal)
def update_proposal(
    proposal_id: int,
    proposal_update: schemas.ProposalUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить КП
    """
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    update_data = proposal_update.model_dump(exclude_unset=True, exclude={'items'})
    
    for field, value in update_data.items():
        setattr(proposal, field, value)
    
    # Обновляем позиции если они переданы
    if proposal_update.items is not None:
        # Удаляем старые позиции
        for item in proposal.items:
            db.delete(item)
        
        # Добавляем новые
        subtotal = 0
        for item_data in proposal_update.items:
            item = models.ProposalItem(
                **item_data.model_dump(),
                total=item_data.quantity * item_data.price,
                proposal_id=proposal.id
            )
            subtotal += item.total
            db.add(item)
        
        # Пересчитываем суммы
        proposal.subtotal = subtotal
        discount_amount = subtotal * (proposal.discount / 100)
        proposal.total = subtotal - discount_amount
    
    db.commit()
    db.refresh(proposal)
    return proposal

@router.delete("/{proposal_id}")
def delete_proposal(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить КП
    """
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    db.delete(proposal)
    db.commit()
    return {"message": "Proposal deleted successfully"}
