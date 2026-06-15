import { apiClient } from '@/services/api-client'
import type { LoginCredentials, AuthResponse } from '@/features/auth/types'

export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  getCurrentUser: () => 
    apiClient<AuthResponse>('/auth/me'),
}
