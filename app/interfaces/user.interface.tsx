export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserDTO {
  firstName: string
  lastName: string
  email: string
  password: string
  company?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  company?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
  access_token?: string
}