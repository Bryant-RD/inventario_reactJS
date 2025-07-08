import { AuthResponse } from "@/app/interfaces/user.interface"

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  token?: string
  user?: AuthResponse["user"]
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
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })

    console.log(response);

    // Handle cases where the response has no content (e.g., DELETE 204)
    if (response.status === 204) {
      return {
        success: true,
        message: "Operación exitosa",
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error en la solicitud ${method} a ${endpoint}`,
      }
    }

    // Adapt to different API response structures
    return {
      success: true,
      message: data.message || "Operación exitosa",
      data: data, // The full response data is returned
      user: data.user,
      token: data.access_token || data.token,
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
