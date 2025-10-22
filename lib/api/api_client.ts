import { UserRepository } from "../repositories"

const API_BASE_URL = "/api"

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  token?: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })

    // Manejo centralizado de errores de autenticación (token expirado/inválido)
    if (response.status === 401) {
      UserRepository.clearSession() // Borramos el token y usuario del localStorage
      // Redirigimos a la página de login. Usamos window.location para forzar un refresco completo.
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
      // Devolvemos una promesa que nunca se resuelve para detener la ejecución del código que llamó a la API.
      return new Promise(() => {})
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error en la solicitud ${method} a ${endpoint}`,
        data: data,
      }
    }

    // Adapt to different API response structures
    return {
      success: true,
      message: data.message || "Operación exitosa",
      data: data,
    }
  } catch (error) {
    console.error(`Error en la solicitud ${method} a ${endpoint}:`, error)
    return {
      success: false,
      message: "Error de conexión con el servidor. Por favor, inténtalo de nuevo.",
    }
  }
}

export const ApiClient = {
  get: <T>(endpoint: string, token: string) => request<T>(endpoint, "GET", token),
  post: <T>(endpoint: string, body: unknown, token?: string) => request<T>(endpoint, "POST", token, body),
  put: <T>(endpoint: string, body: unknown, token: string) => request<T>(endpoint, "PUT", token, body),
  patch: <T>(endpoint: string, body: unknown, token: string) => request<T>(endpoint, "PATCH", token, body),
  delete: <T>(endpoint: string, token: string) => request<T>(endpoint, "DELETE", token),
}
