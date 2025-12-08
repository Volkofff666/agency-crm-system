from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.invoice import Invoice, InvoiceItem, InvoiceStatus
from app.schemas.invoice import Invoice as InvoiceSchema, InvoiceCreate, InvoiceUpdate

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"]
)


def generate_invoice_number(db: Session) -> str:
    """Генерация уникального номера счета"""
    today = datetime.now()
    prefix = f"INV-{today.year}{today.month:02d}"
    
    # Получаем последний счет с таким префиксом
    last_invoice = db.query(Invoice).filter(
        Invoice.invoice_number.like(f"{prefix}%")
    ).order_by(Invoice.id.desc()).first()
    
    if last_invoice:
        last_num = int(last_invoice.invoice_number.split('-')[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    return f"{prefix}-{new_num:04d}"


def calculate_invoice_totals(invoice_data: InvoiceCreate, items: List[InvoiceItem]):
    """Расчет итоговых сумм счета"""
    subtotal = sum(item.quantity * item.price for item in items)
    
    # Применяем скидку
    discount_amount = subtotal * (invoice_data.discount / 100)
    subtotal_after_discount = subtotal - discount_amount
    
    # Считаем НДС
    tax_amount = subtotal_after_discount * (invoice_data.tax_rate / 100)
    
    # Итого
    total = subtotal_after_discount + tax_amount
    
    return {
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "total": total
    }


@router.get("/", response_model=List[InvoiceSchema])
def get_invoices(
    skip: int = 0,
    limit: int = 100,
    status: Optional[InvoiceStatus] = None,
    client_id: Optional[int] = None,
    project_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Получить список счетов с фильтрацией"""
    query = db.query(Invoice)
    
    if status:
        query = query.filter(Invoice.status == status)
    if client_id:
        query = query.filter(Invoice.client_id == client_id)
    if project_id:
        query = query.filter(Invoice.project_id == project_id)
    
    # Проверяем просроченные счета
    now = datetime.utcnow()
    overdue_invoices = query.filter(
        Invoice.status == InvoiceStatus.SENT,
        Invoice.due_date < now
    ).all()
    
    for invoice in overdue_invoices:
        invoice.status = InvoiceStatus.OVERDUE
    
    db.commit()
    
    return query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{invoice_id}", response_model=InvoiceSchema)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Получить счет по ID"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/", response_model=InvoiceSchema)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    """Создать новый счет"""
    # Генерируем номер счета
    invoice_number = generate_invoice_number(db)
    
    # Создаем счет
    db_invoice = Invoice(
        invoice_number=invoice_number,
        title=invoice_data.title,
        description=invoice_data.description,
        client_id=invoice_data.client_id,
        project_id=invoice_data.project_id,
        due_date=invoice_data.due_date,
        tax_rate=invoice_data.tax_rate,
        discount=invoice_data.discount,
        notes=invoice_data.notes,
        terms=invoice_data.terms
    )
    
    db.add(db_invoice)
    db.flush()
    
    # Создаем позиции счета
    items = []
    for item_data in invoice_data.items:
        db_item = InvoiceItem(
            invoice_id=db_invoice.id,
            **item_data.dict()
        )
        db.add(db_item)
        items.append(db_item)
    
    db.flush()
    
    # Рассчитываем итоги
    totals = calculate_invoice_totals(invoice_data, items)
    db_invoice.subtotal = totals["subtotal"]
    db_invoice.tax_amount = totals["tax_amount"]
    db_invoice.total = totals["total"]
    
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice


@router.put("/{invoice_id}", response_model=InvoiceSchema)
def update_invoice(invoice_id: int, invoice_data: InvoiceUpdate, db: Session = Depends(get_db)):
    """Обновить счет"""
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Обновляем поля
    update_data = invoice_data.dict(exclude_unset=True)
    items_data = update_data.pop("items", None)
    
    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    
    # Если обновляем позиции
    if items_data is not None:
        # Удаляем старые позиции
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
        
        # Создаем новые
        items = []
        for item_data in items_data:
            db_item = InvoiceItem(
                invoice_id=invoice_id,
                **item_data.dict()
            )
            db.add(db_item)
            items.append(db_item)
        
        db.flush()
        
        # Пересчитываем итоги
        totals = calculate_invoice_totals(invoice_data, items)
        db_invoice.subtotal = totals["subtotal"]
        db_invoice.tax_amount = totals["tax_amount"]
        db_invoice.total = totals["total"]
    
    db_invoice.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice


@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Удалить счет"""
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db.delete(db_invoice)
    db.commit()
    
    return {"message": "Invoice deleted successfully"}


@router.post("/{invoice_id}/mark-paid")
def mark_invoice_paid(invoice_id: int, payment_method: str, db: Session = Depends(get_db)):
    """Отметить счет как оплаченный"""
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db_invoice.status = InvoiceStatus.PAID
    db_invoice.paid_date = datetime.utcnow()
    db_invoice.payment_method = payment_method
    db_invoice.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice
