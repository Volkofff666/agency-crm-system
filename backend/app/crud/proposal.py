from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models import Proposal, ProposalItem
from app import schemas

def get_proposal(db: Session, proposal_id: int) -> Optional[Proposal]:
    return db.query(Proposal).filter(Proposal.id == proposal_id).first()

def get_proposals(db: Session, skip: int = 0, limit: int = 100, client_id: Optional[int] = None, status: Optional[str] = None) -> List[Proposal]:
    query = db.query(Proposal)
    if client_id:
        query = query.filter(Proposal.client_id == client_id)
    if status:
        query = query.filter(Proposal.status == status)
    return query.offset(skip).limit(limit).all()

def create_proposal(db: Session, proposal: schemas.ProposalCreate) -> Proposal:
    proposal_data = proposal.dict(exclude={'items'})
    db_proposal = Proposal(**proposal_data)
    subtotal = 0
    for item_data in proposal.items:
        item = ProposalItem(**item_data.dict())
        item.total = item.quantity * item.price
        subtotal += item.total
        db_proposal.items.append(item)
    db_proposal.subtotal = subtotal
    db_proposal.total = subtotal * (1 - db_proposal.discount / 100)
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def update_proposal(db: Session, proposal_id: int, proposal: schemas.ProposalUpdate) -> Optional[Proposal]:
    db_proposal = get_proposal(db, proposal_id)
    if db_proposal:
        update_data = proposal.dict(exclude_unset=True, exclude={'items'})
        for key, value in update_data.items():
            setattr(db_proposal, key, value)
        if proposal.items is not None:
            db_proposal.items = []
            subtotal = 0
            for item_data in proposal.items:
                item = ProposalItem(**item_data.dict())
                item.total = item.quantity * item.price
                subtotal += item.total
                db_proposal.items.append(item)
            db_proposal.subtotal = subtotal
            db_proposal.total = subtotal * (1 - db_proposal.discount / 100)
        db_proposal.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_proposal)
    return db_proposal

def delete_proposal(db: Session, proposal_id: int) -> bool:
    db_proposal = get_proposal(db, proposal_id)
    if db_proposal:
        db.delete(db_proposal)
        db.commit()
        return True
    return False

def send_proposal(db: Session, proposal_id: int) -> Optional[Proposal]:
    db_proposal = get_proposal(db, proposal_id)
    if db_proposal:
        db_proposal.status = "sent"
        db.commit()
        db.refresh(db_proposal)
    return db_proposal
