import { ApiUsuarios } from "../api"
import { LoginCredentials, CreateUserDTO, User, LoginResponse } from "@/app/interfaces/user.interface"

const USER_KEY = "inventory_user"
const TOKEN_KEY = "inventory_token"

export class UserRepository {

  /**
   * Registra un nuevo usuario llamando a la API.
   * @param userData - Datos del usuario para el registro.
   * @returns Un objeto indicando si el registro fue exitoso y un mensaje.
   */
  static async register(
    userData: CreateUserDTO
  ): Promise<{ success: boolean; message: string }> {
    const response = await ApiUsuarios.register(userData);

    if (response.success) {
      return { success: true, message: response.message || "Registro exitoso." };
    }

    return { success: false, message: response.message || "Error desconocido durante el registro." };
  }

  /**
   * Realiza el proceso de login, llamando a la API y guardando la sesión si es exitoso.
   * @param credentials - Email y contraseña del usuario.
   * @returns Un objeto indicando si el login fue exitoso y un mensaje.
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const apiResponse = await ApiUsuarios.login(credentials)

    if (apiResponse.success && apiResponse.access_token && apiResponse.user) {
      // 1. Mapeamos el usuario de la API a nuestra interfaz de frontend
      const frontendUser = this.mapApiUserToUser(apiResponse.user)
      // 2. Guardamos el usuario ya mapeado y el token en la sesión
      this.saveSession(frontendUser, apiResponse.access_token)
      // 3. Devolvemos el usuario mapeado en la respuesta del repositorio
      return { ...apiResponse, user: frontendUser }
    }

    return apiResponse
  }

  /**
   * Mapea los datos de un usuario de la API a la interfaz `User` del frontend.
   * @param apiUser - El objeto de usuario tal como viene de la API.
   * @returns Un objeto `User` con los nombres de propiedad del frontend.
   */
  private static mapApiUserToUser(apiUser: any): User {
    return {
      id: apiUser.id,
      firstName: apiUser.nombre, // Mapeo de 'nombre' a 'firstName'
      lastName: apiUser.apellido, // Mapeo de 'apellido' a 'lastName'
      email: apiUser.correo, // Mapeo de 'correo' a 'email'
      company: apiUser.empresa, // Mapeo de 'empresa' a 'company'
      role: apiUser.role,
      createdAt: apiUser.fechaCreacion, // Mapeo de 'fechaCreacion' a 'createdAt'
      updatedAt: apiUser.fechaActualizacion, // Mapeo de 'fechaActualizacion' a 'updatedAt'
    }
  }

  private static saveSession(user: User, token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, token)
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    const userJson = localStorage.getItem(USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  }

  static clearSession(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }
}
