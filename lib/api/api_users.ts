import { AuthResponse, LoginCredentials, RegisterData, User } from "@/app/interfaces/user.interface"

// Servicio para manejar todas las operaciones relacionadas con usuarios
const API_BASE_URL = "http://localhost:4000"


export class ApiUsuarios {
  // Login de usuario
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error en el login",
        }
      }

      return {
        success: true,
        message: "Login exitoso",
        user: data.user,
        token: data.access_token || data.token,
      }
    } catch (error) {
      console.error("Error en login:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Registro de usuario
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error en el registro",
        }
      }

      return {
        success: true,
        message: "Usuario registrado exitosamente",
        user: data.user,
        token: data.access_token || data.token,
      }
    } catch (error) {
      console.error("Error en registro:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener perfil del usuario
  static async getProfile(token: string): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error obteniendo perfil",
        }
      }

      return {
        success: true,
        user: data,
        message: "Perfil obtenido exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo perfil:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Actualizar perfil del usuario
  static async updateProfile(
    token: string,
    userData: Partial<RegisterData>,
  ): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error actualizando perfil",
        }
      }

      return {
        success: true,
        user: data,
        message: "Perfil actualizado exitosamente",
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener todos los usuarios (solo admin)
  static async getAllUsers(token: string): Promise<{ success: boolean; users?: User[]; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error obteniendo usuarios",
        }
      }

      return {
        success: true,
        users: data,
        message: "Usuarios obtenidos exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo usuarios:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Eliminar usuario (solo admin)
  static async deleteUser(token: string, userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error eliminando usuario",
        }
      }

      return {
        success: true,
        message: "Usuario eliminado exitosamente",
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }
}
