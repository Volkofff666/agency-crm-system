export interface Client {
  id: string | number
  name: string
  contact_person: string
  email?: string
  phone: string
  telegram?: string
  whatsapp?: string
  status: 'lead' | 'active' | 'archive'
  projectsCount?: number
  last_contact: string
  created_at?: string
  updated_at?: string
}

export interface ClientDetail extends Client {
  inn?: string
  address?: string
  website?: string
  projects: Project[]
  contacts: Contact[]
  notes?: string
  projects_count?: number
}

export interface Project {
  id: string | number
  name: string
  status: 'active' | 'completed' | 'paused'
  budget?: string
  created_at?: string
  updated_at?: string
}

export interface Contact {
  id?: string | number
  name: string
  position?: string
  phone: string
  email?: string
  telegram?: string
  whatsapp?: string
  created_at?: string
}
