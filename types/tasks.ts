export interface Task {
  id: string | number
  title: string
  description?: string
  project_id?: string | number
  project_name?: string
  client_id?: string | number
  client_name?: string
  status: 'new' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date?: string
  assignee?: string
  completed_at?: string
  created_at: string
  updated_at: string
}
