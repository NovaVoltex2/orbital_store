
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
type FetchOptions = RequestInit & {
  params?: Record<string, string | number>
}

export async function apiClient<T>(endpoint: string, { params, ...options }: FetchOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString())
    })
  }

  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
