import { AuthResponse, LoginCredentials, CreateUserDTO, User, LoginResponse } from "@/app/interfaces/user.interface"
import { ApiClient } from "../api/api_client"

// Servicio para manejar todas las operaciones relacionadas con usuarios y autenticación
export class ApiUsuarios {
  // Login de usuario
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // El tipo genérico ahora es el contenido de 'data' en la respuesta de la API
    const response = await ApiClient.post<{ access_token: string; user: User }>("/auth/login", credentials)

    return {
      success: response.success,
      message: response.message,
      access_token: response.data!.access_token!,
      user: response.data!.user,
    }
  }

  // Registro de usuario
  static async register(userData: CreateUserDTO): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/register", userData);

    return {
      success: response.success,
      message: response.message,
      access_token: response.data?.access_token == null ? "" : response.data?.access_token,
    };
  }

  // Obtener perfil del usuario
  static async getProfile(token: string): Promise<{ success: boolean; user?: User; message: string }> {
    const response = await ApiClient.get<User>("/auth/profile", token);
    return { ...response, user: response.data };
  }

  // Actualizar perfil del usuario
  static async updateProfile(
    token: string,
    userData: Partial<CreateUserDTO>,
  ): Promise<{ success: boolean; user?: User; message: string }> {
    // Usamos PATCH para actualizaciones parciales, que es más semántico que PUT.
    // Asumiendo que el backend lo soporta en /auth/profile para consistencia.
    const response = await ApiClient.patch<User>("/auth/profile", userData, token);
    return { ...response, user: response.data };
  }

  // Obtener todos los usuarios (solo admin)
  static async getAllUsers(token: string): Promise<{ success: boolean; users?: User[]; message: string }> {
    const response = await ApiClient.get<User[]>("/users", token);
    return { ...response, users: response.data };
  }

  // Eliminar usuario (solo admin)
  static async deleteUser(token: string, userId: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(`/users/${userId}`, token);
  }
}
