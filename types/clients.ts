export interface Client {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  status: 'lead' | 'active' | 'archive'
  projectsCount: number
  revenue: number
  lastContact: string
}

export interface ClientDetail extends Client {
  inn: string
  address: string
  website: string
  projects: Project[]
  contacts: Contact[]
  notes: string
}

export interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'paused'
  budget: number
}

export interface Contact {
  name: string
  position: string
  phone: string
  email: string
}
