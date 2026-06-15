export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

export interface User extends Omit<AuthResponse, 'token'> {}
