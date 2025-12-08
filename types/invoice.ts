export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export interface InvoiceItem {
  id?: number
  name: string
  description?: string
  quantity: number
  unit: string
  price: number
}

export interface Invoice {
  id: number
  invoice_number: string
  client_id: number
  project_id?: number
  title: string
  description?: string
  issue_date: string
  due_date: string
  paid_date?: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount: number
  total: number
  status: InvoiceStatus
  payment_method?: string
  notes?: string
  terms?: string
  created_at: string
  updated_at: string
  items: InvoiceItem[]
  client?: {
    id: number
    name: string
    email?: string
  }
  project?: {
    id: number
    name: string
  }
}

export interface InvoiceFormData {
  title: string
  description?: string
  client_id: number
  project_id?: number
  due_date: string
  tax_rate: number
  discount: number
  notes?: string
  terms?: string
  items: InvoiceItem[]
}
