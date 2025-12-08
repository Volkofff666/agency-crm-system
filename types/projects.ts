export interface Project {
  id: string | number
  name: string
  status: 'active' | 'completed' | 'paused'
  our_budget?: number
  ad_budget?: number
  budget_currency?: string
  description?: string
  client_id: string | number
  client_name?: string
  created_at: string
  updated_at: string
}

export interface ProjectDetail extends Project {
  client?: {
    id: string | number
    name: string
    contact_person: string
    phone: string
    email?: string
  }
}
