const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log('API Request:', url, options)
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        console.error('API Error data:', errorData)
        errorMessage = errorData.detail || errorData.message || errorMessage
        
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => 
            `${err.loc.join('.')}: ${err.msg}`
          ).join(', ')
        }
      } catch (e) {
        console.error('Failed to parse error response:', e)
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error: Failed to connect to API')
  }
}

// Clients API
export async function getClients(params?: {
  search?: string
  status?: string
  skip?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return fetchAPI(`/api/clients${query ? `?${query}` : ''}`)
}

export async function getClient(id: string) {
  return fetchAPI(`/api/clients/${id}`)
}

export async function createClient(data: any) {
  return fetchAPI('/api/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateClient(id: string, data: any) {
  return fetchAPI(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteClient(id: string) {
  return fetchAPI(`/api/clients/${id}`, {
    method: 'DELETE',
  })
}

// Contacts API
export async function addContact(clientId: string, data: any) {
  return fetchAPI(`/api/clients/${clientId}/contacts`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteContact(contactId: string) {
  return fetchAPI(`/api/clients/contacts/${contactId}`, {
    method: 'DELETE',
  })
}

// Projects API
export async function getProjects(params?: {
  status?: string
  skip?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return fetchAPI(`/api/projects${query ? `?${query}` : ''}`)
}

export async function getProject(id: string) {
  return fetchAPI(`/api/projects/${id}`)
}

export async function addProject(clientId: string, data: any) {
  return fetchAPI(`/api/clients/${clientId}/projects`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProjectStatus(id: string, status: string) {
  return fetchAPI(`/api/projects/${id}/status?status=${status}`, {
    method: 'PUT',
  })
}

export async function deleteProject(id: string) {
  return fetchAPI(`/api/projects/${id}`, {
    method: 'DELETE',
  })
}

// Tasks API
export async function getTasks(params?: {
  status?: string
  priority?: string
  assignee?: string
  skip?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.priority) queryParams.append('priority', params.priority)
  if (params?.assignee) queryParams.append('assignee', params.assignee)
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return fetchAPI(`/api/tasks${query ? `?${query}` : ''}`)
}

export async function getTask(id: string) {
  return fetchAPI(`/api/tasks/${id}`)
}

export async function createTask(data: any) {
  return fetchAPI('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTask(id: string, data: any) {
  return fetchAPI(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTask(id: string) {
  return fetchAPI(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
}

// Proposals API
export async function getProposals(params?: {
  skip?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const query = queryParams.toString()
  return fetchAPI(`/api/proposals${query ? `?${query}` : ''}`)
}

export async function getProposal(id: string) {
  return fetchAPI(`/api/proposals/${id}`)
}

export async function createProposal(data: any) {
  return fetchAPI('/api/proposals', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProposal(id: string, data: any) {
  return fetchAPI(`/api/proposals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProposal(id: string) {
  return fetchAPI(`/api/proposals/${id}`, {
    method: 'DELETE',
  })
}
