export interface ProposalItem {
  id?: number
  name: string
  description?: string
  quantity: number
  unit: string
  price: number
  total?: number
}

export interface Proposal {
  id: number
  client_id: number
  client_name?: string
  title: string
  number?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  valid_until?: string
  description?: string
  terms?: string
  notes?: string
  subtotal: number
  discount: number
  total: number
  items: ProposalItem[]
  created_at: string
  updated_at: string
}

export interface ProposalCreate {
  client_id: number
  title: string
  number?: string
  status?: string
  valid_until?: string
  description?: string
  terms?: string
  notes?: string
  discount?: number
  items: ProposalItem[]
}
