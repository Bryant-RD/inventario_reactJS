import { ApiUsuarios } from "../api"
import { LoginCredentials, CreateUserDTO, User } from "@/app/interfaces/user.interface"

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
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
    const response = await ApiUsuarios.login(credentials)

     console.log(`(Response: ${JSON.stringify(response)})`);


    if (response.success && response.access_token) {
      this.saveSession(credentials.email, response.access_token)
      return { success: true, message: "Login exitoso" }
    }

    return { success: false, message: response.message || "Error desconocido durante el login." }
  }

  

  private static saveSession(email: String, token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(email))
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
