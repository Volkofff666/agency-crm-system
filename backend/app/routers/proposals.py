from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud
from app.schemas import Proposal, ProposalCreate, ProposalUpdate
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[Proposal])
def list_proposals(
    skip: int = 0,
    limit: int = 100,
    client_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Получить список коммерческих предложений
    """
    proposals = crud.get_proposals(
        db, 
        skip=skip, 
        limit=limit,
        client_id=client_id,
        status=status
    )
    return proposals

@router.get("/{proposal_id}", response_model=Proposal)
def get_proposal(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о коммерческом предложении
    """
    proposal = crud.get_proposal(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal

@router.post("", response_model=Proposal)
def create_proposal(
    proposal: ProposalCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новое коммерческое предложение
    """
    return crud.create_proposal(db, proposal)

@router.put("/{proposal_id}", response_model=Proposal)
def update_proposal(
    proposal_id: int,
    proposal: ProposalUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить коммерческое предложение
    """
    updated_proposal = crud.update_proposal(db, proposal_id, proposal)
    if not updated_proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return updated_proposal

@router.delete("/{proposal_id}")
def delete_proposal(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    """
    Удалить коммерческое предложение
    """
    success = crud.delete_proposal(db, proposal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return {"message": "Proposal deleted successfully"}

@router.patch("/{proposal_id}/send", response_model=Proposal)
def send_proposal(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    """
    Отправить коммерческое предложение клиенту
    """
    proposal = crud.send_proposal(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal
